import mongoose from "mongoose";
import User from "../src/models/User.js";

async function setupAdmin() {
  try {
    // MongoDB Verbindung aus .env
    const mongoUri = process.env.MONGODB_URI;
    await mongoose.connect(mongoUri);
    console.log("MongoDB-Verbindung erfolgreich");

    //Vorhandene Benutzer auflisten
    const users = await User.find({});
    console.log("\n=== Vorhandene Benutzer ===");

    if (users.length === 0) {
      console.log("Kein Benutzer gefunden.");
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Benutzer:`);
        console.log(`   Clerk ID: ${user.clerkId}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log("   ---");
      });
    }

    // Mach den ersten Benutzer zum Admin (falls vorhanden)
    if (users.length > 0) {
      const firstUser = users[0];
      if (firstUser.role !== "admin") {
        await User.findByIdAndUpdate(firstUser._id, { role: "admin" });
        console.log(`\n✅ ${firstUser.email} wurde zum Administrator gemacht!`);
      } else {
        console.log(`\n✅ ${firstUser.email} bereits Administrator!`);
      }
    } else {
      // Testbenutzer erstellen
      console.log("\nTest-Admin-Benutzer wird erstellt...");
      const testUser = new User({
        clerkId: "test-admin-123",
        email: "admin@test.com",
        fullName: "Test Admin",
        role: "admin",
      });
      await testUser.save();
      console.log("✅ Test-Admin-Benutzer wurde erstellt!");
    }

    await mongoose.disconnect();
    console.log("\nMongoDB-Verbindung geschlossen.");
  } catch (error) {
    console.error("Fehler:", error);
    process.exit(1);
  }
}

setupAdmin();
