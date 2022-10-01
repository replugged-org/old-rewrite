import { join } from "path";
import IPC from "modules/IPC";
import Protocol from "modules/Protocol";

class Replugged {
    ipc = new IPC(this);
    protocol = new Protocol(this);

    init() {
        this.protocol.setFile("base/renderer.js", join(__dirname, "renderer.js"));
        this.protocol.setFile("base/renderer.js.map", join(__dirname, "renderer.js.map"));
    }
}

export default Replugged;
