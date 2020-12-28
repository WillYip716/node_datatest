var fs = require("fs");
var XLSX = require('xlsx')
const csv = require('csv-parser');
const converter = require('json-2-csv');


function analyzeSpread(game){
    let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
    //let years = ["2014","2015","2016","2017","2018","2019"];
    let datatable =[];

    for (let i = 0; i < years.length; i++) {
      let text = fs.readFileSync("./data/mergedstats" + years[i] +".txt");
      let spreads = JSON.parse(text);

      let matchedgames = spreads.filter(element=> fullcheck(element,game));
      datatable = datatable.concat(matchedgames);
      
    }

    analyzegames(datatable);
    

}

function spreadCalcs(arr,headline){
    console.log(headline +" averages: " + (arr.reduce((a,b) => a + b, 0)/arr.length).toFixed(2));
    console.log(headline + " min: " + Math.min(...arr) + " max: " + Math.max(...arr) + " std: " + getsd(arr).toFixed(2));

}


function fullcheck(element,game){
    //console.log(element);
    /*
    let vtotalcheck = checker(element,game,"vTOTAL.RNK",32);
    let htotalcheck = checker(element,game,"hTOTAL.RNK",32);
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

function getsd (array) {
  const n = array.length
  const mean = array.reduce((a, b) => a + b) / n
  return Math.sqrt(array.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}


function weeksspread(){
    
    const thisweekrankings = []
    fs.createReadStream('./data/2020 Team DVOA Ratings Overall.csv')
      .pipe(csv())
      .on('data', (r) => {
        thisweekrankings.push(r);        
      })
      .on('end', () => {
        getweeksinfo(thisweekrankings);
    })    

}

function getweeksinfo(dvoarankings){
    const teamkeys = {
      'Cincinnati Bengals':'CIN',
      'Cleveland Browns':'CLE',
      'New York Giants':'NYG',
      'Chicago Bears':'CHI',
      'Atlanta Falcons':'ATL',
      'Dallas Cowboys':'DAL',
      'Detroit Lions':'DET',
      'Green Bay Packers':'GB',
      'Minnesota Vikings':'MIN',
      'Indianapolis Colts':'IND',
      'Buffalo Bills':'BUF',
      'Miami Dolphins':'MIA',
      'San Francisco 49ers':'SF',
      'New York Jets':'NYJ',
      'Los Angeles Rams':'LAR',
      'Philadelphia Eagles':'PHI',
      'Denver Broncos':'DEN',
      'Pittsburgh Steelers':'PIT',
      'Carolina Panthers':'CAR',
      'Tampa Bay Buccaneers':'TB',
      'Jacksonville Jaguars':'JAX',
      'Tennessee Titans':'TEN',
      'Washington Football Team':'WAS',
      'Washington':'WAS',
      'Arizona Cardinals':'ARI',
      'Baltimore Ravens':'BAL',
      'Houston Texans':'HOU',
      'Kansas City Chiefs':'KC',
      'Los Angeles Chargers':'LAC',
      'New England Patriots':'NE',
      'Seattle Seahawks':'SEA',
      'New Orleans Saints':'NO',
      'Las Vegas Raiders':'LV'
    };

    let thisweekslines = "Minnesota%20Vikings%20at%20New%20Orleans%20Saints%20%28-7.0%2C%2050.5%29%0ATampa%20Bay%20Buccaneers%20at%20Detroit%20Lions%20%28+9.5%2C%2054.0%29%0ASan%20Francisco%2049ers%20at%20Arizona%20Cardinals%20%28-5.0%2C%2049.0%29%0AMiami%20Dolphins%20at%20Las%20Vegas%20Raiders%20%28+3.0%2C%2047.5%29%0AAtlanta%20Falcons%20at%20Kansas%20City%20Chiefs%20%28-10.5%2C%2054.0%29%0ACleveland%20Browns%20at%20New%20York%20Jets%20%28+9.5%2C%2047.5%29%0AIndianapolis%20Colts%20at%20Pittsburgh%20Steelers%20%28+1.5%2C%2044.5%29%0AChicago%20Bears%20at%20Jacksonville%20Jaguars%20%28+7.5%2C%2047.0%29%0ANew%20York%20Giants%20at%20Baltimore%20Ravens%20%28-10.5%2C%2044.5%29%0ACincinnati%20Bengals%20at%20Houston%20Texans%20%28-7.5%2C%2046.0%29%0ADenver%20Broncos%20at%20Los%20Angeles%20Chargers%20%28-3.0%2C%2048.5%29%0ACarolina%20Panthers%20at%20Washington%20%28-1.0%2C%2043.0%29%0APhiladelphia%20Eagles%20at%20Dallas%20Cowboys%20%28+2.5%2C%2049.5%29%0ALos%20Angeles%20Rams%20at%20Seattle%20Seahawks%20%28-1.5%2C%2047.5%29%0ATennessee%20Titans%20at%20Green%20Bay%20Packers%20%28-3.0%2C%2056.0%29%0ABuffalo%20Bills%20at%20New%20England%20Patriots%20%28+7.0%2C%2046.0%29";

    let linesArr = unescape(thisweekslines).split("\n");
    let linereader = new RegExp(/([A-Za-z0-9 ]*)\sat\s([A-Za-z0-9 ]*)\s\((\+|\-)([0-9.]*),\s([0-9.]*)\)/);
    for(var i = 0; i <linesArr.length;i++){
      let game = {"visitor": teamkeys[linesArr[i].match(linereader)[1]], "home":teamkeys[linesArr[i].match(linereader)[2]]};
      let vdvoa = dvoarankings.find(element=> element["Team"]==game["visitor"]);
      let hdvoa = dvoarankings.find(element=> element["Team"]==game["home"]);
      game["vTOTAL.RNK"] = vdvoa['Weighted DVOA Rank'];
      game["vTOTAL.DVOA"] = vdvoa['Weighted DVOA'];
      game["vOFF.RNK"] = vdvoa['Offense DVOA Rank'];
      game["vOFF.DVOA"] = vdvoa['Offense DVOA'];
      game["vDEF.RNK"] = vdvoa['Defense DVOA Rank'];
      game["vDEF.DVOA"] = vdvoa['Defense DVOA'];
      game["vST.RNK"] = vdvoa['Special Teams DVOA Rank'];
      game["vST.DVOA"] = vdvoa['Special Teams DVOA'];
      game["hTOTAL.RNK"] = hdvoa['Weighted DVOA Rank'];
      game["hTOTAL.DVOA"] = hdvoa['Weighted DVOA'];
      game["hOFF.RNK"] = hdvoa['Offense DVOA Rank'];
      game["hOFF.DVOA"] = hdvoa['Offense DVOA'];
      game["hDEF.RNK"] = hdvoa['Defense DVOA Rank'];
      game["hDEF.DVOA"] = hdvoa['Defense DVOA'];
      game["hST.RNK"] = hdvoa['Special Teams DVOA Rank'];
      game["hST.DVOA"] = hdvoa['Special Teams DVOA'];
      console.log(game["visitor"] + " at " + game["home"]);
      analyzeSpread(game);
      console.log("");
    }
}

function divVnondiv(){
    //let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
    let years = ["2015","2016","2017","2018","2019"];
    let div =[];
    let nondiv = [];

    for (let i = 0; i < years.length; i++) {
      let text = fs.readFileSync("./data/mergedstats" + years[i] +".txt");
      let spreads = JSON.parse(text);

      let divgames = spreads.filter(element=> element["vdivision"] == element["hdivision"]);
      let nondivgames = spreads.filter(element=> element["vdivision"] !== element["hdivision"]);
      div = div.concat(divgames);
      nondiv = nondiv.concat(nondivgames);
    }
    console.log("div games : ");
    analyzegames(div);
    console.log();
    console.log("non div games : ");
    analyzegames(nondiv);

    
}

function analyzegames(datatable){
    if(datatable.length){
      let avgvscore = [];
      let avghscore = [];
      let avgscorespread = [];
      let avgspread = [];
      let avgou = [];
      let results;
      let hrecord = 0;
      let vrecord = 0;
      let trecord = 0;
      let overs = 0;
      let unders = 0;
      let outies = 0;

      datatable.forEach(e => {
          avgvscore.push(parseFloat(e["vscore"]));
          avghscore.push(parseFloat(e["hscore"]));
          avgspread.push(parseFloat(e["hcspread"]));
          avgou.push(parseFloat(e["ouclose"]));
          avgscorespread.push(parseFloat(e["vscore"]) - parseFloat(e["hscore"]));

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

      //console.log(datatable);
      console.log("number of compared games " + datatable.length);

      spreadCalcs(avgvscore,"visitor");
      spreadCalcs(avghscore,"home");
      spreadCalcs(avgscorespread,"average score spread");
      spreadCalcs(avgspread,"average of spread");
      spreadCalcs(avgou, "average over/under" );

      console.log("visitor-home-ties : " + vrecord +"-" +hrecord +"-" + trecord);
      console.log("overs-unders-ties : " + overs +"-" +unders +"-" + outies);
    }
}

//getallgames();
//
//weeksspread();
divVnondiv();



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