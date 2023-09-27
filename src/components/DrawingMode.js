import React, { useState, useRef ,Fragment} from 'react';
import { InlineMath } from 'react-katex';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'



export default function DrawingMode({ hyperbolicPolygon, setHyperbolicPolygon, errorMessage, setErrorMessage, footerClasses, drawingMode, modeSwitching }) {
    const [clickedNumberIndex, setClickedNumberIndex] = useState(null);
    const [addingNewPoint, setAddingNewPoint] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const safeAreaRef = useRef(null);
  
    const handleNumberClick = (index,event) => {
      if (clickedNumberIndex === index) {
        setClickedNumberIndex(null);
      } else {
        setClickedNumberIndex(index);
        setAddingNewPoint(false);
      }
    };
  
    const handleDeleteClick = () => {
      const updatedPolygon = hyperbolicPolygon.filter((_, index) => index !== clickedNumberIndex);
      setHyperbolicPolygon(updatedPolygon);
      let event = new CustomEvent('arrayChanged', { detail: updatedPolygon });
      window.dispatchEvent(event);
      setClickedNumberIndex(null);
    };
  
    const handleAddClick = () => {
      setShowInput(true);
      setAddingNewPoint(true);
    };
  
    const handleClickOutside = (event) => {
       if (safeAreaRef.current && !safeAreaRef.current.contains(event.target)) {
           setClickedNumberIndex(null);
           setAddingNewPoint(false);
       }
    };
  
    const plusIconClick = () => {
      setShowInput(true);
    };
  
    const minusIconClick = (complex) => {
      if (showInput) {
          setShowInput(false);
      }
    };
  
    const handleInput = (value,index) => {
      setErrorMessage(null); ///testing something 
      if (value.trim().toLowerCase() === 'inf' && !arraysAreEqual(hyperbolicPolygon[0],[1,1,0])) {
          let newPolygon = [[1,1,0], ...hyperbolicPolygon];
          setHyperbolicPolygon(newPolygon);
          let event = new CustomEvent('arrayChanged', { detail: newPolygon });
          window.dispatchEvent(event);
          setShowInput(false);
          setClickedNumberIndex(null);
          return;
      } else if (value.trim().toLowerCase() === 'inf' ){
          setErrorMessage("Cannot currently have more then one point at inf");
          return
      }
  
      const combinedPattern = /^(-?\d+(\.\d+)?|-?\d*\s*\/\s*\d+)?\s*(\+|-)?\s*(-?\d+(\.\d+)?|-?\d*\s*\/\s*\d+)?\s*i\s*$/;
      const realPart = /^\s*(-?\d+(\.\d+)?|-?\d+\s*\/\s*\d+)\s*$/;
      const imgPart = /^\s*(-?\d+(\.\d+)?|-?\d+\s*\/\s*\d+)?\s*i\s*$/;
  
      const combinedTest = combinedPattern.test(value);
      const realTest = realPart.test(value);
      const imgTest = imgPart.test(value); 
      // Check for zero denominator in both the real and imaginary parts
      const hasInvalidZeroDenominator = /\/\s*0(\s|$)/.test(value);
  
      if (hasInvalidZeroDenominator) { 
          setErrorMessage("Cannot input a/0, if want infinity input inf.");
          return;
      }
  
      if (realTest ) {
          let realPart = value.replace(/\s+/g, '');
          let [a,c] = toFraction(realPart);
          if (Math.abs(a) > 30){
            setErrorMessage('Keep x values between -30 & 30.');
            return;
          }
          let newPolygon = hyperbolicPolygon;
          newPolygon.splice(index, 0 ,[a,0,c]);
          setHyperbolicPolygon(newPolygon);
          let event = new CustomEvent('arrayChanged', { detail: newPolygon });
          window.dispatchEvent(event);
          setShowInput(false);
          setClickedNumberIndex(null);
          return;
      }
      if (imgTest ) {
          let imaginaryPart = value.replace('i', '').replace(/\s+/g, '');
          let [b,c] = (imaginaryPart === '') ? [1,1] : toFraction(imaginaryPart);
          // Check if the imaginary part is negative
          if (b < 0) {
              setErrorMessage("The imaginary part cannot be negative.");
              return;
          }
          if (b > 20) {
            setErrorMessage('Keep Imaginary values bellow 20.')
            return;
          }

          let newPolygon = hyperbolicPolygon;
          newPolygon.splice(index, 0 ,[0,b,c]);
          setHyperbolicPolygon(newPolygon);
          let event = new CustomEvent('arrayChanged', { detail: newPolygon });
          window.dispatchEvent(event);
          setShowInput(false);
          setClickedNumberIndex(null);
          return;
      }
      if (combinedTest) {
        if(!value.includes('+')) {
            setErrorMessage("The imaginary part cannot be negative.");
            return;
          }
          const parts = value.split('+');
          const realPart = parts[0].replace(/\s+/g, '');
          let imaginaryPart = parts[1].replace('i', '').replace(/\s+/g, '');
          imaginaryPart = (imaginaryPart === '') ? '1' : imaginaryPart;
          let complexForm = stringToComplex(realPart, imaginaryPart);
          if (complexForm[1] > 20) {
            setErrorMessage('Keep Imaginary values bellow 20.')
            return;
          }
          let newPolygon = hyperbolicPolygon;
          newPolygon.splice(index, 0 ,complexForm);
          setHyperbolicPolygon(newPolygon);
          let event = new CustomEvent('arrayChanged', { detail: newPolygon });
          window.dispatchEvent(event);
          setShowInput(false);
          setClickedNumberIndex(null);
          return;  
            
      }
      
      setErrorMessage("Please enter something in the form of a + bi where a and b are numbers or fractions.");
      return;
    };
  
  
  
    return (
      // <div className={footerClasses}>
  
      //   <ModeSwitchButton drawingMode={drawingMode} modeSwitching={modeSwitching}/>
  
  
        <div style={{ display: 'inline-block' }} className="px-5">
            Hyperbolic Polygon input
  
            <div style={{ display: 'inline-block' }} className="px-9" ref={safeAreaRef} key="safe area">
                {hyperbolicPolygon.map((complex, index) => (
                    <HyperbolicPolygonPoints
                        complex={complex}
                        index={index}
                        clickedNumberIndex={clickedNumberIndex}
                        addingNewPoint={addingNewPoint}
                        handleInput={handleInput}
                        handleDeleteClick={handleDeleteClick}
                        handleAddClick={handleAddClick}
                        handleNumberClick={handleNumberClick}
                    />
                ))}
            </div>
  
            <AddingPointsAtEnd
                  addingNewPoint={addingNewPoint}
                  showInput={showInput}
                  handleInput={handleInput}
                  hyperbolicPolygon={hyperbolicPolygon}
                  setHyperbolicPolygon={setHyperbolicPolygon}
                  minusIconClick={minusIconClick}
                  plusIconClick={plusIconClick}
                  errorMessage={errorMessage}
            />
  
        </div>
      // </div>
    );
  
    
  }
  
  const HyperbolicPolygonPoints = ({ complex, index, clickedNumberIndex, addingNewPoint, handleInput, handleDeleteClick, handleAddClick, handleNumberClick }) => {
    
    function latexInput(complex) {
          
      let c = complex[2];
      let [a, c1] = reduceFraction(complex[0], c);
      let [b, c2] = reduceFraction(complex[1], c);
      let equation;
      let equationA;
      let equationB;
      if (a === 0 && b === 0 && c !== 0){
          return (
              <div style={{display: 'inline-block'}} className='px-1'>
              <InlineMath math='0, ' />
              </div>
          ) 
      }
      if ( c=== 0) {
          return (
              <div style={{display: 'inline-block'}} className='px-1'>
              <InlineMath math='\infty, ' />
              </div>
          )
      }
      
      if (a === 0) {
          equationA = '';
      } else if (c1 === 1) {
          equationA = a + '';
      } else {
          equationA = '\\frac{' + a + '}{' + c1 + '}';
      }
  
      if (b === 0) {
          equationB = '';
      } else if (c2 === 1 && b === 1) {
          equationB ='i';
      } else if (c2 === 1) {
          equationB = b + 'i';
      } else {
          equationB = '\\frac{' + b + '}{' + c2 + '} i';
      }
      equation = (equationB === '') ? equationA + ',' : ( (equationA === '') ?  equationB + ',' :equationA + '+' + equationB + ',');
    
      return (
             <div style={{display: 'inline-block'}} className='px-1'>
                  <InlineMath math={equation} />
             </div>   
      );
    };
  
    return (
        <div style={{ display: 'inline-block' }} key={index}>
            {clickedNumberIndex === index ? (
              // if a number is clicked it will either show the plus and minus icons or and input icon
                <div>
                  {/* if the plus icon is clicked then show hte input icon*/}
                    {addingNewPoint ? (
                        <div style={{ display: 'inline-block' }}>
                            <input
                                className="flex rounded-full shadow-lg bg-purple-800 ring-1 ring-white text-white"
                                style={{ fontFamily: "'STIX Two Text', serif", display: 'inline-block' }}
                                placeholder="a + b i"
                                onKeyPress={(event) => {
                                  if (event.key === 'Enter'){handleInput(event.target.value, index);}
                                }}
                            />
                            <InlineMath math="  , " />
                        </div>
                    ) : (
                      // else we just want to show the icons
                        <div style={{ display: 'inline-flex' }}>
                            <button style={{ display: 'inline-block' }} onClick={handleDeleteClick}>
                                <AiOutlineMinusCircle style={{ display: 'inline-block' }} size="25" />
                            </button>
                            <button style={{ display: 'inline-block' }} onClick={handleAddClick}>
                                <AiOutlinePlusCircle style={{ display: 'inline-block' }} size="25" />
                            </button>
                            <InlineMath math="  , " />
                        </div>
                    )}
                </div>
            ) : (
              // if we have not pressed on a number then we want that point to be shown using the latexInput function
                <div style={{ display: 'inline-block' }} onClick={(event) => handleNumberClick(index, event)}>
                    {latexInput(complex)}
                </div>
            )}
        </div>
    );
  }
  
  const AddingPointsAtEnd = ({ addingNewPoint, showInput, handleInput, hyperbolicPolygon, minusIconClick, plusIconClick, errorMessage }) => {   //if getting all this to waork mix this into the above one aswell
    return (
        <>
            {(!addingNewPoint && showInput) && (
                <input
                    className="flex rounded-full shadow-lg bg-purple-800 ring-1 ring-white text-white"
                    style={{ fontFamily: "'STIX Two Text', serif", display: 'inline-block' }}
                    placeholder=" a + b i"
                    onKeyPress={(event) => {
                        if (event.key === 'Enter') {
                            handleInput(event.target.value, hyperbolicPolygon.length);
                        }
                    }}
                />
            )}
  
            <button onClick={minusIconClick} className="px-5">
                <AiOutlineMinusCircle style={{ display: 'inline-block' }} size="25" />
            </button>
  
            <button onClick={plusIconClick}>
                <AiOutlinePlusCircle style={{ display: 'inline-block' }} size="25" />
            </button>
  
            {errorMessage && (
                <div style={{ display: 'inline-block' }}>
                    {errorMessage}
                </div>
            )}
        </>
    );
  }
  
  

  const arraysAreEqual = (arr1, arr2) => 
  Array.isArray(arr1) && 
  Array.isArray(arr2) && 
  arr1.length === arr2.length && 
  arr1.every((value, index) => value === arr2[index]);

  const stringToComplex = (realPart, imaginaryPart) => {
    const [realNum, realDen] = toFraction(realPart);
    const [imgNum, imgDen] = toFraction(imaginaryPart);
    
    const commonDen = realDen * imgDen;
    const a = realNum * imgDen;
    const b = imgNum * realDen;
    const c = commonDen;
  
    const commonGcd = gcd(gcd(a, b), c);
  
    return [a / commonGcd, b / commonGcd, c / commonGcd];
  }
  

  const toFraction = (str) => {
    if (str === '') { return [0,1] }
    if (str.includes("/")) {
        const [num, den] = str.split("/").map(Number);
        return [num, den];
    } else if (str.includes(".")) {
        const [intPart, decPart] = str.split(".");
        const den = Math.pow(10, decPart.length);
        const num = Number(intPart + decPart);
        const commonGcd = gcd(num, den);
        return [num / commonGcd, den / commonGcd];
    } else {
        return [Number(str), 1];
    }
  };

  function gcd(a, b) {
    while (b !== 0) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
  }
  
  // Function to reduce a fraction to its simplest form
  function reduceFraction(a, b) {
    const commonDivisor = gcd(a, b);
    return [a / commonDivisor, b / commonDivisor];
  }