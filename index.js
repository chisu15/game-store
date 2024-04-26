const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./configs/db");

require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors());

app.use(bodyParser.json())

db.connect();
// ROUTE
const route = require('./routes/index.route')
route(app);

app.listen(port, () => {
    console.log(`Server started on port`);
});