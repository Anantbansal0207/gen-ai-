import React, { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const HomePage = ({ onGetStarted }) => {
  const [calmMode, setCalmMode] = useState(false);

  return (
    <div className={`min-h-screen transition-all duration-500 ${calmMode ? 'opacity-90' : ''}`}>
      <div className="text-center space-y-24">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-4 pt-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-left max-w-2xl">
              <div className="flex items-center gap-4 mb-6">
                <h1 className="text-5xl font-extrabold text-accent sm:text-6xl md:text-7xl leading-tight animate-fadeIn">
                  Your AI Companion for Mental Wellness
                </h1>
                <button
                  onClick={() => setCalmMode(!calmMode)}
                  className={`p-3 rounded-full transition-all duration-300 ${
                    calmMode ? 'bg-primary text-white' : 'bg-secondary text-accent'
                  }`}
                  title={calmMode ? 'Disable Calm Mode' : 'Enable Calm Mode'}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </button>
              </div>

              <p className="mt-6 text-xl text-accent/80 sm:text-2xl md:text-3xl leading-relaxed">
                Experience compassionate AI therapy in a safe, judgment-free space. Your journey to better mental health starts here.
              </p>

              <div className="mt-10">
                <button
                  onClick={onGetStarted}
                  className="px-8 py-4 text-lg font-medium text-white bg-primary hover:bg-primary-hover transition-all duration-300 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Start Your Journey
                </button>
              </div>
            </div>

            <div className="w-full md:w-1/2 animate-breathe">
              <DotLottieReact
                src="https://lottie.host/ad44657b-79c0-4c65-b2b4-1a1b7aded2af/QKRH8YBqbF.lottie"
                loop
                autoplay
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-secondary/30 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-accent mb-12 text-center">
              How We Support Your Mental Wellness
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                title="24/7 AI Support"
                description="Access compassionate support anytime, anywhere. Our AI therapist is always here to listen and help."
                icon="💭"
              />
              <FeatureCard
                title="Personalized Growth"
                description="Receive tailored guidance and exercises based on your unique needs and progress."
                icon="🌱"
              />
              <FeatureCard
                title="Safe Space"
                description="Share your thoughts in a completely private and judgment-free environment."
                icon="🏡"
              />
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-accent mb-12 text-center">
            Stories of Growth
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The AI therapist helped me develop better coping mechanisms. It's like having a supportive friend available 24/7."
              author="Sarah M."
            />
            <TestimonialCard
              quote="I was skeptical at first, but the personalized guidance has made a real difference in my anxiety management."
              author="James K."
            />
            <TestimonialCard
              quote="The calm environment and thoughtful responses helped me open up about issues I've never discussed before."
              author="Emily R."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-accent mb-3">{title}</h3>
    <p className="text-accent/70">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author }) => (
  <div className="bg-secondary/20 p-6 rounded-2xl">
    <p className="text-accent/80 italic mb-4">"{quote}"</p>
    <p className="text-accent font-medium">- {author}</p>
  </div>
);

export default HomePage;