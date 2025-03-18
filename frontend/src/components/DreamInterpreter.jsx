import React, { useState } from 'react';
import { generateTherapyResponse } from '../services/geminiService';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const DreamInterpreter = () => {
  const [dream, setDream] = useState('');
  const [interpretation, setInterpretation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await generateTherapyResponse(
        `Please interpret this dream: ${dream}`,
        'dream'
      );
      setInterpretation(response);
    } catch (error) {
      console.error('Error interpreting dream:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Dream Interpreter</h1>
          <p className="text-xl text-primary/80">
            Unlock the hidden meanings in your dreams with AI-powered Jungian analysis
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-primary font-medium mb-2">
                  Describe your dream
                </label>
                <textarea
                  value={dream}
                  onChange={(e) => setDream(e.target.value)}
                  className="w-full h-48 p-4 rounded-lg bg-background border border-primary/20 focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="Share the details of your dream..."
                />
              </div>
              <button
                type="submit"
                disabled={loading || !dream.trim()}
                className="w-full py-3 px-6 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50"
              >
                Interpret Dream
              </button>
            </form>
          </div>

          <div>
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48">
                <DotLottieReact
                  src="https://lottie.host/b8087c9b-dcaa-43b3-8d0c-8ced0803325a/GqPRB9yLVk.lottie"
                  style={{ width: 100, height: 100 }}
                  loop
                  autoplay
                />
                <p className="text-primary/60 mt-4">Analyzing your dream...</p>
              </div>
            ) : interpretation ? (
              <div className="bg-background-secondary p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-primary mb-4">Interpretation</h2>
                <div className="prose text-primary/80">
                  {interpretation}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-primary/60">
                <p>Share your dream to receive an interpretation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamInterpreter;