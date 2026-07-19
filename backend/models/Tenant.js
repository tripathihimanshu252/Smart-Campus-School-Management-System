const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tenantCode: { type: String, unique: true, required: true },
    tenantId: { type: String, required: true },
    adminEmail: { type: String, required: true },
    directorDetails: {
        name: String,
        email: String,
        password: String
    },
    status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.models.Tenant || mongoose.model('Tenant', tenantSchema);