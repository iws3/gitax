"use client";
import React, { useState, useEffect, useCallback, FC } from 'react';
import { Target, BarChart2, Download, ChevronsRight, ToggleLeft, ToggleRight, Calculator, PlusCircle, RotateCcw } from 'lucide-react';
import FileUpload from './FileUpload';
import { downloadCSV } from '@/lib/utils/csvHelper';
// import { downloadCSV } from '../utils/csvHelper'; // We will create this helper file

// --- TYPE DEFINITIONS ---
type DataPoint = Record<string, any>;
interface Point2D { x: number; y: number; }
interface SupervisedPoint extends Point2D { predicted?: number; }
interface SupervisedModel { slope: number; intercept: number; rSquared: number | null; }

// --- UI SUB-COMPONENTS ---
const SectionHeader: FC<{ title: string; Icon: React.ElementType }> = ({ title, Icon }) => (
    <div className="flex items-center gap-4"><div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20"><Icon size={28} className="text-blue-400" /></div><h3 className="text-2xl lg:text-3xl font-bold text-slate-100">{title}</h3></div>
);

// --- MAIN COMPONENT ---
const SupervisedLearningTab: FC = () => {
    const [mode, setMode] = useState<'demo' | 'real'>('demo');
    
    // Demo State
    const [demoData, setDemoData] = useState<SupervisedPoint[]>([]);
    const [demoModel, setDemoModel] = useState({ slope: 1, intercept: 0 });
    const [manualX, setManualX] = useState('');
    const [manualY, setManualY] = useState('');

    // Real Data State
    const [allData, setAllData] = useState<DataPoint[]>([]);
    const [numericHeaders, setNumericHeaders] = useState<string[]>([]);
    const [feature, setFeature] = useState('');
    const [target, setTarget] = useState('');
    const [model, setModel] = useState<SupervisedModel | null>(null);
    const [predictionInput, setPredictionInput] = useState('');
    const [predictionOutput, setPredictionOutput] = useState<number | null>(null);

    // --- LOGIC ---
    const calculateMse = useCallback((data: Point2D[], slope: number, intercept: number) => {
        if (data.length === 0) return 0;
        const sse = data.reduce((sum, point) => sum + (point.y - (slope * point.x + intercept)) ** 2, 0);
        return sse / data.length;
    }, []);

    const generateDemoData = useCallback(() => {
        const data: Point2D[] = [];
        const trueSlope = Math.random() * 4 - 2;
        const trueIntercept = Math.random() * 10 - 5;
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * 20;
            const y = trueSlope * x + trueIntercept + (Math.random() - 0.5) * 8;
            data.push({ x, y });
        }
        setDemoData(data);
    }, []);

    useEffect(() => { generateDemoData(); }, [generateDemoData]);

    const addDemoPoint = () => {
        const x = parseFloat(manualX);
        const y = parseFloat(manualY);
        if (!isNaN(x) && !isNaN(y)) {
            setDemoData(prev => [...prev, { x, y }]);
            setManualX('');
            setManualY('');
        }
    };

    const handleFileUpload = (data: DataPoint[], headers: string[], numeric: string[]) => {
        setAllData(data);
        setNumericHeaders(numeric);
        setFeature(numeric[0]);
        setTarget(numeric[1] || numeric[0]);
        setModel(null);
        setPredictionInput('');
        setPredictionOutput(null);
    };

    const runAnalysis = useCallback(() => {
        if (!feature || !target || allData.length < 2) {
            alert("Please select valid Feature and Target columns with enough data.");
            return;
        }
        const data = allData.map(d => ({ x: d[feature], y: d[target] })).filter(d => typeof d.x === 'number' && typeof d.y === 'number');
        if (data.length < 2) { alert("Not enough numeric data points for analysis."); return; }
        const n = data.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
        for (const p of data) { sumX += p.x; sumY += p.y; sumXY += p.x * p.y; sumXX += p.x * p.x; sumYY += p.y * p.y; }
        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        const rNum = (n * sumXY - sumX * sumY);
        const rDen = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
        const rSquared = rDen === 0 ? 0 : (rNum / rDen) ** 2;
        setModel({ slope, intercept, rSquared });
    }, [allData, feature, target]);
    
    const makePrediction = () => {
        if (!model || predictionInput === '') return;
        const inputVal = parseFloat(predictionInput);
        if (!isNaN(inputVal)) setPredictionOutput(model.slope * inputVal + model.intercept);
    };
    
    const exportData = () => {
        if (!model || allData.length === 0) return;
        const content = allData.map(row => ({ ...row, [`predicted_${target}`]: (model.slope * row[feature] + model.intercept).toFixed(4) }));
        const headers = Object.keys(content[0]).join(',');
        const rows = content.map(row => Object.values(row).join(',')).join('\n');
        downloadCSV(`${headers}\n${rows}`, `analyzed_${target}_prediction.csv`);
    };

    // --- PLOTTING ---
    const dataForPlot = mode === 'real' ? allData.map(d => ({ x: d[feature], y: d[target] })).filter(d => typeof d.x === 'number' && typeof d.y === 'number') : demoData;
    const currentModel = mode === 'real' ? model : { slope: demoModel.slope, intercept: demoModel.intercept, rSquared: null };
    const xVals = dataForPlot.map(d => d.x), yVals = dataForPlot.map(d => d.y);
    const xDomain = { min: Math.min(...xVals), max: Math.max(...xVals) };
    const yDomain = { min: Math.min(...yVals), max: Math.max(...yVals) };
    const toSVGX = (x: number) => xDomain.max === xDomain.min ? 200 : 20 + ((x - xDomain.min) / (xDomain.max - xDomain.min)) * 360;
    const toSVGY = (y: number) => yDomain.max === yDomain.min ? 125 : 230 - ((y - yDomain.min) / (yDomain.max - yDomain.min)) * 210;
    
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <SectionHeader Icon={Target} title="Supervised Learning: Regression" />
                <div className="flex items-center gap-2 p-1 bg-slate-700/50 rounded-lg self-end sm:self-center">
                    <button onClick={() => setMode('demo')} className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${mode === 'demo' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700'}`}><ToggleLeft/> Demo Mode</button>
                    <button onClick={() => setMode('real')} className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${mode === 'real' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700'}`}><ToggleRight/> Real Data</button>
                </div>
            </div>

            {/* --- PLOT AREA --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold text-slate-300 mb-3 text-xl">📊 Analysis Plot</h4>
                    <div className="bg-slate-900/50 p-4 border border-slate-700 rounded-lg shadow-inner h-96 relative">
                        {dataForPlot.length > 0 ? (
                            <svg width="100%" height="100%" viewBox="0 0 400 250">
                                <rect width="100%" height="100%" fill="none" />
                                {dataForPlot.map((p, i) => <circle key={i} cx={toSVGX(p.x)} cy={toSVGY(p.y)} r="3.5" fill="#3b82f6" opacity="0.6" />)}
                                {currentModel && <line x1={toSVGX(xDomain.min)} y1={toSVGY(currentModel.slope * xDomain.min + currentModel.intercept)} x2={toSVGX(xDomain.max)} y2={toSVGY(currentModel.slope * xDomain.max + currentModel.intercept)} stroke="#ef4444" strokeWidth="2.5"/>}
                            </svg>) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500"><BarChart2 size={48} className="mb-4"/><p>No Data to Display</p><p className="text-sm">{mode === 'real' ? 'Upload a CSV to begin analysis.' : 'Click "Generate Data".'}</p></div>
                        )}
                    </div>
                </div>

                {/* --- CONTROLS AREA --- */}
                {mode === 'demo' ? (
                    <div className="space-y-6">
                        <h4 className="font-semibold text-slate-300 mb-3 text-xl">⚙️ Demo Controls</h4>
                        <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg shadow-inner space-y-4">
                            <div><label>Slope: {demoModel.slope.toFixed(2)}</label><input type="range" min="-5" max="5" step="0.05" value={demoModel.slope} onChange={e => setDemoModel(p => ({...p, slope: +e.target.value}))} className="w-full accent-blue-500"/></div>
                            <div><label>Intercept: {demoModel.intercept.toFixed(2)}</label><input type="range" min="-20" max="20" step="0.1" value={demoModel.intercept} onChange={e => setDemoModel(p => ({...p, intercept: +e.target.value}))} className="w-full accent-blue-500"/></div>
                            <div><p><strong>Mean Squared Error (MSE):</strong> {calculateMse(demoData, demoModel.slope, demoModel.intercept).toFixed(3)}</p></div>
                        </div>
                        <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg shadow-inner space-y-3">
                            <h5 className="font-semibold text-slate-300 text-lg">Add a Point</h5>
                            <div className="flex gap-2"><input type="number" value={manualX} onChange={e => setManualX(e.target.value)} placeholder="X value" className="flex-grow p-2 bg-slate-700 border border-slate-600 rounded-md" /><input type="number" value={manualY} onChange={e => setManualY(e.target.value)} placeholder="Y value" className="flex-grow p-2 bg-slate-700 border border-slate-600 rounded-md" /></div>
                            <button onClick={addDemoPoint} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium bg-green-600 text-white hover:bg-green-500"><PlusCircle size={18}/>Add Point</button>
                        </div>
                        <button onClick={generateDemoData} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium bg-slate-600 text-white hover:bg-slate-500"><RotateCcw size={18}/>Generate New Demo Data</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h4 className="font-semibold text-slate-300 mb-3 text-xl">⚙️ Real Data Workflow</h4>
                        <div className="space-y-2"><h5 className="font-semibold text-slate-400">1. Upload CSV</h5><FileUpload onFileProcessed={handleFileUpload}/></div>
                        {allData.length > 0 && (<>
                            <div className="space-y-2"><h5 className="font-semibold text-slate-400">2. Select Columns</h5>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="text-sm">Feature (X-axis)</label><select value={feature} onChange={e => setFeature(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md mt-1">{numericHeaders.map(h => <option key={h} value={h}>{h}</option>)}</select></div>
                                    <div><label className="text-sm">Target (Y-axis)</label><select value={target} onChange={e => setTarget(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md mt-1">{numericHeaders.filter(h => h !== feature).map(h => <option key={h} value={h}>{h}</option>)}</select></div>
                                </div>
                            </div>
                            <div className="space-y-2"><h5 className="font-semibold text-slate-400">3. Run Analysis</h5><button onClick={runAnalysis} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-500"><Calculator size={18}/>Run Regression</button></div>
                            {model && (
                                <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg shadow-inner space-y-2">
                                    <h5 className="font-semibold text-slate-300 text-lg">Results</h5>
                                    <p><strong>R-Squared:</strong> <span className="font-mono text-green-400">{model.rSquared!.toFixed(4)}</span> (Explains {(model.rSquared! * 100).toFixed(2)}% of variance)</p>
                                    <p><strong>Equation:</strong> <span className="font-mono text-cyan-400">y = {model.slope.toFixed(3)}x + {model.intercept.toFixed(3)}</span></p>
                                </div>
                            )}
                            {model && (
                                <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg shadow-inner space-y-2">
                                    <h5 className="font-semibold text-slate-300 text-lg">4. Make a Prediction</h5>
                                    <p className="text-sm text-slate-400">Enter a value for <span className="font-bold text-cyan-400">{feature}</span> to predict <span className="font-bold text-green-400">{target}</span>.</p>
                                    <div className="flex items-center gap-2">
                                        <input type="number" value={predictionInput} onChange={e => setPredictionInput(e.target.value)} placeholder={`Enter ${feature}...`} className="flex-grow p-2 bg-slate-700 border border-slate-600 rounded-md"/>
                                        <button onClick={makePrediction} className="p-2 bg-blue-600 rounded-md hover:bg-blue-500"><ChevronsRight/></button>
                                    </div>
                                    {predictionOutput !== null && <p className="mt-2 text-lg">Predicted <span className="font-bold text-green-400">{target}</span>: <span className="font-mono text-xl">{predictionOutput.toFixed(3)}</span></p>}
                                </div>
                            )}
                             {model && (
                                <div className="space-y-2"><h5 className="font-semibold text-slate-400">5. Export</h5><button onClick={exportData} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium bg-green-600 text-white hover:bg-green-500"><Download size={18}/>Export Analyzed Data</button></div>
                            )}
                        </>)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupervisedLearningTab;