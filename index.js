const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require("./configs/db");
const cookieParser = require("cookie-parser");
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: 'http://localhost:3000', // URL của frontend
    credentials: true // Cho phép gửi cookie
  }));
app.use(cookieParser());
app.use(bodyParser.json())

db.connect();
// ROUTE
const route = require('./routes/index.route')
route(app);

app.listen(port, () => {
    console.log(`Server started on port`);
});