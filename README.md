# GitaX AI Playground 🚀

**An Interactive Machine Learning Platform for Learning and Experimentation**

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.0-blue?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Lucide React](https://img.shields.io/badge/Lucide_React-Icons-orange)](https://lucide.dev/)

## 🌟 Overview

GitaX AI Playground is a comprehensive, interactive platform designed to make machine learning concepts accessible and engaging. Whether you're a student, educator, or ML enthusiast, this platform provides hands-on experience with core ML algorithms through real-time visualizations and interactive experiments.

## ✨ Features

### 🎯 **Supervised Learning**
- **Linear Regression**: Train models with real datasets
- **Feature & Target Analysis**: Understand data relationships
- **Performance Metrics**: Visualize R-squared, MSE, and model accuracy
- **Prediction Interface**: Make real-time predictions with trained models

### 🧠 **Unsupervised Learning**
- **K-Means Clustering**: Discover hidden patterns in data
- **Interactive Clustering**: Adjust parameters and see results instantly
- **Cluster Visualization**: Real-time 2D/3D cluster representations
- **Centroid Tracking**: Watch algorithm convergence in action

### 🔬 **Neural Networks**
- **Feedforward Networks**: Build and visualize neural architectures
- **Layer-by-Layer Analysis**: Understand information flow
- **Weight & Bias Visualization**: See how networks learn
- **Activation Functions**: Experiment with different activation types

### ⚡ **Reinforcement Learning**
- **Q-Learning Implementation**: Train intelligent agents
- **Interactive Environments**: Custom training scenarios
- **Policy Visualization**: Watch agents learn optimal strategies
- **Reward System**: Understand the learning process

### 🔮 **AI-Powered Explanations**
- **Gemini Integration**: Get detailed explanations of ML concepts
- **Contextual Help**: Algorithm-specific guidance
- **Further Learning**: Curated resources and tutorials
- **Real-time Assistance**: Ask questions and get instant answers

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager
- Modern web browser with JavaScript enabled

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/gitax-ai-playground.git
cd gitax-ai-playground
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Add your Gemini API key to `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to `http://localhost:3000` to start exploring!

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React 18** - UI library with hooks and context
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### AI Integration
- **Google Gemini API** - AI-powered explanations
- **MathJax** - Mathematical notation rendering
- **Better React MathJax** - React integration for MathJax

### Data Visualization
- **Custom D3.js Integration** - Interactive charts and graphs
- **Real-time Plotting** - Dynamic data visualization
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
gitax-ai-playground/
├── app/                          # Next.js app directory
│   ├── api/                     # API routes
│   │   └── gemini/             # Gemini AI integration
│   ├── components/             # React components
│   │   ├── SupervisedLearningTab.tsx
│   │   ├── UnsupervisedLearningTab.tsx
│   │   ├── NeuralNetworkTab.tsx
│   │   ├── ReinforcementLearningTab.tsx
│   │   ├── GeminiResponseModal.tsx
│   │   ├── HomePage.tsx
│   │   └── FloatingAdminAccess.tsx
│   ├── lib/                    # Utility functions
│   └── globals.css            # Global styles
├── public/                     # Static assets
├── types/                      # TypeScript definitions
├── utils/                      # Helper functions
└── README.md                  # Project documentation
```

## 🎮 Usage Guide

### 1. **Choose Your Learning Path**
Navigate through the four main ML categories using the tab interface:
- Supervised Learning
- Unsupervised Learning
- Neural Networks
- Reinforcement Learning

### 2. **Upload Your Data**
- **CSV Support**: Upload your own datasets
- **Sample Data**: Use built-in datasets for quick experiments
- **Data Preprocessing**: Automatic handling of common data formats

### 3. **Interactive Experimentation**
- **Real-time Parameters**: Adjust algorithm parameters and see immediate results
- **Visualization**: Watch algorithms learn and adapt
- **Performance Metrics**: Track model performance in real-time

### 4. **AI-Powered Learning**
- **Explain Button**: Get detailed explanations of any concept
- **Contextual Help**: Algorithm-specific guidance
- **Further Resources**: Curated learning materials

## 🎯 Use Cases

### For Students
- **Visual Learning**: Understand complex ML concepts through interactive visualizations
- **Hands-on Practice**: Experiment with real algorithms and datasets
- **Comprehensive Explanations**: Get detailed explanations of every concept

### For Educators
- **Teaching Tool**: Use in classrooms to demonstrate ML concepts
- **Assignment Platform**: Create interactive ML assignments
- **Student Engagement**: Make abstract concepts tangible

### For Professionals
- **Prototype Testing**: Quick ML model prototyping
- **Algorithm Comparison**: Compare different approaches side-by-side
- **Learning New Concepts**: Stay updated with ML fundamentals

## 🔧 Configuration

### Environment Variables
```env
# Required
GEMINI_API_KEY=your_gemini_api_key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_PIN=your_admin_pin
```

### Customization
- **Themes**: Modify `tailwind.config.js` for custom themes
- **Algorithms**: Add new algorithms in respective component files
- **Data Sources**: Extend data import functionality in utility files

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
4. **Commit your changes**
```bash
git commit -m 'Add amazing feature'
```

5. **Push to the branch**
```bash
git push origin feature/amazing-feature
```

6. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Add proper error handling
- Include comprehensive comments
- Test your changes thoroughly

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** for AI-powered explanations
- **Lucide** for beautiful icons
- **Tailwind CSS** for the styling framework
- **Next.js** team for the amazing framework
- **Open Source Community** for inspiration and support

## 🔮 Future Enhancements

- [ ] **Advanced Algorithms**: Support for deep learning models
- [ ] **Collaborative Features**: Multi-user experimentation
- [ ] **Mobile App**: React Native implementation
- [ ] **Cloud Integration**: Save and share experiments
- [ ] **Advanced Visualizations**: 3D neural network representations
- [ ] **Performance Optimization**: WebGL acceleration for complex computations

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/gitax-ai-playground/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/gitax-ai-playground/discussions)
- **Email**: support@gitax-ai.com

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/gitax-ai-playground&type=Date)](https://star-history.com/#yourusername/gitax-ai-playground&Date)

---

<div align="center">
  <p>✨ <strong>Created by IWS AI. Happy experimenting!</strong> ✨</p>
  <p>
    <a href="https://github.com/yourusername/gitax-ai-playground">⭐ Star this repository</a> |
    <a href="https://github.com/yourusername/gitax-ai-playground/issues">🐛 Report Bug</a> |
    <a href="https://github.com/yourusername/gitax-ai-playground/discussions">💬 Request Feature</a>
  </p>
</div>