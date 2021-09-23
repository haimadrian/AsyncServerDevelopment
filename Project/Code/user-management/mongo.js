const mongoose = require('mongoose');

class Mongo {
    async connect() {
        const mongoDbHost = process.env.EXPENSE_DB_HOST;
        const mongoDbUser = process.env.EXPENSE_DB_USERNAME;
        const mongoDbPwd = process.env.EXPENSE_DB_PWD;
        const connectionString = 'mongodb+srv://' +
            mongoDbUser + ':' + mongoDbPwd + '@' + mongoDbHost +
            '/user_management?retryWrites=true&w=majority';

        try {
            await mongoose.connect(connectionString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                keepAlive: true,
                keepAliveInitialDelay: 300000
            });

            console.log('Connected to MongoDB!');
        } catch (error) {
            console.error('Failed connecting to MongoDB: ', error);
            throw error;
        }
    }
}

const mongo = new Mongo();
module.exports = mongo;