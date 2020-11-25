const puppeteer = require('puppeteer');
const $ = require('cheerio');
var fs = require("fs");

async function findDates() {
    // prepare for headless chrome
    let allDates = [];
    let years = ["2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let url;
    let parser = new RegExp(/([0-9]*)-([0-9]*)-([0-9]*)/);
    // set user agent (override the default headless User Agent)
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    
    for (let i = 0; i < years.length; i++) {
        url = "https://www.pro-football-reference.com/years/" + years[i] + "/games.htm";
        await page.goto(url);
        const content = await page.content();
        $('tbody tr', content).each((index,element) => {
            let field = $(element).find("td");
            if(field[1]&&(parser.test(field[1].attribs.csk))){
                if(!allDates.includes(field[1].attribs.csk)){
                    allDates.push(field[1].attribs.csk);
                }   
            }

        });
    }

    fs.writeFile("./data/dates.txt", JSON.stringify(allDates),function(err){
        console.log("file written");
    })

    await browser.close();
}

findDates();