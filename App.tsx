import React, { useState, useEffect, useCallback } from 'react';
import { Scene, StoryResponse } from './types';
import { generateStoryScript, generateSceneImage } from './services/geminiService';
import BookViewer from './components/BookViewer';
import { Book, Sparkles, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const startStory = async () => {
    setIsLoadingStory(true);
    setError(null);
    try {
      const response: StoryResponse = await generateStoryScript();
      const initializedScenes: Scene[] = response.scenes.map((s, index) => ({
        ...s,
        id: index,
        isLoadingImage: false,
      }));
      setScenes(initializedScenes);
      setHasStarted(true);
      setCurrentIndex(0);
      // Trigger image generation for the first scene immediately
      triggerImageGeneration(initializedScenes, 0);
    } catch (err) {
      console.error(err);
      setError("Failed to create the story. Please check your connection and try again.");
    } finally {
      setIsLoadingStory(false);
    }
  };

  // Function to handle image generation
  const triggerImageGeneration = useCallback(async (currentScenes: Scene[], index: number) => {
    if (index < 0 || index >= currentScenes.length) return;
    
    const scene = currentScenes[index];
    // If already has image or is loading, skip
    if (scene.imageUrl || scene.isLoadingImage) return;

    // Update state to loading
    setScenes(prev => prev.map((s, i) => i === index ? { ...s, isLoadingImage: true } : s));

    try {
      const imageUrl = await generateSceneImage(scene.visual_description);
      setScenes(prev => prev.map((s, i) => i === index ? { ...s, imageUrl, isLoadingImage: false } : s));
    } catch (err) {
      console.error(`Failed to generate image for scene ${index}`, err);
      setScenes(prev => prev.map((s, i) => i === index ? { ...s, isLoadingImage: false } : s));
    }
  }, []);

  // Effect to load images: Current, Next, Previous (Preloading strategy)
  useEffect(() => {
    if (scenes.length === 0) return;

    // Load current
    triggerImageGeneration(scenes, currentIndex);
    
    // Preload next
    if (currentIndex + 1 < scenes.length) {
        triggerImageGeneration(scenes, currentIndex + 1);
    }
  }, [currentIndex, scenes.length, triggerImageGeneration]); // Removed 'scenes' from dependency to avoid loops, logic handled inside trigger

  const handleNext = () => {
    if (currentIndex < scenes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
      setHasStarted(false);
      setScenes([]);
      setCurrentIndex(0);
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f1ea] text-[#5c4033] p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-[#8b5a2b] text-[#f4f1ea] flex items-center justify-center shadow-lg">
              <Book size={48} />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4 font-serif tracking-wider">黛玉葬花</h1>
          <p className="text-xl mb-2 font-serif">Traditional Chinese Picture Book Generator</p>
          <p className="text-sm opacity-70 mb-10 font-serif">Powered by Gemini 2.5 Flash</p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <button
            onClick={startStory}
            disabled={isLoadingStory}
            className="w-full bg-[#8b5a2b] hover:bg-[#6d4621] text-[#fdfbf7] font-bold py-4 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingStory ? (
              <>
                <RefreshCw className="animate-spin" />
                <span>正在创作故事...</span>
              </>
            ) : (
              <>
                <Sparkles />
                <span>开始阅读 (Start)</span>
              </>
            )}
          </button>
          
          <div className="mt-8 text-sm text-[#8b5a2b]/50 font-serif">
            <p>Includes AI-generated script & illustrations.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BookViewer 
      scenes={scenes} 
      currentIndex={currentIndex} 
      onNext={handleNext} 
      onPrev={handlePrev}
      onReset={handleReset}
    />
  );
};

export default App;