  var gpu = new GPU();
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

    
        console.time("a")

    // var a = dataArray.slice(0,dataArray.length/2)
    // var b = dataArray.slice(dataArray.length/2, dataArray.length)

    // a = computeTotals(a)
    var t =  computeTotals(dataArray)
    // b = computeTotals(b)
        console.timeEnd("a")
return t
  }    


function computeTotals(array){
// Maroon: 
// Red :
// Green:
// Lime:
// Navy:
// Blue:
// Olive:
// Orange:
// Yellow:
// Teal:
// Cyan:
// Purple:
// Magenta:
// Black:
// Grey:
// Silver:
// White:
      var Color = [
       [128, 0, 0],
       [255, 0, 0],
       [0, 128, 0], 
       [0, 255, 0],
       [0, 0, 128],
       [0, 0, 255],
       [128, 128, 0],
       [255, 128, 0],
       [255, 255, 0], 
       [0, 128, 128],
       [0, 255, 255],
       [128, 0, 128],
       [255, 0, 255], 
       [0, 0, 0],
       [128, 128, 128],
       [192, 192, 192],
       [255, 255 ,255]
    ] 
    var totalCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    var cost = [];
    var dim = totalCounts.length;
    var ln = array.length
    var colorLength = Color.length;
    var myFunc = gpu.createKernel(function(B, C, D, E) {
      var smallest = 10000000;
      var similarity = 0;
      var idx = 0;        
        for(var i=0; i < D; i++){
          similarity = 0;

          for(var b=0; b<3;b++){
            similarity += Math.pow(E[i][b] - B[b], 2);
          }
          if(smallest > similarity){
             smallest = similarity
             idx = i;
          }
        } 
    return idx
    }, {dimensions: [1], loopMaxIterations: 100});

    var r = myFunc(array[0], ln, colorLength, Color)
    console.log(r)
    // array.forEach(function(threeColorArray){
    //   cost = [];
    //   Object.keys(Color).forEach(function(color){
    //     cost.push(squaredError(threeColorArray, Color[color]));
    //   });
    //   var min = Math.min.apply(null, cost);
    //   totalCounts[cost.indexOf(min)] += 1;
    // })
    totalCounts = normalize(totalCounts).map(function(x){return x % 1})
    return totalCounts;
}