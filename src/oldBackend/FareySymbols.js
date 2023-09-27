
  
  // a farey symbol will be computed, and will be returned together with
// extra information...
    // array consists of 1) Farey end points,
    //  2) labels 3) pairing map 4) generators
// 5) information on internal edges/cosets
// the last information will be a list of length of
// the end points list; it will contain a list of end points
// each end point is joined to.


function matrixMultiplier(arrayOne, arrayTwo){
  var matrixOne = arrayOne;
  var matrixTwo = arrayTwo;
  var a1 = matrixOne[0];
  var b1 = matrixOne[1];
  var c1 = matrixOne[2];
  var d1 = matrixOne[3];
  var a2 = matrixTwo[0];
  var b2 = matrixTwo[1];
  var c2 = matrixTwo[2];
  var d2 = matrixTwo[3];
  var a3 = a1 * a2 + b1 * c2;
  var b3 = a1 * b2 + b1 * d2;
  var c3 = c1 * a2 + d1 * c2;
  var d3 = c1 * b2 + d1 * d2;
  var matrixThree = [a3, b3, c3, d3];
  return matrixThree;
};


function matrixDet(matrix){
        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];
    return (a*d-b*c)*1.;
}

// inverse of a 2x2 matrix; allow the determinant non integer,
// but there will probably result bugs and errors if the determinant is
// non integral or zero
function matrixInverse(matrix){
    var det = matrixDet(matrix);
        var a = matrix[0];
        var b = matrix[1];
        var c = matrix[2];
        var d = matrix[3];
        return [d/det, -b/det, -c/det, a/det];
}

  //Given Farey symbols, returns a list of generator matrices
function getGenerators(array){
    var edges = array[0];
  var labels = array[1];
  var generatorList = [];
  var tempArray = labels;
  for (var i = 0; i < labels.length; i++){
    if (labels[i] === -2){
      var cd = edges[i];
      var ab = edges[i+1];
      var c = cd[0];
      var d = cd[1];
      var a = ab[0];
      var b = ab[1];
      var matrix1 = [a, c, b, d];
      var matrix2 = [0, -1, 1, 0];
      var matrix3 = [d, -c, -b, a];
      var tempmatrix = matrixMultiplier(matrix1, matrix2);
      var generatorMatrix = matrixMultiplier(tempmatrix, matrix3);
      generatorList.push(generatorMatrix);
    }
    else if (labels[i] === -3){
      var cd = edges[i];
      var ab = edges[i+1];
      var c = cd[0];
      var d = cd[1];
      var a = ab[0];
      var b = ab[1];
      var matrix1 = [a, c, b, d];
      var matrix2 = [0, -1, 1, -1];
      var matrix3 = [d, -c, -b, a];
      var tempmatrix = matrixMultiplier(matrix1, matrix2);
      var generatorMatrix = matrixMultiplier(tempmatrix, matrix3);
      generatorList.push(generatorMatrix);
    }
    else if (labels[i] > 0){
      var label = labels[i]
      var cd = edges[i];
      var ab = edges[i+1];
      var c = cd[0];
      var d = cd[1];
      var a = ab[0];
      var b = ab[1];
      tempArray.splice(i, 1);
      var indexOfLabel = tempArray.indexOf(label);
      if (indexOfLabel < i){
        generatorList.push(0)
        tempArray.splice(i, 0, label);
      } else {
        var j = indexOfLabel + 1;
        var c2d2 = edges[j];
        var a2b2 = edges[j+1];
        var c2 = c2d2[0];
        var d2 = c2d2[1];
        var a2 = a2b2[0];
        var b2 = a2b2[1];
        var matrix1 = [c2, -a2, d2, -b2];
        var matrix2 = [d, -c, -b, a];
        var generatorMatrix = matrixMultiplier(matrix1, matrix2);
        generatorList.push(generatorMatrix);
        tempArray.splice(i, 0, label);
      }
    }
  }
  for (var k = 0; k < generatorList.length; k++){
    if (generatorList[k] === 0){
      generatorList.splice(k,1);
    }
  }
  return generatorList;
}


//Given Farey symbols, returns a list of generator matrices
// this is a version that gives the matrix associated with each edge that
// maps that edge to another edge of the domain (possibly the same edge)
function getGeneratorsA(array){
    var edges = array[0];
  var labels = array[1];
  var generatorList = [];
  var tempArray = labels;
  for (var i = 0; i < labels.length; i++){
    if (labels[i] === -2){
      var cd = edges[i];
      var ab = edges[i+1];
      var c = cd[0];
      var d = cd[1];
      var a = ab[0];
      var b = ab[1];
      var matrix1 = [a, c, b, d];
      var matrix2 = [0, -1, 1, 0];
      var matrix3 = [d, -c, -b, a];
      var tempmatrix = matrixMultiplier(matrix1, matrix2);
      var generatorMatrix = matrixMultiplier(tempmatrix, matrix3);
      generatorList.push(generatorMatrix);
    }
    else if (labels[i] === -3){
      var cd = edges[i];
      var ab = edges[i+1];
      var c = cd[0];
      var d = cd[1];
      var a = ab[0];
      var b = ab[1];
      var matrix1 = [a, c, b, d];
      var matrix2 = [0, -1, 1, -1];
      var matrix3 = [d, -c, -b, a];
      var tempmatrix = matrixMultiplier(matrix1, matrix2);
      var generatorMatrix = matrixMultiplier(tempmatrix, matrix3);
      generatorList.push(generatorMatrix);
    }
    else if (labels[i] > 0){
      var label = labels[i]
      var cd = edges[i];
      var ab = edges[i+1];
      var c = cd[0];
      var d = cd[1];
      var a = ab[0];
      var b = ab[1];
      tempArray.splice(i, 1);
      var indexOfLabel = tempArray.indexOf(label);
//      if (indexOfLabel < i){
//        generatorList.push(0)
//        tempArray.splice(i, 0, label);
//      } else {
        var j = indexOfLabel + 1;
        var c2d2 = edges[j];
        var a2b2 = edges[j+1];
        var c2 = c2d2[0];
        var d2 = c2d2[1];
        var a2 = a2b2[0];
        var b2 = a2b2[1];
        var matrix1 = [c2, -a2, d2, -b2];
        var matrix2 = [d, -c, -b, a];
        var generatorMatrix = matrixMultiplier(matrix1, matrix2);
        generatorList.push(generatorMatrix);
        tempArray.splice(i, 0, label);
//    }
    }
  }
  for (var k = 0; k < generatorList.length; k++){
    if (generatorList[k] === 0){
      generatorList.splice(k,1);
    }
  }
  return generatorList;
}


  //Checks if matrix is in GammaU0
// function isMemberGammaU0(generatorList, N){
//   var matrix = generatorList[0];
//   var a = matrix[0];
//   var b = matrix[1];
//   var c = matrix[2];
//   var d = matrix[3];
//   if (a*d-b*c === 1 && b%N === 0){
//     return true
//   }
// };


  //Checks if matrix is in GammaL0
function isMemberGammaL0(generatorList, N){
  var matrix = generatorList[0];
  var a = matrix[0];
  var b = matrix[1];
  var c = matrix[2];
  var d = matrix[3];
  if (a*d-b*c === 1 && c%N === 0){
    return true
  }
};

function isMemberGammaU0(generatorList, N){
  var matrix = generatorList[0];
  var a = matrix[0];
  var b = matrix[1];
  var c = matrix[2];
  var d = matrix[3];
  if (a*d-b*c === 1 && b%N === 0){
    return true
  }
};


//Checks if matrix is in GammaL1
// note that this is applied to a generator list of matrices,
// but only computes for the first entry (same for other similar tests)
// i.e. to test a matrix M, argument should be [M], N, etc
function isMemberGammaL1(generatorList, N){
  var matrix = generatorList[0];
  var a = matrix[0];
  var b = matrix[1];
  var c = matrix[2];
    var d = matrix[3];
    // note in a projective group, we identify 1 and -1
    // extra careful test incase javascript returns negative numbers
    if (a*d-b*c === 1 && c%N === 0 &&
    (a%N == 1 || a%N ==N-1 || a%N==-1 || a%N==1-N)){
    return true
  }
};


function isMemberGammaU1(generatorList, N){
  var matrix = generatorList[0];
  var a = matrix[0];
  var b = matrix[1];
  var c = matrix[2];
    var d = matrix[3];
    // note in a projective group, we identify 1 and -1
    // extra careful test incase javascript returns negative numbers
    if (a*d-b*c === 1 && b%N === 0 &&
    (a%N == 1 || a%N ==N-1 || a%N==-1 || a%N==1-N)){
    return true
  }
};

function isMemberGammaN(generatorList, N){
  var matrix = generatorList[0];
  var a = matrix[0];
  var b = matrix[1];
  var c = matrix[2];
    var d = matrix[3];
    // note in a projective group, we identify 1 and -1
    // extra careful test incase javascript returns negative numbers
    if (a*d-b*c === 1 && b%N === 0 && c%N==0 &&
    (a%N == 1 || a%N ==N-1 || a%N==-1 || a%N==1-N)){
    return true
  }
};

function isMembertest(generatorList, N,grouptype){
    if (grouptype=="gammaL0N"){return isMemberGammaL0(generatorList,N);}
    if (grouptype=="gammaL1N" && (N==2 || N==3)){return isMemberGammaL0(generatorList,N);}    
    if (grouptype=="gammaL1N"){return isMemberGammaL1(generatorList,N);}
    if (grouptype=="gammaU0N"){return isMemberGammaU0(generatorList,N);}
    if (grouptype=="gammaU1N"){return isMemberGammaU1(generatorList,N);}
    if (grouptype=="gammaN"){return isMemberGammaN(generatorList,N);}    
    
}


function checkCurrentIndex(array){
  var edges = array[0];
  var labels = array[1];
  var length = edges.length;
  var m = 0;
  for (var i = 0; i < labels.length; i++){
    if (labels[i] === -3){
      m++;
    }
  }
  var currentIndex = (3 * (length - 3)) + m;
  return currentIndex;
}


// function isPrime(N){
//   for (var i = 2; i <= Math.sqrt(N); i++){
//     if (N % i === 0){
//       return false;
//     }
//   }
//   return true;
// }


// function findFactorsOfN(N){
//   var factorsOfN = [];
//   for (i = 2; i <= N; i++){
//     if (N % i === 0){
//       factorsOfN.push(i);
//     }
//   } return factorsOfN;
// }


// function primeFactorsOfN(N){
//   var factors = findFactorsOfN(N);
//   for (var i = factors.length -1; i >= 0; i--){
//     var factor = factors[i];
//     if (!isPrime(factor)){
//       factors.splice(i,1)
//     }
//   }
//   return factors;
// }


function determineTrueIndex(N){
  var primeFactors = primeFactorsOfN(N);
  var trueIndex = N;
  for (var i = 0; i < primeFactors.length; i++){
    var p = primeFactors[i];
    trueIndex = trueIndex * (1 + 1/p)
  }
  return trueIndex;
}



function determineTrueIndexGL1(N){
    if (N==1){return 1;}    
    if (N==2){return 3;}
  var primeFactors = primeFactorsOfN(N);
  var trueIndex = (N*N)/2.;
  for (var i = 0; i < primeFactors.length; i++){
    var p = primeFactors[i];
    trueIndex = trueIndex * (1 - 1./(p*p));
  }
  return trueIndex;
}

// when we add an extra vertex, all the labels change
function adjustpairing(pairing,i){
    for (var k=0;k<pairing.length;k++){
        if (pairing[k]>i){
        pairing[k]+=1
    }
    }
    return pairing
}
  function findGCD(a, b) {
    if (a*b==0){return 1}    
    var numerator = Math.abs(a);
    var denominator = Math.abs(b);
    var difference = Math.abs(numerator - denominator);
    while (difference > 0){
        if (numerator > denominator){
        numerator += -denominator;
        } else {
        denominator += -numerator;
        } difference = Math.abs(numerator - denominator);
    } return Math.round(numerator);
    };

// take sum of numerator and denomators, and take gcd
function fareysum(frac1,frac2){    
              var numerator1 = frac1[0];
          var denominator1 = frac1[1];
          var numerator2 = frac2[0];
          var denominator2 = frac2[1];
    var fraction = [numerator1 + numerator2, denominator1 + denominator2];
    var g = findGCD(fraction[0],fraction[1])
    // note, let us make the denominator positive
    if (fraction[1]<0){fraction[0] *=-1; fraction[1] *=-1;}
    return [fraction[0]/g,fraction[1]/g]    
}

// a function to keep track of internal joining of edges
function updatejoins(joinings,i){
    var joins = joinings;
    // have to adjust all the joining info for points with index>i+1
    for (var k=0;k<joins.length;k++){
    var temp=[]
    for (var j=0;j<joins[k].length;j++){
            if (joins[k][j]<i){// check shoulod be < and not <=?
        temp.push(joins[k][j])
        }
        else
        {temp.push(joins[k][j]+1)
        }
    }
    joins[k] = temp
    }
    joins.splice(i,0,[i-1,i+1]);
    joins[i-1].push(i)
    joins[i+1].push(i)    
return joins
}


//Determines Farey symbols of group GammaL0
// we start with the list of end points -oo, 0,1,oo
// the two far edges are joined, so labels are [1,0,1]
// 0 means undetermined joining
// we simultanously construct a list of generators
// also for convenience, keep track of the pairing of edges
// so as well as the labels which come in pairs, keep track of
// which edge an edge pairs to.  It is possible it would
// be more efficent to find pairs at the end; we could time both cases
export function determineFareySymbols(N,grouptype){
    // array consists of
    // 1) Farey end points,
    // 2) labels      [1,3,3,1]
    // 3) pairing map  [3,2,1,0]
    // 4) generators
    // 5) "joinings" list of which vertices a vertex is joined to...
    var array
    if (N==1){
    return [[[-1,0], [0,1], [1,0]],
        [-2,-3],
        [0,1],
        [[0,-1,1,0],[-1, 1,-1,0],[0,-1,1,-1]],
        [[1],[0,2],[1]]
           ];
         }
    if (grouptype=="gammaL0N" ||grouptype=="gammaL1N"){
     array = [[[-1,0], [0,1], [1,1], [1,0]],
               [1, 0, 1],
           [2, -1, 0],
          [[1,1,0,1],[0,0,0,0],[1,-1,0,1]],
                      [[1],[0,2],[1,3],[2]]
         ];
}
else if (grouptype=="gammaN")
    {
    return determineFareySymbolsG(N)
}
    else {
    array = [[[-1,0], [0,1], [1,1], [1,0]],
               [1, 1, 0],
           [1, 0, -1],
         [[1,0,1,1],[1,0,-1,1],[0,0,0,0]],
                      [[1],[0,2],[1,3],[2]]
        ];
    }
  var points = array[0];
    var labels = array[1];
    var pairing = array[2];
    var generators = array[3];
    var joinings = array[4];
  var highest = labels[0];
    var trueIndex
    if (grouptype == "gammaL0N"||grouptype == "gammaU0N")
    {
    trueIndex = determineTrueIndex(N);
    }
    else if (grouptype == "gammaL1N"||grouptype == "gammaU1N")
    {trueIndex = determineTrueIndexGL1(N);}
    else if (grouptype == "gammaN")
    {trueIndex = N*determineTrueIndexGL1(N);}    
  var currentIndex = checkCurrentIndex(array);
  for (var i = 0; i < labels.length; i++){
    var resultArray = [];
    if (i !== 0){
      if (labels[i-1] > highest){
        highest = labels[i-1];
      }
    }
    if (labels[i] === 0){
      while (labels[i] === 0 && currentIndex <= trueIndex){
          //Testing paired labels
        for (var j = i+1; j < labels.length; j++){
          if (labels[j] === 0){
            var l = highest + 1;
            var tempPoints = [points[i], points[i+1], points[j], points[j+1]];
              var tempLabels = [l, 0, l];
            var tempArray = [tempPoints, tempLabels];
            var tempMatrix = getGenerators(tempArray);
              var result = isMembertest(tempMatrix, N,grouptype);
            resultArray.push(result);
            if (result === true){
              labels[i] = l;
        labels[j] = l;
        generators[i] = tempMatrix[0]
        generators[j] = matrixInverse(tempMatrix[0])
        pairing[j]=i
        pairing[i]=j
              highest ++;
              currentIndex = checkCurrentIndex(array);
            }
          }
        }
          //Testing -3 for ai, ai(+)ai+1
        var tempPoints = [points[i], points[i+1]];
        var tempLabels = [-3];
        var tempArray = [tempPoints, tempLabels];
          var tempMatrix = getGenerators(tempArray);
          var result = isMembertest(tempMatrix, N,grouptype);
        if (result === true){
            labels[i] = -3;
            generators[i] = tempMatrix[0]
            pairing[i]=i	    
          currentIndex = checkCurrentIndex(array);
        }
          //Testing -2 for ai, ai(+)ai+1
        tempPoints = [points[i], points[i+1]];
        tempLabels = [-2];
        tempArray = [tempPoints, tempLabels];
        tempMatrix = getGenerators(tempArray);
          result = isMembertest(tempMatrix, N,grouptype);
        if (result === true){
            labels[i] = -2;
            generators[i] = tempMatrix[0]
            pairing[i]=i	    	    
          currentIndex = checkCurrentIndex(array);
        }
          //Adding new point (Farey sum of adjacent points)
        if (labels[i] === 0){
          var point1 = points[i];
          var point2 = points[i+1];
            var newPoint// if fractions are bigger than 1 need
        // a different sum type
//		= [numerator1 + numerator2, denominator1 + denominator2];
        = fareysum(point1,point2)
            points.splice(i+1, 0, newPoint);
// add an extra joining info:
        // have to adjust all the joining info for points with index>i+1
        joinings = updatejoins(joinings,i+1)
            labels.splice(i+1, 0, 0);
        pairing.splice(i+1,0,-1);
        // after shifting labels, we have to adjust the pairing labels
        pairing = adjustpairing(pairing,i)
        generators.splice(i+1,0,[0,0,0,0]);
        }
      }
    }
  }
    return array;
}



function isPrime(N){
  for (var i = 2; i <= Math.sqrt(N); i++){
    if (N % i === 0){
      return false;
    }
  }
  return true;
}

function findFactorsOfN(N){
  var factorsOfN = [];
  for (var i = 2; i <= N; i++){
    if (N % i === 0){
      factorsOfN.push(i);
    }
  } return factorsOfN;
}


function primeFactorsOfN(N){
  var factors = findFactorsOfN(N);
  for (var i = factors.length -1; i >= 0; i--){
    var factor = factors[i];
    if (!isPrime(factor)){
      factors.splice(i,1)
    }
  }
  return factors;
}

    // return array consists of 1) Farey end points,
    //  2) labels 3) pairing map 4) generators
function determineFareySymbolsG(N){
    if (N==3){
    return [
            [[-1,0],[0,1],[1,1],[3,2],[2,1],[3,1],[1,0]],
        [1,2,2,3,3,1],
        [5,2,1,4,3,0],
        [[1,3,0,1],[4,-3,3,  -2],[-2,3,-3,4],[7,  -12,3,  -5],[-5,12,-3,7]] ];
    }
    var startingArray = determineFareySymbols(N,"gammaL1N");
    //var array = [[[-1,0], [0,1], [1,1], [1,0]],
              //[1, 0, 1]];
  var startingPoints = startingArray[0];
  startingPoints.splice(1,1);
  var points = [];
  var labels = [];
    var array = [];
    var pairs =[];
    var generators =[];
    var startingLabels = startingArray[1];
    var startingPairs = startingArray[2];
    var startingGenerators = startingArray[3];
  //var highest = labels[0];
  //var trueIndex = determineTrueIndexGL1(N);
    //var currentIndex = checkCurrentIndex(array);
    // this loop constructs the vertices of the domain for
    // Gamma(N) from the domain for GammaL1N by taking N copies
    // we have removed the initial point 0, because it is repeated
    // by adding 1 each time the domain is translated; it is added
    // back on at the end by splice following this
  for (var i = 0; i < N; i++){
    for (var j = 0; j < startingPoints.length; j++){
      var point = startingPoints[j];
    var numerator = point[0];	
      var denominator = point[1];
      if (denominator !== 0){
        if (i !== 0){
          var newNumerator = numerator + denominator * i;
          var newPoint = [newNumerator, denominator];
          points.push(newPoint);
        } else {
          var newPoint = [numerator, denominator];
          points.push(newPoint);
        }
      }
    }
  }
  points.splice(0,0,[0,1]);
  points.splice(0,0,[-1,0]);
  points.push([1,0]);
  array.push(points);
    labels.push(1);
    pairs.push(N-1);// first edge pairs to last edge
    generators.push([1,N,0,1]);// matrix joining first edge to last edge
  for (var i = 0; i < points.length - 3; i++){
      labels.push(0);
      pairs.push(-1);
      generators.push([0,0,0,0]);
  }
    labels.push(1);
    pairs.push(0);// last edge pairs to first edge
    generators.push([1,-N,0,1]);// matrix joining first edge to last edge    
  var highest = 1;
  //var trueIndex = determineTrueIndexGL1(N);
//    var currentIndex = checkCurrentIndex(array);
    // we already know the pairings for GammaL1(N)
    // we need to compute pairings for Gamma(N) from these
    // we can go through each pairing of GammaL1(N)
    // and find all the corresponding pairings for Gamma(N) one by 1
    // so i only needs to go through the original pairings,
    // and we have already paired the end pairs, so we can start at 1
    var J = startingLabels.length -2;
    for (var i = 1; i <startingLabels.length-1;i++){
        var j = startingPairs[i];
    if (j>=i){// only compute if we have not
        // done the pair already
        // note that always j != i unless N=2 or 3;
        // these cases could be done separately
            // now go through all the possible lifts of j
        // these are on the traslates got by adding 1 repeatedly
        // the index will differ by the addition of multiples of J
            for (var k=0;k<N;k++){
        var liftedi = i + k*J
        var gen = startingGenerators[i]
        var a = gen[0]
        var b = gen[1]
        var c = gen[2]
        var d = gen[3]		
                // a is 1 or -1 mod N; for convenience, let us multiply so
        // a is 1 mod N
        if ((a+1)%N==0){
            a *=-1
            b *=-1
            c *=-1
            d *=-1
        }
        // we need M = (ak -b)/d mod N, but we already have a=d=1 mod N
        // so M = (k-b) mod N
        // by paired region, I mean which of the shifted domains contains the
        // edge paired with the one we are considering
        var pairedregion  = (k-b)%N
        if (pairedregion<0){pairedregion += N;}		
        var pairededge = J*pairedregion+startingPairs[i];
        var Mpaired = [1,pairedregion,0,1]
        var Mliftedi = [1,-k,0,1]
        gen = matrixMultiplier(Mpaired,matrixMultiplier(gen,Mliftedi))
        highest +=1;
        labels[liftedi]=highest
        labels[pairededge]=highest
        pairs[liftedi]=pairededge
        pairs[pairededge]=liftedi
        generators[liftedi]=gen
        generators[pairededge]=matrixInverse(gen)
        }
    }
    }
    array = [points,labels,pairs,generators]
  return array;
}

