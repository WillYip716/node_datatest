var fs = require("fs");

let years = ["2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];

for (let i = 0; i < years.length; i++) {
  var text = fs.readFileSync("./data/"+years[i]+"spreads.txt");
  let spreads = JSON.parse(text);
  for (let j = 0; j < spreads.length; j++) {
      if(spreads[j].total_open == "PK"){
        spreads[j].total_open = spreads[j].home_open;
        spreads[j].home_open = "+0";
        spreads[j].away_open = "+0";
      }
      if(spreads[j].total_close == "PK"){
        spreads[j].total_close = spreads[j].home_close;
        spreads[j].home_close = "+0";
        spreads[j].away_close = "+0";
      }

      /*if((parseFloat(spreads[j].total_open) < 25)||(parseFloat(spreads[j].total_close) < 25)){
          anomalies.push(spreads[j]);
      }*/
  }

  fs.writeFile("./data/"+years[i]+"cleaned.txt", JSON.stringify(spreads),function(err){
    console.log("cleaned file for " + years[i] + "written");
  })

}



/*fs.writeFile("./data/anomalies.txt", JSON.stringify(anomalies),function(err){
    console.log("anomalies file written");
})*/