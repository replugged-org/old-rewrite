import type Replugged from "../Replugged";
import { app, protocol, ProtocolRequest, ProtocolResponse } from "electron";
import mime from "mime-types";
import { readFile } from "fs/promises";

const REPLUGGED_SCHEME = [
    {
        scheme: "replugged",
        privileges: {
            standard: true,
            secure: true,
            bypassCSP: true,
            allowServiceWorkers: true,
            supportFetchAPI: true,
            corsEnabled: true,
        },
    },
];

export type Request = Omit<ProtocolRequest, "url"> & {
    url: URL;
};

class Protocol {
    __rp: Replugged;

    /** Maps virtual paths to file paths */
    staticPaths = new Map<string, string>();

    constructor(replugged: Replugged) {
        this.__rp = replugged;

        this.init();
    }

    init() {
        protocol.registerSchemesAsPrivileged(REPLUGGED_SCHEME);

        app.whenReady().then(() => {
            protocol.registerBufferProtocol("replugged", (request, callback) => {
                const url = new URL(request.url);
                this.handleRequest({ ...request, url }, callback);
            });
        });
    }

    handleRequest(request: Request, callback: (response: ProtocolResponse) => void) {
        // Static
        const vPath = request.url.host + request.url.pathname;
        if (request.method === "GET" && this.staticPaths.has(vPath))
            return this.handleStatic(this.staticPaths.get(vPath)).then(callback);

        // TODO (if wanted): arbitrary endpoint api
    }
    handleStatic(filePath: string): Promise<ProtocolResponse> {
        return readFile(filePath)
            .then((data) => ({
                data,
                mimeType: mime.lookup(filePath),
            }))
            .catch(() => ({ statusCode: 404 }));
    }

    setFile(vPath, filePath) {
        this.staticPaths.set(vPath, filePath);
    }
}

export default Protocol;
