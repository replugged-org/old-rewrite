import type RepluggedBridge from "RepluggedBridge";
import { ipcRenderer } from "electron";
import Channel, { ChannelPort } from "../../lib/Channel";
import logger from "logger";

export default class IPCBridge {
    _rp: RepluggedBridge;
    port: ChannelPort;

    channel = new Channel("bridge");
    logger = logger.createLogger({
        name: "IPC",
    });

    constructor(replugged: RepluggedBridge) {
        this._rp = replugged;
        this._initChannel();
    }
    _initChannel() {
        this.channel.setLogger(this.logger);

        // Main Pipe
        this.channel.addPipe({
            emit: ipcRenderer.send.bind(ipcRenderer),
            listen: (event: string, callback) => {
                ipcRenderer.on(event, (evt, ...data) => callback(...data));
            },
        });

        // Port
        this.port = new ChannelPort();
        this.channel.addPipe(this.port.createPipe("bridge"));
    }
}
