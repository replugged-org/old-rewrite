import ipc from "./modules/IPC";

export default class RepluggedRenderer {
    // TODO: Freeze or seal modules
    ipc = ipc;
}
