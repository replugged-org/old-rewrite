import type createRepluggedNative from "../preload/native/RepluggedNative";
import logger from "logger";
import RepluggedRenderer from "RepluggedRenderer";

declare global {
    interface Window {
        RepluggedNative: ReturnType<typeof createRepluggedNative>;
        replugged: RepluggedRenderer;
        webpackChunkdiscord_app: any;
    }
}

logger.log("Hello from renderer!", window.webpackChunkdiscord_app);

window.replugged = new RepluggedRenderer();

export {};
