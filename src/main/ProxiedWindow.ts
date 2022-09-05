import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { join } from "path";

export enum Environment {
    Unknown = 0,
    Client = 1,
    PopOut = 2,
    Splash = 3,
    Overlay = 4,
}

export function getEnvironment(options: BrowserWindowConstructorOptions) {
    switch (true) {
        case "webContents" in options:
            return Environment.PopOut;
        case options.webPreferences?.nodeIntegration:
            return Environment.Splash;
        case options.webPreferences?.offscreen:
            return Environment.Overlay;
        case !!options.webPreferences?.preload:
            return options.webPreferences.nativeWindowOpen
                ? Environment.Client
                : Environment.Splash;
        default:
            return Environment.Unknown;
    }
}

const ProxiedWindow = new Proxy(BrowserWindow, {
    construct(target, [winOpts]: [BrowserWindowConstructorOptions], _) {
        const env = getEnvironment(winOpts);

        if (env === Environment.Client) {
            // TODO: store original preload
            winOpts.webPreferences!.preload = join(__dirname, "preload.js");
        }

        return new target(winOpts);
    },
});

export default ProxiedWindow;
