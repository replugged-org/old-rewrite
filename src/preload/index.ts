import { contextBridge, ipcRenderer } from "electron";
import RepluggedBridge from "./RepluggedBridge";
import createRepluggedNative from "./native/RepluggedNative";
import logger from "./logger";
import { MainEvent } from "../constants";

logger.log("Hello from preload!", document);

async function injectRenderer() {
    const scriptElem = Object.assign(document.createElement("script"), {
        type: "module",
        src: "replugged://base/renderer.js",
    });

    // Doesn't have to be .documentElement
    while (!document.documentElement) await new Promise((resolve) => setImmediate(resolve));

    document.documentElement.appendChild(scriptElem);
    scriptElem.remove();
}

async function initBridge() {
    const rp = new RepluggedBridge();

    contextBridge.exposeInMainWorld("RepluggedNative", createRepluggedNative(rp));
}

async function main() {
    await injectRenderer();
    await initBridge();
}

const discordPreload: string = ipcRenderer.sendSync(MainEvent.GetDiscordPreload);
require(discordPreload);

main().catch((error) => {
    logger.error("Could not start Bridge", error);
});

export {};
