/* ============================================================
   The Ujjwal Times — theme switcher
   Persists user choice in localStorage and honours system preference
   on first visit. Runs before DOMContentLoaded to avoid theme flash.
   ============================================================ */
(function () {
    const STORAGE_KEY = 'ujjwal-theme';
    const VALID = ['light', 'dark', 'colorful'];

    function preferredTheme() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved && VALID.includes(saved)) return saved;
        } catch (_e) { /* localStorage may be blocked */ }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    function applyTheme(theme) {
        if (!VALID.includes(theme)) theme = 'light';
        document.documentElement.setAttribute('data-theme', theme);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            const colors = { light: '#ebeae7', dark: '#0e1014', colorful: '#fbc2eb' };
            meta.setAttribute('content', colors[theme]);
        }
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (_e) { /* ignore */ }
    }

    // Apply ASAP (before paint) to prevent flash of wrong theme.
    applyTheme(preferredTheme());

    function wireSwitcher() {
        const buttons = document.querySelectorAll('.theme-btn[data-theme-value]');
        if (!buttons.length) return;
        const current = document.documentElement.getAttribute('data-theme');

        function refreshChecked() {
            const active = document.documentElement.getAttribute('data-theme');
            buttons.forEach(btn => {
                btn.setAttribute('aria-checked', btn.dataset.themeValue === active ? 'true' : 'false');
            });
        }

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                applyTheme(btn.dataset.themeValue);
                refreshChecked();
            });
        });

        // Reflect initial state
        const _ = current; // no-op reference
        refreshChecked();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireSwitcher);
    } else {
        wireSwitcher();
    }
})();


document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('currentDate').textContent = currentDate;

    const rssFeeds = [
        { url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', category: 'US', source: 'The New York Times' },
        { url: 'https://www.theguardian.com/us/rss', category: 'US', source: 'The Guardian' },
        { url: 'https://www.theguardian.com/uk/rss', category: 'UK', source: 'The Guardian' },
        { url: 'http://rss.cnn.com/rss/cnn_topstories.rss', category: 'World', source: 'CNN' },
        { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', category: 'Technology', source: 'BBC' },
        { url: 'https://feeds.bbci.co.uk/news/rss.xml', category: 'World', source: 'BBC' },
        { url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', category: 'India', source: 'Times of India' },
        { url: 'https://economictimes.indiatimes.com/rssfeedsdefault.cms', category: 'Business', source: 'The Economic Times' },
        { url: 'https://www.thehindu.com/feeder/default.rss', category: 'India', source: 'The Hindu' },
        { url: 'https://feeds.feedburner.com/ndtvnews-top-stories', category: 'India', source: 'NDTV' },
        { url: 'https://www.hindustantimes.com/feeds/rss/home/rssfeed.xml', category: 'India', source: 'Hindustan Times' },
        { url: 'https://indianexpress.com/feed/', category: 'India', source: 'Indian Express' },
        { url: 'https://www.livemint.com/rss/news', category: 'India', source: 'Mint' },
        { url: 'https://www.news18.com/rss/india.xml', category: 'India', source: 'News18' },
        { url: 'https://zeenews.india.com/rss/india-national-news.xml', category: 'India', source: 'Zee News' },
        { url: 'https://www.firstpost.com/rss', category: 'India', source: 'Firstpost' }
    ];

    const newsColumns = document.getElementById('newsColumns');
    const sourceFilters = document.getElementById('sourceFilters');
    const categoryFilters = document.getElementById('categoryFilters');

    // Extract unique sources and categories
    const sources = [...new Set(rssFeeds.map(feed => feed.source))];
    const categories = [...new Set(rssFeeds.map(feed => feed.category))];

    // Render source filters
    sources.forEach(source => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${source}" onchange="filterNews()"> ${source}`;
        sourceFilters.appendChild(label);
    });

    // Render category filters
    categories.forEach(category => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${category}" onchange="filterNews()"> ${category}`;
        categoryFilters.appendChild(label);
    });

    // Fetch and display news
    let allArticles = [];
    rssFeeds.forEach(feed => {
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`)
            .then(response => response.json())
            .then(data => {
                data.items.forEach(item => {
                    const article = document.createElement('div');
                    article.classList.add('news-card');
                    article.dataset.source = feed.source;
                    article.dataset.category = feed.category;
                    article.innerHTML = `
                        <div class="category">${feed.category}</div>
                        <h1>${item.title}</h1>
                        <p>${item.description}</p>
                        ${item.enclosure ? `<img src="${item.enclosure.link}" alt="${item.title}" loading="lazy" decoding="async">` : ''}
                        <div class="source">Source: <a href="${item.link}" target="_blank" rel="noopener">${feed.source}</a></div>
                    `;
                    newsColumns.appendChild(article);
                    allArticles.push(article);
                });
            })
            .catch(error => console.error('Error fetching RSS feed:', error));
    });

    // Filter news based on selected checkboxes
    window.filterNews = function() {
        const selectedSources = Array.from(document.querySelectorAll('#sourceFilters input:checked')).map(input => input.value);
        const selectedCategories = Array.from(document.querySelectorAll('#categoryFilters input:checked')).map(input => input.value);

        allArticles.forEach(article => {
            const matchesSource = selectedSources.length === 0 || selectedSources.includes(article.dataset.source);
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(article.dataset.category);

            if (matchesSource && matchesCategory) {
                article.style.display = '';
            } else {
                article.style.display = 'none';
            }
        });
    };

    // Toggle filter section visibility
    window.toggleFilters = function() {
        const filterSection = document.getElementById('filterSection');
        const toggleButton = document.getElementById('filterToggle');

        if (filterSection.style.display === 'none') {
            filterSection.style.display = 'flex';
            toggleButton.textContent = 'Hide Filters';
        } else {
            filterSection.style.display = 'none';
            toggleButton.textContent = 'Show Filters';
        }
    };
});