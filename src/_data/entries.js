import fs from "node:fs";
import path from "node:path";

const slugify = s =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const pages = {};
const defaultPages = false;

export default function() {
    const root = "content";
    return fs.readdirSync(root, { recursive: true })
        .filter(f => f.endsWith(".json"))
        .flatMap(f => {
            const [section, file] = f.split(path.sep);
            const subsection = file.replace(".json", "");
            const hasPage = pages[section] ?? defaultPages;
            const group = JSON.parse(fs.readFileSync(path.join(root, f), "utf8"));
            return Object.entries(group).map(([key, data]) => {
                const slug = slugify(key);
                return {
                    ...data,
                    section,
                    subsection,
                    slug,
                    hasPage,
                    url: hasPage ? `/${section}/${subsection}/${slug}/` : null,
                };
            });
        });
}
