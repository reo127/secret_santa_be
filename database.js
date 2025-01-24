const mongoose = require('mongoose');

const connectDB = async () => {
  try { 
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: 'majority'
    });

    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);  
  }
};

module.exports = connectDB;
