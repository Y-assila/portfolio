# Yassine Aassila — Portfolio

Dynamic, framework-free portfolio hosted on GitHub Pages: animated network background, live "Now" status, filterable projects with detail pages, a live feed of the latest GitHub repositories, light/dark theme, and a private admin page to publish new projects.

## Structure

```
index.html       Public site
styles.css       Styles (dark/light themes)
script.js        Rendering, animations, project modal, GitHub feed, contact form
data.js          Profile, experience and skills
content.json     Projects + "Now" status (managed by the admin page)
admin.html/.js/.css   Hidden admin page (not linked anywhere, noindex)
screenshots/     Project images    reports/   PDF reports    cv-*.pdf   CVs
```

## Adding a project (admin page)

1. Create a **fine-grained personal access token**: GitHub → Settings → Developer settings → Fine-grained tokens → *Only select repositories* → this repo → **Contents: Read and write**. Set an expiry.
2. Open `https://<your-site>/admin.html` and sign in with the token.
3. Click **New project**, fill the form, add screenshots, **Publish**. The page commits `content.json` (and resized images) to the repo; GitHub Pages redeploys in about a minute.

Security: the page is public but powerless without the token. The token is stored only in your browser (session by default; "Remember me" uses local storage) and is only sent to `api.github.com`. Never commit it anywhere. Revoke it on GitHub if a device is lost.

You can also edit `content.json` by hand — see any existing entry for the format.

## Local preview

```bash
python -m http.server 8000   # then open http://localhost:8000
```

(Must be served over HTTP — `content.json` is loaded with `fetch`.)

## Contact

[yassineassila321@gmail.com](mailto:yassineassila321@gmail.com) · [LinkedIn](https://www.linkedin.com/in/yassine-aassila/) · [GitHub](https://github.com/Y-assila)
