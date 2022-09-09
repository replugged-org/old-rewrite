import electron from "electron";
import ProxiedWindow from "./ProxiedWindow";

export function start(loadDiscord: CallableFunction) {
    console.log("Hello from Replugged");

    /**
     * Electron BrowserWindow patch.
     */

    const ELECTRON_PATH = require.resolve("electron");

    delete require.cache[ELECTRON_PATH].exports;
    require.cache[ELECTRON_PATH].exports = { ...electron, BrowserWindow: ProxiedWindow };

    loadDiscord();
}
