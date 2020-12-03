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
    let parser = new RegExp(/(off)/mi);
    // set user agent (override the default headless User Agent)
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    
    for (let i = 0; i < years.length; i++) {
        let yearsData = [];
        for (let j = 0; j < week.length; j++) {
            url = "https://www.footballoutsiders.com/dvoa-ratings/"+years[i]+"/week-"+week[j]+"-dvoa-ratings"
            await page.goto(url, { waitUntil: 'networkidle0' });
            const content = await page.content();
            $('tbody', content).each((index,element) => {
                let field = $(element).find("tr");
                //for (let k = 0; k < field.length; k++) {
                //console.log("this is index " + index + " and tr length is "+ field.length);
                if(parser.test($(field[0]).text())&&field.length>31){
                    let keys = ["holder"];

                    field.each((count,ele) => {
                        let cell = $(ele).find("td");
                        let data = {"week": week[j]};
                        for(let k = 1; k < cell.length; k++){
                            if(count == 0){
                                if(keys.includes($(cell[k]).text())){
                                    if(keys.includes($(cell[k]).text() + "++")){
                                        keys.push($(cell[k]).text() + "+++");
                                    }
                                    else if(keys.includes($(cell[k]).text() + "+")){
                                        keys.push($(cell[k]).text() + "++");
                                    }
                                    else{
                                        keys.push($(cell[k]).text() + "+");
                                    }   
                                }
                                else{
                                    keys.push($(cell[k]).text());
                                }
                                
                            }
                            else{
                                data[keys[k].replace(/\n/g,"")] = $(cell[k]).text();
                            }
                        }
                        if(count > 0 && (data[keys[2].replace(/\n/g,"")].indexOf("\n") < 0)){
                            yearsData.push(data);
                        }
                    })
                }
            });
            console.log("week " + week[j] + " finished");
        }
        console.log(years[i] + " finished harvesting");
        fs.writeFile("./data/"+years[i]+"dvoaRanking.txt", JSON.stringify(yearsData),function(err){
            console.log("file written " + years[i]);
        })
    }

    

    await browser.close();
}

getdvoaratings();