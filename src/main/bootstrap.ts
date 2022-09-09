import { Module } from "module";
import { join } from "path";
import { existsSync, readdirSync } from "fs";
import { app } from "electron";

const plugPattern = /^plug(?:-v?(\d+\.\d+\.\d+(?:\w+)?))?(?:\.asar)?$/;

function loadDiscord() {
    const APP_PATH = join(process.resourcesPath, "app.asar");

    // If this fails, the error will be enough context.
    const { name, main } = require(join(APP_PATH, "package.json"));

    // @ts-ignore
    app.setAppPath?.(APP_PATH);
    app.name = name;

    // @ts-ignore
    Module._load(join(APP_PATH, main), null, 0);
}

try {
    if (!existsSync(process.env.INSTALL_DIR)) throw new Error("Unable to find installation folder");

    const plugs = readdirSync(process.env.INSTALL_DIR).filter((item) => plugPattern.test(item));

    if (plugs.length === 0) throw new Error("Unable to find plugs in installation folder");

    // TODO: Implement plug version sorting and priority
    const plug = plugs[0];

    const mainPaths = [
        join(process.env.INSTALL_DIR, plug, "main.js"),
        join(process.env.INSTALL_DIR, plug, "build", "main.js"),
    ];
    const mainPath = mainPaths.find((file) => existsSync(file));

    if (!mainPath) throw new Error("Unable to find main entry point");

    require(mainPath).start(loadDiscord);
} catch (error) {
    console.error(error);
    loadDiscord();
}

export {};
