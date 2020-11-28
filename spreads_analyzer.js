var fs = require("fs");



let years = ["2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];

for (let i = 0; i < years.length; i++) {
  var text = fs.readFileSync("./data/"+years[i]+"spreads.txt");
  let spreads = JSON.parse(text);
  spreads.forEach(element => {
    if(element)
  });

}


/*fs.readFile("data/animals.tsv", "utf8", function(error, data) {
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