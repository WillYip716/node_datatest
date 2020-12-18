var fs = require("fs");

let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
//let years = ["2007"];

function teamNames(yearsToCheck) {
  let finalCount = {};
  for (let i = 0; i < yearsToCheck.length; i++) {
    var text = fs.readFileSync("./data/mergedstats" + yearsToCheck[i] +".txt");
    //var text = fs.readFileSync("./data/" + yearsToCheck[i] +"dvoaRanking.txt");
    let spreads = JSON.parse(text);
    spreads.forEach(element => {
      if (element["hteam"] in finalCount){
          finalCount[element["hteam"]] = parseInt(finalCount[element["hteam"]]) + 1;
      }
      else{
          finalCount[element["hteam"]] = 1;
      }
    });
    //console.log("Final Count for year " + yearsToCheck[i])
    
  } 
  console.log(finalCount);
  console.log("number of teams is " + Object.keys(finalCount).length);
}

function checkKeys(yearsToCheck) {
  let finalCount = {};
  for (let i = 0; i < yearsToCheck.length; i++) {
    var text = fs.readFileSync("./data/"+yearsToCheck[i]+"dvoaRanking.txt");
    //finalCount = {};
    let spreads = JSON.parse(text);
    spreads.forEach(element => {
        let keys = Object.keys(element);
        for (let j = 0; j < keys.length; j++) {
            if (keys[j] in finalCount){
                finalCount[keys[j]] = parseInt(finalCount[keys[j]]) + 1;
            }
            else{
                finalCount[keys[j]] = 1;
            }
          
        }
        //console.log("Final Count for year " + yearsToCheck[i])
        //console.log(finalCount);
    });
    //console.log("Final Count for year " + yearsToCheck[i])
    //console.log(finalCount);
  }
  console.log(finalCount);
}

/*function xlsxToJson(yearsToCheck){

  for(let i = 0; i < yearsToCheck.length; i++ ){
    var workbook = XLSX.readFile("./data/nflodds" + yearsToCheck[i] +".xlsx");
    var sheet_name_list = workbook.SheetNames;
    var teamspreads = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);


    fs.writeFile("./data/nflodds" + yearsToCheck[i] +".txt", JSON.stringify(teamspreads),function(err){
      console.log("file written " + yearsToCheck[i]);
    })
  }  
}*/




teamNames(years);
//checkKeys(years);
//console.log(finalCount);
//console.log("number of teams is " + Object.keys(finalCount).length);
