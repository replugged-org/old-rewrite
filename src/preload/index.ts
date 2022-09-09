console.log("Hello from preload!", document);

async function injectRenderer() {
    const scriptElem = Object.assign(document.createElement("script"), {
        type: "module",
        src: "replugged://base/renderer.js",
    });

    // Doesn't have to be .documentElement
    while (!document.documentElement) await new Promise((resolve) => setImmediate(resolve));

    document.documentElement.appendChild(scriptElem);
    scriptElem.remove();
}

injectRenderer();

export {};
