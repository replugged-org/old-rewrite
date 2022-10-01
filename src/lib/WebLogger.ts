export type Scope = {
    name: string;
    shorthand?: string;
    background?: string;
    color?: string;
    css?: string;
};

export default class Logger {
    scopes: Scope[];

    constructor(scopes: Scope[]) {
        this.scopes = scopes;
    }

    // TODO: support format strings
    log(...args: any[]) {
        console.log(...this.getScopedArgs(), ...args);
    }
    warn(...args: any[]) {
        console.warn(...this.getScopedArgs(), ...args);
    }
    error(...args: any[]) {
        console.error(...this.getScopedArgs(), ...args);
    }

    createLogger(scopes: Scope | Scope[], trim = 0) {
        return new Logger([...this.scopes.slice(-trim), ...[scopes].flat()]);
    }
    serialize() {
        return JSON.stringify(this.scopes);
    }
    static deserialize(data: string) {
        return new Logger(JSON.parse(data));
    }

    // TODO: increase readability of the methods below
    getEdges(scope: Scope): [boolean, boolean] {
        const isLeftEdge = scope === this.scopes[0];
        const isRightEdge = scope === this.scopes[this.scopes.length - 1];
        return [isLeftEdge, isRightEdge];
    }
    getBorderRadius(scope: Scope) {
        const [isLeftEdge, isRightEdge] = this.getEdges(scope);
        const leftRadius = isLeftEdge ? "3px" : "0";
        const rightRadius = isRightEdge ? "3px" : "0";
        return `${leftRadius} ${rightRadius} ${rightRadius} ${leftRadius}`;
    }
    getBorderWidth(scope: Scope) {
        const [isLeftEdge, isRightEdge] = this.getEdges(scope);
        const leftWidth = isLeftEdge ? "1px" : "0";
        const rightWidth = isRightEdge ? "1px" : "0";
        return `1px ${rightWidth} 1px ${leftWidth}`;
    }
    getDisplayName(scope: Scope) {
        const [, isRightEdge] = this.getEdges(scope);
        return (!isRightEdge && scope.shorthand) || scope.name;
    }
    getScopedArgs() {
        const args = [];
        args.push(this.scopes.map((s) => "%c" + this.getDisplayName(s)).join(""));

        for (const scope of this.scopes) {
            const cssData = {
                background: scope.background ?? "var(--brand-experiment)",
                color: scope.color ?? "hsl(0,calc(var(--saturation-factor, 1)*0%),100%)",
                padding: "0 5px 0 4px",
                border: "rgba(255, 255, 255, 0.1) solid",
                "border-width": this.getBorderWidth(scope),
                "border-radius": this.getBorderRadius(scope),
                "box-shadow": "0 0 0 14px rgba(255, 255, 255, 0.1)",
            };

            const css =
                [...Object.entries(cssData)].map((pair) => pair.join(":")).join(";") +
                    ";" +
                    scope.css ?? "";
            args.push(Logger.replaceCssVars(css));
        }

        return args;
    }

    static replaceCssVars(css) {
        return css.replace(/var\((--[\w-]+)(?:,([^\)]+))?\)/g, (match, prop, fallback) => {
            return getComputedStyle(document.documentElement).getPropertyValue(prop) || fallback;
        });
    }
}
