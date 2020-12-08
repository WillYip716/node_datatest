var fs = require("fs");



let years = ["2007"];
let finalCount = {};

for (let i = 0; i < years.length; i++) {
  var text = fs.readFileSync("./data/"+years[i]+"dvoaRanking.txt");
  let spreads = JSON.parse(text);
  spreads.forEach(element => {
    if (element["TEAM"] in finalCount){
        finalCount[element["TEAM"]] = parseInt(finalCount[element["TEAM"]]) + 1;
    }
    else{
        finalCount[element["TEAM"]] = 1;
    }
  });

}


console.log(finalCount);
console.log("number of teams is " + Object.keys(finalCount).length);
