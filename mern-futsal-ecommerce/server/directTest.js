import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://admin:admin@fyp.angb3.mongodb.net/futsal-ecommerce?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

testConnection(); 