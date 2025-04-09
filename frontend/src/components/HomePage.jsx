import React, { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import therapist from '../assets/therapist.jpg';
import background from '../assets/bg4.jpg';

const HomePage = ({ onGetStarted }) => {
  const [calmMode, setCalmMode] = useState(false);

  return (
    <div 
      className="min-h-screen w-full transition-all duration-500"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="text-center space-y-24 w-full">
        {/* Hero Section */}
        <div style={{marginTop:'-70px'}} className="w-full px-4 pt-20">
          <div className="max-w-6xl mx-auto">

            <div style={{paddingLeft:'50px',paddingRight:'50px'}} className="w-full bg-amber-50/30 backdrop-blur-sm px-4 pt-12 pb-16 rounded-lg shadow-md">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  {/* Left Side - Text Content */}
                  <div className="w-full md:w-1/2 pr-0 md:pr-8">
                    <div className="text-left">
                      <p className="text-base text-primary/80 font-medium tracking-wider mb-2">MINDFUL MENTAL WELLNESS</p>
                      
                      <h1 style={{fontSize:'40px'}} className="text-4xl md:text-5xl lg:text-6xl font-bold text-accent leading-tight mb-6">
                        <div className="flex items-center flex-wrap">
                          <span>Experience the </span>
                          <span className="inline-block bg-green-500 text-white px-5 py-1 rounded-full text-2xl relative ml-2">
                            gentle
                          </span>
                        </div>
                        
                        <div className="mt-2 flex items-center flex-wrap">
                          <span className="inline-block bg-red-500 text-white px-5 py-1 rounded-full text-2xl relative mr-2">
                            support
                          </span>
                          <span>mindful therapy</span>
                        </div>
                      </h1>
                      
                      <p className="text-lg text-accent/80 leading-relaxed mb-8 max-w-lg">
                        Experience compassionate AI therapy in a safe, judgment-free space. Your journey to better mental health starts here.
                      </p>
                      
                      <div className="flex flex-wrap gap-4">
                        <button className="px-8 py-4 text-lg font-medium text-white bg-primary hover:bg-primary-hover transition-all duration-300 rounded-full shadow-md hover:shadow-lg">
                          Start Your Journey
                        </button>
                        
                        <div className="flex items-center">
                          <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-xs">⭐</div>
                            <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-xs">⭐</div>
                            <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-xs">⭐</div>
                          </div>
                          <span className="ml-3 text-sm font-medium text-accent/70">Over 5,000+ satisfied clients</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side - Image */}
                  <div className="w-full md:w-1/2 mt-12 md:mt-0">
                    <div className="relative">
                      <img 
                        className="w-full h-auto rounded-lg shadow-lg object-cover" 
                        src={therapist} 
                        alt="Mindful Therapy" 
                      />
                      <div className="absolute -bottom-4 -left-4 bg-white px-6 py-3 rounded-lg shadow-md hidden md:block">
                        <div className="flex items-center">
                          <div className="text-amber-400 text-xl mr-2">★★★★★</div>
                          <div className="text-sm font-medium">Trusted by thousands</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Animation */}
            {/* <div className="w-full mt-16 animate-breathe">
              <DotLottieReact
                src="https://lottie.host/ad44657b-79c0-4c65-b2b4-1a1b7aded2af/QKRH8YBqbF.lottie"
                loop
                autoplay
              />
            </div> */}
          </div>
        </div>

        {/* Features Section */}
        <div style={{margin:'0px'}} className="py-20 w-full">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-secondary/70 backdrop-blur-sm rounded-xl p-12 shadow-lg">
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
        </div>

        <div style={{marginTop:'-100px',margin:'0px',padding:'0px'}} className="py-20 w-full">
          <div style={{width:'1000px'}} className="max-w-6xl mx-auto px-4">
            <div className="bg-white/30 backdrop-blur-sm rounded-xl p-12 shadow-lg">
              <h2 style={{marginBottom:'40px'}} className="text-3xl font-bold text-accent mb-16 text-center">
                How It Works
              </h2>
              
              <div className="relative">
                {/* Vertical line */}
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/30 rounded-full"></div>
                
                {/* Step 1 */}
                <div className="md:flex items-center mb-16">
                  <div className="md:w-1/2 pr-8 md:text-right">
                    <h3 style={{textAlign:'center'}} className="text-2xl font-bold text-primary mb-3">1. Start a Conversation</h3>
                    <p style={{textAlign:'center'}} className="text-accent/70 text-lg">
                      Begin your journey in a safe space. Share what's on your mind without judgment or time constraints.
                    </p>
                  </div>
                  <div className="hidden md:flex justify-center items-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-lg z-10">1</div>
                  </div>
                  <div className="md:w-1/2 pl-8 mt-4 md:mt-0">
                    <div className="bg-secondary/30 backdrop-blur-sm p-6 rounded-2xl">
                      <div className="text-5xl mb-4">🗣️</div>
                      <p className="italic text-accent/80">"I've been feeling overwhelmed lately with everything going on..."</p>
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="md:flex items-center mb-16 flex-row-reverse">
                  <div className="md:w-1/2 pl-8 md:text-left">
                    <h3 style={{textAlign:'center'}} className="text-2xl font-bold text-primary mb-3">2. Receive Thoughtful Guidance</h3>
                    <p style={{textAlign:'center'}} className="text-accent/70 text-lg">
                      Get personalized responses grounded in therapeutic approaches and emotional intelligence.
                    </p>
                  </div>
                  <div className="hidden md:flex justify-center items-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-lg z-10">2</div>
                  </div>
                  <div className="md:w-1/2 pr-8 mt-4 md:mt-0">
                    <div className="bg-secondary/30 backdrop-blur-sm p-6 rounded-2xl">
                      <div className="text-5xl mb-4">💭</div>
                      <p className="italic text-accent/80">"That sounds challenging. Let's explore some ways to manage these feelings together..."</p>
                    </div>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="md:flex items-center">
                  <div className="md:w-1/2 pr-8 md:text-right">
                    <h3 style={{textAlign:'center'}} className="text-2xl font-bold text-primary mb-3">3. Practice & Grow</h3>
                    <p style={{textAlign:'center'}} className="text-accent/70 text-lg">
                      Apply insights to your daily life and track your progress over time with personalized reflection tools.
                    </p>
                  </div>
                  <div className="hidden md:flex justify-center items-center">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold shadow-lg z-10">3</div>
                  </div>
                  <div className="md:w-1/2 pl-8 mt-4 md:mt-0">
                    <div className="bg-secondary/30 backdrop-blur-sm p-6 rounded-2xl">
                      <div className="text-5xl mb-4">📈</div>
                      <p className="italic text-accent/80">"I've noticed myself using those breathing techniques we discussed, and they're really helping..."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
{/* Testimonials Section */}
<div style={{margin:'0px',padding:'0px', marginTop:'100px' ,marginBottom:'0px'}} className="w-full px-4 py-20">
  <div className="max-w-6xl mx-auto">
    <div className="bg-amber-50/30 backdrop-blur-sm rounded-xl p-12 shadow-lg">
      <h2 style={{marginTop:'0',marginBottom:'32px'}} className="text-3xl font-bold text-accent text-center">
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

{/* Decorative transition element */}
<div className="w-full flex justify-center -mt-6 mb-12">
  <div className="relative">
    
  </div>
</div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-accent mb-3">{title}</h3>
    <p className="text-accent/70">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author }) => (
  <div className="bg-secondary/40 backdrop-blur-sm p-6 rounded-2xl shadow-sm">
    <p className="text-accent/80 italic mb-4">"{quote}"</p>
    <p className="text-accent font-medium">- {author}</p>
  </div>
);

export default HomePage;