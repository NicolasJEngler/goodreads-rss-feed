const request = require('request');
const cheerio = require('cheerio');
const RSS = require('rss');
const fs = require('fs');

module.exports = async function (req, res) {
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

        $('your_html_selector_for_articles').each((index, element) => {
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
        fs.writeFileSync('public/rss.xml', xml);
      }
    });
  }

  // Example usage
  createRSSFeed(
    'https://www.goodreads.com/news',
    'Goodreads RSS Feed',
    'Latest articles from Goodreads'
  );

  // Send a response
  res.status(200).send('RSS feed generated successfully!');
};