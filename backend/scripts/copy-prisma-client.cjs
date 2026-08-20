const fs = require("node:fs");
const path = require("node:path");

const source = path.resolve(__dirname, "..", "src", "generated", "prisma");
const destination = path.resolve(__dirname, "..", "dist", "generated", "prisma");

if (fs.existsSync(destination)) process.exit(0);
fs.cpSync(source, destination, { recursive: true });
