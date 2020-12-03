var fs = require("fs");

let years = ["2007"];
let anomalies = [];

for (let i = 0; i < years.length; i++) {
  var text = fs.readFileSync("./data/"+years[i]+"dvoaRanking.txt");
  let spreads = JSON.parse(text);
  console.log(spreads.length);
  for (let j = 0; j < spreads.length; j++) {
      if(Object.keys(spreads[j]).length !== 13){
        //console.log(spreads[j]);
        anomalies.push(spreads[j]);
      }

      /*if((parseFloat(spreads[j].total_open) < 25)||(parseFloat(spreads[j].total_close) < 25)){
          anomalies.push(spreads[j]);
      }*/
  }

  fs.writeFile("./data/"+years[i]+"anomalies.txt", JSON.stringify(anomalies),function(err){
    console.log("anomalies " + years[i] + " written");
  })

}



/*fs.writeFile("./data/anomalies.txt", JSON.stringify(anomalies),function(err){
    console.log("anomalies file written");
})*/