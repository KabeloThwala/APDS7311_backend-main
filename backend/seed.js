import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bankapp");

const users = [
  { fullName: "Employee One", idNumber: "8001015009087", accountNumber: "10000001", role: "employee", password: "Emp!1234" },
  { fullName: "Admin One",    idNumber: "7501015009088", accountNumber: "10000002", role: "admin",    password: "Adm!1234" },
];

for (const u of users) {
  const hashed = await bcrypt.hash(u.password, 12);
  await User.updateOne({ accountNumber: u.accountNumber }, { ...u, password: hashed }, { upsert: true });
  console.log(`Seeded ${u.role}: ${u.fullName}`);
}

await mongoose.disconnect();
process.exit(0);
