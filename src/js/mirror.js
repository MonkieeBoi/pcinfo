const root = document.documentElement;
const btn = document.getElementById("mirror-toggle");

function apply() {
    const on = root.dataset.mirror !== "on";
    if (on) root.dataset.mirror = "on";
    else delete root.dataset.mirror;
    try { localStorage.setItem("mirror", on ? "on" : "off"); } catch (e) { }
}

if (btn) {
    btn.addEventListener("click", () => {
        const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!document.startViewTransition || reduce) return apply();
        document.startViewTransition(apply);
    });
}

document.addEventListener("keydown", e => {
    const t = e.target;
    if (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;

    if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        btn?.click();
    }
});

const STORAGE_KEY = "mirror-style";

if (localStorage.getItem(STORAGE_KEY) === "mirror") {
    document.documentElement.dataset.vt = "mirror";
}

function setTransitionStyle(style) {
  if (style === "mirror") {
    document.documentElement.dataset.vt = "mirror";
    localStorage.setItem(STORAGE_KEY, "mirror");
  } else {
    delete document.documentElement.dataset.vt;
    localStorage.removeItem(STORAGE_KEY);
  }
}
