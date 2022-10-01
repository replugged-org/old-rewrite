import type RepluggedBridge from "../RepluggedBridge";

export default function createNativeIPC(rp: RepluggedBridge) {
    const ipc = {
        pipe: rp.ipc.port.createPipe("renderer"),
    };

    return ipc;
}
