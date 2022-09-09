import { join } from "path";
import Protocol from "./modules/Protocol";

class Replugged {
    protocol = new Protocol(this);

    init() {
        this.protocol.setFile("base/renderer.js", join(__dirname, "renderer.js"));
        this.protocol.setFile("base/renderer.js.map", join(__dirname, "renderer.js.map"));
    }
}

export default Replugged;
