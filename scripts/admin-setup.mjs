import mongoose from 'mongoose';
import User from '../src/models/User.js';

async function setupAdmin() {
  try {
    // MongoDB bağlantısı
    await mongoose.connect('mongodb://localhost:27017/actyra-io');
    console.log('MongoDB bağlantısı başarılı');

    // Mevcut kullanıcıları listele
    const users = await User.find({});
    console.log('\n=== Mevcut Kullanıcılar ===');
    
    if (users.length === 0) {
      console.log('Hiç kullanıcı bulunamadı.');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Kullanıcı:`);
        console.log(`   Clerk ID: ${user.clerkId}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log('   ---');
      });
    }

    // İlk kullanıcıyı admin yap (eğer varsa) 
    if (users.length > 0) {
      const firstUser = users[0];
      if (firstUser.role !== 'admin') {
        await User.findByIdAndUpdate(firstUser._id, { role: 'admin' });
        console.log(`\n✅ ${firstUser.email} kullanıcısı admin yapıldı!`);
      } else {
        console.log(`\n✅ ${firstUser.email} zaten admin!`);
      }
    } else {
      // Test kullanıcısı oluştur
      console.log('\nTest admin kullanıcısı oluşturuluyor...');
      const testUser = new User({
        clerkId: 'test-admin-123',
        email: 'admin@test.com',
        fullName: 'Test Admin',
        role: 'admin'
      });
      await testUser.save();
      console.log('✅ Test admin kullanıcısı oluşturuldu!');
    }

    await mongoose.disconnect();
    console.log('\nMongoDB bağlantısı kapatıldı.');
    
  } catch (error) {
    console.error('Hata:', error);
    process.exit(1);
  }
}

setupAdmin();
