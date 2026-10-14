import { pick } from "../layouts.js";

export default {
    eleventyComputed: {
        layout: (data) => {
            const sec = data.sections.find((s) => s.slug === data.sub.section);
            return pick(
                "subsections",
                [data.sub.layout, sec?.subsectionLayout],
                [data.sub.section, "default"],
            );
        },
    },
};
