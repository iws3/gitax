"use client";
import React, { useState, FC, useRef, useEffect } from 'react';
import { Target, Brain, BrainCircuit, Zap, Lightbulb } from 'lucide-react';
// Import the context provider from the new, correct library
import { MathJaxContext } from 'better-react-mathjax';
import SupervisedLearningTab from '@/components/SupervisedLearningTab';
import UnsupervisedLearningTab from '@/components/UnsupervisedLearningTab';
import NeuralNetworkTab from '@/components/NeuralNetworkTab';
import ReinforcementLearningTab from '@/components/ReinforcementLearningTab';
import GeminiResponseModal from '@/components/GeminiResponseModal';

// Import all your tab components
// import SupervisedLearningTab from '../components/SupervisedLearningTab';
// import UnsupervisedLearningTab from '../components/UnsupervisedLearningTab';
// import ReinforcementLearningTab from '../components/ReinforcementLearningTab';
// import NeuralNetworkTab from '../components/NeuralNetworkTab';
// import GeminiResponseModal from '../components/GeminiResponseModal';

const MLPlayground: FC = () => {
    const [activeTab, setActiveTab] = useState<'supervised' | 'unsupervised' | 'neuralnetwork' | 'reinforcement'>('supervised');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isGeminiLoading, setIsGeminiLoading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D Tilt Effect
    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;
        const handleMouseMove = (e: MouseEvent) => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = e.clientX - left - width / 2;
            const y = e.clientY - top - height / 2;
            card.style.setProperty('--rotate-x', `${-(y / (height / 2)) * 4}deg`);
            card.style.setProperty('--rotate-y', `${(x / (width / 2)) * 4}deg`);
        };
        const handleMouseLeave = () => {
            card.style.setProperty('--rotate-x', '0deg');
            card.style.setProperty('--rotate-y', '0deg');
        };
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const callGeminiAPI = async (prompt: string, title: string) => {
        setIsModalOpen(true);
        setModalTitle(title);
        setIsGeminiLoading(true);
        setModalContent(null);
        const fullPrompt = `${prompt}\n\nPlease provide your explanation in Markdown format. Also, include a "Further Learning" section. In this section, provide up to 5 helpful article links and up to 5 YouTube video links. For YouTube videos, please use the format: [YOUTUBE](video_id "Video Title Here").`;
        
        try {
            const response = await fetch('/api/gemini', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: fullPrompt }) });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'API request failed');
            setModalContent(data.text);
        } catch (error: any) {
            setModalContent(`## Error\n\nThere was an issue communicating with the AI model.\n\n**Details:**\n\`\`\`\n${error.message}\n\`\`\``);
        } finally {
            setIsGeminiLoading(false);
        }
    };
    
    // Tabs configuration
    const tabs = [
        { id: 'supervised', Icon: Target, Component: SupervisedLearningTab, title: "Supervised" },
        { id: 'unsupervised', Icon: Brain, Component: UnsupervisedLearningTab, title: "Unsupervised" },
        { id: 'neuralnetwork', Icon: BrainCircuit, Component: NeuralNetworkTab, title: "Neural Network" },
        { id: 'reinforcement', Icon: Zap, Component: ReinforcementLearningTab, title: "Reinforcement" }
    ];

    const ActiveComponent = tabs.find(t => t.id === activeTab)!.Component;

    // Explain button handler
    const handleExplain = () => {
        let prompt, title;
        switch (activeTab) {
            case 'supervised':
                title = "About Supervised Learning";
                prompt = "Explain Supervised Learning, focusing on Linear Regression. What are Feature and Target columns? How do we interpret slope, intercept, R-Squared, and MSE? Explain how a model can be used for prediction.";
                break;
            case 'unsupervised':
                title = "About Unsupervised Learning";
                prompt = "Explain Unsupervised Learning, focusing on K-Means Clustering. What is the goal of clustering? How does the algorithm work (the assignment and update steps)? What are some real-world use cases?";
                break;
            case 'neuralnetwork':
                title = "About Neural Networks";
                prompt = "Explain the basics of a Feedforward Neural Network. Describe the roles of the Input Layer, Hidden Layers, and Output Layer. What are weights and biases? Briefly explain the concepts of Forward Propagation and Backpropagation in an intuitive way.";
                break;
            case 'reinforcement':
                title = "About Reinforcement Learning";
                prompt = "Explain Reinforcement Learning, focusing on Q-Learning. What are the key concepts: Agent, Environment, State, Action, Reward, and Policy? Explain how the Q-Table helps an agent make decisions. What do the Learning Rate (α), Discount Factor (γ), and Exploration Rate (ε) control?";
                break;
        }
        callGeminiAPI(prompt, title);
    };

    // This config tells MathJax which packages to load, including the one for text color
    const mathJaxConfig = {
        loader: { load: ["input/tex", "output/svg", "ui/safe", "[tex]/color"] },
        tex: { packages: { "[+]": ["color"] } }
    };

    return (
        // --- THE FIX: Wrap the entire component in the MathJaxContext provider ---
        <MathJaxContext version={3} config={mathJaxConfig}>
            <div className="min-h-screen bg-slate-900 text-slate-200 p-2 sm:p-4 md:p-6 lg:p-8 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <header className="text-center mb-10">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 mb-3 tracking-tight">GitaX AI Playground</h1>
                        <p className="text-slate-400 text-base sm:text-lg max-w-3xl mx-auto">An interactive platform to explore Machine Learning. Upload real data, train agents, and visualize neural networks in real-time.</p>
                    </header>
                    
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-5 mb-10">
                        {tabs.map(({ id, Icon, title }) => (
                            <button key={id} onClick={() => setActiveTab(id as any)} className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${activeTab === id ? 'bg-blue-600 text-white scale-105 shadow-lg shadow-blue-500/20' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                                <Icon size={20}/>{title}
                            </button>
                        ))}
                    </div>
                    
                    <div ref={cardRef} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 transition-transform duration-200"
                        style={{ transformStyle: 'preserve-3d', transform: 'perspective(2000px) rotateX(var(--rotate-x, 0)) rotateY(var(--rotate-y, 0))' }}>
                        <div className="flex justify-end mb-6 -mt-2 -mr-2 sm:-mt-4 sm:-mr-4">
                            <button onClick={handleExplain} className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 text-amber-900 font-medium rounded-lg hover:bg-amber-500 transition-colors shadow-lg hover:shadow-amber-500/30 text-sm">
                                <Lightbulb size={18} />Explain This Concept
                            </button>
                        </div>
                        <ActiveComponent />
                    </div>
                    
                    <footer className="text-center mt-12 mb-6 text-slate-600 text-sm">
                        <p>✨Created by IWS Ai. Happy experimenting! ✨</p>
                    </footer>
                </div>
                
                <GeminiResponseModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    title={modalTitle} 
                    content={modalContent} 
                    isLoading={isGeminiLoading} 
                />
            </div>
        </MathJaxContext>
    );
};

export default MLPlayground;