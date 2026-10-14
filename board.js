const W = 10, H = 23;

// [state][cell] = [dx, dy]; state 0 spawn, 1 left, 2 reverse, 3 right
const SHAPES = {
    T: [[[1, 0], [0, 0], [1, 1], [2, 0]], [[0, 1], [0, 0], [-1, 1], [0, 2]],
    [[0, 1], [0, 0], [-1, 1], [1, 1]], [[0, 1], [0, 0], [1, 1], [0, 2]]],
    I: [[[1, 0], [0, 0], [2, 0], [3, 0]], [[0, 1], [0, 0], [0, 2], [0, 3]]],
    J: [[[1, 0], [0, 0], [0, 1], [2, 0]], [[1, 1], [0, 0], [1, 0], [1, 2]],
    [[-1, 1], [0, 0], [-2, 1], [0, 1]], [[0, 1], [0, 0], [0, 2], [1, 2]]],
    L: [[[1, 0], [0, 0], [2, 0], [2, 1]], [[0, 1], [0, 0], [0, 2], [-1, 2]],
    [[1, 1], [0, 0], [0, 1], [2, 1]], [[0, 1], [0, 0], [1, 0], [0, 2]]],
    O: [[[0, 0], [1, 0], [0, 1], [1, 1]]],
    S: [[[1, 0], [0, 0], [1, 1], [2, 1]], [[0, 1], [0, 0], [-1, 1], [-1, 2]]],
    Z: [[[0, 0], [1, 0], [-1, 1], [0, 1]], [[1, 1], [0, 0], [0, 1], [1, 2]]],
};

const STATE = { n: 0, h: 0, w: 1, v: 1, s: 2, e: 3 };
const DEFAULT_ROT = { T: "n", L: "n", J: "n", O: "n", I: "h", S: "h", Z: "h" };
const TOKEN = /([TLJ][nsew]?|[ISZ][hv]?|O)(\d)(20|[01]\d|\d)?/g;
const num = (a, b) => a - b;

export class Board {
    constructor(
        rows = Array.from({ length: H }, () => Array(W).fill("_")),
        cleared = []
    ) {
        this.rows = rows;
        this.cleared = cleared;
    }

    copy() { return new Board(this.rows.map(r => [...r]), [...this.cleared]); }
    greyed() {
        const b = this.copy();
        b.rows = b.rows.map(r => r.map(c => (c === "_" ? "_" : "X")));
        return b;
    }


    at(x, y) { return this.rows[y]?.[x] ?? "_"; }

    realY(y) { for (const r of this.cleared) { if (r > y) break; y++; } return y; }
    wat(x, y) { return this.at(x, this.realY(y)); }
    height() { return H - this.cleared.length; }

    isFree(x, y) {
        return x >= 0 && x < W && y >= 0 && y < this.height()
            && this.realY(y) < H && this.wat(x, y) === "_";
    }
    fullRows(rows) {
        return [...rows].filter(y => {
            for (let x = 0; x < W; x++) if (this.wat(x, y) === "_") return false;
            return true;
        }).sort(num);
    }
    registerClears(workingRows) {
        const real = [...workingRows].sort(num).map(y => this.realY(y));
        this.cleared = [...this.cleared, ...real].sort(num);
    }

    place(piece, state, x, dist) {
        const shape = SHAPES[piece][state];
        if (!shape) return;
        const dxs = shape.map(s => s[0]), dys = shape.map(s => s[1]);
        const cx = x - Math.min(...dxs);
        if (cx + Math.max(...dxs) >= W) return;
        const cells = cy => shape.map(([dx, dy]) => [cx + dx, cy + dy]);

        let cy = null;
        if (dist != null) {
            cy = dist - Math.min(...dys);
        } else {
            for (let y = 0; y < 20; y++) {
                const c = cells(y);
                if (!c.every(([px, py]) => this.isFree(px, py))) continue;
                if (!c.some(([px, py]) => py === 0 || this.wat(px, py - 1) !== "_")) continue;
                if (cy === null) cy = y;
                else { if (Math.max(...c.map(p => p[1])) < 4) cy = null; break; }
            }
        }
        if (cy === null) return;

        const c = cells(cy);
        if (!c.every(([px, py]) => this.isFree(px, py))) return;
        for (const [px, py] of c) this.rows[this.realY(py)][px] = piece;
        this.registerClears(this.fullRows(new Set(c.map(p => p[1]))));
    }

    applyNotation(text) {
        for (const m of text.matchAll(TOKEN)) {
            const piece = m[1][0];
            const state = STATE[m[1].slice(1) || DEFAULT_ROT[piece]];
            this.place(piece, state, +m[2], m[3] == null ? null : +m[3]);
        }
        return this;
    }
}
