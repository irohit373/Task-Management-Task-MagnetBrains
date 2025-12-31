import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB Connected: ' + conn.connection.host);
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        process.exit(1);
    }
};

process.on('SIGNT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});


