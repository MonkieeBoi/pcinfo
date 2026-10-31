import { Board } from "./board.js";
import { fumenSvg, renderSolves } from "./fumen-svg.js";

export function renderTree(root, { img, label }) {
  const both = (make) => {
    const a = make(false), b = make(true);
    return a === b ? a : `<span class="n">${a}</span><span class="m">${b}</span>`;
  };

  const build = (node, parent) => {
    const start = node.base ? new Board().applyNotation(node.base) : parent;
    const board = node.p ? start.greyed().applyNotation(node.p) : start;

    const solves = node.solves
      ? renderSolves(node.solves, (page) =>
          both((mirror) => img(fumenSvg(node.solves, { page, mirror }))))
      : "";

    const head = node.label
      ? both(m => label(node.label, m)) + "<br>"
      : "";
    const pic = both(m => img(fumenSvg(board, { rows: 4, mirror: m })));
    const btn = `<button class="node">${head}${pic}</button>`;

    const kids = (node.c ?? []).map(k => build(k, board)).join("");
    const ul = kids ? `<ul>${kids}</ul>` : "";
    return `<li>${btn}${solves}${ul}</li>`;
  };

  return `<ul class="tree">${build(root, new Board())}</ul>`;
}
