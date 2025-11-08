import { storage } from '../storage';
import { hashPassword } from '../auth';

async function createDefaultAdmin() {
  try {
    const existingAdmin = await storage.getAdminByUsername('admin');
    
    if (existingAdmin) {
      console.log('✓ Admin user already exists');
      return;
    }

    const password_hash = await hashPassword('admin123');
    
    await storage.createAdmin({
      username: 'admin',
      password: 'admin123',
      full_name: 'System Administrator',
      email: 'admin@hospital.com',
      password_hash,
    });

    console.log('✓ Default admin user created successfully');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the default password immediately after first login!');
  } catch (error) {
    console.error('✗ Failed to create admin user:', error);
    throw error;
  }
}

createDefaultAdmin()
  .then(() => {
    console.log('\n✓ Database initialization complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Database initialization failed:', error);
    process.exit(1);
  });
