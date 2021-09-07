const mongoose = require('mongoose');

class Mongo {
    connect(onOpen) {
        const mongoDbHost = process.env.EXPENSE_DB_HOST;
        const mongoDbUser = process.env.EXPENSE_DB_USERNAME;
        const mongoDbPwd = process.env.EXPENSE_DB_PWD;
        const connectionString = 'mongodb+srv://' +
            mongoDbUser + ':' + mongoDbPwd + '@' + mongoDbHost +
            '/expense_manager?retryWrites=true&w=majority';

        mongoose
            .connect(connectionString,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    keepAlive: true,
                    keepAliveInitialDelay: 300000
                })
            .then(() => {
                console.log('Connected to MongoDB!');
                if (onOpen) {
                    onOpen.apply();
                }
            })
            .catch(error => {
                if (error) {
                    console.log('Failed connecting to MongoDB. Exiting.');
                    console.error(error);
                    process.exit(1);
                }
            });
    }
}

const mongo = new Mongo();
module.exports = mongo;