"use client";
import React, { useState, useEffect, useCallback, FC, useRef, useMemo } from 'react';
import { BrainCircuit, Play, Pause, RotateCcw, Cpu, Sigma } from 'lucide-react';
// Import the new, modern math library. No CSS import is needed.
import { MathJax } from 'better-react-mathjax';

// --- TYPE DEFINITIONS ---
interface Neuron { id: number; x: number; y: number; activation: number; bias: number; }
interface Layer { id: number; neurons: Neuron[]; }
interface Weight { from: [number, number]; to: [number, number]; value: number; }
interface Pulse { id: number; path: { x1: number, y1: number, x2: number, y2: number }; progress: number; }

// --- HELPER FUNCTIONS ---
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
const randomWeight = () => Math.random() * 2 - 1;

// --- UI SUB-COMPONENTS ---
const SectionHeader: FC<{ title: string; Icon: React.ElementType }> = ({ title, Icon }) => (
    <div className="flex items-center gap-4">
        <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20"><Icon size={28} className="text-blue-400" /></div>
        <h3 className="text-2xl lg:text-3xl font-bold text-slate-100">{title}</h3>
    </div>
);
const ParameterSlider: FC<{ label: string; value: number; onChange: (val: number) => void; min: number; max: number; step?: number, disabled?: boolean }> = ({ label, value, onChange, disabled, ...props }) => (
    <div>
        <label className={`text-sm font-medium ${disabled ? 'text-slate-500' : 'text-slate-300'}`}>{label}: <span className="font-bold text-blue-300">{value}</span></label>
        <input type="range" value={value} onChange={e => onChange(Number(e.target.value))} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:accent-slate-600 disabled:cursor-not-allowed" disabled={disabled} {...props} />
    </div>
);

// --- MAIN COMPONENT ---
const NeuralNetworkTab: FC = () => {
    const [architecture, setArchitecture] = useState([3, 5, 4, 1]);
    const [networkState, setNetworkState] = useState<{ activations: number[][]; biases: number[][]; weights: number[][][] }>({ activations: [], biases: [], weights: [] });
    const [pulses, setPulses] = useState<Pulse[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);
    const [hoveredNeuron, setHoveredNeuron] = useState<[number, number] | null>(null);
    const [hoveredWeight, setHoveredWeight] = useState<[number, number, number] | null>(null);

    const animationFrameRef = useRef<number>();
    const trainingIntervalRef = useRef<NodeJS.Timeout>();

    const { layers, connections } = useMemo(() => {
        const newLayers: Layer[] = [];
        const newConnections: Weight[] = [];
        const svgWidth = 800, svgHeight = 400;
        const layerXs = architecture.map((_, i) => 50 + (i * (svgWidth - 100)) / (architecture.length - 1));

        architecture.forEach((neuronCount, i) => {
            const layer: Layer = { id: i, neurons: [] };
            const ySpacing = svgHeight / (neuronCount + 1);
            for (let j = 0; j < neuronCount; j++) {
                const activation = networkState.activations[i]?.[j] || 0;
                const bias = networkState.biases[i]?.[j] || 0;
                layer.neurons.push({ id: j, x: layerXs[i], y: ySpacing * (j + 1), activation, bias });
            }
            newLayers.push(layer);
        });

        for (let i = 0; i < architecture.length - 1; i++) {
            for (const from of newLayers[i]?.neurons || []) {
                for (const to of newLayers[i + 1]?.neurons || []) {
                    const value = networkState.weights[i]?.[from.id]?.[to.id] || 0;
                    newConnections.push({ from: [i, from.id], to: [i + 1, to.id], value });
                }
            }
        }
        return { layers: newLayers, connections: newConnections };
    }, [architecture, networkState]);

    const initializeNetworkValues = useCallback(() => {
        setIsPlaying(false);
        setIsPulsing(false);
        setPulses([]);
        const activations = architecture.map(size => Array(size).fill(0));
        const biases = architecture.map(size => Array(size).fill(0).map(() => randomWeight() * 0.1));
        const weights = architecture.slice(0, -1).map((size, i) =>
            Array(size).fill(0).map(() => Array(architecture[i + 1]).fill(0).map(() => randomWeight()))
        );
        setNetworkState({ activations, biases, weights });
    }, [architecture]);

    useEffect(() => {
        initializeNetworkValues();
    }, [architecture]);

    const runForwardPass = useCallback((startPulses: boolean) => {
        if (layers.length === 0) return;
        setNetworkState(prevState => {
            const newActivations = prevState.activations.map(l => [...l]);
            newActivations[0] = newActivations[0].map(() => Math.random());
            for (let i = 0; i < architecture.length - 1; i++) {
                for (let j = 0; j < architecture[i + 1]; j++) {
                    let sum = prevState.biases[i + 1]?.[j] || 0;
                    for (let k = 0; k < architecture[i]; k++) {
                        sum += (newActivations[i]?.[k] || 0) * (prevState.weights[i]?.[k]?.[j] || 0);
                    }
                    newActivations[i + 1][j] = sigmoid(sum);
                }
            }
            if (startPulses) {
                setIsPulsing(true);
                const initialPulses = connections.filter(c => c.from[0] === 0).flatMap(c => {
                    const from = layers[c.from[0]]?.neurons[c.from[1]];
                    const to = layers[c.to[0]]?.neurons[c.to[1]];
                    if (!from || !to) return [];
                    return { id: Math.random(), path: { x1: from.x, y1: from.y, x2: to.x, y2: to.y }, progress: 0 };
                });
                setPulses(initialPulses);
            }
            return { ...prevState, activations: newActivations };
        });
    }, [layers, connections, architecture]);

    const runTrainingStep = useCallback(() => {
        runForwardPass(false);
        setNetworkState(prevState => {
            const learningRate = 0.05;
            const newWeights = prevState.weights.map((layer, l_idx) =>
                layer.map((from_weights, f_idx) =>
                    from_weights.map((weight, t_idx) => {
                        const fromActivation = prevState.activations[l_idx]?.[f_idx] || 0;
                        const toActivation = prevState.activations[l_idx + 1]?.[t_idx] || 0;
                        const adjustment = (fromActivation * toActivation - 0.25) * learningRate + (Math.random() - 0.5) * 0.01;
                        return weight + adjustment;
                    })
                )
            );
            return { ...prevState, weights: newWeights };
        });
    }, [runForwardPass]);

    useEffect(() => {
        if (isPlaying) {
            trainingIntervalRef.current = setInterval(runTrainingStep, 150);
        }
        return () => clearInterval(trainingIntervalRef.current);
    }, [isPlaying, runTrainingStep]);

    useEffect(() => {
        if (pulses.length === 0) { setIsPulsing(false); return; }
        const animate = () => {
            setPulses(prev => {
                const nextPulses: Pulse[] = [];
                const stillMoving = prev.filter(p => {
                    p.progress += 0.05;
                    if (p.progress >= 1) {
                        const arrivedAtNeuron = layers.flat().flatMap(l => l.neurons).find(n => n.x === p.path.x2 && n.y === p.path.y2);
                        if (arrivedAtNeuron) {
                            const layerIndex = layers.findIndex(l => l.neurons.includes(arrivedAtNeuron));
                            if (layerIndex !== -1 && layerIndex < layers.length - 1) {
                                connections.filter(c => c.from[0] === layerIndex && c.from[1] === arrivedAtNeuron.id).forEach(c => {
                                    const from = layers[c.from[0]]?.neurons[c.from[1]];
                                    const to = layers[c.to[0]]?.neurons[c.to[1]];
                                    if(from && to) {
                                        nextPulses.push({ id: Math.random(), path: { x1: from.x, y1: from.y, x2: to.x, y2: to.y }, progress: 0 });
                                    }
                                });
                            }
                        }
                        return false;
                    }
                    return true;
                });
                const allPulses = [...stillMoving, ...nextPulses];
                if (allPulses.length === 0) setIsPulsing(false);
                return allPulses;
            });
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animationFrameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameRef.current!);
    }, [pulses, layers, connections]);
    
    let equation = `a_j = \\sigma(\\sum_{i} (w_{ij} \\cdot a_i) + b_j)`;
    if (hoveredNeuron && layers.length > 0) {
        const [l_idx, n_idx] = hoveredNeuron;
        const neuron = layers[l_idx]?.neurons[n_idx];
        if (neuron && l_idx > 0) {
            equation = `\\textcolor{cyan}{${neuron.activation.toFixed(3)}} = \\sigma(\\sum_{i} (w_{ij} \\cdot a_i) + \\textcolor{orange}{${neuron.bias.toFixed(3)}})`;
        }
    } else if (hoveredWeight && layers.length > 0) {
        const [l_idx, from_n_idx, to_n_idx] = hoveredWeight;
        const weightValue = networkState.weights[l_idx]?.[from_n_idx]?.[to_n_idx];
        const fromNeuron = layers[l_idx]?.neurons[from_n_idx];
        if (weightValue !== undefined && fromNeuron) {
            equation = `a_j = \\sigma(\\sum_{i} (\\textcolor{lime}{${weightValue.toFixed(3)}} \\cdot \\textcolor{yellow}{${fromNeuron.activation.toFixed(3)}}) + ... )`;
        }
    }

    return (
        <div className="space-y-8">
            <SectionHeader Icon={BrainCircuit} title="Neural Network Simulator" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h4 className="font-semibold text-slate-300 mb-3 text-xl">🧠 Network Architecture</h4>
                    <div className="bg-slate-900/50 p-2 border border-slate-700 rounded-lg shadow-inner h-[450px] relative overflow-hidden">
                        <svg width="100%" height="100%" className="overflow-visible">
                            <defs><filter id="glow"><feGaussianBlur stdDeviation="3.5" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
                            {connections.map((w, i) => {
                                const fromNeuron = layers[w.from[0]]?.neurons[w.from[1]];
                                const toNeuron = layers[w.to[0]]?.neurons[w.to[1]];
                                if (!fromNeuron || !toNeuron) return null;
                                const isHovered = (hoveredNeuron && ((hoveredNeuron[0] === w.from[0] && hoveredNeuron[1] === w.from[1]) || (hoveredNeuron[0] === w.to[0] && hoveredNeuron[1] === w.to[1]))) || (hoveredWeight && hoveredWeight[0] === w.from[0] && hoveredWeight[1] === w.from[1] && hoveredWeight[2] === w.to[1]);
                                return (<line key={i} x1={fromNeuron.x} y1={fromNeuron.y} x2={toNeuron.x} y2={toNeuron.y}
                                    stroke={isHovered ? (w.value > 0 ? "#60a5fa" : "#f87171") : (w.value > 0 ? "rgba(255, 255, 255, 0.2)" : "rgba(239, 68, 68, 0.2)")}
                                    strokeWidth={isHovered ? 4 : 1 + Math.abs(w.value) * 2} className="transition-all duration-200"
                                    onMouseEnter={() => setHoveredWeight([w.from[0], w.from[1], w.to[1]])} onMouseLeave={() => setHoveredWeight(null)} />);
                            })}
                            {layers.map(layer => layer.neurons.map(neuron => {
                                const isHovered = hoveredNeuron && hoveredNeuron[0] === layer.id && hoveredNeuron[1] === neuron.id;
                                const color = layer.id === 0 ? 'orange' : layer.id === layers.length - 1 ? 'blue' : 'sky';
                                return (<circle key={`${layer.id}-${neuron.id}`} cx={neuron.x} cy={neuron.y} r={isHovered ? 16 : 12}
                                    fill={`rgba(${color === 'orange' ? '251, 146, 60' : color === 'blue' ? '59, 130, 246' : '96, 165, 250'}, ${0.4 + neuron.activation * 0.6})`}
                                    stroke={color === 'orange' ? "#fb923c" : color === 'blue' ? "#3b82f6" : "#60a5fa"}
                                    strokeWidth={isHovered ? 3 : 2} style={{ filter: neuron.activation > 0.8 ? 'url(#glow)' : 'none', transition: 'all 0.2s ease' }}
                                    onMouseEnter={() => setHoveredNeuron([layer.id, neuron.id])} onMouseLeave={() => setHoveredNeuron(null)} />);
                            }))}
                            {pulses.map(p => <circle key={p.id} cx={p.path.x1 + (p.path.x2 - p.path.x1) * p.progress} cy={p.path.y1 + (p.path.y2 - p.path.y1) * p.progress} r="5" fill="rgba(255, 255, 100, 0.9)" />)}
                        </svg>
                    </div>
                </div>
                <div className="space-y-6">
                    <h4 className="font-semibold text-slate-300 mb-3 text-xl">⚙️ Controls & Equations</h4>
                    <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg shadow-inner space-y-4">
                        <ParameterSlider label="Hidden Layers" value={architecture.length - 2} onChange={v => setArchitecture([3, ...Array(v).fill(architecture[1] || 4), 1])} min={1} max={4} disabled={isPlaying || isPulsing} />
                        <ParameterSlider label="Neurons per Layer" value={architecture[1] || 4} onChange={v => setArchitecture([3, ...Array(architecture.length - 2).fill(v), 1])} min={2} max={8} disabled={isPlaying || isPulsing} />
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg shadow-inner space-y-3">
                        <button onClick={() => runForwardPass(true)} disabled={isPulsing || isPlaying} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-500 disabled:bg-slate-600 disabled:cursor-not-allowed">
                            <Cpu size={18}/> One-Shot Pulse
                        </button>
                        <button onClick={() => setIsPlaying(p => !p)} className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-white ${isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}>
                            {isPlaying ? <><Pause size={18}/> Pause Training</> : <><Play size={18}/> Start Live Training</>}
                        </button>
                        <button onClick={initializeNetworkValues} disabled={isPlaying || isPulsing} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium bg-slate-600 text-white hover:bg-slate-500 disabled:bg-slate-700">
                            <RotateCcw size={18}/> Reset Network
                        </button>
                    </div>
                     <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg shadow-inner">
                        <p className="flex items-center gap-2 text-slate-400 text-sm mb-2"><Sigma size={16}/> Neuron Activation Function</p>
                        <div className="text-xl text-center text-slate-200 p-2 bg-slate-800/50 rounded h-16 flex items-center justify-center">
                            {/* --- THE FIX: Using MathJax from better-react-mathjax --- */}
                            <MathJax dynamic hideUntilTypeset="first">
                                {`\\(${equation}\\)`}
                            </MathJax>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 text-center">Hover over neurons and weights to see live values.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NeuralNetworkTab;