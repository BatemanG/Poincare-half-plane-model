
// Set the scale width and height
const scaleWidth = 500;
const scaleHeight = 500;
const scale = 250;
const inf = -10000;

export function cartesianToPixel(x, y) {
    var px = scale * x;
    var py = -scale * y;
    return { px: px, py: py };
  }
  
  export function pixelToCartesian(px, py) {
    var x = px / scale;
    var y = -py / scale;
    return { x: x, y: y };
  }
  
  export function complexToPixel(Z){     //document this properly but complex is sorted as [a,b,c] = ( a + bi ) / c
    var px = scale * Z[0]/Z[2];
    var py = -scale * Z[1]/Z[2];
    return {px: px, py: py};
  }
  
 
  export function farey(n) {
    let result = [[0, 1]];
    let a = 0, b = 1, c = 1, d = n;
  
    while (c <= n) {
      let k = Math.floor((n + b) / d);
      let aa = a, bb = b;
      a = c;
      b = d;
      c = k * c - aa;
      d = k * d - bb;
      result.push([a, b]);
    }
  
    return result;
  }
  
  


export function drawGeodesic(context, x1, y1, x2, y2, scaleX, scaleY, offsetX, offsetY, colour) {
  let Z1 = cartesianToPixel(x1,y1,scaleX, scaleY, offsetX, offsetY);
  let Z2 = cartesianToPixel(x2,y2,scaleX, scaleY, offsetX, offsetY);

  if (x1 == x2) {
      context.lineTo(Z2.px, Z2.py);  // Continue line to next point without breaking the path
  } else {
      let denominator = (x2*x2 - x1*x1) + (y2*y2 - y1*y1);
      let numerator   = 2 * (x2 - x1);
      let x0 = denominator / numerator; 
      let absv1 = Math.sqrt( (x1 - x0)*(x1 -x0) + y1*y1 );
      
      let center = cartesianToPixel(x0, 0, scaleX, scaleY, offsetX, offsetY);
      let radius = cartesianToPixel(absv1,0,scaleX, scaleY, offsetX, offsetY);

      // Calculate the start and end angles
      let startAngle = Math.atan2(-y1, x1 - x0);
      let endAngle = Math.atan2(-y2, x2 - x0);

      if ( x1 < x2) {
                context.arc(center.px, center.py, radius.px, startAngle, endAngle, false);
              } else {
                [startAngle, endAngle] = [endAngle, startAngle]
                context.arc(center.px, center.py, radius.px, endAngle, startAngle, true);
              }

  }
  
  context.strokeStyle = colour;
}


function drawGeodesicComplex(context, z1, z2, scaleX, scaleY, offsetX, offsetY) {           //change z = [a,b,c] and then inf is c = 0 this will be last step of the polygon steps 
    // Separate out the real and imaginary parts of the complex numbers
    let x1 = z1[0]/z1[2];
    let y1 = z1[1]/z1[2];
    let x2 = z2[0]/z2[2];
    let y2 = z2[1]/z2[2];
    
        context.lineWidth   = 3/scaleX;  
        context.colour      = 'black';
        drawGeodesic(context, x1, y1, x2, y2, scaleX, scaleY, offsetX, offsetY);
   
}

  export function drawHyperbolicPolygon(context, polygon, drawingMode, scaleX, scaleY, offsetX, offsetY) {
    context.lineWidth   = 3/scaleX;  // Change this to your desired line thickness
    context.colour      = 'black';
    context.strokeStyle = 'dark grey';
    context.globalAlpha = 1; // ensure that the transparency is set to fully opaque
    context.lineWidth = 1;
    //     // Set the fill color to light gray with a little transparency
    context.fillStyle = 'rgba(211, 211, 211)';  // Light gray in RGBA
    context.beginPath();  // Start a new path

    for (let i = 0; i < polygon.length; i++) {
      let z1 = polygon[i];
      let z2 = polygon[(i + 1) % polygon.length];  // % operator is for cyclic rotation over the array

      
       context.fillStyle = '#A9A9A9';
       context.globalAlpha = 0.5; // ensure that the transparency is set to fully opaque


       //this could be handle diff depending if i only allow one point at inf
       if (z1[2] === 0 && i < polygon.length - 1) {
        let Z = complexToPixel(z2);
        context.moveTo(Z.px,inf);
        context.lineTo(Z.px, Z.py);
       }

       drawGeodesicComplex(context, z1, z2, scaleX, scaleY, offsetX, offsetY);
    }
    
    if (polygon.length !== 0 && polygon[0][2] === 0) {
      let Z1 = complexToPixel(polygon[0]);
      let Z2 = complexToPixel(polygon[polygon.length-1]);
      context.lineTo(Z2.px,inf);
      context.lineTo(Z1.px,inf);
    }
    context.closePath(); 
    context.stroke();
    //doesnt do anything noticable
    // Set the fill color to light gray with a little transparency
    context.fillStyle = 'rgba(211, 211, 211, 0.5)';  // Light gray in RGBA
    context.globalAlpha = 0.99;
    context.fill();  // Fill the path
    for (let i = 0; i < polygon.length; i++) {
      let z1 = polygon[i];
      let z2 = polygon[(i + 1) % polygon.length];
      let pixel1 = complexToPixel(z1);
      // context.save();
       // Draw a small circle around each vertex
       context.beginPath();
       context.arc(pixel1.px, pixel1.py, 5/scaleX, 0, 2 * Math.PI, false);
       context.fillStyle = drawingMode ? '#6B21A8' : '#2196F3';
       context.globalAlpha = 1; // ensure that the transparency is set to fully opaque
       context.fill();

    }
  }
  