import React, { useState, useRef } from 'react';
import { useDrawing } from '../ModeContext';
// import { Select, Option } from "@material-tailwind/react";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, MinusIcon } from '@heroicons/react/20/solid'
import { InlineMath } from 'react-katex';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai'
import { draw } from './Canvas'



function Footer({hyperbolicPolygon, setHyperbolicPolygon, drawingMode, setDrawingMode,forceRedraw, gammaType, setGammaType, fareySymbols, setFareySymbols, N, setN, fundamentalDomain, setFundamentalDomain, generatorsString, fareyString}) {
    const [clickedNumberIndex, setClickedNumberIndex] = useState(null);
    const [minusHighlighted, setMinusHighlighted] = useState(false);
    const [isInteger, setIsInteger] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [inputs, setInputs] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [newNumber, setNewNumber] = useState('');
    const isAddingRef = useRef(false);
    const safeAreaRef = useRef(null);
    
    // console.log('gen', generatorsString)
    
    // let initialDrawModeHyperbolicPolygonValue = [
    //     [-1, 0, 1],
    //     [0, 3, 1],
    //     [2, 2, 1],
    //     [1, 1, 1]
    //   ];
    // // I think later i will change it so it has a hyperbolicpolygon, and a fundamenalt domain value and i jsut switch between them 
    // // ths still needs sorting out, it should hold the value of the last polygon before the switch
    // let hyperbolicPolygonDrawing = initialDrawModeHyperbolicPolygonValue;               /// this storage thing doesnt work need to fix this 
    const modeSwtiching = () => {
        // if(drawingMode) {
        // setFundamentalDomain([]);
        setN("");
        setErrorMessage('');
        // hyperbolicPolygonDrawing = hyperbolicPolygon;
        // console.log('testing what the sorted value is', hyperbolicPolygonDrawing);
        // }
        // setHyperbolicPolygon( !drawingMode ? hyperbolicPolygonDrawing : [] )
        setDrawingMode(!drawingMode)
        setGammaType('Gamma Options')
        setIsInteger(false);
        // setHyperbolicPolygon(prevPolygon => !drawingMode ? hyperbolicPolygonDrawing : []);
        forceRedraw();
    }

    const handleNumberClick = (index,event) => {
        // event.stopPropagation();
        // isAddingRef.current =false;
        if (clickedNumberIndex === index) {
            setClickedNumberIndex(null);
            // setIsAdding(false); 
        } else {
            setClickedNumberIndex(index);
            setIsAdding(false);
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
        setIsAdding(true);
    };
    
    
    const handleClickOutside = (event) => {
       console.log('click')
        if (safeAreaRef.current && !safeAreaRef.current.contains(event.target)) {
            console.log('clicked outside')
            setClickedNumberIndex(null);
            setIsAdding(false);
        }
    };
    

    React.useEffect(() => {
        // Attach the click listener to the document
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
          // Remove the listener when the component unmounts
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, []); 
   

    const handleNewNumberSubmit = () => {
        let updatedPolygon = [...hyperbolicPolygon];
        updatedPolygon.splice(clickedNumberIndex, 0, newNumber); // Inserting new number at the clicked index
        setHyperbolicPolygon(updatedPolygon);
        setNewNumber('');
        setIsAdding(false);
        setClickedNumberIndex(null);
    };

    const plusIconClick = () => {
        setShowInput(true);
    };


    const minusIconClick = (complex) => {
        if (showInput) {
            setShowInput(false);
        }
    
    }

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
            // if(value.includes('+')) {
            const parts = value.split('+');
            const realPart = parts[0].replace(/\s+/g, '');
            let imaginaryPart = parts[1].replace('i', '').replace(/\s+/g, '');
            imaginaryPart = (imaginaryPart === '') ? '1' : imaginaryPart;
            let complexForm = stringToComplex(realPart, imaginaryPart);
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
    }

    const buttonClasses = drawingMode 
        ? "bg-purple-500 hover:bg-purple-700 text-white font-bold text-sm py-2 px-4 rounded-full"
        : "bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 rounded-full";

    const footerClasses = drawingMode 
        ? "fixed bottom-0 left-0 w-screen m-0 h-20 rounded-t-lg bg-purple-800 text-gray-300 shadow-lg px-5 py-5"
        : "fixed bottom-0 left-0 w-screen m-0 h-auto rounded-t-lg bg-gray-900 text-gray-300 shadow-lg px-5 py-3 ";

    return (
      <div className={footerClasses}> 
        
            <button 
                className={buttonClasses}
                onClick={modeSwtiching}
            >
                {drawingMode ? 'Drawing' : 'Fundamental Domains'}
            </button>
            
            {drawingMode ? (
                <div style={{ display: 'inline-block' }} className='px-5'>
                  Hyperbolic Polygon input 
                  

                  <div style = {{display: 'inline-block' }} className='px-9' ref={safeAreaRef} key='safe area'>
    
                    {hyperbolicPolygon.map((complex, index) => (
                        
                        <div  style={{ display: 'inline-block' }}  key={index} >

            {clickedNumberIndex === index 
            ? (
                <div>
                    { (isAdding )//&& showInput)
                        ? ( <div style={{display: 'inline-block'}}>
                        <input
                            className='flex rounded-full shadow-lg bg-purple-800 ring-1 ring-white text-white'
                            style={{ fontFamily: "'STIX Two Text', serif", display: 'inline-block' }}
                            placeholder="a + b i" 
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    handleInput(event.target.value, index);
                                    // setShowInput(false);  
                                }
                            }}
                        />
                        <InlineMath math='  , ' />
                        </div>
                        )
                        :
                        (
                        <div style={{display: 'inline-flex'}}>
                            <button style={{display: 'inline-block' }} onClick={handleDeleteClick}>
                                <AiOutlineMinusCircle style={{ display: 'inline-block' }} size='25'/>
                            </button>
                            <button style={{display: 'inline-block' }} onClick={handleAddClick}>
                                <AiOutlinePlusCircle style={{ display: 'inline-block' }} size='25'/>
                            </button>
                            <InlineMath math='  , ' />
                        </div>
                        )
                    }
                </div>
            ) 
            : (
                <div style={{display:'inline-block'}} onClick={(event) => handleNumberClick(index,event)} >
                    {latexInput(complex)} 
                </div>
            ) 
            
        }                   
    </div>
))}


                 </div>
            
                {
                    (!isAdding && showInput) &&
                    <input
                        className='flex rounded-full shadow-lg bg-purple-800 ring-1 ring-white text-white'
                        style={{ fontFamily: "'STIX Two Text', serif", display: 'inline-block' }}
                        placeholder=" a + b i" 
                        onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                                handleInput(event.target.value, hyperbolicPolygon.length);  // you can define this function to process the input
                                // setShowInput(false);  // hide the input after processing
                            }
                        }}
                    />
                }
                  <button onClick={minusIconClick} className='px-5'>
                    <AiOutlineMinusCircle style={{ display: 'inline-block' }}  size='25'/>
                  </button>

                  <button onClick={plusIconClick} className=''>
                    <AiOutlinePlusCircle style={{ display: 'inline-block' }} size='25'/>
                  </button>

                  { errorMessage && (
                    <div style={{ display: 'inline-block' }}>
                     {errorMessage}
                    </div>
                    )
                  }

                </div>
                
            ) : (
                <div style={{ display: 'inline-block' , alignItems: 'center'}} className='inline-flex px-5 bg-grey-900 text-gray-300'>
                    {/* <div className='' style={{display: 'inline-block'}}> */}
                    <GammaOptions 
                      gammaType={gammaType} 
                      setGammaType={setGammaType} 
                      N={N} 
                      setN={setN} 
                      isInteger={isInteger}
                      setIsInteger={setIsInteger}
                      errorMessage={errorMessage}
                      setErrorMessage={setErrorMessage}
                      
                    />
                
                    {gammaType !== 'Gamma Options' && isInteger && (
                    //     <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', maxWidth: '100%' }}>
                    //     <div style={{ display: 'inline-block', whiteSpace: 'nowrap' }} className=' px-5 '>
                    //         <div className=' py-2'>
                    //             Farey Symbols = <InlineMath math={fareyString} />
                    //         </div>
                    //     </div>
                        
                    //     <div style={{ display: 'inline-block', whiteSpace: 'nowrap' }} className='px-0 py-5 '>
                    //         <div className='flex py-2'>
                    //             Generators =<InlineMath math={generatorsString} />
                    //         </div>
                    //     </div>
                    // </div>
                    
                    <div style={{ display: 'inline-flex', alignItems: 'center', overflowX: 'auto', whiteSpace: 'nowrap'}} className=' '>

                        <div style={{ display: 'inline-block' }} className=' px-5 '>
                            <div style={{ display: 'inline-block' }} className=' py-2'>
                                Farey Symbols = <InlineMath math={fareyString} />
                            </div>
                        </div>
                        
                        <div style={{ display: 'inline-block' }} className='px-0 py-5 '>
                            <div style={{ display: 'inline-block' }} className='flex py-2'>
                                 Generators =<InlineMath math={generatorsString} />
                            </div>
                        </div>
                        
                    </div>

                    )}
                </div>
            )}
        </div>
    );
}




export default Footer;


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
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

//move to maths
// Function to compute the GCD (greatest common divisor) of two numbers
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




function parseValue(value) {
    // If the value contains '/', it's a fraction
    if (value.includes('/')) {
        const [numerator, denominator] = value.split('/').map(v => parseFloat(v.trim()));
        return numerator / denominator;
    }
    // Otherwise, just parse it as a float and return
    return parseFloat(value);
}
  
function GammaOptions({ gammaType, setGammaType, N, setN, isInteger, setIsInteger, errorMessage, setErrorMessage }) {
    const [liveInput, setLiveInput] = useState("");

    // Calculate width based on content
    const inputWidth = N.length ? `${N.length + 2}ch` : '2ch';  // "ch" is a unit that represents the width of the "0" character of the element's font.

    const handleGammaClick = (gammaValue) => {
        setGammaType(gammaValue);
        setErrorMessage('');
    }


    function isValueInteger(value) {
        setIsInteger(/^\d+$/.test(value))
        return /^\d+$/.test(value); 
    }

    const handleInputChange = (event) => {
        const value = event.target.value;

        // Only update the state if it's an empty string or an integer make this just an integer
        if (/^\d+$/.test(value)) {      // value === "" || 
            setN(value);
        }
    }

    const GammaClasses =  (gammaType === 'Gamma Options')
    ?   "inline-flex w-full justify-center gap-x-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-blue-500"
    :   "inline-fixed w-10 justify-center gap-x-1.5 rounded-full bg-gray-900 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-800"   

    return (
        <div style={{display: 'inline-block', alignItems: 'center'}} className=' inline-block bg-gray-900 rounded-lg text-gray-300 text-lg'>
      <Menu as="div" className="relative inline-block text-left text-lg ">
        <div>
          <Menu.Button className={GammaClasses}>
            {/* <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" /> */}
           
                { (gammaType === 'Gamma Options') 
                ? 'Gamma Options' :( 
                 <div className='text-lg text-gray-300'>
                    <InlineMath math = {gammaType} /> 
                </div>
                )}
                            
            
            
          </Menu.Button>
          {/* <span className="mx-2">=</span> */}
          
        
        </div>
  
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          {/* <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"> */}
          <Menu.Items className="absolute right-0 bottom-full z-10 mb-2 w-56 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1 text-lg">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={() => {handleGammaClick('\\Gamma')
                                    setN('')
                                    setIsInteger(false)
                                }}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    <InlineMath math='\Gamma' />
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={() => {handleGammaClick('\\Gamma_0')
                                    setN('')
                                    setIsInteger(false)
                                }}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    <InlineMath math='\Gamma_0' />
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={() => {handleGammaClick('\\Gamma_1')
                                    setN('')
                                    setIsInteger(false)
                                }}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    <InlineMath math='\Gamma_1' />
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={() => {
                        handleGammaClick('\\Gamma^0')
                        setN('')
                        setIsInteger(false)
                        } }
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    <InlineMath math='\Gamma^0' />
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    onClick={() => {handleGammaClick('\\Gamma^1')
                                setN('')
                                setIsInteger(false)
                            }}
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    <InlineMath math='\Gamma^1' />
                  </a>
                )}
              </Menu.Item>

            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      
      { (gammaType !== 'Gamma Options' ) && (
    <>
        <InlineMath math='(' />
        <input 
            type="" 
            value={liveInput} 
            onChange={(e) => {
                setLiveInput(e.target.value); // Update the live input value as user types
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && isValueInteger(liveInput) ) {
                    if (gammaType == '\\Gamma' && parseInt(liveInput,10) < 7){ setN(liveInput); setErrorMessage('');}
                    else if (gammaType != '\\Gamma' && parseInt(liveInput,10) < 21 ) {setN(liveInput); setErrorMessage(''); }
                    else {
                        setIsInteger(false);
                        setN("");
                        setErrorMessage('You have choosen a N to large. It is currently capped at 20 and 7 depending on the Gamma type');  
                        }
                }
            }}
            style={{ width: 15 + 10 * liveInput.length }}  // Dynamically set width here
            className="text-gray-300 rounded-md p-2 text-sm bg-gray-900"
            // placeholder="Enter integer" 
        />
        <InlineMath math=')' />
           {errorMessage}
    </>
)}

      </div>
     
    )
  }


  const arraysAreEqual = (arr1, arr2) => 
    Array.isArray(arr1) && 
    Array.isArray(arr2) && 
    arr1.length === arr2.length && 
    arr1.every((value, index) => value === arr2[index]);



    
    