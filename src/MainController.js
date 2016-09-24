    var MainController = function(options) {
      this.videoId  = options.videoId  || 'video';
      this.canvasId = options.canvasId || 'canvas';
      this.parallelId = options.parallelId || 'parallel';
      this.numberId = options.numberId || 'number';
      this.beginId  = options.beginId  || 'begin';
      this.shotId = options.shotId || 'snap';
      this.clearId = options.clearId || 'clear';
      this.whiteBalanceId = options.whiteBalanceId || 'whitebalance';
      this.height = options.height || 320;
      this.width = options.width || 240;
      this.divisions = options.divisions || 2;
      this.offline = options.offline || false;
      this.parallelFileDefinition = options.parallelFileDefinition || './files/processParallel.js';
      this.videoCanvas;
      this.parallel;
      this.coordsMatrix = [[110, 70, 50, 50], [180, 70, 50, 50]];
      this.whiteBalance = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.offline = false;
      this.accumulatedTotals = [];
      this.completed = 0;
      this.start;
      this.times = [];
      this.TimePtr = new StopWatch;
      this.ParallelTimeWatch = [];
      this.ParallelPtr = PL;
      this.VideoCanvasPtr = VideoCanvas;
      this.isParallel;
      this.numberOfThreads;
      this.animFrameID;
      this.initialized = true;
      this.ImageProcess = new ImageProcess;
      // shim layer with setTimeout fallback
      window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
          function( callback ){
                window.setTimeout(callback, 1000 / 60);
          };
      })();
    }

    MainController.prototype.Begin = function() {
      this.SetUpClickFunctions();
    }

    MainController.prototype.SetUpClickFunctions = function() {
      document.getElementById(this.beginId).addEventListener("click", () => {
          this.isParallel = document.getElementById(this.parallelId).checked ? true : false;
          this.numberOfThreads = parseInt(document.getElementById(this.numberId).value);
          
          if(this.initialized){
            this.videoCanvas = new this.VideoCanvasPtr(this.videoId, this.canvasId, {h: this.height, w: this.width, m: this.coordsMatrix, p: this.isParallel});
          }

          if(this.isParallel && this.initialized){
            for(var i=0; i<this.numberOfThreads; i++) {
              this.accumulatedTotals.push([]);
              this.ParallelTimeWatch.push((function(){
                return new StopWatch;
              }()))
            }
            this.parallel = new this.ParallelPtr(this.isParallel, this.numberOfThreads, this.parallelFileDefinition, this.DispatchTotals, this);
            this.parallel.begin();
          }

          this.videoCanvas.startVideo();
          var self = this;
          this.initialized = false;
          function animloop() {
            self.animFrameID = requestAnimFrame(animloop);
            self.videoCanvas.drawVideoToCanvas();
            self.ProcessData();
          }
          animloop();
        });

        // Trigger photo take
        document.getElementById(this.shotId).addEventListener("click", () => {
          window.cancelAnimationFrame(this.animFrameID);    
          this.videoCanvas.drawVideoToCanvas();
          this.ProcessData();
        });

        // Store white balance
        document.getElementById(this.whiteBalanceId).addEventListener('click', () => {
          this.videoCanvas.drawVideoToCanvas();
          storeWhiteBalance();
        });

        // Clear Video source and erase canvas
        document.getElementById(this.clearId).addEventListener('click', () => {
          this.videoCanvas.clearCanvas();
          window.cancelAnimationFrame(this.animFrameID);    
          if(this.parallel&&this.parallel.isParallel){
            this.parallel.computeWorkers.forEach(function(worker){
              worker.terminate();
            });
            this.parallel.isParallel = false;
            this.parallel = null;
            this.initialized = true;
            this.accumulatedTotals = [];
            this.ParallelTimeWatch = [];
          }  
        });
    }

    MainController.prototype.ProcessData = function(){
      if(this.isParallel){
         this.SendDataParallel(this.videoCanvas.context);
      } else {
         this.SendData(this.videoCanvas.context);
      }
    }
    
    MainController.prototype.SendDataParallel = function() { 
      // Get array of data to execute in parallel
      var dataValueArray = this.coordsMatrix.map((singleCoordArray) => {
        var a = singleCoordArray[0];
        var b = singleCoordArray[1];
        var c = singleCoordArray[2];
        var d = singleCoordArray[3];
        return this.videoCanvas.context.getImageData(a,b,c,d).data.buffer;
      });
      // return array for each coord dimensions by using c and d 
      // return corresponding job number
      
      var dimensionsAndJobNumber = this.coordsMatrix.map((coord, idx)=>{
        var b = new ArrayBuffer(8);
        var d = new ArrayBuffer(4);
        var v = new Int32Array(b);
        var m = new Int32Array(d);
        v[0] = coord[2];
        v[1] = coord[3];
        m[0] = idx;
        var dimensionsBuffer = v.buffer;
        var countBuf = m.buffer;
        return {
          dim : dimensionsBuffer,
          count : countBuf
        }
      });
      // Send out jobs
        this.parallel.computeWorkers.forEach((worker, idx)=>{
          worker.postMessage({values: dataValueArray[idx], dim: dimensionsAndJobNumber[idx].dim, idx: dimensionsAndJobNumber[idx].count}, [dataValueArray[idx], dimensionsAndJobNumber[idx].dim, dimensionsAndJobNumber[idx].count])
          this.ParallelTimeWatch[idx].Start();
        });
     }

    MainController.prototype.SendData = function(context){
      var dataValues = context.getImageData(this.coordsMatrix[0][0], this.coordsMatrix[0][1], this.coordsMatrix[0][2], this.coordsMatrix[0][3]);
      var totals;
      this.TimePtr.Execute(() => {
        totals =  this.ImageProcess.getDataValues(dataValues);
        totalsC = totals;
        totals = totals.map( (v, i) =>{
        return (v-this.whiteBalance[i] < 0) ? 0 : v-this.whiteBalance[i] });  
      });

      if(!this.offline){
        updateLine(totals);
        updateBar(totals);
      } else {
        document.getElementsByClassName("info")[0].innerHTML = totals;
      }
        document.getElementsByClassName("stats")[0].innerHTML = this.TimePtr.getMeanTime().toFixed(2).toString() + " ms";
    } 

    MainController.prototype.DispatchTotals = function(data){
      this.accumulatedTotals[data.idx] = data.data;
      this.completed = this.completed + 1;
      this.ParallelTimeWatch[data.idx].End();
      if(this.completed === this.numberOfThreads){
        this.completed = 0;
        this.parallelUpdate();
      }
    }

    MainController.prototype.parallelUpdate = function(){
      var totals = this.accumulatedTotals;
      totals = totals.map((total) =>{
        return total.map((v, i)=>{return (v-this.whiteBalance[i] < 0) ? 0 : v-this.whiteBalance[i] });  
      })
      if(!this.offline){
        updateLine(totals[0]);
        updateBar(totals[1]);
      }
      var times = this.getParallelTotals();
      document.getElementsByClassName("stats")[0].innerHTML = times;
      // socket.emit('raw data', {data: dataValues.data, height: dataValues.height, width: dataValues.width});
    }

    MainController.prototype.getParallelTotals = function(){
      return this.ParallelTimeWatch.map((watch, idx)=>{
        return "Worker " + idx + ": " + watch.getMeanTime().toFixed(2).toString() + " ms";
      }).join("<br>");
    }

    MainController.prototype.End = function(){

    }