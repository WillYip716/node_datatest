var fs = require("fs");
var XLSX = require('xlsx')
const csv = require('csv-parser');
const converter = require('json-2-csv');
const puppeteer = require('puppeteer');
const $ = require('cheerio');


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
    const teamkeys = {
        'Bengals':'CIN',
        'Browns':'CLE',
        'Giants':'NYG',
        'Bears':'CHI',
        'Falcons':'ATL',
        'Cowboys':'DAL',
        'Lions':'DET',
        'Packers':'GB',
        'Vikings':'MIN',
        'Colts':'IND',
        'Bills':'BUF',
        'Dolphins':'MIA',
        '49ers':'SF',
        'Jets':'NYJ',
        'Eagles':'PHI',
        'Broncos':'DEN',
        'Steelers':'PIT',
        'Panthers':'CAR',
        'Buccaneers':'TB',
        'Jaguars':'JAX',
        'Titans':'TEN',
        'Washington':'WAS',
        'Cardinals':'ARI',
        'Ravens':'BAL',
        'Texans':'HOU',
        'Chiefs':'KC',
        'Patriots':'NE',
        'Seahawks':'SEA',
        'Saints':'NO',
        'Rams':'STL',
        'Chargers': 'SD',
        'Raiders': 'OAK',
        'Redskins' : 'WAS'
      };
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const year = 2011;
    let url;
    //let week = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17"];
    let week = ["9","10","11","12","13","14","15","16","17"];
    let output = [];
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    
    for (let i = 0; i < week.length; i++) {
       try {
            url = "http://www.nflweather.com/en/week/"+year+"/week-"+week[i]+"/";
            
            await page.goto(url, { waitUntil: 'networkidle0' });
            const content = await page.content();
            $('table.footable>tbody>tr', content).each((index,element) => {
                //console.log("elements is : " + $(element).text());
                let game = {};
                let gameinfo = $(element).find("td");

                
                game["year"] = year;
                game["week"] = week[i];
                game["vteam"] = teamkeys[$(gameinfo[1]).text().trim()];
                game["hteam"] = teamkeys[$(gameinfo[5]).text().trim()];
                if($(gameinfo[9]).text().indexOf("DOME")>-1){
                    game["temp"] = 72;
                    game["wind_mph"] = 0;
                }else{
                    game["temp"] = $(gameinfo[9]).text().trim().split(" ")[0];
                    game["temp"] = game["temp"].substring(0, game["temp"].length - 1);
                    game["wind_mph"] = $(gameinfo[10]).text().trim().split(" ")[0];
                    game["wind_mph"] = game["wind_mph"].substring(0, game["wind_mph"].length - 1);
                    if(!game["wind_mph"]){
                        game["wind_mph"] = "no wind data";
                    }
                }
                
                output.push(game);
                
            });
       } catch (error) {
            console.log("failed to complete full scrape");
            converter.json2csv(output, (err, csv) => {
                if (err) {
                    throw err;
                }
                console.log("success in transferring partial data");
        
                // write CSV to a file
                fs.writeFileSync('./data/weatherdatascraped'+year+'.csv', csv);
            });
            await browser.close();
       }
       console.log(week[i] + " completed");
    }
    


    converter.json2csv(output, (err, csv) => {
        if (err) {
            throw err;
        }
        console.log("success");

        // write CSV to a file
        fs.writeFileSync('./data/weatherdatascraped'+year+'v2.csv', csv);
    });
    await browser.close();
}

function csvconverter(){
    
    const data = []
    fs.createReadStream('./data/weatherdatascraped2010.csv')
      .pipe(csv())
      .on('data', (r) => {
        data.push(r);        
      })
      .on('end', () => {
        fs.writeFile("./data/weatherdatascraped2010.txt", JSON.stringify(data),function(err){
            console.log("file converted");
        })
    })    

}

function combinedweather(){
    let text1 = fs.readFileSync("./data/weatherdatascraped2010.txt");
    let scraped = JSON.parse(text1);
    let text2 = fs.readFileSync("./data/weatherdata.txt");
    let base = JSON.parse(text2);
    let output = [];

    for (let i = 0; i < scraped.length; i++) {
        let game = scraped[i];
        let founddata = base.find(element=> (element["year"] == game["year"])&&(element["week"] == game["week"])&&(element["vteam"] == game["vteam"])&&(element["hteam"] == game["hteam"]));
        if(founddata){
            game["wind_mph"] = founddata["wind_mph"];
        }
        output.push(game);
    }

    converter.json2csv(output, (err, csv) => {
        if (err) {
            throw err;
        }
        console.log("success");

        // write CSV to a file
        fs.writeFileSync('./data/weatherdata2010combined.csv', csv);
    });
    
}

//weathercsv();
//scrapeweather();
//csvconverter();
combinedweather();