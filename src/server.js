import dotenv from "dotenv";
import "dotenv/config";
import app from "./app.js";
import env from "./config/env.js";
import connectDB from "./config/db.js";

const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

console.log(`\n${colors.bold}${colors.blue}═══════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bold}${colors.green}🚀 STARTING APPLICATION${colors.reset}`);
console.log(`${colors.bold}${colors.blue}═══════════════════════════════════════════════${colors.reset}`);

connectDB();

app.listen(env.PORT, () => {
  console.log(`\n${colors.green}✅ MongoDB Connected${colors.reset}`);
  console.log(`${colors.green}✅ Server running on port${colors.reset} ${colors.bold}${env.PORT}${colors.reset}`);
  console.log(`${colors.blue}🌐 http://localhost:${env.PORT}${colors.reset}`);
  console.log(`${colors.yellow}📅 ${new Date().toLocaleString()}${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}═══════════════════════════════════════════════${colors.reset}\n`);
});