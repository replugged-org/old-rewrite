import { existsSync, mkdirSync, symlinkSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INSTALL_PATH = join(__dirname, "installation");
const BUILD_PATH = join(__dirname, "build");
const PLUG_PATH = join(INSTALL_PATH, "plug");
const BOOTSTRAP_PATH = join(INSTALL_PATH, "bootstrap");
const RESOURCES_PATH = process.argv[2];
const APP_PATH = join(RESOURCES_PATH, "app");

if (!existsSync(INSTALL_PATH)) mkdirSync(INSTALL_PATH);
if (!existsSync(PLUG_PATH)) symlinkSync(BUILD_PATH, PLUG_PATH, "junction");
if (!existsSync(BOOTSTRAP_PATH)) mkdirSync(BOOTSTRAP_PATH);
if (!existsSync(APP_PATH)) symlinkSync(BOOTSTRAP_PATH, APP_PATH, "junction");

writeFileSync(
    join(BOOTSTRAP_PATH, "package.json"),
    JSON.stringify({
        name: "discord",
        main: "index.js",
    }),
);
