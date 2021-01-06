var fs = require("fs");
var XLSX = require('xlsx')
const csv = require('csv-parser');
const converter = require('json-2-csv');

let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
function merge(yearsToCheck){

    
    let wkey = ["error","dvoa-projections","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16"];
    let divkey = {
        "BAL"	: "afcn",
        "CIN" : "afcn",
        "PIT"	: "afcn",
        "CLE": "afcn",
        "BUF": "afce",
        "MIA": "afce",
        "NE": "afce",
        "NYJ": "afce",
        "IND" : "afcs",
        "HOU": "afcs",
        "TEN"	: "afcs",
        "JAX" : "afcs",
        "SD": "afcw",
        "OAK": "afcw",
        "DEN"	: "afcw",
        "KC"	: "afcw",
        "LAC": "afcw",
        "DET"	: "nfcn",
        "CHI"	: "nfcn",
        "GB" : "nfcn",
        "MIN" : "nfcn",
        "WAS" : "nfce",
        "PHI"	: "nfce",
        "NYG"	: "nfce",
        "DAL" : "nfce",
        "CAR"	 : "nfcs",
        "ATL"	: "nfcs",
        "TB" : "nfcs",
        "NO" : "nfcs",
        "ARI"	: "nfcw",
        "SF" : "nfcw",
        "SEA" : "nfcw",
        "STL": "nfcw",
        "LAR": "nfcw"
    };
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
            game["vdivision"] = divkey[game["vteam"]];
            game["hteam"] = spreads[j]["Team"];
            game["hdivision"] = divkey[game["hteam"]];
            game["vscore"] = spreads[j-1]["Final"];
            game["hscore"] = spreads[j]["Final"];   
            if(spreads[j]["VH"] == "N"){
                game["nsite"] == true;
            }
            if(spreads[j]["Open"] > spreads[j-1]["Open"]){
                game["vospread"] = "-" + spreads[j-1]["Open"];
                game["hospread"] = "+" + spreads[j-1]["Open"]; 
                game["ouopen"] = spreads[j]["Open"];
            }
            else{
                game["vospread"] = "+" + spreads[j]["Open"];
                game["hospread"] = "-" + spreads[j]["Open"];
                game["ouopen"] = spreads[j-1]["Open"];
            }
            if(spreads[j]["Close"] > spreads[j-1]["Close"]){
                game["vcspread"] = "-" + spreads[j-1]["Close"];
                game["hcspread"] = "+" + spreads[j-1]["Close"];
                game["ouclose"] = spreads[j]["Close"];
            }
            else{
                game["vcspread"] = "+" + spreads[j]["Close"];
                game["hcspread"] = "-" + spreads[j]["Close"];
                game["ouclose"] = spreads[j-1]["Close"];
            }
            let vteamdvoa = dvoastats.find(element=> element.TEAM == game["vteam"] && element.week == wkey[game["week"]]);
            let hteamdvoa = dvoastats.find(element=> element.TEAM == game["hteam"] && element.week == wkey[game["week"]]);
            if(vteamdvoa&&hteamdvoa){
                if(vteamdvoa["WEI.DVOA"]){
                    game["vWEI.DVOA"] = vteamdvoa["WEI.DVOA"];
                }
                if(vteamdvoa["DAVE"]){
                    game["vDAVE"] = vteamdvoa["DAVE"];
                }
                game["vTOTAL.RNK"] = vteamdvoa["TOTAL.RNK"];
                game["vTOTAL.DVOA"] = vteamdvoa["TOTAL.DVOA"];
                game["vOFF.RNK"] = vteamdvoa["OFF.RNK"];
                game["vOFF.DVOA"] = vteamdvoa["OFF.DVOA"];
                game["vDEF.RNK"] = vteamdvoa["DEF.RNK"];
                game["vDEF.DVOA"] = vteamdvoa["DEF.DVOA"];
                game["vST.RNK"] = vteamdvoa["ST.RNK"];
                game["vST.DVOA"] = vteamdvoa["ST.DVOA"];
                game["vW-L"] = vteamdvoa["W-L"];
                game["vLASTWEEK"] = vteamdvoa["LASTWEEK"];
    
                if(hteamdvoa["WEI.DVOA"]){
                    game["hWEI.DVOA"] = hteamdvoa["WEI.DVOA"];
                }
                if(hteamdvoa["DAVE"]){
                    game["hDAVE"] = hteamdvoa["DAVE"];
                }
                game["hTOTAL.RNK"] = hteamdvoa["TOTAL.RNK"];
                game["hTOTAL.DVOA"] = hteamdvoa["TOTAL.DVOA"];
                game["hOFF.RNK"] = hteamdvoa["OFF.RNK"];
                game["hOFF.DVOA"] = hteamdvoa["OFF.DVOA"];
                game["hDEF.RNK"] = hteamdvoa["DEF.RNK"];
                game["hDEF.DVOA"] = hteamdvoa["DEF.DVOA"];
                game["hST.RNK"] = hteamdvoa["ST.RNK"];
                game["hST.DVOA"] = hteamdvoa["ST.DVOA"];
                game["hW-L"] = hteamdvoa["W-L"];
                game["hLASTWEEK"] = hteamdvoa["LASTWEEK"];
    
    
                console.log(vteamdvoa);
                console.log(hteamdvoa);
            }
            
            mergedData.push(game);


        }

        fs.writeFile("./data/mergedstats" + yearsToCheck[i] +".txt", JSON.stringify(mergedData),function(err){
            console.log("file written " + yearsToCheck[i]);
        })
    }
    
}


function getallgames(yearsToCheck){

    let data = [];
    for (let i = 0; i < yearsToCheck.length; i++) {
      //let text = fs.readFileSync("./data/mergedstats" + years[i] +".txt");
      let text = fs.readFileSync("./data/ml/mldata" + yearsToCheck[i] +"v2.txt");
      
      let spreads = JSON.parse(text);

      data = data.concat(spreads); 
    }

    converter.json2csv(data, (err, csv) => {
        if (err) {
            throw err;
        }
        console.log("success");
    
        // write CSV to a file
        fs.writeFileSync('./data/ml/merged_mldata2007-2019v2.csv', csv);
    });
}


function mlmerge(yearsToCheck){

    
    let wkey = ["error","dvoa-projections","1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16"];
    let divkey = {
        "BAL"	: "afcn",
        "CIN" : "afcn",
        "PIT"	: "afcn",
        "CLE": "afcn",
        "BUF": "afce",
        "MIA": "afce",
        "NE": "afce",
        "NYJ": "afce",
        "IND" : "afcs",
        "HOU": "afcs",
        "TEN"	: "afcs",
        "JAX" : "afcs",
        "SD": "afcw",
        "OAK": "afcw",
        "DEN"	: "afcw",
        "KC"	: "afcw",
        "LAC": "afcw",
        "DET"	: "nfcn",
        "CHI"	: "nfcn",
        "GB" : "nfcn",
        "MIN" : "nfcn",
        "WAS" : "nfce",
        "PHI"	: "nfce",
        "NYG"	: "nfce",
        "DAL" : "nfce",
        "CAR"	 : "nfcs",
        "ATL"	: "nfcs",
        "TB" : "nfcs",
        "NO" : "nfcs",
        "ARI"	: "nfcw",
        "SF" : "nfcw",
        "SEA" : "nfcw",
        "STL": "nfcw",
        "LAR": "nfcw"
    };
    for(let i = 0; i<yearsToCheck.length;i++){
        let text1 = fs.readFileSync("./data/nflodds" + yearsToCheck[i] +".txt");
        let spreads = JSON.parse(text1);
        let text2 = fs.readFileSync("./data/" + yearsToCheck[i] +"dvoaRanking.txt");
        let dvoastats = JSON.parse(text2);
        let mergedData = [];
        let teamslastgame = {};
        //console.log("spreads length for " + yearsToCheck[i] + ": " + spreads.length);
        //{"Date":904,"Rot":451,"VH":"V","Team":"WAS","1st":0,"2nd":7,"3rd":0,"4th":0,"Final":7,"Open":40,"Close":41.5,"ML":175,"2H":29.5,"week":"1"}
        for (let j = 1; j < 512; j+=2) {
            let game = {};
            game["vscore"] = spreads[j-1]["Final"];
            game["hscore"] = spreads[j]["Final"];   
            game["date"] = spreads[j]["Date"];

            if(teamslastgame[spreads[j-1]["Team"]]){
                game["vdflg"] = datedifference(teamslastgame[spreads[j-1]["Team"]],spreads[j-1]["Date"]+yearsToCheck[i]);
                
            }else{
                game["vdflg"] = "-1";
            }
            teamslastgame[spreads[j-1]["Team"]] = spreads[j-1]["Date"]+yearsToCheck[i];

            if(teamslastgame[spreads[j]["Team"]]){
                game["hdflg"] = datedifference(teamslastgame[spreads[j]["Team"]],spreads[j]["Date"]+yearsToCheck[i]);
                
            }else{
                game["hdflg"] = "-1";
            }
            teamslastgame[spreads[j]["Team"]] = spreads[j-1]["Date"]+yearsToCheck[i];

            if(divkey[spreads[j-1]["Team"]] == divkey[spreads[j]["Team"]]){
                game["divgame"] = 1;
            }else{
                game["divgame"] = 0;
            }
            if(spreads[j]["VH"] == "N"){
                game["nsite"] = 1;
            }else{
                game["nsite"] = 0;
            }
            if(spreads[j]["Open"] > spreads[j-1]["Open"]){
                game["vospread"] = parseFloat("-" + spreads[j-1]["Open"]);
                game["hospread"] = parseFloat("+" + spreads[j-1]["Open"]); 
                game["ouopen"] = parseFloat(spreads[j]["Open"]);
            }
            else{
                game["vospread"] = parseFloat("+" + spreads[j]["Open"]);
                game["hospread"] = parseFloat("-" + spreads[j]["Open"]);
                game["ouopen"] = parseFloat(spreads[j-1]["Open"]);
            }
            if(spreads[j]["Close"] > spreads[j-1]["Close"]){
                game["vcspread"] = parseFloat("-" + spreads[j-1]["Close"]);
                game["hcspread"] = parseFloat("+" + spreads[j-1]["Close"]);
                game["ouclose"] = parseFloat(spreads[j]["Close"]);
            }
            else{
                game["vcspread"] = parseFloat("+" + spreads[j]["Close"]);
                game["hcspread"] = parseFloat("-" + spreads[j]["Close"]);
                game["ouclose"] = parseFloat(spreads[j-1]["Close"]);
            }
            let vteamdvoa = dvoastats.find(element=> element.TEAM == spreads[j-1]["Team"] && element.week == wkey[spreads[j]["week"]]);
            let hteamdvoa = dvoastats.find(element=> element.TEAM == spreads[j]["Team"] && element.week == wkey[spreads[j]["week"]]);
            if(vteamdvoa&&hteamdvoa&&vteamdvoa["OFF.DVOA"]){
                if(vteamdvoa["WEI.DVOA"]){
                    game["vTOTAL.DVOA"] = parseFloat(vteamdvoa["WEI.DVOA"]);
                }
                else if(vteamdvoa["DAVE"]){
                    game["vTOTAL.DVOA"] = parseFloat(vteamdvoa["DAVE"]);
                }else{
                    game["vTOTAL.DVOA"] = parseFloat(vteamdvoa["TOTAL.DVOA"]);
                }
                game["vTOTAL.RNK"] = vteamdvoa["TOTAL.RNK"];
                game["vOFF.RNK"] = vteamdvoa["OFF.RNK"];
                game["vOFF.DVOA"] = parseFloat(vteamdvoa["OFF.DVOA"]);
                game["vDEF.RNK"] = vteamdvoa["DEF.RNK"];
                game["vDEF.DVOA"] = parseFloat(vteamdvoa["DEF.DVOA"]);
                game["vST.RNK"] = vteamdvoa["ST.RNK"];
                game["vST.DVOA"] = parseFloat(vteamdvoa["ST.DVOA"]);
    
                if(hteamdvoa["WEI.DVOA"]){
                    game["hTOTAL.DVOA"] = parseFloat(hteamdvoa["WEI.DVOA"]);
                }
                else if(hteamdvoa["DAVE"]){
                    game["hTOTAL.DVOA"] = parseFloat(hteamdvoa["DAVE"]);
                }else{
                    game["hTOTAL.DVOA"] = parseFloat(hteamdvoa["TOTAL.DVOA"]);
                }
                game["hTOTAL.RNK"] = hteamdvoa["TOTAL.RNK"];
                game["hOFF.RNK"] = hteamdvoa["OFF.RNK"];
                game["hOFF.DVOA"] = parseFloat(hteamdvoa["OFF.DVOA"]);
                game["hDEF.RNK"] = hteamdvoa["DEF.RNK"];
                game["hDEF.DVOA"] = parseFloat(hteamdvoa["DEF.DVOA"]);
                game["hST.RNK"] = hteamdvoa["ST.RNK"];
                game["hST.DVOA"] = parseFloat(hteamdvoa["ST.DVOA"]);

                if((parseFloat(game["hscore"])+parseFloat(game["hcspread"])) == (parseFloat(game["vscore"]))){
                    game["winner"] = "tie";
                }
                else if((parseFloat(game["hscore"])+parseFloat(game["hcspread"])) > (parseFloat(game["vscore"]))){
                    game["winner"] = "home";
                }
                else{
                    game["winner"] = "visitor";
                }
            
                if(parseFloat(game["ouclose"]) == (parseFloat(game["vscore"])+parseFloat(game["hscore"]))){
                    game["ou"] = "tie";
                }
                else if(parseFloat(game["ouclose"]) < (parseFloat(game["vscore"])+parseFloat(game["hscore"]))){
                    game["ou"] = "over";
                }
                else{
                    game["ou"] = "under";
                }
    
    
                mergedData.push(game);
            }
            
            


        }

        fs.writeFile("./data/ml/mldata" + yearsToCheck[i] +"v2.txt", JSON.stringify(mergedData),function(err){
            console.log("file written " + yearsToCheck[i]);
        })
    }
    
}

function datedifference(lastdate, currentdate){
    let lmonth = parseInt(lastdate.toString().slice(0,-6))-1;
    let lday = lastdate.toString().slice(-6,-4);
    let lyear = lastdate.toString().slice(-4);
    if(lmonth == 0 || lmonth == 1){
        lyear++;
    }
    let cmonth = parseInt(currentdate.toString().slice(0,-6))-1;
    let cday = currentdate.toString().slice(-6,-4);
    let cyear = currentdate.toString().slice(-4);
    if(cmonth == 0 || cmonth == 1){
        cyear++;
    }
    let l = new Date(lyear,lmonth ,lday);
    let c = new Date(cyear,cmonth ,cday);

    return Math.round((c-l)/(1000*60*60*24));
    //console.log(Math.round((c-l)/(1000*60*60*24)));
}

getallgames(years);
//mlmerge(years);
//datedifference("09142008","10032008");