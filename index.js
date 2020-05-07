const { gvLinks } = require('./siteLinks');
const { saveNews } = require('./saveData');
const { gvScraper } = require('./scraper');


(async () => {
    try {
        for(link of gvLinks){          
            const news = await gvScraper(link.pageURL, link.location);
            await saveNews(news);
        }
    } catch (err) {
        console.log(err);
    }
})()