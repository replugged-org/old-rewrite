const { RepluggedNative: native } = window;

// TODO: increase security later by serializing namespaced channels, and putting the namespacing inside preload
// Eg: "namespace:somethingHappened" -> "bmFtZXNwYWNl:c29tZXRoaW5nSGFwcGVuZWQ"

export class NamespacedIPC {
    __namespace: string;

    constructor(namespace: string) {
        this.__namespace = namespace;
    }

    static create(namespace: string) {
        return new NamespacedIPC(namespace);
    }
    create(namespace: string) {
        return new NamespacedIPC(namespace);
    }

    on(event: string, listener: (...args: any[]) => void) {
        native.ipc.on(`${this.__namespace}:${event}`, listener);
        return this;
    }
    once(event: string, listener: (...args: any[]) => void) {
        native.ipc.once(`${this.__namespace}:${event}`, listener);
        return this;
    }
    off(event: string, listener: (...args: any[]) => void) {
        native.ipc.off(`${this.__namespace}:${event}`, listener);
        return this;
    }
    send(event: string, ...args: any[]) {
        native.ipc.send(`${this.__namespace}:${event}`, ...args);
    }
}

export default new NamespacedIPC("renderer");
