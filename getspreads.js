const puppeteer = require('puppeteer');
const $ = require('cheerio');
var fs = require("fs");

async function grabSpreads(){
    // prepare for headless chrome
    let spreadsinfo = [];
    let dates = [];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let url;

    /*
    {
        date: 20121014,
        Away team: Cincinnati,
        Home team: Cleveland,
        away score: 24,
        home score: 34,
        away opening spread: -1,
        home opening spread: +1,
        away closing spread: -1,
        home closing spread: +1,
        opening total: 44,
        closing total: 41.5,
    }*/

    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    
    for (let i = 0; i < years.length; i++) {
        url = "https://www.sportsbookreview.com/betting-odds/nfl-football/merged/?date=" + dates[i].replaceAll("-","");
        await page.goto(url);
        const content = await page.content();
        $('div.eventMarketGridContainer-3QipG', content).each((index,element) => {
            let field = $(element).find("td");
            if(field[1]&&(parser.test(field[1].attribs.csk))){
                if(!allDates.includes(field[1].attribs.csk)){
                    allDates.push(field[1].attribs.csk);
                }   
            }

        });
    }

    fs.writeFile("./data/spreadinfo.txt", JSON.stringify(spreadsinfo),function(err){
        console.log("file written");
    })

    await browser.close();
}


