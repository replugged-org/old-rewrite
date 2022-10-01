import logger from "logger";
import Channel from "../../lib/Channel";

const { RepluggedNative: native } = window;

const ipcLogger = logger.createLogger({
    name: "IPC",
});

const channel = new Channel("renderer");
channel.setLogger(ipcLogger);
channel.addPipe(native.ipc.pipe);
// Handshake will bubble up to main channel
channel.handshakeAll();

export class NamespacedIPC {
    namespace: string;

    constructor(namespace: string) {
        this.namespace = namespace;
    }

    on(event: string, listener: (...args: any[]) => void) {
        channel.on(`${this.namespace}:${event}`, listener);
        return this;
    }
    once(event: string, listener: (...args: any[]) => void) {
        channel.once(`${this.namespace}:${event}`, listener);
        return this;
    }
    off(event: string, listener: (...args: any[]) => void) {
        channel.off(`${this.namespace}:${event}`, listener);
        return this;
    }
    send(event: string, data: any) {
        channel.send({
            name: `${this.namespace}:${event}`,
            destination: "main",
            data,
        });
    }
    // TODO: callers
}

export default {
    create(namespace: string) {
        return new NamespacedIPC(namespace);
    },
    get channel() {
        return channel;
    },
};
