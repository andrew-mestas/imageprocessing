  var Tools = Tools || {};
  
  Tools.ImageProcess = function() {
    var totals;
    var Stats = {
      Mean : 0,
      SD : 0
    }
    var COLOR = {
      RED : 0,
      GREEN: 1,
      BLUE: 2,
      ALPHA: 3
    };
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
    ];    
  };

  Tools.ImageProcess.prototype.getDataValues = function(dataValues){
    return this.computeTotals(this.separatedValues(dataValues))
  }

  Tools.ImageProcess.prototype.separatedValues = function(imageData) {
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

  Tools.ImageProcess.prototype.colorFnGenerator = function(imageData, COLOR){
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

  Tools.ImageProcess.prototype.squaredError = function(threeColorArray, singleThreeColor){
      var similarity = 0;
      for(var i=0; i<3;i++){
        similarity += Math.pow(singleThreeColor[i] - threeColorArray[i], 2);
      }
      return similarity;
    }

    Tools.ImageProcess.prototype.squareDiff = function(mean, value){
      return Math.pow(value - mean, 2);
    }

    Tools.ImageProcess.prototype.meanAndStandardDeviation = function(values){
      var mean = values.reduce(function(a,b){return a+b}) / values.length;
      var sd = values.reduce(function(a,b){return a + this.squareDiff(mean, b)},0);
      this.Stats = {Mean: mean, SD: Math.sqrt(sd / values.length)};
      return this.Stats;
    }

    Tools.ImageProcess.prototype.normalize = function(totals){
      this.meanAndStandardDeviation(totals);
      return totals.map(function(x){
        return Math.pow( (( x - this.Stats.Mean) / this.Stats.SD ), 2);
      });
    }

    Tools.ImageProcess.prototype.computeTotals = function(array){
      var totalCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      var cost = [];
      array.forEach(function(threeColorArray){
        cost = [];
        this.Color.forEach(function(color){
          cost.push(this.squaredError(threeColorArray, color));
        });
        var min = Math.min.apply(null, cost);
        totalCounts[cost.indexOf(min)] += 1;
      })
      totalCounts = this.normalize(totalCounts).map(function(x){return x % 1})
      return totalCounts;
    }