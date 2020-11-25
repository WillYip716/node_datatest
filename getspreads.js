const puppeteer = require('puppeteer');
const $ = require('cheerio');
var fs = require("fs");

async function grabSpreads(){
    // prepare for headless chrome
    let spreadsinfo = [];
    let dates = ["20121014"];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let url;

    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    
    for (let i = 0; i < dates.length; i++) {
        url = "https://www.sportsbookreview.com/betting-odds/nfl-football/merged/?date=" + dates[i];
        await page.goto(url, { waitUntil: 'networkidle0' });
        const content = await page.content();
        $('div.eventMarketGridContainer-3QipG', content).each((index,element) => {
            let game = {};
            game.date = dates[i];

            let teams = $(element).find("span.participantBox-3ar9Y");
            game.away_team = $(teams[0]).text();
            game.home_team = $(teams[1]).text();

            let scores = $(element).find("div.finalScore-156Hx > div");
            game.away_score = $(scores[0]).text();
            game.home_score = $(scores[1]).text();

            let lines = $(element).find("span.adjust-1uDgI");

            if($(lines[0]).text().charAt(0) == "-"){
                game.away_open = $(lines[0]).text().replace("½",".5");
                game.home_open = "+" + $(lines[0]).text().slice(1).replace("½",".5");
                game.total_open = $(lines[1]).text().replace("½",".5");
            }
            else{
                game.away_open = "+" + $(lines[1]).text().slice(1).replace("½",".5");
                game.home_open = $(lines[1]).text().replace("½",".5");
                game.total_open = $(lines[0]).text().replace("½",".5");
            }

            if($(lines[2]).text().charAt(0) == "-"){
                game.away_close = $(lines[2]).text().replace("½",".5");
                game.home_close = "+" + $(lines[2]).text().slice(1).replace("½",".5");
                game.total_close = $(lines[3]).text().replace("½",".5");
            }
            else{
                game.away_close = "+" + $(lines[3]).text().slice(1).replace("½",".5");
                game.home_close = $(lines[3]).text().replace("½",".5"); 
                game.total_close = $(lines[2]).text().replace("½",".5");
            }


            spreadsinfo.push(game);

            

        });
    }

    console.log(spreadsinfo);
    /*fs.writeFile("./data/spreadinfo.txt", JSON.stringify(spreadsinfo),function(err){
        console.log("file written");
    })*/

    await browser.close();
}


grabSpreads();

