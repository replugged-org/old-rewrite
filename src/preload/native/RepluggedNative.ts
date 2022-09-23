import logger from "logger";
import type RepluggedBridge from "../RepluggedBridge";
import createNativeIPC from "./NativeIPC";

export default function createRepluggedNative(rp: RepluggedBridge) {
    return {
        ipc: createNativeIPC(rp),
    };
}
