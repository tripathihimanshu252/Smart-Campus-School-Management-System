const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("⏳ Connecting to Database Pool Shard...");
        
        // Configuration options handle heavy concurrent school ERP requests securely
        const enterprisePoolOptions = {
            maxPoolSize: 50,           // Allows up to 50 concurrent sockets per shard cluster
            minPoolSize: 10,           // Maintains at least 10 active connections in hot state
            socketTimeoutMS: 45000,    // Drops unresponsive pipeline connection blocks after 45s
            serverSelectionTimeoutMS: 5000, // Throws exception early if cluster instance fails to ping
            family: 4                  // Prioritizes IPv4 addresses layout matching config networks
        };

        // 🔥 FIX: Yahan MONGO_URI rakha hai taaki Render ke variable se match ho
        const conn = await mongoose.connect(process.env.MONGO_URI, enterprisePoolOptions);
        
        console.log(`=========================================`);
        console.log(`🗄️  MONGODB CLUSTER DATABASE CONNECTED`);
        console.log(`🌐 HOST ARCH: ${conn.connection.host}`);
        console.log(`=========================================`);
    } catch (error) {
        console.error(`❌ DATABASE CONNECTION ERROR: ${error.message}`);
        process.exit(1); // Server ko band kar dega agar database connect nahi hua
    }
};

module.exports = connectDB;