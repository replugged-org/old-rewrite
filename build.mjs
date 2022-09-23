import { build as esbuild } from "esbuild";
import { replace } from "esbuild-plugin-replace";
import { copyFileSync, existsSync, fstat, readdirSync, rmSync } from "fs";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { NODE_ENV } = process.env;
const IS_DEV = NODE_ENV === "development" || NODE_ENV === "dev" || process.argv.includes("--dev");

const NODE_VERSION = "14";
const CHROME_VERSION = "91";

const BUILD_DIR = join(__dirname, "build");

const BOOTSTRAP_PLUGINS = [];
if (IS_DEV) {
    BOOTSTRAP_PLUGINS.push(
        replace({
            "process.env.INSTALL_DIR": JSON.stringify(path.join(__dirname, "installation")),
        }),
    );
}

const COMMON_OPTIONS = {
    absWorkingDir: __dirname,
    bundle: true,
    format: "cjs",
    minify: true,
    sourcemap: IS_DEV,
};
const BUILD_OPTIONS = [
    {
        ...COMMON_OPTIONS,
        bundle: false,
        entryPoints: ["./src/main/bootstrap"],
        platform: "node",
        plugins: BOOTSTRAP_PLUGINS,
        sourcemap: false,
        target: "node" + NODE_VERSION,
        outfile: "build/bootstrap.js",
    },
    {
        ...COMMON_OPTIONS,
        entryPoints: ["./src/main"],
        platform: "node",
        sourcemap: false,
        target: "node" + NODE_VERSION,
        outfile: "build/main.js",
        external: ["electron"],
    },
    {
        ...COMMON_OPTIONS,
        entryPoints: ["./src/preload"],
        platform: "node",
        target: ["node" + NODE_VERSION, "chrome" + CHROME_VERSION],
        sourcemap: "inline",
        outfile: "build/preload.js",
        external: ["electron"],
    },
    {
        ...COMMON_OPTIONS,
        entryPoints: ["./src/renderer"],
        format: "iife",
        platform: "browser",
        target: "chrome" + CHROME_VERSION,
        outfile: "build/renderer.js",
    },
];

export default async function build() {
    const buildStart = process.hrtime.bigint();

    if (existsSync(BUILD_DIR))
        for (const entry of readdirSync(BUILD_DIR))
            rmSync(join(BUILD_DIR, entry), { recursive: true, force: true });

    return Promise.all(BUILD_OPTIONS.map(async (options) => esbuild(options))).then((results) => {
        const durationMs = Number(process.hrtime.bigint() - buildStart) / 1e6;
        return [results, durationMs];
    });
}

if (import.meta.url.startsWith("file:///") && __filename === process.argv[1])
    build()
        .then(({ 1: buildMs }) => {
            console.log(`Done! Built in ${buildMs.toFixed(3)}ms`);

            if (IS_DEV) {
                if (existsSync(join(__dirname, "installation/bootstrap/"))) {
                    copyFileSync(
                        join(__dirname, "build/bootstrap.js"),
                        join(__dirname, "installation/bootstrap/index.js"),
                    );
                }
            }
        })
        .catch((error) => {
            console.error("Could not build Replugged:", error.message || error);
        });
