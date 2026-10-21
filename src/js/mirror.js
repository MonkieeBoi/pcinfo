const root = document.documentElement;
const btn = document.getElementById("mirror-toggle");

function apply() {
    const on = root.dataset.mirror !== "on";
    if (on) root.dataset.mirror = "on";
    else delete root.dataset.mirror;
    try { localStorage.setItem("mirror", on ? "on" : "off"); } catch (e) { }

    if (document.documentElement.dataset.vt == "mirror") {
        var audio = new Audio('/assets/audio/woop.mp3');
        audio.play();
    } else if (document.documentElement.dataset.vt == "spin") {
        var audio = new Audio('/assets/audio/whoosh.mp3');
        audio.play();
    }
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

const loaded_style = localStorage.getItem(STORAGE_KEY);
if (loaded_style) {
    document.documentElement.dataset.vt = loaded_style;
}

function setTransitionStyle(style) {
    if (style) {
        document.documentElement.dataset.vt = style;
        localStorage.setItem(STORAGE_KEY, style);
    } else {
        delete document.documentElement.dataset.vt;
        localStorage.removeItem(STORAGE_KEY);
    }
}
