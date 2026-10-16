import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import rangefindPlugin from "eleventy-plugin-rangefind";
import { fumenPageCount, fumenSvg } from "./fumen-svg.js";
import { renderTree } from "./tree.js";

const esc = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(
        />/g,
        "&gt;",
    );

const flip = { L: "J", J: "L", S: "Z", Z: "S" };
const ORDER = "TIJLOSZ";

const sortBlock = (s) =>
    [...s].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)).join("");

function normalizeText(text) {
    return String(text).replace(/\b[IJLOSTZ]+\b/g, sortBlock);
}

function mirrorText(text) {
    return String(text).replace(
        /\b[IJLOSTZ]+\b/g,
        (block) => sortBlock([...block].map((c) => flip[c] ?? c).join("")),
    );
}

const img = (svg) =>
    `<img class="fumen" alt="fumen" src="data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")
    }">`;

const colorize = (html) =>
    html
        .replace(/\b[IJLOSTZ]+\b/g, (block) =>
            [...block].map((c) =>
                `<span class="p-${c}">${c}</span>`
            ).join(""))
        .replaceAll("\n", "<br>");

export default function(eleventyConfig) {
    eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
    const PATH_PREFIX = process.env.PATH_PREFIX || "/";
    eleventyConfig.addPlugin(rangefindPlugin, {
        baseUrl: PATH_PREFIX,
        src: `${PATH_PREFIX}rangefind/`
    });
    eleventyConfig.addWatchTarget("content/");
    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/css");
    eleventyConfig.addPassthroughCopy("src/assets");

    eleventyConfig.addShortcode("fumen", (code, opts = {}) => {
        const { rows = 4, lock = true, page = null } = opts;
        return (
            `<span class="n">${img(fumenSvg(code, { rows, lock, page, mirror: false }))
            }</span>` +
            `<span class="m">${img(fumenSvg(code, { rows, lock, page, mirror: true }))
            }</span>`
        );
    });

    eleventyConfig.addShortcode("label", (text) => {
        const a = normalizeText(text), b = mirrorText(text);
        const ha = colorize(esc(a));
        return a === b
            ? ha
            : `<span class="n">${ha}</span><span class="m">${colorize(esc(b))}</span>`;
    });


    eleventyConfig.addShortcode("normal_label", (text) => {
        const a = esc(normalizeText(text));
        const b = esc(mirrorText(text));
        return a === b
            ? a
            : `${a}/${b}`;
    });

    eleventyConfig.addShortcode("tree", node =>
        renderTree(node, {
            img,
            label: (text, mirror) =>
                colorize(esc(mirror ? mirrorText(text) : normalizeText(text))),
        })
    );

    eleventyConfig.addFilter("withTag", (entries, tags) => {
        const wanted = Array.isArray(tags) ? tags : [tags];
        return entries.filter(e => wanted.some(t => e.tags?.includes(t)));
    });

    eleventyConfig.addFilter(
        "fumenPages",
        (code) =>
            code
                ? Array.from({ length: fumenPageCount(code) }, (_, i) => i + 1)
                : [],
    );

    return {
        dir: { input: "src", output: "_site" },
        pathPrefix: PATH_PREFIX,
    };
}
