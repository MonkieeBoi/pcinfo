import { pick } from "../layouts.js";

export default {
    eleventyComputed: {
        layout: (data) =>
            pick("sections", [data.section.layout], [
                data.section.slug,
                "default",
            ]),
    },
};
