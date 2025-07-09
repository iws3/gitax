"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, 
  Brain, 
  BrainCircuit, 
  Zap, 
  ChevronDown, 
  Play, 
  Sparkles, 
  ArrowRight,
  Users,
  BookOpen,
  Code,
  Lightbulb,
  CheckCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';

interface HeroProps {
  onEnterPlayground: () => void;
}

const HomePage: React.FC<HeroProps> = ({ onEnterPlayground }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Smooth mouse tracking for background effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Feature cards data
  const features = [
    {
      icon: Target,
      title: "Supervised Learning",
      description: "Master linear regression with real datasets. Upload your data and watch AI learn patterns.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "Unsupervised Learning", 
      description: "Explore K-means clustering. Discover hidden patterns in your data without labels.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: BrainCircuit,
      title: "Neural Networks",
      description: "Build and visualize feedforward networks. See how AI processes information layer by layer.",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Zap,
      title: "Reinforcement Learning",
      description: "Train smart agents using Q-learning. Watch AI learn through trial and reward.",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "4", label: "ML Algorithms", icon: Brain },
    { number: "∞", label: "Datasets Supported", icon: BookOpen },
    { number: "Real-time", label: "Visualization", icon: Sparkles },
    { number: "Interactive", label: "Learning Experience", icon: Users }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
          }}
        />
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Heading */}
          <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500">
                GitaX AI
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-500">
                Playground
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Dive into the world of <span className="text-blue-400 font-semibold">Machine Learning</span> with interactive visualizations, 
              real-time training, and hands-on experimentation.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <Link 
              href="/play"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 flex items-center gap-2"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Enter Playground
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            
          </div>

          {/* Floating Action Indicator */}
           <a href="#contact" className={`animate-bounce transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <ChevronDown className="w-8 h-8 text-slate-400 mx-auto"  id=""/>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative" id='contact'>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
              Explore AI Concepts
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Master the fundamentals of machine learning through interactive, hands-on experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-slate-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Three simple steps to start your machine learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Path",
                description: "Select from supervised, unsupervised, neural networks, or reinforcement learning",
                icon: Target
              },
              {
                step: "02", 
                title: "Upload & Experiment",
                description: "Import your data or use sample datasets to train and test algorithms",
                icon: Code
              },
              {
                step: "03",
                title: "Visualize & Learn",
                description: "Watch real-time visualizations and get AI-powered explanations",
                icon: Lightbulb
              }
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                <div className="text-6xl font-bold text-slate-700 mb-4 group-hover:text-slate-600 transition-colors">
                  {item.step}
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 group-hover:border-slate-600 transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-slate-300">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Explore AI?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of learners mastering machine learning through hands-on experimentation
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onEnterPlayground}
              className="group px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Start Learning Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-400 mb-4">
            ✨ Created by IWS AI. Happy experimenting! ✨
          </p>
          <div className="flex justify-center gap-6 text-slate-500">
            <Star className="w-5 h-5" />
            <Star className="w-5 h-5" />
            <Star className="w-5 h-5" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;