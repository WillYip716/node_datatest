var fs = require("fs");
var XLSX = require('xlsx')
const csv = require('csv-parser');



//let years = ["2007"];
//TOTAL OFFENSE DEFENSE ST
//SD 30 	-26.8% 	19 	-1.1% 	22 	7.3% 	32 	-13.5%
//LV 22 	-8.7% 	15 	1.5% 	28 	10.5% 	12 	1.5%




function getallgames(){
    let years = ["2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];
    for (let i = 0; i < years.length; i++) {
      let text = fs.readFileSync("./data/mergedstats" + years[i] +".txt");
      let spreads = JSON.parse(text);

      console.log(spreads.length);
      
    }

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

      //console.log(datatable);
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
    let vtotalcheck = checker(element,game,"vTOTAL.RNK",32);
    let htotalcheck = checker(element,game,"hTOTAL.RNK",32);
    */

    let voffcheck = checker(element,game,"vOFF.DVOA",7);
    let hoffcheck = checker(element,game,"hOFF.DVOA",7);

    let vdefcheck = checker(element,game,"vDEF.DVOA",7);
    let hdefcheck = checker(element,game,"hDEF.DVOA",7);
  
    let vstcheck = checker(element,game,"vST.DVOA",7);
    let hstcheck = checker(element,game,"hST.DVOA",7);
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

function getStandardDeviation (array) {
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

    let thisweekslines = "Los%20Angeles%20Chargers%20at%20Las%20Vegas%20Raiders%20%28-3.5%2C%2052.0%29%0ABuffalo%20Bills%20at%20Denver%20Broncos%20%28+6.0%2C%2049.5%29%0ACarolina%20Panthers%20at%20Green%20Bay%20Packers%20%28-8.5%2C%2051.5%29%0ATampa%20Bay%20Buccaneers%20at%20Atlanta%20Falcons%20%28+6.0%2C%2049.5%29%0ASan%20Francisco%2049ers%20at%20Dallas%20Cowboys%20%28+3.0%2C%2045.0%29%0ADetroit%20Lions%20at%20Tennessee%20Titans%20%28-10.5%2C%2051.5%29%0AHouston%20Texans%20at%20Indianapolis%20Colts%20%28-7.5%2C%2051.0%29%0ANew%20England%20Patriots%20at%20Miami%20Dolphins%20%28-2.0%2C%2041.5%29%0AChicago%20Bears%20at%20Minnesota%20Vikings%20%28-3.0%2C%2046.5%29%0ASeattle%20Seahawks%20at%20Washington%20%28+5.5%2C%2044.5%29%0AJacksonville%20Jaguars%20at%20Baltimore%20Ravens%20%28-13.0%2C%2047.5%29%0ANew%20York%20Jets%20at%20Los%20Angeles%20Rams%20%28-17.5%2C%2044.0%29%0APhiladelphia%20Eagles%20at%20Arizona%20Cardinals%20%28-6.5%2C%2049.5%29%0AKansas%20City%20Chiefs%20at%20New%20Orleans%20Saints%20%28+3.0%2C%2051.5%29%0ACleveland%20Browns%20at%20New%20York%20Giants%20%28+6.0%2C%2044.5%29%0APittsburgh%20Steelers%20at%20Cincinnati%20Bengals%20%28+13.0%2C%2040.5%29";

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
    }
}

//getallgames();
//
weeksspread();


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