const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const RSS = require('rss');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Function to create an RSS feed
function createRSSFeed(url, feedTitle, feedDescription) {
  return new Promise((resolve, reject) => {
    request(url, (error, response, html) => {
      if (error || response.statusCode !== 200) {
        reject(error || `Request failed with status code ${response.statusCode}`);
        return;
      }

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
      resolve(xml);
    });
  });
}

// Get feed
app.get('/api/rss', async (req, res) => {
  try {
    const feed = await createRSSFeed(
      'https://www.goodreads.com/news',
      'Goodreads RSS Feed',
      'Latest articles from Goodreads'
    );

    res.header('Content-Type', 'application/xml');
    res.send(feed);
  } catch (error) {
    console.error('Error generating or sending RSS feed:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;