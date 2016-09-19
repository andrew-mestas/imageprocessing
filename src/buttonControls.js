var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
// Video Controls
    function startVideo() {
      // Get access to the camera!
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          // Not adding `{ audio: true }` since we only want video now
          navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
              video.src = window.URL.createObjectURL(stream);
              video.play();
          });
      }
    }
    // Start video stream
    document.getElementById('begin').addEventListener("click", function() {
      startVideo();
      parallel = document.getElementById("parallel").checked ? true : false;
      threads = parseInt(document.getElementById("number").value);
      
      if(!parallelInitialized && parallel){
        spawnWorkers();
        parallelInitialized = true;
      }
      interval = setInterval(function(){
        context.drawImage(video, 0, 0, 320, 240);
        updateLoop();
      }, 10);
    });

    // Trigger photo take
    document.getElementById('snap').addEventListener("click", function() {
      clearInterval(interval);
      context.drawImage(video, 0, 0, 320, 240);
      updateLoop();
    });

    // Clear Video source and erase canvas
    document.getElementById('whitebalance').addEventListener('click', function(){
      context.drawImage(video, 0, 0, 320, 240);
      updateChart(context);
      storeWhiteBalance();
    });

    // Clear Video source and erase canvas
    document.getElementById('clear').addEventListener('click', function(){
      video.src = '';
      computeWorkers.forEach(function(worker){
        worker.terminate();
      }) 
      clearInterval(interval);
      context.clearRect(0, 0, 320, 240);
    });