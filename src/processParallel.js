importScripts('imageProcess.4.js');
self.addEventListener('message', function(e) {
  var Image = new ImageProcess;
  var ByteArrayAndIdx = getByteArrayAndIndex(e);  
  self.postMessage({data: Image.getDataValues(ByteArrayAndIdx.ByteArray), idx: ByteArrayAndIdx.idx});
}, false);

var getByteArrayAndIndex = function(e){
  var byteArray = {}; 
  byteArray.data = new Uint8ClampedArray(e.data.values);
  var dim = new Int32Array(e.data.dim);
  var index = new Int32Array(e.data.idx)[0];
  byteArray.height = dim[0];
  byteArray.width = dim[1];
  return {
    ByteArray : byteArray,
    idx : index
  }
}