const mongoose = require('mongoose');

class Mongo {
    connect(onOpen) {
        const mongoDbHost = process.env.EXPENSE_DB_HOST;
        const mongoDbUser = process.env.EXPENSE_DB_USERNAME;
        const mongoDbPwd = process.env.EXPENSE_DB_PWD;
        const connectionString = 'mongodb+srv://' +
            mongoDbUser + ':' + mongoDbPwd + '@' + mongoDbHost +
            '/user_management?retryWrites=true&w=majority';

        mongoose.connect(connectionString,
            { useNewUrlParser: true,
                useUnifiedTopology: true,
                keepAlive: true,
                keepAliveInitialDelay: 300000 },
            error => {
                if (error) {
                    console.log(`Failed connecting to MongoDB. Reason: ${error}`);
                }
            });

        const connection = mongoose.connection;
        connection.on('error', console.error.bind(console, 'MongoDB error: '));
        connection.once('open', () => {
            console.log('Connected to MongoDB!');
            if (onOpen) {
                onOpen.apply();
            }
        });
    }
}

const mongo = new Mongo();
module.exports = mongo;