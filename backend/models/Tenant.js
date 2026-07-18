// Author: Himanshu Tripathi
// Department: AI and DS

const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tenantCode: { type: String, unique: true, required: true },
    
    // 🔥 Ye do fields missing the, jo Backend save karne ki koshish kar raha tha
    tenantId: { type: String, required: true },
    adminEmail: { type: String, required: true },
    
    // 🔥 Director ki details bhi DB mein save honi chahiye
    directorDetails: {
        name: String,
        email: String,
        password: String
    },
    
    status: { type: String, default: 'Active' }
}, { timestamps: true });

// Sahi Export:
module.exports = mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema);