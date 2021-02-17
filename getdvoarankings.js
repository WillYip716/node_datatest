const puppeteer = require('puppeteer');
const $ = require('cheerio');
var fs = require("fs");

async function getdvoaratings() {
    // prepare for headless chrome
    let allDates = [];
    //let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
    let years = ["2020"];
    let week = ["dvoa-projections","1","2","3","4","5","6","7","8","9","10"];
    //let week = ["dvoa-projections","1"];
    let orderOfRanks = ["TOTAL.","OFF.","DEF.","S.T.","SCHED."];
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let parser = new RegExp(/(off)/mi);
    let url,startofloop,repeats;
    // set user agent (override the default headless User Agent)
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
    
    for (let i = 0; i < years.length; i++) {
        let yearsData = [];
        for (let j = 0; j < week.length; j++) {
            if( j == 0 ){
                url = "https://www.footballoutsiders.com/dvoa-ratings/"+years[i]+"/"+years[i]+"-" +week[j];
                startofloop = 0;
            }else{
                url = "https://www.footballoutsiders.com/dvoa-ratings/"+years[i]+"/week-"+week[j]+"-dvoa-ratings"
                startofloop = 1;
            }
            await page.goto(url);
            const content = await page.content();
            
            
            $('table', content).each((index,element) => {
                let keys;
                repeats = 0;
                (j==0)?keys=[]:keys=["holder"];
                let head = $(element).find("thead tr");
                if(parser.test($(head[0]).text())){
                    
                    let headercell = $(head[0]).find("td");
                    if(!headercell.length){
                        headercell = $(head[0]).find("th");
                    }
                    for (let k = startofloop; k < headercell.length; k++) {
                        if((/RK/gi).test($(headercell[k]).text())){
                            keys.push( orderOfRanks[repeats] + ($(headercell[k]).text().replace(/\n|\t/g,"").replace(/ /g,"")));
                            repeats++;
                        }
                        else{
                            keys.push($(headercell[k]).text().replace(/\n|\t/g,"").replace(/ /g,""));
                        }  
                    }
                    console.log(keys);
                    let valuecells = $(element).find("tbody tr td");
                    let data = {"year":years[i],"week": week[j]};
                    for (let k = startofloop; k < valuecells.length; k++) {
                        if((k%keys.length)==0){
                            if(k){
                                yearsData.push(data);
                            }
                            data = {"year":years[i],"week": week[j]};
                            if(!j){
                                data[keys[k%keys.length]] = $(valuecells[k]).text().replace(/\n/g,"").replace(/ /g,""); 
                            }
                        }
                        else{
                            data[keys[k%keys.length]] = $(valuecells[k]).text().replace(/\n/g,"").replace(/ /g,""); 
                            if(k == valuecells.length-1){
                                yearsData.push(data);
                            } 
                        }
                    }
                }
            
                
            });
        
            
            /*
            $('tbody', content).each((index,element) => {
                let field = $(element).find("tr");
                //for (let k = 0; k < field.length; k++) {
                //console.log("this is index " + index + " and tr length is "+ field.length);
                if(parser.test($(field[0]).text())&&field.length>31){
                    let keys;
                    (j==0)?keys=[]:keys=["holder"];

                    field.each((count,ele) => {
                        let cell = $(ele).find("td");
                        let data = {"year":years[i],"week": week[j]};
                        for(let k = startofloop; k < cell.length; k++){
                            if(count == 0){
                                if(keys.includes($(cell[k]).text())){
                                    keys.push($(cell[k]).text().replace(/\n/g,"").replace(/ /g,"") + "+");
                                }
                                else{
                                    keys.push($(cell[k]).text().replace(/\n/g,"").replace(/ /g,""));
                                }
                                
                            }
                            else{
                                data[keys[k]] = $(cell[k]).text().replace(/\n/g,"").replace(/ /g,"");
                            }
                        }
                        //console.log(data);
                        
                        if(count > 0 && (keys.length < 20) && !(/([a-zA-Z]+)/g).test(data[keys[6]])) {
                            yearsData.push(data);
                            
                        }
                    })
                }
            });
            console.log("week " + week[j] + " finished");
            console.log("data length so far " + yearsData.length);
        }
        console.log(years[i] + " finished harvesting");
        fs.writeFile("./data/"+years[i]+"dvoaRanking.txt", JSON.stringify(yearsData),function(err){
            console.log("file written " + years[i]);
        })*/
            console.log("week " + week[j] + " finished");
            console.log("data length so far " + yearsData.length);
        }
        console.log(years[i] + " finished harvesting");
        fs.writeFile("./data/tweaked"+years[i]+"dvoaRanking.txt", JSON.stringify(yearsData),function(err){
            console.log("file written " + years[i]);
        })
    }

    

    await browser.close();
}

getdvoaratings();