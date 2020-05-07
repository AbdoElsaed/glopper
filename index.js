const { gvLinks } = require('./siteLinks');
const { saveNews } = require('./saveData');
const { gvScraper } = require('./scraper');

// scrape global voices website and save to firebase
// for(link of gvLinks){
//     gvScraper(link.pageURL, link.location)
//         .then(news => {
//             saveNews(news);
//         })
//         .catch(console.error);
// }


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