declare global {
    interface Window {
        webpackChunkdiscord_app: any;
    }
}

console.log("Hello from renderer!", window.webpackChunkdiscord_app);

export {};
