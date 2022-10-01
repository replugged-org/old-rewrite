import IPCBridge from "modules/IPC";

export default class RepluggedBridge {
    ipc = new IPCBridge(this);
}
