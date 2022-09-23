import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { join } from "path";

export enum Environment {
    Unknown = 0,
    Client = 1,
    PopOut = 2,
    Splash = 3,
    Overlay = 4,
}

export type WindowContext = {
    env: Environment;
    discordPreload: string;
};

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

export const windowContexts = new Map<BrowserWindow, WindowContext>();

const ProxiedWindow = new Proxy(BrowserWindow, {
    construct(target, [winOpts]: [BrowserWindowConstructorOptions]) {
        const env = getEnvironment(winOpts);

        const winCtx: WindowContext = {
            env,
            discordPreload: null,
        };

        if (env === Environment.Client) {
            winCtx.discordPreload = winOpts.webPreferences!.preload;
            winOpts.webPreferences!.preload = join(__dirname, "preload.js");
        }

        const win = new target(winOpts);

        windowContexts.set(win, winCtx);
        win.once("closed", () => windowContexts.delete(win));

        return win;
    },
});

export default ProxiedWindow;
