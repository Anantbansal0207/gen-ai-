import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import ChatInterface from './components/ChatInterface';
import DreamInterpreter from './components/DreamInterpreter';
import MentalHealthPlan from './components/MentalHealthPlan';
import RelationshipCoaching from './components/RelationshipCoaching';
import LifePrediction from './components/LifePrediction';
import { ThemeProvider } from './context/ThemeContext';
import Footer from './components/Footer';

function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background transition-colors duration-200">
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/dream-interpreter" element={<DreamInterpreter />} />
          <Route path="/mental-health" element={<MentalHealthPlan />} />
          <Route path="/relationship" element={<RelationshipCoaching />} />
          <Route path="/life-prediction" element={<LifePrediction />} />
          <Route path="*" element={<HomePage />} />
        </Routes>

        <Toaster
          position="top-right"
          toastOptions={{
            className: 'bg-background text-accent',
          }}
        />

        {location.pathname !== '/chat' && <Footer />}
      </div>
    </ThemeProvider>
  );
}

export default App;