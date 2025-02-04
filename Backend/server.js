const express = require('express');
const helmet = require('helmet');
const connectDB = require('./db');
const cors = require('cors');
const leaveRoutes = require('./routes/leaveRoutes');
const authRoutes=require('./routes/login');

require('dotenv').config();

const app = express();


app.use(helmet());

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use('/api/leaves', leaveRoutes);
app.use('/api/auth',authRoutes);


connectDB();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



