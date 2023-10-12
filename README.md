## Goodreads RSS feed generator

This project is intended to expose an Express API to return all the latest entries from Goodreads' News section. The API is in charge of serving an XML response to be used as an RSS feed in your favorite RSS reader.

If you're looking to fork this project, here are build instructions & notes:
1. Run `yarn install`
2. Add a `.env` file with a `PROJECT_URL` variable. This should be the root of your host (e.g.: `https://your-app-slug.vercel.app/`)
3. After deploying your app (I developed this using Vercel strictly, but it most definitely can be adapted to any other service), you should have a URL like the following exposing an RSS feed in XML format: `https://your-app-slug.vercel.app/api/rss`
4. You can use this locally by running `node api/index.js`. This will spin up a local server in `localhost:3000` which you can later use to access `localhost:3000/api/rss` for the feed.

Notes:
- The HTML exposed by Goodreads doesn't include a year for the dates of the articles, thus ending up in incorrect dates for the entries (e.g.: 21 sep **2001** when it should be **2023**)
- This could easily break as soon as Goodreads changes the markup of their blog, since scraping depends solely on HTML class attributes to get data