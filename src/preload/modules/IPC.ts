import { ipcRenderer, IpcRendererEvent } from "electron";
import { EventEmitter } from "events";
import { MainHandles } from "../../constants";
import type RepluggedBridge from "../RepluggedBridge";

export default class IPCBridge extends EventEmitter {
    __rp: RepluggedBridge;

    constructor(replugged: RepluggedBridge) {
        super();
        this.__rp = replugged;
    }

    init() {
        this.registerEvents();
        this.registerCallers();
    }

    registerEvents() {
        // From Main
        ipcRenderer.on("messageRenderer", (event, channel, ...args) => {
            this.onMessageRenderer(channel, args);
        });

        // From Renderer
        this.on("messageMain", (channel, ...args) => {
            ipcRenderer.send("messageMain", channel, args);
        });
        this.on("messageBridge", (channel, ...args) => {
            ipcRenderer.send("messageMain", channel, args);
        });
    }
    registerCallers() {
        // TODO: nonce-based implementation
    }

    onMessageRenderer(channel: string, args: any[]) {
        this.emit("messageRenderer", channel, args);
    }
}
