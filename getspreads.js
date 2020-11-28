const puppeteer = require('puppeteer');
const $ = require('cheerio');
var fs = require("fs");

async function grabSpreads(){
    // prepare for headless chrome
    let spreadsinfo = [];
    let dates = ["2019-09-05","2019-09-08","2019-09-09","2019-09-12","2019-09-15","2019-09-16","2019-09-19","2019-09-22","2019-09-23","2019-09-26","2019-09-29","2019-09-30","2019-10-03","2019-10-06","2019-10-07","2019-10-10","2019-10-13","2019-10-14","2019-10-17","2019-10-20","2019-10-21","2019-10-24","2019-10-27","2019-10-28","2019-10-31","2019-11-03","2019-11-04","2019-11-07","2019-11-10","2019-11-11","2019-11-14","2019-11-17","2019-11-18","2019-11-21","2019-11-24","2019-11-25","2019-11-28","2019-12-01","2019-12-02","2019-12-05","2019-12-08","2019-12-09","2019-12-12","2019-12-15","2019-12-16","2019-12-21","2019-12-22","2019-12-23","2019-12-29"];
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
        console.log(dates[i] + " finished");
    }
    

    fs.writeFile("./data/2019spreads.txt", JSON.stringify(spreadsinfo),function(err){
        console.log("file written with " + spreadsinfo.length + " games");
    })

    await browser.close();
}


grabSpreads();

