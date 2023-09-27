// External Imports
import React from 'react';
import Logo from '../imgs/logo.png';

const Header = ({ drawingMode }) => {
    // Determine header style based on drawing mode
    const headerStyle = `fixed top-0 left-0 w-screen m-0 h-16 flex flex-row shadow-lg ${drawingMode ? 'bg-purple-800' : 'bg-gray-900'} text-white`;

    return (
        <div className={headerStyle}>
            <div className='fixed top-5 left-10 items-center'>
                Upper Half View of the Hyperbolic Plane by George Bateman
                   
            </div>
            <div>
               <img src={Logo} alt="logo"  className='absolute top-4 right-4 h-8 w-auto' /> 
            </div>
             
            
        </div>
    );
}

export default Header;

