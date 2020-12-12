var fs = require("fs");
var XLSX = require('xlsx')


let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];

//let years = ["2007"];

function xlscNameCount(yearsToCheck){
  var teamNames = {};

  for(let i = 0; i < yearsToCheck.length; i++ ){
    var workbook = XLSX.readFile("./data/nflodds" + yearsToCheck[i] +".xlsx");
    var sheet_name_list = workbook.SheetNames;
    var teamspreads = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    //console.log(teamspreads);

    teamspreads.forEach(element => {
      if (element["Team"] in teamNames){
        teamNames[element["Team"]] = parseInt(teamNames[element["Team"]]) + 1;
      }
      else{
        teamNames[element["Team"]] = 1;
      }
    });
    //console.log("Final Count for year " + yearsToCheck[i])
    //console.log(teamNames);
  }
  console.log(teamNames);
  console.log(Object.keys(teamNames).length);
}

xlscNameCount(years);


/*
for (let i = 0; i < years.length; i++) {
  var text = fs.readFileSync("./data/"+years[i]+"spreads.txt");
  let spreads = JSON.parse(text);
  spreads.forEach(element => {
    if(element)
  });

}


fs.readFile("data/animals.tsv", "utf8", function(error, data) {
  data = d3.tsvParse(data);
  console.log(JSON.stringify(data));

  var maxWeight = d3.max(data, function(d) { return d.avg_weight; });
  console.log(maxWeight);

  var bigAnimals = data.filter(function(d) { return d.avg_weight > 300; });
  bigAnimalsString = JSON.stringify(bigAnimals);

  fs.writeFile("big_animals.json", bigAnimalsString, function(err) {
    console.log("file written");
  });
});*/