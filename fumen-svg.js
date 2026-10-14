import tf from "tetris-fumen";
const { decoder } = tf;

const colors = {
    T: { normal: "#9739a2", highlight: "#d958e9", skim: "#b94bc6" },
    I: { normal: "#42afe1", highlight: "#6ceaff", skim: "#5cc7f9" },
    J: { normal: "#1165b5", highlight: "#339bff", skim: "#2c84da" },
    L: { normal: "#f38927", highlight: "#ffba59", skim: "#f99e4c" },
    O: { normal: "#f6d03c", highlight: "#ffff7f", skim: "#f9df6c" },
    S: { normal: "#51b84d", highlight: "#84f880", skim: "#70d36d" },
    Z: { normal: "#eb4f65", highlight: "#ff7f79", skim: "#f96c67" },
    X: { normal: "#868686", highlight: "#dddddd", skim: "#bdbdbd" },
};

const swap = { T: "T", I: "I", J: "L", L: "J", O: "O", S: "Z", Z: "S", X: "X" };

const T = 22;
const COLS = 10;
const UP = T / 5;

function pageBody(page, rows, lock, mirror) {
    const field = page.field;
    const h = rows * T;
    let out = "";
    for (let j = 0; j < rows; j++) {
        let full = true;
        for (let x = 0; x < COLS; x++) {
            if (field.at(x, j) === "_") {
                full = false;
                break;
            }
        }
        for (let i = 0; i < COLS; i++) {
            const raw = field.at(i, j);
            if (raw === "_") continue;
            const c = colors[mirror ? swap[raw] : raw];
            const fill = full && lock ? c.skim : c.normal;
            const x = (mirror ? COLS - 1 - i : i) * T;
            const y = h + UP - (j + 1) * T - 1;
            out += `<rect x="${x}" y="${y}" width="${T}" height="${T + 1
                }" fill="${fill}"/>`;
            if (field.at(i, j + 1) === "_") {
                out += `<rect x="${x}" y="${h + UP - (j + 1) * T - T / 5
                    }" width="${T}" height="${T / 5}" fill="${c.highlight}"/>`;
            }
        }
    }
    return out;
}

export function fumenSvg(
    input,
    { rows = 4, lock = true, mirror = false, page = null, delay = 500 } = {},
) {
    let pages;
    if (typeof input === "string") {
        const code = input.split(/\s+/).filter(Boolean)[0];
        pages = decoder.decode(code);
    } else {
        pages = [{ field: input }];
    }

    if (page != null) {
        const p = pages[page - 1];
        if (p) pages = [p];
        else {
            console.warn(
                `fumen: page ${page} not found (${pages.length} page(s)), showing all`,
            );
        }
    }

    const w = COLS * T;
    const h = rows * T + UP;
    const n = pages.length;

    let body;
    if (n === 1) {
        body = pageBody(pages[0], rows, lock, mirror);
    } else {
        const times = pages.map((_, m) => (m / n).toFixed(4)).join(";");
        body = pages.map((pg, k) => {
            const values = pages.map((_, m) => (m === k ? "visible" : "hidden"))
                .join(";");
            return `<g visibility="hidden"><animate attributeName="visibility" calcMode="discrete" dur="${n * delay
                }ms" repeatCount="indefinite" values="${values}" keyTimes="${times}"/>${pageBody(pg, rows, lock, mirror)
                }</g>`;
        }).join("");
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;
}

export function fumenPageCount(input) {
    const code = input.split(/\s+/).filter(Boolean)[0];
    return decoder.decode(code).length;
}
