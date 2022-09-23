import logger from "./logger";
import type createRepluggedNative from "../preload/native/RepluggedNative";

declare global {
    interface Window {
        RepluggedNative: ReturnType<typeof createRepluggedNative>;
        webpackChunkdiscord_app: any;
    }
}

logger.log("Hello from renderer!", window.webpackChunkdiscord_app);

export {};
