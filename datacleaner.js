var fs = require("fs");

let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
//let years = ["2015"];

function cleanerAndNormalize() {
  //let parser = /\\t/gi;
  let parser = /TOTALVOA|TOTALDVOA/gi;
  let parser1 = /TOTALDAVE/gi;
  let parser2 = /WEIGHTEDDVOA|WEIGHTEDVOA/gi;
  let parser3 = /OFFENSEVOA|OFF.DVOA|OFFENSEDVOA/gi;
  let parser4 = /OFF.RK|OFF.RANK/gi;
  let parser5 = /DEFENSEVOA|DEF.DVOA|DEFENSEDVOA/gi;
  let parser6 = /DEF.RK|DEF.RANK/gi;
  let parser7 = /SPECIALDVOA|S.T.VOA|S.T.DVOA/gi;
  let parser8 = /S.T.RK|S.T.RANK/gi;
  let parser9 = /SCHEDRANK/gi;
  let parser10 = /RANK|TOTAL.RK|TOTALRANK/gi;
  for (let i = 0; i < years.length; i++) {
    var readFile = fs.readFileSync("./data/"+years[i]+"dvoaRanking.txt");
    var text = readFile.toString();
    //text = text.replace(parser,"");
    text = text.replace(parser,"TOTAL.DVOA");
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
    //console.log(spreads.length);
    
  
    fs.writeFile("./data/"+years[i]+"dvoaRanking.txt", text,function(err){
      console.log("anomalies " + years[i] + " written");
    })
  
  } 
}

cleanerAndNormalize();