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
