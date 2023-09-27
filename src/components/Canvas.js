import React from "react";
import { drawGeodesic, drawGeodesicFarey, farey, drawGeodesicComplex,drawHyperbolicPolygon, cartesianToPixel, pixelToCartesian, complexToPixel } from '../maths/Drawing';


// Set the scale width and height
const scaleWidth = 500;
const scaleHeight = 500;
const scale = 250;
const inf = 1000;
var FareyTesilations = 6;
const MAX_FAREY_ORDER = 2;
const threathHold = 25
// We set the base font size.
const baseFontSize = 20; // You can adjust this number to suit your needs.
const maxAxisNumber = 50;


// Define the draw function. It takes a canvas and parameters for the x and y scales, and x and y offsets
function draw(canvas, hyperbolicPolygon, drawingMode, scaleX, scaleY, offsetX, offsetY, initialScale, initialOnePosition) {
  if (!canvas) return;
  // If either of the scales are invalid (<= 0), we return immediately and don't draw
  if (scaleX <= 0 || scaleY <= 0) return;

  // Get the 2D rendering context for the canvas
  const context = canvas.getContext("2d");
  
  // Save the initial state of the context
  context.save();

  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Translate the context by the offset and scale it
  context.translate(offsetX, offsetY);
  context.scale(scaleX, scaleY);

  // Set the line width, accounting for the scale so the line doesn't appear thicker when zoomed in
  context.lineWidth = 1/scaleX;

  // Draw the y-axis
  context.beginPath();
  context.moveTo(0, (-offsetY) / scaleY); 
  context.lineTo(0, (canvas.height - offsetY) / scaleY);
  context.strokeStyle = "black";
  context.stroke();

  // Draw the x-axis
  context.beginPath();
  context.moveTo((-offsetX) / scaleX,0);
  context.lineTo((canvas.width - offsetX) / scaleX,0);
  context.strokeStyle = "black";
  context.stroke();

 
  //start drawing the grey lines 'tesilations'
  for ( let i=1; i<=maxAxisNumber;i++){                                      
    context.beginPath();
    context.moveTo(i*scale, (-offsetY) / scaleY);                  
    context.lineTo(i*scale, (canvas.height - offsetY) / scaleY);
    context.strokeStyle = "grey";
    context.stroke()

    context.beginPath();
    context.moveTo(-i*scale, (-offsetY) / scaleY); 
    context.lineTo(-i*scale, (canvas.height - offsetY) / scaleY);
    context.strokeStyle = "grey";
    context.stroke()

  }

 
  // We adjust the font size based on the zoom level.
  let fontSize = baseFontSize / scaleX;

  // Label the x-axis
  context.font = fontSize + 'px Cambria Math';
  context.fillStyle = 'black';
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.save();

// Draw the text
for( let i = -maxAxisNumber; i<= maxAxisNumber; i++){
  context.fillText(i, i * scale, 0);
  if ( i !== 0){ context.fillText(i + 'i', - 12/ scaleY, - i * scale); }
  
}



// Restore the previous state of the context
context.restore();

// Before drawing the geodesics, set the global alpha
context.globalAlpha = 0.5;  // 50% opacity

// Set the font and text alignment for the labels
context.font = "8px Arial";
context.textAlign = "center";

 // Adjust Farey sequence order based on zoom level
 let fareyOrder = Math.floor(scaleX * MAX_FAREY_ORDER);

// Draw the Farey Tesilations
for (let i = 1; i<= fareyOrder; i++){
  let fareySeq = farey(i);
  let xOffsets = [-4,-3, -2, -1, 0, 1, 2, 3];

  for (let xOffset of xOffsets) {
    for (let i = 0; i < fareySeq.length - 1; i++) {
      let x1 = fareySeq[i][0] / fareySeq[i][1] + xOffset;
      let x2 = fareySeq[i + 1][0] / fareySeq[i + 1][1] + xOffset;
      context.beginPath(); //testing if i can get the fill to work
      drawGeodesic(context, x1, 0, x2, 0, scaleX, scaleY, offsetX, offsetY);
      context.stroke();
      // Draw the labels for the x-axis
      context.save();
      // context.setTransform(1, 0, 0, 1, 0, 0); // Reset the transform
      
      // Convert Cartesian coordinates (x1,0) to pixel coordinates
      var pixelPos1 = cartesianToPixel(x1, 0, initialScale, initialOnePosition, scaleX, scaleY, offsetX, offsetY, canvas.height);
      
      // Draw the label, but only for x values between 0 and 1, and skip it if the label is "0/1"
      if (x1 > 0 && x1 < 1 && fareySeq[i][1] !== 1) {
        // setting font to change with the zoom as done above
        context.font = (fontSize)/2 + 'px Cambria Math';
        //plot the faction
        context.fillText(`${fareySeq[i][0]}`, pixelPos1.px,5/scaleX);
        context.fillText(`${fareySeq[i][1]}`, pixelPos1.px,20/scaleX);
        context.beginPath();
        context.moveTo(pixelPos1.px-5/scaleX,17/scaleX);
        context.lineTo(pixelPos1.px+5/scaleX,17/scaleX);
        context.strokeStyle = "grey";
        context.stroke();
      }

      context.restore();
    }
    
  }
}


drawHyperbolicPolygon(context, hyperbolicPolygon, drawingMode, scaleX, scaleY, offsetX, offsetY);

context.restore();
}





// Define the Canvas component
function Canvas({hyperbolicPolygon, setHyperbolicPolygon, drawingMode, setDrawingMode, redraw, gammaType, fundamentalDomain, fareySymbols, polygon}) {


  // Initialize state for the scale, whether the canvas is being dragged, the last mouse position, and the offset
  const [scale, setScale] = React.useState({ x: 1, y: 1 });
  const [dragging, setDragging] = React.useState(false);
  const [lastPos, setLastPos] = React.useState({ x: 0, y: 0 });
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  
  const [initialScale, setInitialScale] = React.useState(null);
  const [initialOnePosition, setInitialOnePosition] = React.useState(null);

  
  // Create a ref for the canvas element
  const canvas = React.useRef(null);

  // Define functions to calculate the scale based on the canvas dimensions
  const calculateScaleX = () => (!canvas.current ? 0 : canvas.current.clientWidth / scaleWidth);
  const calculateScaleY = () => (!canvas.current ? 0 : canvas.current.clientHeight / scaleHeight);

  const resized = () => {
    canvas.current.width = canvas.current.clientWidth;
    canvas.current.height = canvas.current.clientHeight;
    const scale = Math.min(
      canvas.current.clientWidth / scaleWidth,
      canvas.current.clientHeight / scaleHeight
    );
    setScale({ x: scale, y: scale });
  
    setOffset({ x: canvas.current.clientWidth / 2 , y: canvas.current.clientHeight - 50 });   //if want to shift the starting possition here is where you would do that.
  };
  
  // Define functions to handle mouse down, up, and move events
  const mouseDown = e => {
    setDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const mouseUp = () => {
    setDragging(false);
  };

  // Define functions to handle mouse move events
// const mouseMove = e => {
//   if (dragging) {
//     const dx = e.clientX - lastPos.x;
//     const dy = e.clientY - lastPos.y;

//     // Calculate new offset
//     let newOffsetX = offset.x + dx;
//     let newOffsetY = offset.y + dy;

//     // Set the limits for the offsets

//     // //i think these seem to be label the wrong way but work
//     // const minX = -1000;  // Set your own limit here
//     // const maxX = 1000;  // Set your own limit here
//     // const minY = -1000;  // Set your own limit here
//     // const maxY = 1000;  // Set your own limit here

//     // // Apply the limits
//     // if (newOffsetX < minX) newOffsetX = minX;
//     // if (newOffsetX > maxX) newOffsetX = maxX;
//     // if (newOffsetY < minY) newOffsetY = minY;
//     // if (newOffsetY > maxY) newOffsetY = maxY;

//     setOffset({ x: newOffsetX, y: newOffsetY });
//     setLastPos({ x: e.clientX, y: e.clientY });
//   }
// };
const mouseMove = e => {
  if (dragging) {
    const minX = -1000;  // Set your own limit here
    const maxX = 3500;  // Set your own limit here
    const minY = -1;  // Set your own limit here
    const maxY = 2000;  // Set your own limit here

    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;

    // Calculate new offset
    let newOffsetX = offset.x + dx;
    let newOffsetY = offset.y + dy;

    // Apply the limits
    if (newOffsetX < minX) newOffsetX = minX;
    if (newOffsetX > maxX) newOffsetX = maxX;
    if (newOffsetY < minY) newOffsetY = minY;
    if (newOffsetY > maxY) newOffsetY = maxY;

    setOffset({ x: newOffsetX, y: newOffsetY });
    setLastPos({ x: e.clientX, y: e.clientY });
  }
};

  
  // Define a function to handle the mouse wheel event for zooming
  const wheel = e => {
    e.preventDefault();
    const scaleFactor = e.deltaY < 0 ? 1.1 : 0.9;

    const newScale = { 
      x: scale.x * scaleFactor, 
      y: scale.y * scaleFactor 
    };

     // Set the maximum scale corresponding to the Farey sequence F_18
    const maxScale = 10;  //this is 18 on the farey 
    const minScale = 0.3; //this is about -4 to 4 on a noraml Full screen aspect ratio need to later make this so that it changes depending on the aspext ratio of the screen.

    // Check if the new scale exceeds the maximum scale
    if (newScale.x > maxScale && newScale.y > maxScale) {
      console.log("Maximum zoom level reached");
      return;
    }

    if (newScale.x < minScale && newScale.y < minScale) {
      console.log("Minimum zoom level reached");
      return;
    }

    const rect = canvas.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
  
    const newOffset = {
      x: (offset.x - x) * scaleFactor + x,
      y: (offset.y - y) * scaleFactor + y
    };

    setScale(newScale);
    setOffset(newOffset);
  };

  // Add event listeners when the component mounts, and remove them when it unmounts
  React.useEffect(() => {
    const currentCanvas = canvas.current;
    currentCanvas.addEventListener("resize", resized);
    currentCanvas.addEventListener("mousedown", mouseDown);
    currentCanvas.addEventListener("mouseup", mouseUp);
    currentCanvas.addEventListener("mousemove", mouseMove);
    currentCanvas.addEventListener("wheel", wheel);

    // Add mouseup event listener to the window
    window.addEventListener("mouseup", mouseUp);

    return () => {
      currentCanvas.removeEventListener("resize", resized);
      currentCanvas.removeEventListener("mousedown", mouseDown);
      currentCanvas.removeEventListener("mouseup", mouseUp);
      currentCanvas.removeEventListener("mousemove", mouseMove);
      currentCanvas.removeEventListener("wheel", wheel);
    };
  }, [canvas, scale, offset]);

  // Call the resized function when the component mounts
  React.useEffect(() => {
    resized();
  }, []);

  React.useEffect(() => {
    if (canvas.current && initialScale && initialOnePosition) {
      draw(canvas.current, polygon, drawingMode, scale.x, scale.y, offset.x, offset.y, initialScale, initialOnePosition);
    }
  }, [scale, offset]);
  
  // Add event listeners for mouse down, up, and move when the component mounts, and remove them when it unmounts
  React.useEffect(() => {
    const currentCanvas = canvas.current;
    currentCanvas.addEventListener("resize", resized);
    currentCanvas.addEventListener("mousedown", mouseDown);
    currentCanvas.addEventListener("mouseup", mouseUp);
    currentCanvas.addEventListener("mousemove", mouseMove);
    
    return () => {
      currentCanvas.removeEventListener("resize", resized);
      currentCanvas.removeEventListener("mousedown", mouseDown);
      currentCanvas.removeEventListener("mouseup", mouseUp);
      currentCanvas.removeEventListener("mousemove", mouseMove);
    };
  });

  // Call the draw function when the scale or offset changes
  React.useEffect(() => {
    draw(canvas.current,  polygon, drawingMode, scale.x, scale.y, offset.x, offset.y);
  }, [scale, offset]);


  React.useEffect(() => {
    draw(canvas.current, polygon, drawingMode, scale.x, scale.y, offset.x, offset.y);
  },[redraw]);

  React.useEffect(() => {
    // The function to be called when the event is fired
    function handleArrayChange(event) {
      let newPolygon = event.detail;
        draw(canvas.current, newPolygon, drawingMode, scale.x, scale.y, offset.x, offset.y);
    }

    // Add the event listener
    window.addEventListener('arrayChanged', handleArrayChange);

    // Cleanup the event listener on unmount
    return () => {
        window.removeEventListener('arrayChanged', handleArrayChange);
    };
  }, [canvas, polygon, setHyperbolicPolygon, scale, offset]);

  // Render the canvas element
  return <canvas ref={canvas} style={{ width: "100%", height: "100%" }}  />;
}

export default Canvas;
