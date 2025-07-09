"use client";
import React, { useState, useEffect, useCallback, FC, useRef } from 'react';
import { Zap, Play, Pause, RotateCcw } from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Point2D { x: number; y: number; }
interface RLAgentState extends Point2D {}
interface RLObstacle extends Point2D {}
type QTable = number[][][];

// --- UI SUB-COMPONENTS ---
const SectionHeader: FC<{ title: string; Icon: React.ElementType }> = ({ title, Icon }) => (
    <div className="flex items-center gap-4"><div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20"><Icon size={28} className="text-blue-400" /></div><h3 className="text-2xl lg:text-3xl font-bold text-slate-100">{title}</h3></div>
);

// --- MAIN COMPONENT ---
const ReinforcementLearningTab: FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [rlAgent, setRlAgent] = useState<RLAgentState>({ x: 0, y: 0 });
    const [rlEpisode, setRlEpisode] = useState(0);
    const [rlGridSize, setRlGridSize] = useState(8);
    const [rlGoal, setRlGoal] = useState<RLAgentState>({x: 7, y: 7});
    const [rlObstacles, setRlObstacles] = useState<RLObstacle[]>([{x:2, y:2}, {x:2, y:3}, {x:2, y:4}, {x:5, y:4}, {x:5, y:5}, {x:5, y:6}]);
    const [qTable, setQTable] = useState<QTable>([]);
    const [learningRate, setLearningRate] = useState(0.1);
    const [discountFactor, setDiscountFactor] = useState(0.9);
    const [epsilon, setEpsilon] = useState(0.3);
    // @ts-ignore
    const episodeRef = useRef<NodeJS.Timeout>();

    // --- LOGIC ---
    const initializeRL = useCallback(() => {
        setIsPlaying(false);
        setQTable(Array(rlGridSize).fill(0).map(() => Array(rlGridSize).fill(0).map(() => Array(4).fill(0))));
        setRlAgent({x:0, y:0});
        setRlEpisode(0);
    }, [rlGridSize]);

    useEffect(() => { initializeRL(); }, [initializeRL]);

    const runRLEpisodeStep = useCallback(() => {
        if (qTable.length === 0) return;
        setRlAgent(prevAgent => {
            let newX = prevAgent.x, newY = prevAgent.y, actionIndex;
            // Epsilon-greedy action selection
            if (Math.random() < epsilon) actionIndex = Math.floor(Math.random() * 4); // Explore
            else actionIndex = qTable[prevAgent.y][prevAgent.x].indexOf(Math.max(...qTable[prevAgent.y][prevAgent.x])); // Exploit

            if (actionIndex === 0) newY--; else if (actionIndex === 1) newY++; else if (actionIndex === 2) newX--; else if (actionIndex === 3) newX++;
            newX = Math.max(0, Math.min(rlGridSize - 1, newX));
            newY = Math.max(0, Math.min(rlGridSize - 1, newY));

            let reward = -0.04; // Small cost for each step
            if (newX === rlGoal.x && newY === rlGoal.y) reward = 20;
            if (rlObstacles.some(obs => obs.x === newX && obs.y === newY)) reward = -20;
            
            setQTable(prevQ => {
                const oldQ = prevQ[prevAgent.y][prevAgent.x][actionIndex];
                const maxFutureQ = Math.max(...prevQ[newY][newX]);
                const newQ = oldQ + learningRate * (reward + discountFactor * maxFutureQ - oldQ);
                const newQTable = prevQ.map(r => r.map(c => [...c]));
                newQTable[prevAgent.y][prevAgent.x][actionIndex] = newQ;
                return newQTable;
            });
            
            if (reward > 1 || reward < -1) {
                setRlEpisode(prev => prev + 1);
                return { x: 0, y: 0 };
            }
            return { x: newX, y: newY };
        });
    }, [qTable, epsilon, learningRate, discountFactor, rlGridSize, rlGoal, rlObstacles]);

    useEffect(() => {
        if (isPlaying) episodeRef.current = setInterval(runRLEpisodeStep, 50);
        else clearInterval(episodeRef.current);
        return () => clearInterval(episodeRef.current);
    }, [isPlaying, runRLEpisodeStep]);

    // --- PLOTTING ---
    const gridCellValues = qTable.length > 0 ? qTable.map(row => row.map(cell => Math.max(...cell))) : [];
    const maxQ = Math.max(...gridCellValues.flat().filter(v => isFinite(v) && v > -Infinity));
    const minQ = Math.min(...gridCellValues.flat().filter(v => isFinite(v) && v < Infinity));

    return (
        <div className="space-y-8">
            <SectionHeader Icon={Zap} title="Reinforcement Learning: Q-Learning" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-slate-300 text-xl">🤖 Q-Learning Agent</h4>
                        <div className="flex gap-2">
                            <button onClick={() => setIsPlaying(p => !p)} className={`p-2.5 rounded-lg shadow-lg text-white ${isPlaying ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}>{isPlaying ? <Pause size={20} /> : <Play size={20} />}</button>
                            <button onClick={initializeRL} className="p-2.5 bg-slate-600 text-white hover:bg-slate-500 rounded-lg shadow-lg"><RotateCcw size={20}/></button>
                        </div>
                    </div>
                    <div className="bg-slate-900/50 p-3 border border-slate-700 rounded-lg shadow-inner aspect-square max-w-md mx-auto">
                        <div className="grid gap-0.5" style={{gridTemplateColumns: `repeat(${rlGridSize}, 1fr)`}}>
                            {qTable.map((row, y) => row.map((cell, x) => {
                                const isGoal = x === rlGoal.x && y === rlGoal.y;
                                const isObstacle = rlObstacles.some(o => o.x === x && o.y === y);
                                const isAgent = rlAgent.x === x && rlAgent.y === y;
                                const maxVal = Math.max(...cell);
                                const normVal = (maxQ > minQ) ? (maxVal - minQ) / (maxQ - minQ) : 0;
                                return (
                                    <div key={`${x}-${y}`} className={`aspect-square relative flex items-center justify-center text-3xl font-bold ${isAgent ? 'ring-4 ring-blue-400 z-10' : ''}`}>
                                        <div className="absolute inset-0 bg-blue-900 transition-opacity" style={{opacity: isObstacle ? 0 : normVal * 0.8, zIndex: 1}}></div>
                                        <span style={{zIndex: 2, textShadow: '0 0 5px black'}}>{isAgent ? '🤖' : isGoal ? '🎯' : isObstacle ? '💥' : ''}</span>
                                    </div>);
                            }))}
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <h4 className="font-semibold text-slate-300 text-xl">🧠 Learning Parameters</h4>
                    <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg shadow-inner space-y-4">
                        <div><label className="text-sm">Learning Rate (α): {learningRate}</label><input type="range" min="0.01" max="1" step="0.01" value={learningRate} onChange={e => setLearningRate(+e.target.value)} className="w-full accent-purple-500"/></div>
                        <div><label className="text-sm">Discount Factor (γ): {discountFactor}</label><input type="range" min="0.1" max="0.99" step="0.01" value={discountFactor} onChange={e => setDiscountFactor(+e.target.value)} className="w-full accent-purple-500"/></div>
                        <div><label className="text-sm">Exploration Rate (ε): {epsilon}</label><input type="range" min="0" max="1" step="0.01" value={epsilon} onChange={e => setEpsilon(+e.target.value)} className="w-full accent-purple-500"/></div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-lg shadow-inner">
                        <p><strong>Episode:</strong> <span className="font-mono text-xl text-green-400">{rlEpisode}</span></p>
                        <p className="text-xs mt-2 text-slate-400">The blue heatmap shows the agent's learned "value" (Q-value) for each square. A darker blue means the agent believes that square is a good step towards the goal.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ReinforcementLearningTab;