import fs from "node:fs";

// conventions: names tried by file existence, first match wins
export function pick(kind, explicit, conventions) {
    const set = explicit.find(Boolean);
    if (set) return `${kind}/${set}.njk`;
    const found = conventions.find((n) =>
        fs.existsSync(`src/_includes/${kind}/${n}.njk`)
    );
    if (!found) {
        throw new Error(
            `No ${kind} layout found (tried ${conventions.join(", ")})`,
        );
    }
    return `${kind}/${found}.njk`;
}
