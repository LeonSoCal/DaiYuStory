import React from 'react';
import { Scene } from '../types';
import { ArrowLeft, ArrowRight, BookOpen, Loader2 } from 'lucide-react';

interface BookViewerProps {
  scenes: Scene[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
}

const BookViewer: React.FC<BookViewerProps> = ({ scenes, currentIndex, onNext, onPrev, onReset }) => {
  const currentScene = scenes[currentIndex];
  const progress = ((currentIndex + 1) / scenes.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 md:px-0">
      <div className="w-full max-w-4xl bg-[#fdfbf7] shadow-2xl border-8 border-[#5c4033] rounded-lg overflow-hidden relative min-h-[80vh] flex flex-col">
        
        {/* Header/Top Decor */}
        <div className="h-4 bg-[#8b5a2b] w-full"></div>

        <div className="flex-1 flex flex-col md:flex-row">
          {/* Image Section (Left or Top) */}
          <div className="w-full md:w-2/3 bg-[#f0ece2] flex items-center justify-center p-8 border-b-4 md:border-b-0 md:border-r-4 border-[#dcd0c0] relative">
            <div className="absolute top-4 left-4 z-10">
                <span className="bg-[#8b5a2b] text-white px-3 py-1 text-sm font-serif rounded-sm shadow-md">
                    第 {currentIndex + 1} 页
                </span>
            </div>
            
            {currentScene.isLoadingImage ? (
              <div className="flex flex-col items-center text-[#8b5a2b]">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p className="font-serif tracking-widest">宫崎骏风格绘制中...</p>
                <p className="text-xs opacity-60 mt-2">Creating Ghibli style art...</p>
              </div>
            ) : currentScene.imageUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={currentScene.imageUrl} 
                    alt={currentScene.title}
                    className="max-w-full max-h-[60vh] object-contain shadow-sm rounded-sm border border-[#dcd0c0]/50"
                  />
                  {/* Signature stamp effect */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-red-800 text-red-800 flex items-center justify-center text-[10px] font-bold opacity-80">
                      AI印
                  </div>
              </div>
            ) : (
              <div className="text-gray-400 italic font-serif">等待绘制...</div>
            )}
          </div>

          {/* Text Section (Right or Bottom) */}
          <div className="w-full md:w-1/3 p-8 md:p-12 flex flex-col justify-between bg-[#fdfbf7]">
            <div>
              <h2 className="text-3xl font-bold text-[#5c4033] mb-8 font-serif tracking-widest border-b pb-4 border-[#e5e0d8]">
                {currentScene.title}
              </h2>
              <p className="text-lg leading-loose text-[#4a3b32] font-serif text-justify">
                {currentScene.narrative_text}
              </p>
            </div>
            
            <div className="mt-8 md:mt-auto flex justify-between items-center text-[#8b5a2b]/60 text-sm">
               <div className="flex items-center gap-2">
                  <BookOpen size={16} />
                  <span>黛玉葬花</span>
               </div>
               <span>{currentIndex + 1} / {scenes.length}</span>
            </div>
          </div>
        </div>

        {/* Footer / Controls */}
        <div className="h-16 bg-[#f4f1ea] border-t border-[#dcd0c0] flex items-center justify-between px-8">
          <button 
            onClick={onPrev} 
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 font-serif font-bold px-4 py-2 rounded hover:bg-[#eaddcf] transition-colors ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'text-[#5c4033]'}`}
          >
            <ArrowLeft size={20} /> 上一页
          </button>

          <div className="w-1/3 h-1 bg-[#dcd0c0] rounded-full overflow-hidden hidden md:block">
              <div className="h-full bg-[#8b5a2b] transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>

          {currentIndex === scenes.length - 1 ? (
            <button 
                onClick={onReset}
                className="flex items-center gap-2 font-serif font-bold px-4 py-2 rounded text-[#5c4033] hover:bg-[#eaddcf] transition-colors"
            >
                重新阅读 <BookOpen size={20} />
            </button>
          ) : (
            <button 
                onClick={onNext}
                className="flex items-center gap-2 font-serif font-bold px-4 py-2 rounded text-[#5c4033] hover:bg-[#eaddcf] transition-colors"
            >
                下一页 <ArrowRight size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookViewer;