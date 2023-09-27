import React, { useState, useRef ,Fragment} from 'react';
import { Menu, Transition } from '@headlessui/react';
import { InlineMath } from 'react-katex';
import { AiOutlinePlusCircle, AiOutlineMinusCircle } from 'react-icons/ai';

import DrawingMode from './DrawingMode';
import FundamentalDomainMode from './FundamentalDomainMode';

export default function Footer({hyperbolicPolygon, setHyperbolicPolygon, drawingMode, setDrawingMode,forceRedraw, gammaType, setGammaType, fareySymbols, setFareySymbols, N, setN, fundamentalDomain, setFundamentalDomain, generatorsString, fareyString}) {
  const [errorMessage, setErrorMessage] = useState(null);
  const [newNumber, setNewNumber] = useState('');
  


  const modeSwitching = () => {
    setFundamentalDomain([]);
    setN("");
    setErrorMessage("");
    setDrawingMode(!drawingMode);
    setGammaType('Gamma Options');
    // setIsInteger(false);
    forceRedraw();
  };


  const footerClasses = drawingMode 
        ? "fixed bottom-0 left-0 w-screen m-0 h-20 rounded-t-lg bg-purple-800 text-gray-300 shadow-lg px-5 py-5"
        : "fixed bottom-0 left-0 w-screen m-0 h-auto rounded-t-lg bg-gray-900 text-gray-300 shadow-lg px-5 py-3 ";

  return (
    <div className={footerClasses}>
      <div className='inline-flex items-center max-w-[calc(100%-100px)]'>        
      
      <ModeSwitchButton drawingMode={drawingMode} modeSwitching={modeSwitching}/>
    
      {drawingMode ? (
                <DrawingMode 
                    hyperbolicPolygon={hyperbolicPolygon}
                    setHyperbolicPolygon={setHyperbolicPolygon}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                />
            ) : (
                <FundamentalDomainMode 
                    gammaType={gammaType}
                    setGammaType={setGammaType}
                    N={N}
                    setN={setN}
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    generatorsString={generatorsString}
                    fareyString={fareyString}
                />
            )
      }
      </div>
    </div>
  )
}



function ModeSwitchButton({ drawingMode, modeSwitching }) {
  const buttonClasses = drawingMode 
      ? "bg-purple-500 hover:bg-purple-700 text-white font-bold text-sm py-2 px-4 rounded-full"
      : "bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 rounded-full";
  return (
    <button className={buttonClasses} onClick={modeSwitching}>
      {drawingMode ? 'Drawing' : 'Fundamental Domains'}
    </button>
  )
}


