import { BrowserWindow, ipcMain } from "electron";
import { windowContexts } from "ProxiedWindow";
import { MainEvent } from "../../constants";

export default class IPCMain {
    init() {
        this.registerEvents();
        this.registerCallers();
    }

    registerEvents() {
        ipcMain.on("messageMain", (event, channel, ...args) => {
            // TODO
        });
        ipcMain.on(MainEvent.GetDiscordPreload, (event) => {
            const win = BrowserWindow.fromWebContents(event.sender);
            event.returnValue = windowContexts.get(win)?.discordPreload;
        });
    }
    registerCallers() {
        // TODO: nonce-based implementation (main -> renderer)
    }
}
