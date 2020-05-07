const puppeteer = require('puppeteer');
// const admin = require('firebase-admin');
// const serviceAccount = require('./serviceAccountKey.json');

// //initialize admin SDK using serviceAcountKey
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://glopper-f830f.firebaseio.com"
// });

// const db = admin.firestore();
// const realtimeDB = admin.database();

const gvScraper = async (pageURL, location) => {
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
                category: newsCategory[i]?newsCategory[i]:'general',
                summary: newsSummary[i],
                contentTexts: texts,
                imgUrl: imgUrl,
                location
            })

        }
        


        // const egyptRef = realtimeDB.ref('news/egypt');
        // console.log(news);
        // for(let i=0; i<news.length; i++){
        //     db.collection('egypt').doc(`${i}`).set(news[i]);
        //     egyptRef.child(`${i}`).set(news[i]);
        // }


        await browser.close();
    }
    catch (err) {
        console.log(err);
    }
    
    return news;
}



module.exports = { gvScraper };