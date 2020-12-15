var fs = require("fs");

let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];

function merge(yearsToCheck){
    let wkey = ["error","dvoa-projections","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16"]
    for(let i = 0; i<yearsToCheck.length;i++){
        let text1 = fs.readFileSync("./data/nflodds" + yearsToCheck[i] +".txt");
        let spreads = JSON.parse(text1);
        let text2 = fs.readFileSync("./data/" + yearsToCheck[i] +"dvoaRanking.txt");
        let dvoastats = JSON.parse(text2);
        let mergedData = [];
        //console.log("spreads length for " + yearsToCheck[i] + ": " + spreads.length);
        for (let j = 1; j < 512; j+=2) {
            let game = {};
            game["year"] = yearsToCheck[i];
            game["week"] = spreads[j]["week"];
            game["vteam"] = spreads[j-1]["Team"];
            game["hteam"] = spreads[j]["Team"];
            game["hscore"] = spreads[j]["Final"];
            game["vscore"] = spreads[j-1]["Final"];
            if(spreads[j]["VH"] == "N"){
                game["nsite"] == true;
            }
            if(spreads[j]["Open"] > spreads[j-1]["Open"]){
                game["ouopen"] = spreads[j]["Open"];
                game["hospread"] = "+" + spreads[j-1]["Open"];
                game["vospread"] = "-" + spreads[j-1]["Open"];
            }
            else{
                game["hospread"] = "-" + spreads[j]["Open"];
                game["vospread"] = "+" + spreads[j]["Open"];
                game["ouopen"] = spreads[j-1]["Open"];
            }
            if(spreads[j]["Close"] > spreads[j-1]["Close"]){
                game["ouclose"] = spreads[j]["Close"];
                game["hcspread"] = "+" + spreads[j-1]["Close"];
                game["vcspread"] = "-" + spreads[j-1]["Close"];
            }
            else{
                game["hcspread"] = "-" + spreads[j]["Close"];
                game["vcspread"] = "+" + spreads[j]["Close"];
                game["ouclose"] = spreads[j-1]["Close"];
            }
            mergedData.push(game);


        }

        fs.writeFile("./data/mergedstats" + yearsToCheck[i] +".txt", JSON.stringify(mergedData),function(err){
            console.log("file written " + yearsToCheck[i]);
        })
    }
    
}

merge([2007]);