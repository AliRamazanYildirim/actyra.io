// MongoDB'de kullanıcı rolünü admin yapmak için bu scripti kullanabilirsiniz

// 1. MongoDB Compass veya mongosh ile bağlanın
// 2. Kullanıcınızın clerkId'sini bulun (Clerk Dashboard'dan)
// 3. Bu komutu çalıştırın:

db.users.updateOne(
  { clerkId: "user_2xdV7sSClYwdlG6TVDsAl92cQd1" },
  { $set: { role: "admin" } }
);

// Örnek:
// db.users.updateOne(
//   { clerkId: "user_2abc123def456" },
//   { $set: { role: "admin" } }
// )
