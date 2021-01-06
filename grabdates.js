const puppeteer = require('puppeteer');
const $ = require('cheerio');
var fs = require("fs");
const { parseInt, last } = require('lodash');

let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
//let years = ["2019"];



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


function addDates(yearsToCheck) {
    let week = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","WildCard","Division","ConfChamp","Superbowl"];
    for (let i = 0; i < yearsToCheck.length; i++) {
      var text = fs.readFileSync("./data/nflodds" + yearsToCheck[i] +".txt");
      let spreads = JSON.parse(text);
      let weekcount = 0;
      let lastday = 5;
      let lastdate;
        let output = {};
      spreads.forEach(element => {
        let month = parseInt(element["Date"].toString().slice(0,-2))-1;
        let day = element["Date"].toString().slice(-2);
        let year = yearsToCheck[i];
        if(month == 0 || month == 1){
            year++;
        }

        var d = new Date(year,month ,day).getDay();
        if((lastday==1&&d==4)||(lastday==1&&d==5)||(lastday==2&&d==0)||(lastday==2&&d==4)||(lastday==0&&d==6)||(lastday==1&&d==6)||(lastday==0&&d==6)||(lastday==1&&d==0)||(lastday==0&&d==0&&(lastdate!=element["Date"]))){
            weekcount++;
        }
        if(week[weekcount] in output){
            output[week[weekcount]] = parseInt(output[week[weekcount]]) + 1;   
        }
        else{
            output[week[weekcount]] = 1;
        }
        element.week = week[weekcount];
        lastday = d;
        lastdate = element["Date"];
        
      });
      fs.writeFile("./data/nflodds" + yearsToCheck[i] +".txt", JSON.stringify(spreads),function(err){
          console.log("year is " + yearsToCheck[i]);
          console.log(spreads.length);
        console.log(output);
      })
      
    } 
  }


function anomalydates(yearsToCheck){
    let adates = [];
    let holder;
    for (let i = 0; i < yearsToCheck.length; i++) {
        var text = fs.readFileSync("./data/nflodds" + yearsToCheck[i] +".txt");
        let spreads = JSON.parse(text);
        
        
        spreads.forEach(element => {
            let month = parseInt(element["Date"].toString().slice(0,-2))-1;
            let day = element["Date"].toString().slice(-2);
            let year = yearsToCheck[i];
            if(month == 0 || month == 1){
                year++;
            }
            var d = new Date(year,month ,day).getDay();
            if(d==2||d==3||d==5){
                adates.push(year + " " + element["Date"]);
            }
        });
    }
    holder = [...new Set(adates)];
    console.log(holder);
}

//findDates();
//addDates(years);
anomalydates(years);