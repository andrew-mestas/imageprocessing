  var totals;
  var COLOR = {
    RED : 0,
    GREEN: 1,
    BLUE: 2,
    ALPHA: 3
  }
  function getTotals(dataValues) {        
    return getDataValues(separatedValues(dataValues))
  }

  function separatedValues(imageData){
    var redfn = colorFnGenerator(imageData, COLOR.RED);
    var greenfn = colorFnGenerator(imageData, COLOR.GREEN);
    var bluefn = colorFnGenerator(imageData, COLOR.BLUE);
    var rgb = [];
    var rgbs = [];
    for(var i=0; i< imageData.height; i++){
      for(var x=0; x< imageData.width; x++){
        rgb.push(redfn(i,x,imageData));
        rgb.push(greenfn(i,x,imageData));
        rgb.push(bluefn(i,x,imageData));
        rgbs.push(rgb);
        rgb = [];
      }
    }
    return rgbs;
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
   return computeTotals(dataArray)
  }    

  function computeTotals(array){
    var Color = [
       [128, 0, 0],
       [255, 0, 0],
       [0, 128, 0], 
       [0, 255, 0],
       [0, 0, 128],
       [0, 0, 255],
       [120, 120, 0],
       [255, 128, 0],
       [255, 255, 0], 
       [0, 128, 128],
       [0, 255, 255],
       [136, 0, 136],
       [255, 0, 255], 
       [0, 0, 0],
       [255, 255 ,255]
    ] 
      var Colora = { 
      Maroon: [128, 0, 0],
      Red : [255, 0, 0],
      Green: [0, 128, 0], 
      Lime: [0, 255, 0],
      Navy: [0, 0, 128],
      Blue: [0, 0, 255],
      Olive: [120, 120, 0],
      Orange: [255, 128, 0],
      Yellow: [255, 255, 0], 
      Teal: [0, 128, 128],
      Cyan: [0, 255, 255],
      Purple: [136, 0, 136],
      Magenta: [255, 0, 255], 
      Black: [0, 0, 0],
      White: [255, 255 ,255]
    }
    var totalCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var cost = [];
    array.forEach(function(threeColorArray){
      cost = [];
      Color.forEach(function(color){
        cost.push(squaredError(threeColorArray, color));
      });
      var min = Math.min.apply(null, cost);
      totalCounts[cost.indexOf(min)] += 1;
    })
    totalCounts = normalize(totalCounts).map(function(x){return x % 1})
    return totalCounts;
}