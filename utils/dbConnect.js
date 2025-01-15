import mongoose from 'mongoose';

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return; // If already connected, return

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'rpg-game',
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

export default dbConnect;
