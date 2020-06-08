const puppeteer = require('puppeteer');

const gvScraper = async (pageURL, location='general', category='general') => {
    let news = [];
    try {
        
        let browser = await puppeteer.launch()
        const page = await browser.newPage()
        // await page.setDefaultNavigationTimeout(0);
        // await page.goto('https://globalvoices.org/-/world/middle-east-north-africa/egypt/', { waitUntil: 'load', timeout: 0 })
        await page.goto(pageURL, { waitUntil: 'load', timeout: 0 })

        // execute standard javascript in the context of the page.
        //const newsHeader = await page.$$eval('section.stream-main .story:not(.story-sponsored) article .story-h a', anchors => { return anchors.map(anchor => anchor.textContent).slice(0, 12) })
        const newsHeader = await page.$$eval('.dategroup .post-excerpt-container h3.post-title a', anchors => { return anchors.map(anchor => anchor.textContent) })
        const newsCategory = await page.$$eval('.dategroup .post-excerpt-container div.postmeta.post-summary-postmeta-top span.post-terms-inline a', catgs => {
            return catgs = catgs.map(cat => cat.textContent.trim())
        })
        const newsSummary = await page.$$eval('.dategroup .post-excerpt-container div.entry.excerpt-entry p.excerpt-text', texts => {
            return texts.map(text => text.textContent)
        })

        
        const links = await page.$$eval('.dategroup .post-excerpt-container h3.post-title a', anchors => {
            return anchors.map(anchor => anchor.href);
            
        })

        for (let i=0; i<links.length; i++) {

            await page.goto(links[i], { waitUntil: 'load', timeout: 0 });

            // collect content img and paragraphs
            const texts = await page.$$eval('div#full-article div#single-post div.entry p', paras => {
                return paras.map(para => para.textContent);
            }) 
            const imgUrl = await page.$eval('div#full-article div#single-post div.entry div.wp-caption img', img => img.src ) ? await page.$eval('div#full-article div#single-post div.entry div.wp-caption img', img => img.src ) : 'No Image Provided'; 


            news.push({
                header: newsHeader[i],
                tag: newsCategory[i],
                summary: newsSummary[i],
                contentTexts: texts,
                imgUrl: imgUrl,
                views: 0,
                location,
                category
            })
        }
        
        await browser.close();
    }
    catch (err) {
        console.log(err);
    }
    
    return news;
}



module.exports = { gvScraper };