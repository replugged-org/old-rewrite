import type Replugged from "Replugged";
import { BrowserWindow, ipcMain, webContents } from "electron";
import { windowContexts } from "ProxiedWindow";
import { MainEvent } from "../../constants";
import Channel from "../../lib/Channel";

export default class IPCMain {
    _rp: Replugged;
    channel = new Channel("main");
    winRef: WeakRef<BrowserWindow>;

    constructor(rp: Replugged) {
        this._rp = rp;
        this.init();
    }

    init() {
        ipcMain.on(MainEvent.GetDiscordPreload, (event) => {
            const win = BrowserWindow.fromWebContents(event.sender);
            this.winRef = new WeakRef(win);

            event.returnValue = windowContexts.get(win)?.discordPreload;
        });
        this.initChannel();
    }
    initChannel() {
        this.channel.setLogger(console);
        this.channel.addPipe({
            emit: (event, ...data) => {
                this.winRef.deref()?.webContents.send(event, ...data);
            },
            listen: (event: string, callback) => {
                ipcMain.on(event, (evt, ...data) => callback(...data));
            },
        });
    }
}
