// Man kann dieses Skript verwenden, um die Benutzerrolle in MongoDB auf Admin zu setzen

// 1. Verbinde dich mit MongoDB Compass oder mongosh
// 2. Finde die clerkId deines Benutzers (im Clerk-Dashboard)
// 3. Führe diesen Befehl aus:

db.users.updateOne(
  { clerkId: "user_2xdV7sSClYwdlG6TVDsAl92cQd1" },
  { $set: { role: "admin" } }
);

// Beispiel:
// db.users.updateOne(
//   { clerkId: "user_2abc123def456" },
//   { $set: { role: "admin" } }
// )
