const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Tenant = require('./models/Tenant');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcampus';

const demoTenants = [
  {
    name: 'GNIOT Academy',
    tenantId: 'GNIOT-AI-DS',
    adminEmail: 'admin@gniot.edu'
  },
  {
    name: 'Delhi Public School',
    tenantId: 'DPS-CORE-SAAS',
    adminEmail: 'admin@dps.edu'
  },
  {
    name: 'LLOYD Group of Institutions',
    tenantId: 'LLOYD-CSE',
    adminEmail: 'lloyd@gmail.com'
  }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    for (const tenant of demoTenants) {
      const existingTenant = await Tenant.findOne({ tenantId: tenant.tenantId });
      if (!existingTenant) {
        await Tenant.create({
          name: tenant.name,
          tenantId: tenant.tenantId,
          adminEmail: tenant.adminEmail,
          status: 'Active'
        });
      }

      const existingUser = await User.findOne({ email: tenant.adminEmail });
      if (!existingUser) {
        const passwordHash = await bcrypt.hash('123456', 10);
        await User.create({
          tenantId: tenant.tenantId,
          tenantMapping: tenant.tenantId,
          branchCode: tenant.tenantId,
          name: tenant.name,
          email: tenant.adminEmail,
          password: passwordHash,
          role: 'admin',
          status: 'Active',
          createdBy: 'seed-script'
        });
      }
    }

    console.log('✅ Demo tenants and head-admin users created');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
