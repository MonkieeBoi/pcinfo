import fs from "node:fs";
import path from "node:path";

export default function() {
    const root = "content";
    return fs.readdirSync(root, { recursive: true })
        .filter(f => f.endsWith(".json"))
        .flatMap(f => {
            const [section, file] = f.split(path.sep);
            const subsection = file.replace(".json", "");
            const group = JSON.parse(fs.readFileSync(path.join(root, f), "utf8"));
            return Object.entries(group).map(([slug, data]) => ({
                ...data,
                section,
                subsection,
                slug,
                url: `/${section}/${subsection}/${slug}/`,
            }));
        });
}
