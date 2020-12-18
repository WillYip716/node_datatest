var fs = require("fs");
var XLSX = require('xlsx')




//let years = ["2007"];
//TOTAL OFFENSE DEFENSE ST
//SD 30 	-26.8% 	19 	-1.1% 	22 	7.3% 	32 	-13.5%
//LV 22 	-8.7% 	15 	1.5% 	28 	10.5% 	12 	1.5%

let testgame = {
  "vTOTAL.RNK" : 30,
  "vTOTAL.DVOA": "-26.8%",
  "hTOTAL.RNK" : 22,
  "hTOTAL.DVOA": "-8.7%",
  "vOFF.RNK" : 19,
  "vOFF.DVOA": "-1.1%",
  "hOFF.RNK" : 15,
  "hOFF.DVOA": "1.5%",
  "vDEF.RNK" : 22,
  "vDEF.DVOA": "7.3%",
  "hDEF.RNK" : 28,
  "hDEF.DVOA": "10.5%",
  "vST.RNK" : 32,
  "vST.DVOA": "-13.5%",
  "hST.RNK" : 12,
  "hST.DVOA": "1.5%"
}


function analyzeSpread(game){
    let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
    //let years = ["2007"];
    let datatable =[];

    for (let i = 0; i < years.length; i++) {
      let text = fs.readFileSync("./data/mergedstats" + years[i] +".txt");
      let spreads = JSON.parse(text);

      let matchedgames = spreads.filter(element=> fullcheck(element,game));
      datatable = datatable.concat(matchedgames);
      
    }

    if(datatable.length){
      let avgvscore = 0;
      let avghscore = 0;
      let avgscorespread = 0;
      let avgspread = 0;
      let avgou = 0;
      let results;
      let hrecord = 0;
      let vrecord = 0;
      let trecord = 0;
      let overs = 0;
      let unders = 0;
      let outies = 0;

      datatable.forEach(e => {
          avgvscore+= parseFloat(e["vscore"]) ;
          avghscore+= parseFloat(e["hscore"]);
          avgspread+= parseFloat(e["hcspread"]);
          avgou+= parseFloat(e["ouclose"]);
          avgscorespread+= parseFloat(e["vscore"]) - parseFloat(e["hscore"]);

          results = spreadResult(e);
          if(results["winner"] == "home"){
              hrecord+=1;
          }
          else if(results["winner"] == "visitor"){
              vrecord+=1;
          }
          else if(results["winner"] == "tie"){
              trecord+=1;
          }
          if(results["ou"] == "over"){
              overs+=1;
          }
          else if(results["ou"] == "under"){
              unders+=1;
          }
          else if(results["ou"] == "tie"){
              outies+=1;
          }
      });

      console.log(datatable);
      console.log(datatable.length);

      console.log("avg score of visitors : " + (avgvscore/datatable.length));
      console.log("avg score of home : " + (avghscore/datatable.length));
      console.log("avg score spread result : " + (avgscorespread/datatable.length));
      console.log("avg closing home spread : " + (avgspread/datatable.length));
      console.log("avg closing o/u : " + (avgou/datatable.length));
      console.log("visitors have beat the spread " + vrecord);
      console.log("home has beat the spread " + hrecord);
      console.log("spread has tied " + trecord);
      console.log("overs-unders-ties : " + overs +"-" +unders +"-" + outies);
    }
    

}


function fullcheck(element,game){
    //console.log(element);
    /*
    let vtotalcheck = checker(element,game,"vTOTAL.DVOA",3);
    let htotalcheck = checker(element,game,"hTOTAL.DVOA",3);
    */

    let voffcheck = checker(element,game,"vOFF.DVOA",6);
    let hoffcheck = checker(element,game,"hOFF.DVOA",6);

    let vdefcheck = checker(element,game,"vDEF.DVOA",6);
    let hdefcheck = checker(element,game,"hDEF.DVOA",6);
  
    let vstcheck = checker(element,game,"vST.DVOA",6);
    let hstcheck = checker(element,game,"hST.DVOA",6);
    //if(vtotalcheck&&htotalcheck&&voffcheck&&hoffcheck&&vdefcheck&&hdefcheck&&vstcheck&&hstcheck){
    if(voffcheck&&hoffcheck&&vdefcheck&&hdefcheck&&vstcheck&&hstcheck){
    //if(vtotalcheck&&htotalcheck){
      return true;
    }
}


function checker(element,game,value,deviation){
    let checked = ((parseFloat(game[value])-deviation)<=(parseFloat(element[value])))&&((parseFloat(element[value]))<=(parseFloat(game[value])+deviation));

    
/*
    if(checked){

      console.log("checked rank equals: " + (parseFloat(element[value])) );
      console.log("checked value is: " + value );
      console.log("lower range equals: " +  (parseFloat(game[value])-deviation));
      console.log("upper range equals: " +  (parseFloat(game[value])+deviation));
    }*/

    return checked;
}

function spreadResult(game){
    let results = {};
    if((parseFloat(game["hscore"])+parseFloat(game["hcspread"])) == (parseFloat(game["vscore"]))){
        results["winner"] = "tie";
    }
    else if((parseFloat(game["hscore"])+parseFloat(game["hcspread"])) > (parseFloat(game["vscore"]))){
        results["winner"] = "home";
    }
    else{
        results["winner"] = "visitor";
    }

    if(parseFloat(game["ouclose"]) == (parseFloat(game["vscore"])+parseFloat(game["hscore"]))){
      results["ou"] = "tie";
    }
    else if(parseFloat(game["ouclose"]) < (parseFloat(game["vscore"])+parseFloat(game["hscore"]))){
        results["ou"] = "over";
    }
    else{
        results["ou"] = "under";
    }

    return results;
}




analyzeSpread(testgame);


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