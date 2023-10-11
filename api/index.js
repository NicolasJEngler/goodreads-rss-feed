const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const RSS = require('rss');
const fs = require('fs');

const { PROJECT_URL } = process.env;

const app = express();
const port = process.env.PORT || 3000;

// Function to create an RSS feed
function createRSSFeed(url, feedTitle, feedDescription) {
  request(url, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);
      const feed = new RSS({
        title: feedTitle,
        description: feedDescription,
        feed_url: `${url}/rss.xml`,
        site_url: url,
      });

      $('.editorialCard').each((index, element) => {
        const title = $(element).find('.editorialCard__title').text();
        const link = $(element).find('.editorialCard__title .gr-hyperlink').attr('href');
        const description = $(element).find('.editorialCard__body').text();
        const pubDate = $(element).find('.editorialCard__timestamp').text();

        feed.item({
          title: title,
          description: description,
          url: link,
          date: new Date(pubDate),
        });
      });

      const xml = feed.xml({ indent: true });
      fs.writeFileSync('./../public/rss.xml', xml);
    }
  });
}

// Example usage
app.get('/api/generate-rss', (req, res) => {
  createRSSFeed(
    'https://www.goodreads.com/news',
    'Goodreads RSS Feed',
    'Latest articles from Goodreads'
  );

  res.status(200).send('RSS feed generated successfully!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;