import React, { useState, useRef ,Fragment} from 'react';
import { Menu, Transition } from '@headlessui/react';
import { InlineMath } from 'react-katex';


export default function FundamentalDomainMode({gammaType, setGammaType, N, setN, generatorsString, fareyString, errorMessage, setErrorMessage, footerClasses, drawingMode, modeSwitching}) {
    const [isInteger, setIsInteger] = useState(false);
    return (
     <div className='flex items-center px-5 bg-grey-900 text-gray-300 w-full'>
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
          <div className=' flex-grow overflow-x-auto'>
          <FundametnalDomainResults
            generatorsString={generatorsString}
            fareyString={fareyString}  
          />
          </div>
        )}
      </div>
    )
  }
  
  function FundametnalDomainResults({generatorsString, fareyString}) {
    return (
    <div style={{ display: 'inline-flex', alignItems: 'center', height: '50px' }} className='whitespace-nowrap py-2  overflow-y-hidden  '>
  
        <div style={{ display: 'inline-block' }} className=' px-5 whitespace-nowrap'>
            <div style={{ display: 'inline-block' }} className=' py-2'>
                Farey Symbols = <InlineMath math={fareyString} />
            </div>
        </div>
                          
        <div style={{ display: 'inline-block' }} className='px-0 py-5 whitespace-nowrap'>
            <div style={{ display: 'inline-block' }} className='flex py-2'>
                 Generators =<InlineMath math={generatorsString} />
            </div>
        </div>
                          
      </div>
    )
  }
  
  
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }


  
function GammaOptions({ gammaType, setGammaType, N, setN, isInteger, setIsInteger, errorMessage, setErrorMessage }) {
    const gammaValues = ['\\Gamma', '\\Gamma_0', '\\Gamma_1', '\\Gamma^0', '\\Gamma^1'];
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
       <div style={{display: 'inline-block', alignItems: 'center', position: 'relative'}} className=' flex items-center bg-gray-900 rounded-lg text-gray-300 text-lg'>
      <Menu as="div" className="relative inline-block text-left text-lg ">
          <Menu.Button className={GammaClasses}>
           
                { (gammaType === 'Gamma Options') 
                ? 'Gamma Options' :( 
                 <div className='text-lg text-gray-300'>
                    <InlineMath math = {gammaType} /> 
                </div>
                )}
                      
          </Menu.Button>
    
  
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 bottom-full z-30 mb-2 w-15 origin-bottom-right rounded-md bg-white shadow-lg ring-1   ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1 text-lg ">
             
              {gammaValues.map((gamma) => (
                <Menu.Item key={gamma}>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={() => {
                        handleGammaClick(gamma);
                        setN('');
                        setIsInteger(false);
                      }}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      <InlineMath math={gamma} />
                    </a>
                  )}
                </Menu.Item>
              ))}
    
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
      
      { (gammaType !== 'Gamma Options' ) && (
    <div className='flex items-center whitespace-nowrap' style={{display: 'inline-block'}}>
        <InlineMath math='(' className='whitespace-nowrap'/>
        <input 
            type="" 
            value={liveInput} 
            onChange={(e) => {
                setLiveInput(e.target.value); // Update the live input value as user types
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && isValueInteger(liveInput) ) {
                    if (gammaType == '\\Gamma' && parseInt(liveInput,10) < 15){ setN(liveInput); setErrorMessage('');}
                    else if (gammaType != '\\Gamma' && parseInt(liveInput,10) < 21 ) {setN(liveInput); setErrorMessage(''); }
                    else {
                        setIsInteger(false);
                        setN("");
                        setErrorMessage('You have choosen a N to large. It is currently capped at 20 and 14 depending on the Gamma type');  
                        }
                }
            }}
            style={{ width: 15 + 10 * liveInput.length }}  // Dynamically set width here
            className="text-gray-300 rounded-md p-2 text-sm bg-gray-900"
            // placeholder="Enter integer" 
        />
        <InlineMath math=')' className='whitespace-nowrap'/>
           {errorMessage}
    </div>
  )}
  
      </div>
     
    )
  };