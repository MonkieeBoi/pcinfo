import { pick } from "../layouts.js";

export default {
    eleventyComputed: {
        layout: (data) => {
            const sec = data.sections.find((s) =>
                s.slug === data.entry.section
            );
            const sub = sec?.subsections?.find((s) =>
                s.slug === data.entry.subsection
            );
            return pick("entries", [
                data.entry.layout,
                sub?.entryLayout,
                sec?.entryLayout,
            ], [data.entry.section, "default"]);
        },
    },
};
