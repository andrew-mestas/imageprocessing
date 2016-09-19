  var totals;
  var COLOR = {
    RED : 0,
    GREEN: 1,
    BLUE: 2,
    ALPHA: 3
  }
  function getTotals(dataValues) {        
      var red = getAllColorValues(dataValues, COLOR.RED);
      var green = getAllColorValues(dataValues, COLOR.GREEN);
      var blue = getAllColorValues(dataValues, COLOR.BLUE);
      var separatedValues = red.map(function(color, idx){
        return [red[idx], green[idx], blue[idx]];
      });
      return (getDataValues(separatedValues, 0.2))
    }
// Picture
  function colorFnGenerator(imageData, COLOR){
    switch(COLOR){
      case 0 :  return function(x,y,imageData) {
                  return imageData.data[((x*(imageData.width*4)) + (y*4)) + 0];
                };
      case 1 :  return function(x,y,imageData) {
                  return imageData.data[((x*(imageData.width*4)) + (y*4)) + 1];
                };;
      case 2 :  return function(x,y,imageData) {
                  return imageData.data[((x*(imageData.width*4)) + (y*4)) + 2];
                };;
      case 3 :  return function(x,y,imageData) {
                  return imageData.data[((x*(imageData.width*4)) + (y*4)) + 3];
                };;
    }
  }

  function getAllColorValues(imageData, COLOR){
    var getData = colorFnGenerator(imageData, COLOR);
    var allData = [];

    for(var i=0; i< imageData.height; i++){
      for(var x=0; x< imageData.width; x++){
        allData.push(getData(i,x,imageData));
      }
    }
    return allData; 
  }

  function squaredError(threeColorArray, singleThreeColor){
    var similarity = 0;
    for(var i=0; i<3;i++){
      similarity += Math.pow(singleThreeColor[i] - threeColorArray[i], 2);
    }
    return similarity;
  }

  function squareDiff(mean, value){
    return Math.pow(value - mean, 2);
  }

  function meanAndStandardDeviation(values){
    var mean = values.reduce(function(a,b){return a+b}) / values.length;
    var sd = values.reduce(function(a,b){return a + squareDiff(mean, b)},0);
    return {Mean: mean, SD: Math.sqrt(sd / values.length)}
  }
  function normalize(totals){
    var Stats = meanAndStandardDeviation(totals);
    return totals.map(function(x){
      return Math.pow( (( x - Stats.Mean) / Stats.SD ), 2);
    });
  }

  function getDataValues(dataArray, eps){
    var Color = { 
      Maroon: [128, 0, 0],
      Red : [255, 0, 0],
      Green: [0, 128, 0], 
      Lime: [0, 255, 0],
      Navy: [0, 0, 128],
      Blue: [0, 0, 255],
      Olive: [128, 128, 0],
      Orange: [255, 128, 0],
      Yellow: [255, 255, 0], 
      Teal: [0, 128, 128],
      Cyan: [0, 255, 255],
      Purple: [128, 0, 128],
      Magenta: [255, 0, 255], 
      Black: [0, 0, 0],
      Grey: [128, 128, 128],
      Silver: [192, 192, 192],
      White: [255, 255 ,255]
    }
    var totalCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var cost = [];
    var arrayOfPercents = [];
    var namedColors = [];
    var colorLength = Object.keys(Color).length;
    console.log(dataArray.length)
    console.time("a")
    for(var x=0, ln = dataArray.length; x< ln; x++){     
        cost = [];            
        for(var i=0, mn = colorLength; i < mn; i++){
          var similarity = 0;
          for(var b=0; b<3;b++){
            similarity += Math.pow(Object.keys(Color)[b] - dataArray[b], 2);
          }
          cost.push(similarity);
        }
        var min = Math.min.apply(null, cost);
        totalCounts[cost.indexOf(min)] += 1;
    
    }
    totalCounts = normalize(totalCounts).map(function(x){return x % 1})
    console.timeEnd("a")

    return totalCounts;

  }    