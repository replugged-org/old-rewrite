import { Style } from "../constants";
import Logger from "../lib/WebLogger";

const logger = new Logger([
    {
        name: "Replugged",
        background: Style.RepluggedGradient,
        color: "#fff",
        css: "font-weight:600",
    },
    {
        name: "Renderer",
        shorthand: "R",
        background: "#171e29",
        color: "#fff",
    },
]);

export default logger;
