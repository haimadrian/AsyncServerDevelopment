const mongoose = require('mongoose');

class Mongo {
    constructor() {
        this.db = {};
    }

    connect(onOpen) {
        mongoose.connect(`mongodb+srv://ServerTeam:QazWSX123@cluster0.xjg7v.mongodb.net/products_haim?retryWrites=true&w=majority`,
            { useNewUrlParser: true, useUnifiedTopology: true, keepAlive: true, keepAliveInitialDelay: 300000 }) // Keep alive for 5 minutes
            .catch(error => console.log(`Failed connecting to MongoDB. Reason: ${error}`));
        const connection = mongoose.connection;

        connection.on('error', console.error.bind(console, 'MongoDB error: '));
        connection.once('open', () => {
            console.log('Connected to MongoDB!');

            let productsSchema = new mongoose.Schema({
                name: String,
                image: String,
                price: Number
            });

            // Lambda does not work here. this refers to the parent scope's this
            //productsSchema.methods.printDetails = () => console.log(`Name: ${this.name}, Price: ${this.price}$`);
            productsSchema.methods.printDetails = function() {
                console.log(`Name: ${this.name}, Price: ${this.price}$`);
            }

            // This returns a constructor function, sow we can do new db.Product()
            this.db.Product = mongoose.model('products', productsSchema);

            onOpen.apply();
        });
    }

    find(resultsConsumer) {
        this.db.Product.find((error, products) => {
            resultsConsumer(error, products);
        });
    }
}

const mongo = new Mongo();
module.exports = mongo;