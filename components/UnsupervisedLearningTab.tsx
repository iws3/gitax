"use client";
import React, { useState, useEffect, useCallback, FC, useRef } from 'react';
import { Brain, BarChart2, ToggleLeft, ToggleRight, Play, Pause, RotateCcw } from 'lucide-react';
import FileUpload from './FileUpload';

// --- TYPE DEFINITIONS ---
type DataPoint = Record<string, any>;
interface Point2D { x: number; y: number; }
interface UnsupervisedPoint extends Point2D { cluster: number | null; }
interface ClusterCenter extends Point2D { color: string; }

// --- UI SUB-COMPONENTS ---
const SectionHeader: FC<{ title: string; Icon: React.ElementType }> = ({ title, Icon }) => (
    <div className="flex items-center gap-4"><div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20"><Icon size={28} className="text-blue-400" /></div><h3 className="text-2xl lg:text-3xl font-bold text-slate-100">{title}</h3></div>
);

// --- MAIN COMPONENT ---
const UnsupervisedLearningTab: FC = () => {
    const [mode, setMode] = useState<'demo' | 'real'>('demo');
    const [isPlaying, setIsPlaying] = useState(false);

    // Demo State
    const [demoData, setDemoData] = useState<UnsupervisedPoint[]>([]);
    
    // Real Data State
    const [allData, setAllData] = useState<DataPoint[]>([]);
    const [numericHeaders, setNumericHeaders] = useState<string[]>([]);
    const [featureX, setFeatureX] = useState('');
    const [featureY, setFeatureY] = useState('');

    // Shared State
    const [dataToCluster, setDataToCluster] = useState<UnsupervisedPoint[]>([]);
    const [clusters, setClusters] = useState<ClusterCenter[]>([]);
    const [numClusters, setNumClusters] = useState(3);
    // @ts-ignore
    const iterationRef = useRef<NodeJS.Timeout>();

    // --- LOGIC ---
    const generateDemoData = useCallback(() => {
        const data: UnsupervisedPoint[] = [];
        const baseCenters: Point2D[] = [];
        for(let i=0; i < numClusters; i++){ baseCenters.push({x: Math.random()*20, y: Math.random()*20}); }
        baseCenters.forEach(center => {
            for (let i = 0; i < 30; i++) {
                data.push({ x: center.x + (Math.random() - 0.5) * 8, y: center.y + (Math.random() - 0.5) * 8, cluster: null });
            }
        });
        setDataToCluster(data);
    }, [numClusters]);

    useEffect(() => {
        if (mode === 'demo') generateDemoData();
    }, [mode, generateDemoData]);

    const handleFileUpload = (data: DataPoint[], headers: string[], numeric: string[]) => {
        setAllData(data);
        setNumericHeaders(numeric);
        setFeatureX(numeric[0]);
        setFeatureY(numeric[1] || numeric[0]);
    };

    useEffect(() => {
        if (mode === 'real' && featureX && featureY && allData.length > 0) {
            const points = allData.map(d => ({ x: d[featureX], y: d[featureY], cluster: null })).filter(p => typeof p.x === 'number' && typeof p.y === 'number');
            setDataToCluster(points);
        }
    }, [mode, allData, featureX, featureY]);
    
    const initializeClusters = useCallback(() => {
        if (dataToCluster.length === 0) return;
        setIsPlaying(false);
        const xVals = dataToCluster.map(p => p.x), yVals = dataToCluster.map(p => p.y);
        const minX = Math.min(...xVals), maxX = Math.max(...xVals), minY = Math.min(...yVals), maxY = Math.max(...yVals);
        const baseColors = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ef4444', '#eab308'];
        setClusters(Array.from({ length: numClusters }, (_, i) => ({
            x: minX + Math.random() * (maxX - minX), y: minY + Math.random() * (maxY - minY), color: baseColors[i % baseColors.length]
        })));
        setDataToCluster(prev => prev.map(p => ({...p, cluster: null})));
    }, [numClusters, dataToCluster]);

    useEffect(() => { initializeClusters(); }, [initializeClusters]);

    const runKMeansIteration = useCallback(() => {
        if (clusters.length === 0) return;
        setDataToCluster(currentData => {
            const updatedData = currentData.map(point => {
                let minDistance = Infinity, assignedCluster = null;
                clusters.forEach((center, index) => {
                    const dist = Math.sqrt((point.x - center.x)**2 + (point.y - center.y)**2);
                    if (dist < minDistance) { minDistance = dist; assignedCluster = index; }
                });
                return { ...point, cluster: assignedCluster };
            });
            const newClusters = clusters.map((center, index) => {
                const clusterPoints = updatedData.filter(p => p.cluster === index);
                if (clusterPoints.length === 0) return center;
                const avgX = clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length;
                const avgY = clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length;
                return { ...center, x: avgX, y: avgY };
            });
            setClusters(newClusters);
            return updatedData;
        });
    }, [clusters]);
    
    useEffect(() => {
        if (isPlaying) {
            iterationRef.current = setInterval(runKMeansIteration, 500);
        } else {
            clearInterval(iterationRef.current);
        }
        return () => clearInterval(iterationRef.current);
    }, [isPlaying, runKMeansIteration]);

    // --- PLOTTING ---
    const xValsPlot = dataToCluster.map(d => d.x), yValsPlot = dataToCluster.map(d => d.y);
    const xDomain = { min: Math.min(...xValsPlot), max: Math.max(...xValsPlot) };
    const yDomain = { min: Math.min(...yValsPlot), max: Math.max(...yValsPlot) };
    const toSVGX = (x: number) => xDomain.max === xDomain.min ? 200 : 20 + ((x - xDomain.min) / (xDomain.max - xDomain.min)) * 360;
    const toSVGY = (y: number) => yDomain.max === yDomain.min ? 125 : 230 - ((y - yDomain.min) / (yDomain.max - yDomain.min)) * 210;
    
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <SectionHeader Icon={Brain} title="Unsupervised Learning: K-Means" />
                <div className="flex items-center gap-2 p-1 bg-slate-700/50 rounded-lg self-end sm:self-center">
                    <button onClick={() => setMode('demo')} className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${mode === 'demo' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700'}`}><ToggleLeft/> Demo Mode</button>
                    <button onClick={() => setMode('real')} className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${mode === 'real' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700'}`}><ToggleRight/> Real Data</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold text-slate-300 mb-3 text-xl">📊 Clustering Plot</h4>
                    <div className="bg-slate-900/50 p-4 border border-slate-700 rounded-lg shadow-inner h-96 relative">
                         {dataToCluster.length > 0 ? (
                            <svg width="100%" height="100%" viewBox="0 0 400 250">
                                <rect width="100%" height="100%" fill="none" />
                                {dataToCluster.map((p, i) => <circle key={i} cx={toSVGX(p.x)} cy={toSVGY(p.y)} r="3.5" fill={p.cluster !== null ? clusters[p.cluster]?.color : '#64748b'} opacity="0.7" />)}
                                {clusters.map((c, i) => <circle key={`c-${i}`} cx={toSVGX(c.x)} cy={toSVGY(c.y)} r="8" fill={c.color} stroke="white" strokeWidth="2"/>)}
                            </svg>) : (
                             <div className="flex flex-col items-center justify-center h-full text-slate-500"><BarChart2 size={48} className="mb-4"/><p>No Data to Display</p></div>
                         )}
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="font-semibold text-slate-300 mb-3 text-xl">⚙️ Controls</h4>
                    <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg shadow-inner space-y-4">
                        <div><label>Number of Clusters (K): {numClusters}</label><input type="range" min="2" max="6" value={numClusters} onChange={e => setNumClusters(+e.target.value)} className="w-full accent-blue-500"/></div>
                        <div className="flex gap-2">
                             <button onClick={() => setIsPlaying(p => !p)} className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-white ${isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}>{isPlaying ? <><Pause size={18}/>Pause</> : <><Play size={18}/>Play All</>}</button>
                             <button onClick={initializeClusters} className="p-2 bg-slate-600 text-white hover:bg-slate-500 rounded-lg"><RotateCcw/></button>
                        </div>
                    </div>
                    {mode === 'real' && (
                        <div className="space-y-6">
                            <div className="space-y-2"><h5 className="font-semibold text-slate-400">1. Upload CSV</h5><FileUpload onFileProcessed={handleFileUpload}/></div>
                            {allData.length > 0 && (
                                <div className="space-y-2"><h5 className="font-semibold text-slate-400">2. Select Features</h5>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="text-sm">Feature 1 (X-axis)</label><select value={featureX} onChange={e => setFeatureX(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md mt-1">{numericHeaders.map(h => <option key={h} value={h}>{h}</option>)}</select></div>
                                        <div><label className="text-sm">Feature 2 (Y-axis)</label><select value={featureY} onChange={e => setFeatureY(e.target.value)} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md mt-1">{numericHeaders.filter(h => h !== featureX).map(h => <option key={h} value={h}>{h}</option>)}</select></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UnsupervisedLearningTab;