document.addEventListener('DOMContentLoaded', () => {
    const backdrop = document.querySelector('.rf-backdrop');

    function openSearch() {
        backdrop.classList.remove('hidden');
        const searchInput = backdrop.querySelector('input, [autofocus]') || backdrop.querySelector('rangefind-search');
        if (searchInput) {
            searchInput.focus();
            searchInput.value = "";
        }
    }

    function closeSearch() {
        backdrop.classList.add('hidden');
    }

    backdrop.addEventListener('click', (event) => {
        if (event.target === event.currentTarget) {
            closeSearch();
        }
    });

    document.getElementById('search-toggle').addEventListener('click', openSearch);
    document.addEventListener('keydown', (e) => {
        if (e.metaKey || e.altKey || e.repeat) return;
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const isOpen = !backdrop.classList.contains('hidden');
            if (isOpen) closeSearch();
            else openSearch();
        }
        if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) {
            closeSearch();
        }
    });

    const ORDER = "TIJLOSZ";

    const sortBlock = (s) =>
        [...s].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)).join("");

    function normalizeText(text) {
        return String(text).replace(/\b[IJLOSTZ]+\b/gi, (match) => (sortBlock(match.toUpperCase())));
    }

    const searchInput = document.querySelector('.rf-search__input');

    searchInput.addEventListener('input', (e) => {
        let rawQuery = e.target.value;

        if (rawQuery == "mookmouth") {
            setTransitionStyle("mirror");
            closeSearch();
        } else if (rawQuery == "reset") {
            setTransitionStyle();
            closeSearch();
        }

        let normalizedQuery = normalizeText(rawQuery);

        searchInput.value = normalizedQuery;
    });
});
