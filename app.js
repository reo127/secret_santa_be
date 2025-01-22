const express = require('express');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const connectDB = require('./database');
const app = express();
const santaRoutes = require('./routes/santaRoutes');

require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api', santaRoutes);

const PORT = process.env.PORT || 8000;
app.listen(8000, () => {
    console.log(`Server is running on port ${PORT}`);
});