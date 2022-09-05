import electron, { app } from "electron";
import Module from "module";
import { join } from "path";
import ProxiedWindow from "./ProxiedWindow";

/**
 * Electron BrowserWindow patch.
 */

const ELECTRON_PATH = require.resolve("electron");

delete require.cache[ELECTRON_PATH].exports;
require.cache[ELECTRON_PATH].exports = { ...electron, BrowserWindow: ProxiedWindow };

/**
 * Load Discord.
 */

const APP_PATH = join(process.resourcesPath, "app.asar");

// If this fails, the error will be enough context.
const { name, main } = require(join(APP_PATH, "package.json"));

// @ts-ignore
app.setAppPath?.(APP_PATH);
app.name = name;

// @ts-ignore
Module._load(join(APP_PATH, main), null, 0);
