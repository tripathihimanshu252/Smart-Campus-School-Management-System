const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("⏳ Connecting to Database Pool Shard...");
        
        const enterprisePoolOptions = {
            maxPoolSize: 50,
            minPoolSize: 10,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 5000,
            family: 4
        };

        // 🔥 FIX: Yahan MONGO_URI ki jagah MONGODB_URI karo (jo tumhari .env mein hai)
        const conn = await mongoose.connect(process.env.MONGODB_URI, enterprisePoolOptions);
        
        console.log(`=========================================`);
        console.log(`🗄️  MONGODB CLUSTER DATABASE CONNECTED`);
        console.log(`🌐 HOST ARCH: ${conn.connection.host}`);
        console.log(`=========================================`);
    } catch (error) {
        console.error(`❌ DATABASE CONNECTION ERROR: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;