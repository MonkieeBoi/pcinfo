document.addEventListener("click", (e) => {
    const node = e.target.closest(".tree .node");
    if (!node) return;

    const sub = node.parentElement.querySelector(":scope > ul");
    if (sub) sub.classList.toggle("hidden");
});
