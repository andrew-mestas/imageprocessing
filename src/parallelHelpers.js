var StopWatch = function(){
  this.times = [],
  this.completed = 0,
  this.start = 0,
  this.end = 0
  this.ImageProcess = new ImageProcess;
};

StopWatch.prototype.Execute = function(fn){
  this.start = performance.now();
  fn();
  this.end = performance.now();
  var time = this.end - this.start;
  this.times.push(time);
}

StopWatch.prototype.getMeanTime = function(){
  return this.ImageProcess.meanAndStandardDeviation(this.times).Mean;
}

StopWatch.prototype.Start = function(){
  this.start = performance.now();
}

StopWatch.prototype.End = function() {
  this.end = performance.now();
  var time = this.end - this.start;
  this.times.push(time)
}


var VideoCanvas = function(videoId, canvasId, dimensions){
  this.dimensions = dimensions;
  this.video = document.getElementById(videoId);
  this.canvas = document.getElementById(canvasId);
  this.context = canvas.getContext('2d');
  this.coordsMatrix = this.dimensions.m;
  this.parallel = this.dimensions.p;
  return this;
};

VideoCanvas.prototype.startVideo = function(){
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        this.video.src = window.URL.createObjectURL(stream);
        this.video.play();
    });
  }
}

VideoCanvas.prototype.drawVideoToCanvas = function() {
  this.context.drawImage(this.video, 0, 0, this.dimensions.h, this.dimensions.w);
  this.drawRectangles();
}

VideoCanvas.prototype.clearCanvas = function(){
  this.video.src = '';
  this.context.clearRect(0, 0, this.dimensions.h, this.dimensions.w);
}

VideoCanvas.prototype.drawRectangles = function(){
  this.coordsMatrix.forEach(function(coord){
    this.context.rect(coord[0], coord[1], coord[2], coord[3]);
  }, this);      
  this.context.stroke();
}

// VideoCanvas.prototype.updateLoop = function() {
//     if(parallel){
//     sendDataParallel(this.context)
//   } else {
//     sendData(this.context);
//   }
// }

var chartManager = function(charts){
  this.whiteBalance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.totals;
  this.labels = ['Maroon', 'Red', 'Green', 'Lime', 'Navy', 'Blue', 'Olive', 'Orange', 'Yellow', 'Teal', 'Cyan', 'Purple', 'Magenta', 'Black', 'White'];
  this.charts = charts;
}


var PL = function(isParallel, threads, file, fn, extPtr) {
  this.isParallel = isParallel;
  this.offline = false;
  this.workers = false;
  this.threads = threads;
  this.computeWorkers = [];
  this.parallelFn = fn;
  this.parallelInitalized = false;
  this.accumulatedTotals = [];
  this.parallelFile = file;
  this.externalPtr = extPtr || null;
  if (typeof(Worker) !== "undefined") {
      console.log("Web workers available.");
      this.workers = true;
    } else {
      console.log("No Web workers available");
      this.workers = false;
    }
    return this;
}

PL.prototype.begin = function(){
 if(!this.parallelInitialized && this.isParallel){
    this.spawnWorkers();
  }
  this.parallelInitalized = true;
}

PL.prototype.spawnWorkers = function(){
  var ext = this.externalPtr;
  var self = this;
  for(var i=0; i<this.threads; i++){
    this.computeWorkers.push(new Worker(this.parallelFile));
    this.computeWorkers[i].addEventListener('message', function(e) {
      self.parallelFn.bind(ext, e.data)();
    }, false);
  }
  console.log('Created: ', this.computeWorkers.length, ' workers.')
}
