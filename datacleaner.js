var fs = require("fs");
var XLSX = require('xlsx');

//let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
let years = ["2020"];

function cleanerAndNormalize(yearsToCheck) {
  //let parser = /\\t/gi;
  /*let parser0 = /TOTALVOA|TOTALDVOA/gi;
  let parser1 = /TOTALDAVE/gi;
  let parser2 = /WEIGHTEDDVOA|WEIGHTEDVOA/gi;
  let parser3 = /OFFENSEVOA|OFF.DVOA|OFFENSEDVOA/gi;
  let parser4 = /OFF.RK|OFF.RANK/gi;
  let parser5 = /DEFENSEVOA|DEF.DVOA|DEFENSEDVOA/gi;
  let parser6 = /DEF.RK|DEF.RANK/gi;
  let parser7 = /SPECIALDVOA|S.T.VOA|S.T.DVOA/gi;
  let parser8 = /S.T.RK|S.T.RANK/gi;
  let parser9 = /SCHEDRANK/gi;
  let parser10 = /RANK|TOTAL.RK|TOTALRANK/gi;*/
  for (let i = 0; i < yearsToCheck.length; i++) {
    var readFile = fs.readFileSync("./data/nflodds" + yearsToCheck[i] +".txt");
    //var readFile = fs.readFileSync("./data/" + yearsToCheck[i] +"dvoaRanking.txt");
    var text = readFile.toString();
    //text = text.replace(/LARM/gi,"LAR");
    //text = text.replace(/LACH/gi,"LAC");
    //text = text.replace(/JAC/gi,"JAX");
    text = text.replace(/"pk"/gi,"0");
    text = text.replace(/NewOrleans/gi,"NO");
    text = text.replace(/Indianapolis/gi,"IND");
    text = text.replace(/KansasCity/gi,"KC");
    text = text.replace(/HoustonTexans/gi,"HOU");
    text = text.replace(/Houston/gi,"HOU");
    text = text.replace(/Denver/gi,"DEN");
    text = text.replace(/BuffaloBills/gi,"BUF");
    text = text.replace(/Buffalo/gi,"BUF");
    text = text.replace(/Pittsburgh/gi,"PIT");
    text = text.replace(/Cleveland/gi,"CLE");
    text = text.replace(/Tennessee/gi,"TEN");
    text = text.replace(/Jacksonville/gi,"JAX");
    text = text.replace(/Carolina/gi,"CAR");
    text = text.replace(/St.Louis/gi,"STL");
    text = text.replace(/Philadelphia/gi,"PHI");
    text = text.replace(/GreenBay/gi,"GB");
    text = text.replace(/Atlanta/gi,"ATL");
    text = text.replace(/Minnesota/gi,"MIN");
    text = text.replace(/Miami/gi,"MIA");
    text = text.replace(/Washington/gi,"WAS");
    text = text.replace(/NewEngland/gi,"NE");
    text = text.replace(/NYJets/gi,"NYJ");
    text = text.replace(/TampaBay/gi,"TB");
    text = text.replace(/Seattle/gi,"SEA");
    text = text.replace(/Chicago/gi,"CHI");
    text = text.replace(/SanDiego/gi,"SD");
    text = text.replace(/Detroit/gi,"DET");
    text = text.replace(/Oakland/gi,"OAK");
    text = text.replace(/NYGiants|NewYork/gi,"NYG");
    text = text.replace(/Dallas/gi,"DAL");
    text = text.replace(/Baltimore/gi,"BAL");
    text = text.replace(/Cincinnati/gi,"CIN");
    text = text.replace(/Arizona/gi,"ARI");
    text = text.replace(/SanFrancisco/gi,"SF");
    text = text.replace(/LosAngeles|LARams/gi,"LAR");
    text = text.replace(/LAChargers/gi,"LAC");
    /*text = text.replace(parser0,"TOTAL.DVOA");
    text = text.replace(parser1,"DAVE");
    text = text.replace(parser2,"WEI.DVOA");
    text = text.replace(parser3,"OFF.DVOA");
    text = text.replace(parser4,"OFF.RNK");
    text = text.replace(parser5,"DEF.DVOA");
    text = text.replace(parser6,"DEF.RNK");
    text = text.replace(parser7,"ST.DVOA");
    text = text.replace(parser8,"ST.RNK");
    text = text.replace(parser9,"SCHEDRNK");
    text = text.replace(parser10,"TOTAL.RNK");
    //console.log(spreads.length);*/
    
  
    fs.writeFile("./data/nflodds" + yearsToCheck[i] +".txt", text,function(err){
      console.log("anomalies " + yearsToCheck[i] + " written");
    })
  
  } 
}

function xlsxToJson(yearsToCheck){

  for(let i = 0; i < yearsToCheck.length; i++ ){
    var workbook = XLSX.readFile("./data/nflodds" + yearsToCheck[i] +".xlsx");
    var sheet_name_list = workbook.SheetNames;
    var teamspreads = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);


    fs.writeFile("./data/nflodds" + yearsToCheck[i] +".txt", JSON.stringify(teamspreads),function(err){
      console.log("file written " + yearsToCheck[i]);
    })
  }  
}

//xlsxToJson(years);
cleanerAndNormalize(years);