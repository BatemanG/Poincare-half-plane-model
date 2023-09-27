// External Imports
import React, { useState, useEffect } from 'react';

// Internal Imports
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Canvas from './components/Canvas';
import { ModeProvider } from './ModeContext';
import { determineFareySymbols } from './oldBackend/FareySymbols';

export default function App() {
    // Initial Values
    const initialHyperbolicPolygon = [
        [-1, 0, 1],
        [0, 3, 1],
        [2, 2, 1],
        [1, 1, 1]
    ];

    // State Management
    const [hyperbolicPolygon, setHyperbolicPolygon] = useState(initialHyperbolicPolygon);
    const [fundamentalDomain, setFundamentalDomain] = useState([]);
    const [drawingMode, setDrawingMode] = useState(false);
    const [redrawTrigger, setRedrawTrigger] = useState(false);
    const [gammaType, setGammaType] = useState('Gamma Options');
    const [fareySymbols, setFareySymbols] = useState();
    const [N, setN] = useState("");
    const [fareyString, setFareyString] = useState('');
    const [generatorsString, setGeneratorsString] = useState('');

    const polygon = drawingMode ? hyperbolicPolygon : fundamentalDomain;

    // Gamma type mapping
    const gammaTypeMapping = {
        '\\Gamma': 'gammaN',
        '\\Gamma^0': 'gammaU0N',
        '\\Gamma^1': 'gammaU1N',
        '\\Gamma_0': 'gammaL0N',
        '\\Gamma_1': 'gammaL1N'
    };

    // Effect to determine Farey Symbols
    useEffect(() => {
        if (N) {
            const results = determineFareySymbols(parseInt(N), gammaTypeMapping[gammaType]);
            const [fareyResult, links, , generators] = results;

            setFareySymbols(fareyResult);
            setFundamentalDomain(FareyToPolynomial(fareyResult));
            setFareyString(fareyToString(fareyResult, links));
            setGeneratorsString(generatorToString(generators));
            forceRedraw();
        }
    }, [N, gammaType]);

    // Force a redraw
    const forceRedraw = () => {
        setRedrawTrigger(prev => !prev);
    };

    return (
        <ModeProvider>
            <div className='flex w-screen h-screen'>
                <Header drawingMode={drawingMode} />
                <main className='mt-16 mb-16 w-screen'>
                    <Canvas
                        hyperbolicPolygon={hyperbolicPolygon}
                        setHyperbolicPolygon={setHyperbolicPolygon}
                        drawingMode={drawingMode}
                        setDrawingMode={setDrawingMode}
                        redraw={redrawTrigger}
                        gammaType={gammaType}
                        fundamentalDomain={fundamentalDomain}
                        polygon={polygon}
                    />
                </main>
                <footer>
                    <Footer
                        hyperbolicPolygon={hyperbolicPolygon}
                        setHyperbolicPolygon={setHyperbolicPolygon}
                        drawingMode={drawingMode}
                        setDrawingMode={setDrawingMode}
                        forceRedraw={forceRedraw}
                        gammaType={gammaType}
                        setGammaType={setGammaType}
                        fundamentalDomain={fundamentalDomain}
                        setFundamentalDomain={setFundamentalDomain}
                        fareySymbols={fareySymbols}
                        setFareySymbols={setFareySymbols}
                        N={N}
                        setN={setN}
                        fareyString={fareyString}
                        generatorsString={generatorsString}
                    />
                </footer>
            </div>
        </ModeProvider>
    );
}

// Convert Farey array to polynomial
function FareyToPolynomial(fareyArray) {
    return fareyArray.slice(0, -1).map(num => [num[0], 0, num[1]]);
}

// Convert Farey and links to string
function fareyToString(farey, links) {
    let fareyStr = `\\infty \\underset{${links[0]}} \\smile`;
    for (let i = 1; i < farey.length - 1; i++) {
        fareyStr += `\\frac{${farey[i][0]}}{${farey[i][1]}} `;
        if (i !== farey.length - 1) {
            fareyStr += `\\underset{${links[i]}}\\smile `;
        }
    }
    return fareyStr + '\\infty';
}

// Convert generators to string
function generatorToString(generators) {
    return generators.map(matrix => `\\begin{pmatrix} ${matrix[0]} & ${matrix[1]} \\\\ ${matrix[2]} & ${matrix[3]} \\end{pmatrix}`).join(',  ');
}

