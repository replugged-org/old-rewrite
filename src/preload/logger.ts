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
        name: "Bridge",
        shorthand: "B",
        background: "#2f3136",
        color: "#fff",
    },
]);

export default logger;
