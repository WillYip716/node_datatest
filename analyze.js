var fs = require("fs");
var d3 = require("d3");
var _  = require("lodash");

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


var articles = [{
  "id": 1,
  "name": "vacuum cleaner",
  "weight": 9.9,
  "price": 89.9,
  "brand_id": 2
}, {
  "id": 2,
  "name": "washing machine",
  "weight": 540,
  "price": 230,
  "brand_id": 1
}, {
  "id": 3,
  "name": "hair dryer",
  "weight": 1.2,
  "price": 24.99,
  "brand_id": 2
}, {
  "id": 4,
  "name": "super fast laptop",
  "weight": 400,
  "price": 899.9,
  "brand_id": 3
}];

var brands = [{
  "id": 1,
  "name": "SuperKitchen"
}, {
  "id": 2,
  "name": "HomeSweetHome"
}];


articles.forEach(function(article) {
  var result = brands.filter(function(brand) {
      return brand.id === article.brand_id;
  });
  delete article.brand_id;
  article.brand = (result[0] !== undefined) ? result[0].name : null;
});
console.log(articles);