const cron = require("node-cron");
const axios = require("axios");
const jwtSign = require("./jwt_util");
const currencyConverter = require("./currency_converter");
const dailyExpenses = require("../model/mongo/daily_expenses");
const monthlyExpenses = require("../model/mongo/monthly_expenses");

/**
 * Schedule aggregation tasks to be run on the server.
 * @author Haim Adrian
 * @since 21-Sep-21
 */
const startStatisticsJob = () => {
    /**
     * Helper to get the date of yesterday, midnight
     * @param {Date} relativeTo Current time, to get yesterday of it
     * @return {Date} Yesterday of the specified date
     */
    const yesterday = (relativeTo) => {
        let startTime = new Date(relativeTo);
        startTime.setUTCHours(0, 0, 0, 0);
        startTime.setUTCDate(relativeTo.getUTCDate() - 1);
        return startTime;
    };

    /**
     * Helper to encode some sensitive text in asymmetric direction
     * @param {string} text The text to encode
     * @return {Uint8Array} Array of uint8, which is the encoded value
     */
    const encode = (text) => {
        const encoder = new TextEncoder();
        return encoder.encode(text);
    };

    /**
     * Fetching expenses from expenses server at some specific range
     * @param {Date} startTime Start time to fetch all expenses with date greater than or equal to
     * @param {Date} endTime End time to fetch all expenses with date less than.
     * @return {Promise<AxiosResponse<Array[any]>>} A promise to handle the response from expenses server
     */
    const fetchExpenses = (startTime, endTime) => {
        return jwtSign({
            EXPENSE_DB_USERNAME: JSON.stringify(encode(process.env.EXPENSE_DB_USERNAME)),
            EXPENSE_DB_PWD: JSON.stringify(encode(process.env.EXPENSE_DB_PWD))
        })
            .then(jwt => {
                let config = {
                    headers: {
                        authorization: `Bearer ${jwt}`
                    }
                };

                let path = `expense/fetch/all/start/${startTime.getTime()}/end/${endTime.getTime()}`;
                return axios.get(`${process.env.APP_SERVER_EXPENSES_URL}/${path}`, config);
            });
    };

    /**
     * Helper that gets an array of objects, and the name of the field to be used as
     * key for grouping the array elements based on that value. The result is array
     * of groups.
     * @param {Array<object>} array The array to group its elements by
     * @param {string} key A getter for retrieving the value to group by
     * @return {Array<{key: string, values: Array<object>}>}
     */
    const groupBy = (array, key) => {
        // Use the reduce function to go over all elements of the specified array,
        // and for each element, extract its key. This key is what we will use for
        // separating into groups.
        const reducer = (resultArray, currentElement) => {
            let currentGroupByValue = currentElement[key];
            let existingGroup = resultArray.find(item => item && item[key] === currentGroupByValue);
            if (existingGroup) {
                existingGroup.values.push(currentElement);
            } else {
                let item = {};
                item[key] = currentGroupByValue;
                item.values = [currentElement];
                resultArray.push(item);
            }

            return resultArray;
        };

        return Array(...array.reduce(reducer, []));
    };

    /**
     * Sum up array of objects by key mapping
     * @param {Array<object>} array The array to sum its elements
     * @param {Function | string} key A getter for retrieving the value to sum
     * @return {number} Calculated sum
     */
    const sum = (array, key) => {
        const reducer = (previousValue, currentItem) => {
            let value = key instanceof Function ? key(currentItem) : currentItem[key];
            return previousValue + value;
        }

        return parseFloat(array.reduce(reducer, 0).toString());
    };

    /**
     * Create the expenseStatistics entity. This closure receives array of expenses,
     * and group them by user identifier, and then by expense category, to prepare
     * a daily expense statistics Mongo entity.
     * @param {Array<any>} expenses Array of expenses to perform aggregations on
     * @param {Date} time The time to set as the date of expense statistics entity (Mongo)
     * @return {Array<{key: string, values: Array<any>}>}
     */
    const aggregateExpenses = (expenses, time) => {
        // Group expenses by userId
        const expenseStatistics = groupBy(expenses, 'userId');
        expenseStatistics.forEach(expensesOfUser => {
            // For each userId, group expenses by category
            expensesOfUser.categoryToExpenses =
                groupBy(expensesOfUser.values, 'category');
            expensesOfUser.values = undefined;

            // Now reduce expenses to their total amount
            expensesOfUser.categoryToExpenses.forEach(expensesOfCategory => {
                expensesOfCategory.totalExpenses =
                    sum(expensesOfCategory.values, expense => {
                        return currencyConverter.toUsDollar(expense.currency, expense.sum);
                    });
                expensesOfCategory.values = undefined;
            });

            // Use endTime to represent statistics of the previous day.
            expensesOfUser.date = time;

            // Now sum up the total of totals. (Totals from categories)
            expensesOfUser.totalExpenses = sum(expensesOfUser.categoryToExpenses, 'totalExpenses');
        });

        return expenseStatistics;
    }

    /**
     * Create the expenseStatistics entity for month. This closure receives array of
     * daily expenses, and group them by user identifier, and then by expense category,
     * to prepare a monthly expense statistics Mongo entity.
     * @param {Array<any>} expenses Array of expenses to perform aggregations on
     * @param {Date} time The time to set as the date of expense statistics entity (Mongo)
     * @return {Array<{key: string, values: Array<any>}>}
     */
    const aggregateExpensesMonthly = (expenses, time) => {
        // Group expenses by userId
        const expenseStatistics = groupBy(expenses, 'userId');
        expenseStatistics.forEach(expensesOfUser => {
            let allCategoryToExpenses = [];
            for (let value of expensesOfUser.values) {
                allCategoryToExpenses.push(...value.categoryToExpenses);
            }

            // For each userId, group expenses by category
            expensesOfUser.categoryToExpenses =
                groupBy(allCategoryToExpenses, 'category');
            expensesOfUser.values = undefined;

            // Now reduce expenses to their total amount
            expensesOfUser.categoryToExpenses.forEach(expensesOfCategory => {
                expensesOfCategory.totalExpenses =
                    sum(expensesOfCategory.values, 'totalExpenses');
                expensesOfCategory.values = undefined;
            });

            // Use endTime to represent statistics of the previous month.
            expensesOfUser.date = time;

            // Now sum up the total of totals. (Totals from categories)
            expensesOfUser.totalExpenses = sum(expensesOfUser.categoryToExpenses, 'totalExpenses');
        });

        return expenseStatistics;
    }

    /**
     * Main logic of the job, here we aggregate the data, grouped by user and category.
     */
    const doAggregations = () => {
        console.log('Running statistics aggregator job. Time:', new Date(Date.now()));

        const currTime = new Date(Date.now());
        const startTime = yesterday(currTime);
        const endTime = new Date(startTime);
        endTime.setUTCDate(startTime.getUTCDate() + 1);

        // Start of month is second day, since we store aggregations of
        // a previous day.
        let startOfMonth = new Date(startTime);
        startOfMonth.setUTCDate(2);
        let startOfNextMonth = new Date(startOfMonth);
        startOfNextMonth.setUTCDate(1);
        startOfNextMonth.setUTCMonth(startOfMonth.getUTCMonth() + 1);

        currencyConverter.refresh()
            // Make sure we do not aggregate twice for the same day
            .then(() => dailyExpenses.findOne({
                date: {
                    $gte: startTime,
                    $lte: endTime
                }
            }).exec())
            .then(docs => {
                if (!docs) {
                    return fetchExpenses(startTime, endTime);
                }
            })
            .then(expensesResponse => {
                if (expensesResponse) {
                    return aggregateExpenses(expensesResponse.data, endTime);
                }
            })
            .then(expenseStatistics => {
                if (expenseStatistics) {
                    return dailyExpenses.insertMany(expenseStatistics);
                }
            })
            .then((expenseStatistics) => {
                if (expenseStatistics) {
                    console.log(`Saved daily expense statistics: ${expenseStatistics}`);

                    // If month has passed, calculate month statistics
                    if (startTime.getMonth() !== endTime.getMonth()) {
                        console.log('Querying all daily expenses between',
                            startOfMonth,
                            '(inclusive) to ',
                            startOfNextMonth,
                            '(exclusive)');

                        return dailyExpenses.find({
                            date: {
                                $gte: startOfMonth,
                                $lte: startOfNextMonth
                            }
                        }, {_id: 0, __v: 0})
                            .sort({"date": 1})
                            .exec();
                    }
                }
            })
            .then(dailyExpenses => {
                if (dailyExpenses) {
                    return aggregateExpensesMonthly(dailyExpenses, startOfNextMonth);
                }
            })
            .then(expenseStatistics => {
                if (expenseStatistics) {
                    return monthlyExpenses.insertMany(expenseStatistics);
                }
            })
            .then(expenseStatistics => {
                if (expenseStatistics) {
                    console.log(`Saved monthly expense statistics: ${expenseStatistics}`);
                }
            })
            .catch(error => console.error(error.response?.data?.message || error.toString()));
    };

    // Use an expression to define our schedule. There are 6 parts, where the first
    // part is optional. Each part represents, from left to right:
    // second (optional), minute, hour, day of month, month, day of week
    // Our pattern is set to run every day, at the start of the dat (00:00) so
    // at the start of each day, we aggregate data of the previous day.
    const scheduleExpression = '0 0 * * *';

    doAggregations();
    cron.schedule(scheduleExpression, doAggregations);
}

module.exports = {startStatisticsJob}