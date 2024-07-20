const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/v1', user);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App started at ${PORT}`);
});


module.exports = app;
