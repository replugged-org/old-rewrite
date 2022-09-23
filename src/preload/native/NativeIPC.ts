import logger from "logger";
import type RepluggedBridge from "../RepluggedBridge";

type Listener = (...args: any[]) => void;

export type NativeIPC = {
    on: (channel: string, listener: Listener) => NativeIPC;
    once: (channel: string, listener: Listener) => NativeIPC;
    off: (channel: string, listener: Listener) => NativeIPC;
    send: (channel: string, ...args: any[]) => void;
    call: (channel: string, ...args: any[]) => Promise<any>;
};

export default function createNativeIPC(rp: RepluggedBridge) {
    // TODO: use a better listener manager (maybe a basic events lib)
    const listeners: Record<string, Listener[]> = {};
    const once: Listener[] = [];

    const ipc: NativeIPC = {
        on: (channel, listener) => {
            if (!listeners[channel]) listeners[channel] = [];
            listeners[channel].push(listener);
            return this;
        },
        once: (channel, listener) => {
            const unique = (...args) => listener(...args);
            ipc.on(channel, unique);
            once.push(unique);
            return this;
        },
        off: (channel, listener) => {
            if (!listeners[channel]) return this;

            listeners[channel] = listeners[channel].filter((fn) => fn !== listener);

            if (listeners[channel].length === 0) delete listeners[channel];
            return this;
        },
        send: (channel, ...args) => {
            rp.ipc.emit("messageMain", channel, ...args);
        },
        call: async () => {}, // TODO
    };

    rp.ipc.on("messageRenderer", (channel, ...args) => {
        if (!listeners[channel]) return;

        for (const listener of listeners[channel]) {
            // Remove once
            const onceIndex = once.indexOf(listener);
            if (onceIndex !== -1) {
                ipc.off(channel, listener);
                once.splice(onceIndex, 1);
            }

            try {
                listener(...args);
            } catch (error) {
                logger.error(`"${channel}" listener threw:`, error);
            }
        }
    });

    return ipc;
}
