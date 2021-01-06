var fs = require("fs");
var XLSX = require('xlsx')
const csv = require('csv-parser');
const converter = require('json-2-csv');
const puppeteer = require('puppeteer');
const $ = require('cheerio');
var fs = require("fs");


function weathercsv(){
    
    const weatherdata = [];
    fs.createReadStream('./data/weather_20131231.csv')
      .pipe(csv())
      .on('data', (r) => {
        weatherdata.push(r);        
      })
      .on('end', () => {
        parseweathercsv(weatherdata);
    })    

}


function parseweathercsv(data){
    const teamkeys = {
      'Cincinnati Bengals':'CIN',
      'Cleveland Browns':'CLE',
      'New York Giants':'NYG',
      'Chicago Bears':'CHI',
      'Atlanta Falcons':'ATL',
      'Dallas Cowboys':'DAL',
      'Detroit Lions':'DET',
      'Green Bay Packers':'GB',
      'Minnesota Vikings':'MIN',
      'Indianapolis Colts':'IND',
      'Buffalo Bills':'BUF',
      'Miami Dolphins':'MIA',
      'San Francisco 49ers':'SF',
      'New York Jets':'NYJ',
      'Los Angeles Rams':'LAR',
      'Philadelphia Eagles':'PHI',
      'Denver Broncos':'DEN',
      'Pittsburgh Steelers':'PIT',
      'Carolina Panthers':'CAR',
      'Tampa Bay Buccaneers':'TB',
      'Jacksonville Jaguars':'JAX',
      'Tennessee Titans':'TEN',
      'Washington Football Team':'WAS',
      'Washington':'WAS',
      'Arizona Cardinals':'ARI',
      'Baltimore Ravens':'BAL',
      'Houston Texans':'HOU',
      'Kansas City Chiefs':'KC',
      'Los Angeles Chargers':'LAC',
      'New England Patriots':'NE',
      'Seattle Seahawks':'SEA',
      'New Orleans Saints':'NO',
      'Las Vegas Raiders':'LV',
      'St. Louis Rams':'STL',
      'San Diego Chargers': 'SD',
      'Oakland Raiders': 'OAK',
      'Washington Redskins' : 'WAS'
    };

    //let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
    //id	home_team	home_score	away_team	away_score	temperature	wind_chill	humidity	wind_mph	weather	date
    let week = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","WildCard","Division","ConfChamp","Superbowl"];
    
    let output = [];
    let weekcount = 0;
    let lastmonth = 9;
    let lastday = 5;
    let lastdate;

    for (let i = 0; i < data.length; i++) {
        let game = {};
        let dateinfo = data[i]["date"].split("/");
        let month = parseInt(dateinfo[0]) - 1; 
        let day = dateinfo[1];
        let year = dateinfo[2];
        var d = new Date(year,month ,day).getDay();
        if(month==8&&(lastmonth==1||lastmonth==0||lastmonth==11)){
            weekcount = 0;
            lastday = 5;
        }
        if((lastday==0&&d==4)||(lastday==1&&d==4)||(lastday==1&&d==5)||(lastday==2&&d==0)||(lastday==2&&d==4)||(lastday==0&&d==6)||(lastday==1&&d==6)||(lastday==0&&d==6)||(lastday==1&&d==0)||(lastday==0&&d==0&&(lastdate!=data[i]["date"]))){
            weekcount++;
        }
        game["vteam"] = teamkeys[data[i]["away_team"]] ;
        game["hteam"] = teamkeys[data[i]["home_team"]] ;
        (data[i]["wind_mph"])?game["windmph"] = data[i]["wind_mph"]:game["windmph"] = 0;
        game["temp"] = data[i]["temperature"];
        game["week"] = week[weekcount];
        game["date"] = data[i]["date"];
        if(month == 0 || month == 1){
          year--;
        }
        game["year"] = year;

        lastday = d;
        lastdate = data[i]["date"];
        lastmonth = month;

        

        output.push(game);
    }

    converter.json2csv(output, (err, csv) => {
      if (err) {
          throw err;
      }
      console.log("success");
  
      // write CSV to a file
      fs.writeFileSync('./data/weatherdata.csv', csv);
    });
  
}

async function scrapeweather(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let url;
    //let week = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17"];
    let week = ["1","2"];
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    
    for (let i = 0; i < week.length; i++) {
        
        url = "http://www.nflweather.com/en/week/2010/week-"+week[i]+"-2/";
        await page.goto(url, { waitUntil: 'networkidle0' });
        const content = await page.content();
        $('table.footable>tbody>tr', content).each((index,element) => {
            //console.log("elements is : " + $(element).text());
            let game = {};
            let gameinfo = $(element).find("td");

            console.log("away team is : " +$(gameinfo[1]).text());
            console.log("home team is : " +$(gameinfo[5]).text());
            console.log("weather is : " +$(gameinfo[9]).text());
            console.log("wind is : " +$(gameinfo[10]).text());

            game["vteam"] = $(gameinfo[1]).text();
            game["hteam"] = $(gameinfo[1]).text();
            game["temp"] = $(gameinfo[1]).text();
            game["wind_mph"] = $(gameinfo[1]).text();



          /*            
            let game = {};
            game.date = dates[i];

            let teams = $(element).find("tbody.participantBox-3ar9Y");
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


            spreadsinfo.push(game);*/

            

        });
        //console.log(dates[i] + " finished");
    }
    
    /*
    fs.writeFile("./data/2019spreads.txt", JSON.stringify(spreadsinfo),function(err){
        console.log("file written with " + spreadsinfo.length + " games");
    })
*/
    await browser.close();
}

//weathercsv();
scrapeweather();