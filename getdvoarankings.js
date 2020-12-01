const puppeteer = require('puppeteer');
const $ = require('cheerio');
var fs = require("fs");

async function getdvoaratings() {
    // prepare for headless chrome
    let allDates = [];
    //let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
    let years = ["2007"];
    let week = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16"];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let url;
    // set user agent (override the default headless User Agent)
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    
    for (let i = 0; i < years.length; i++) {
        for (let j = 0; j < week.length; j++) {
            url = "https://www.footballoutsiders.com/dvoa-ratings/"+years[i]+"/week-"+week[j]+"-dvoa-ratings"
            await page.goto(url, { waitUntil: 'networkidle0' });
            const content = await page.content();
            $('tbody', content).each((index,element) => {
                let field = $(element).find("tr");
                //for (let k = 0; k < field.length; k++) {
                console.log("this is index " + index + " and tr length is "+ field.length);
            });
            
        }
    }

    /*fs.writeFile("./data/dates.txt", JSON.stringify(allDates),function(err){
        console.log("file written");
    })*/

    await browser.close();
}

getdvoaratings();