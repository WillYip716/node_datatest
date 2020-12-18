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
                else if(vteamdvoa["vDAVE"]){
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
                    game["vWEI.DVOA"] = hteamdvoa["WEI.DVOA"];
                }
                else if(hteamdvoa["vDAVE"]){
                    game["vDAVE"] = hteamdvoa["DAVE"];
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

merge(years);