# The Ujjwal Times

A newspaper-styled, client-side news aggregator that pulls headlines from leading global and Indian RSS feeds onto a single front page.

## Themes

Light · Dark · Colorful — switch from the pill in the top-right; your choice is remembered.

## Running

It's a static site — open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

## Thanks

### RSS sources

Every headline you see comes from one of these publishers' public RSS feeds. Article copyright stays with them and every link goes back to the original story on their site. Thank you to:

- [The New York Times](https://www.nytimes.com/)
- [The Guardian](https://www.theguardian.com/) (US & UK editions)
- [CNN](https://www.cnn.com/)
- [BBC News](https://www.bbc.com/news) (World & Technology)
- [Times of India](https://timesofindia.indiatimes.com/)
- [The Economic Times](https://economictimes.indiatimes.com/)
- [The Hindu](https://www.thehindu.com/)
- [NDTV](https://www.ndtv.com/)
- [Hindustan Times](https://www.hindustantimes.com/)
- [The Indian Express](https://indianexpress.com/)
- [Mint](https://www.livemint.com/)
- [News18](https://www.news18.com/)
- [Zee News](https://zeenews.india.com/)
- [Firstpost](https://www.firstpost.com/)

And thanks to [**rss2json**](https://rss2json.com/) for the public JSON proxy that lets the browser read these feeds without a backend.

### Tooling

- [**GitHub Actions**](https://github.com/features/actions) — for CI and for serving the site via [GitHub Pages](https://pages.github.com/).
- [**Google Fonts**](https://fonts.google.com/) — Fondamento, Playfair Display, Roboto, and Roboto Mono.

## License

[MIT](./LICENSE)