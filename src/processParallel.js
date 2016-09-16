importScripts('imageProcess.3.js');


self.addEventListener('message', function(e) {
  var byteArray = {}; 
  byteArray.data = new Uint8ClampedArray(e.data.values);
  var dim = new Int32Array(e.data.dim);
  var index = new Int32Array(e.data.idx)[0];
  byteArray.height = dim[0];
  byteArray.width = dim[1];
  self.postMessage({data: getTotals(byteArray), idx: index});
}, false);