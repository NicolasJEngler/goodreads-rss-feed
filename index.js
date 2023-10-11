const request = require('request');
const cheerio = require('cheerio');
const RSS = require('rss');

const { PROJECT_URL } = process.env;

function createRSSFeed(url, feedTitle, feedDescription) {
  // Fetch the HTML content of the website
  request(url, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      // Parse the HTML using Cheerio
      const $ = cheerio.load(html);

      // Create an RSS feed
      const feed = new RSS({
        title: feedTitle,
        description: feedDescription,
        feed_url: `${PROJECT_URL}/public/rss.xml`,
        site_url: url,
      });

      // Extract relevant information from the website
      $('.elementListLast.mediumText--index').each((index, element) => {
        const title = $(element).find('.editorialCard__title').text();
        const link = $(element).find('.editorialCard__title .gr-hyperlink').attr('href');
        const description = $(element).find('.editorialCard__body').text();
        const pubDate = $(element).find('.editorialCard__timestamp').text();

        // Add the item to the RSS feed
        feed.item({
          title: title,
          description: description,
          url: link,
          date: new Date(pubDate),
        });
      });

      // Save the RSS feed to a file
      const xml = feed.xml({ indent: true });
      require('fs').writeFileSync('public/rss.xml', xml);
    }
  });
}

// Example usage
createRSSFeed(
  'https://www.goodreads.com/news',
  'Goodreads RSS Feed',
  'Latest articles from Goodreads'
);