import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from the root directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...'.yellow);
    console.log(`Connection string: ${process.env.MONGODB_URI}`.gray);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

connectDB(); 