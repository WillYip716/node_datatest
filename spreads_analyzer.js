var fs = require("fs");
var XLSX = require('xlsx')




//let years = ["2007"];

function analyzeSpread(vteam, hteam){
    let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
    let datatable =[];

    for (let i = 0; i < years.length; i++) {
      let text = fs.readFileSync("./data/nflodds" + years[i] +".txt");
      let spreads = JSON.parse(text);

      let matchedgames = spreads.filter(element=> fullcheck(element,vteam,hteam));
      datatable.push(matchedgames);
      
    }

}


function fullcheck(element,visitor,home){

    let vtotalcheck = checker(element,visitor,"vTOTAL.RNK",1);
    let htotalcheck = checker(element,home,"hTOTAL.RNK",1);

    let voffcheck = checker(element,visitor,"vOFF.RNK",1);
    let hoffcheck = checker(element,home,"hOFF.RNK",1);

    let vdefcheck = checker(element,visitor,"vDEF.RNK",1);
    let hdefcheck = checker(element,home,"hDEF.RNK",1);

    let vstcheck = checker(element,visitor,"vST.RNK",1);
    let hstcheck = checker(element,home,"hST.RNK",1);

    if(vtotalcheck&&htotalcheck&&voffcheck&&hoffcheck&&vdefcheck&&hdefcheck&&vstcheck&&hstcheck){
      return true;
    }


}


function checker(element,team,value,deviation){
    let checked = ((parseFloat(team[value])-deviation)<=(parseFloat(element[value])))&&((parseFloat(element[value]))<=(parseFloat(team[value])+deviation));

    return checked;
}




analyzeSpread();


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