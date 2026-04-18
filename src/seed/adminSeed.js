import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create Admin
    const admin = new User({
      name: 'Global Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });

    await admin.save();
    console.log('Admin user created successfully:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword} (Please change this in production!)`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin user:', err);
    process.exit(1);
  }
};

seedAdmin();
