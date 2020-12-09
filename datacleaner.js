var fs = require("fs");

let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
//let years = ["2015"];

function cleanerAndNormalize() {
  //let parser = /\\t/gi;
  let parser = /TOTALVOA|ACTUALDVOA/gi;
  for (let i = 0; i < years.length; i++) {
    var readFile = fs.readFileSync("./data/"+years[i]+"dvoaRanking.txt");
    var text = readFile.toString();
    text = text.replace(parser,"TOTALDVOA");
    //console.log(spreads.length);
    
  
    fs.writeFile("./data/"+years[i]+"dvoaRanking.txt", text,function(err){
      console.log("anomalies " + years[i] + " written");
    })
  
  } 
}

cleanerAndNormalize();