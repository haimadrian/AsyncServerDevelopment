const expenseManagement = 'http://localhost:3000';
const userManagement = 'http://localhost:3001';
const expenseStatistics = 'http://localhost:3002';

const urls = {
    userSignUp: `${userManagement}/api/user/signup`,
    userSignOut: `${userManagement}/api/user/signout`,
    userInfo: `${userManagement}/api/user/info`,
    expenseFetch: `${expenseManagement}/api/expense/fetch`,
    totalDataCount: `${expenseManagement}/api/expense/count`,
    addExpense: `${expenseManagement}/api/expense`,
    getStatsMonthly: (year) => `${expenseStatistics}/api/statistics/year/${year}`,
    getStatsDaily: (year, month) => `${expenseStatistics}/api/statistics/year/${year}/month/${month}`
}

export default urls;
