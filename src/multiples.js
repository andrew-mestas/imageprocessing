

function Multiples(num) {
  this.dimensions = 0;
  this.num = num;
  this.num2 = 0;
  this.length = 0;
  this.intersects = [];
  this.multiples = num === undefined ? [] : this.getMultiples();
  this.matrix = [];
  this.possible = [];
}

Multiples.prototype.getMultiples = function() {
  var count = 0;
  var multiples = [];
  var num = this.num;
  while (num >= 2) {
    if (num % 2 === 0) {
      num = num / 2;
      multiples.push(2)
    } else if (num % 3 === 0) {
      num = num / 3;
      multiples.push(3)
    } else if (num % 5 === 0) {
      num = num / 5;
      multiples.push(5)
    } else if (num % 7 === 0) {
      num = num / 7;
      multiples.push(7)
    } else {
      console.log("Not Applicable");
      this.length = multiples.length;
      return multiples;
    }
  }
  this.multiples = multiples;
  return multiples;
}

Multiples.prototype.intersect = function(ar1) {
  this.num2 = ar1 instanceof Multiples ? ar1.num : ar1;
  var ar1 = ar1 instanceof Multiples ? ar1.multiples : ar1;
  var bigger = ar1.length > this.multiples.length ? ar1 : this.multiples;
  var smaller = bigger == ar1 ? this.multiples : ar1;
  var intersects = smaller.filter((num)=> {
    return bigger.indexOf(num) >= 0;
  });
  this.dimensions = intersects.length;
  this.intersects = intersects;
  return this;
}

Multiples.prototype.generatePossible = function() {
  var dimensions = this.dimensions;
  var intersects = this.intersects;
  var possible = [];
  for(var i=0; i< intersects.length; i++){
    var mult = (intersects.slice(i, intersects.length).reduce((a,b)=>{return a*b},1));
    possible.push(mult);
  }
  this.possible = possible;
  return this;
}

Multiples.prototype.createMatrix = function(){
  var matrixDimensions = this.possible;
  var CoordMatrixArr = [];
  var height = this.num;
  var width = this.num2;

  var CoordMatrixArr = matrixDimensions.map((dim)=>{
    var h = height / dim;
    var w = width / dim;
    return this.generateMatrix(dim, h, w);
  })
  return CoordMatrixArr;
}

Multiples.prototype.generateMatrix = function(reducedDim, height, width){
  var matrix = [];
  for(var i=0; i<reducedDim*height; i+=height){
    var inner = [];
    for(var x=0; x<reducedDim*width; x+=width){
      inner.push([i,x,height, width]);
    }
    matrix.push(inner);
  }
  return matrix;
}



// console.log(intersect(multiples(320), multiples(240)))