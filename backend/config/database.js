const mongoose = require('mongoose');
require('dotenv').config();

exports.dbConnect = () => {
    mongoose.connect('process.env.DB_URL', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection stablished'))
    .catch((err) => {
        console.log(`Db connection issue ${err.message}`);
        process.exit(1);
    });
};