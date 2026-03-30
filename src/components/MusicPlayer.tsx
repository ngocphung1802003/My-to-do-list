import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Square, Music } from 'lucide-react';

export const MusicPlayer = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);

    return (
        <div className="fixed bottom-6 right-6 z-[100] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
            <style>{`
        .music-card { 
          width: 200px; height: 260px; 
          background: #121212; border-radius: 24px; 
          position: relative; overflow: hidden; 
          box-shadow: 0 20px 50px rgba(0,0,0,0.4); 
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }
        
        /* Khi thu nhỏ thành thanh ngang */
        .card-collapsed { 
          width: 220px; height: 50px; 
          border-radius: 15px; 
        }

        .card-glass { 
          width: 100%; height: 100%; z-index: 10; 
          position: absolute; background: rgba(255, 255, 255, 0.05); 
          backdrop-filter: blur(15px); border-radius: inherit; 
          border: 1px solid rgba(255, 255, 255, 0.1); 
          display: flex; align-items: center; justify-content: center;
        }

        .album-art { 
          width: 70px; height: 70px; 
          background: linear-gradient(45deg, #3B82F6, #8B5CF6); 
          border-radius: 18px; display: flex; align-items: center; justify-content: center; 
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
          animation: ${isPlaying ? 'pulse 2s infinite ease-in-out' : 'none'};
        }

        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.04); } 100% { transform: scale(1); } }
        
        .lava { position: absolute; filter: blur(30px); opacity: 0.6; border-radius: 50%; animation: move 10s infinite alternate; }
        .lava-1 { width: 100px; height: 100px; background: #8319a3; top: -20px; left: -20px; }
        .lava-2 { width: 100px; height: 100px; background: #1dd195; bottom: -20px; right: -20px; }
        
        @keyframes move { 0% { transform: translate(0, 0); } 100% { transform: translate(30px, 30px); } }
        
        .youtube-hidden { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
      `}</style>

            <div className={`music-card ${isCollapsed ? 'card-collapsed' : ''}`}>
                <div className="card-glass px-4 group">

                    {/* NÚT ĐÓNG/MỞ Ở TRÊN CÙNG */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute top-2 right-2 text-white/40 hover:text-white transition-colors"
                    >
                        {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>

                    {!isCollapsed ? (
                        /* GIAO DIỆN ĐẦY ĐỦ */
                        <div className="flex flex-col items-center w-full">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 mb-4">Aurora Radio</span>
                            <div className="album-art mb-4">
                                <Music className="text-white w-8 h-8" />
                            </div>
                            <p className="text-white font-bold text-sm text-center truncate w-full px-2">Nobody New</p>
                            <p className="text-white/30 text-[10px] uppercase tracking-widest mt-1">The Marías</p>

                            {/* NÚT ĐIỀU KHIỂN */}
                            <div className="flex items-center gap-6 mt-6">
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                                >
                                    {isPlaying ? <Square size={16} fill="white" /> : <Play size={18} fill="white" className="ml-1" />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* GIAO DIỆN THANH NGANG (MINI BAR) */
                        <div className="flex items-center justify-between w-full pr-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <Music size={14} className="text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-white leading-none">Nobody New</span>
                                    <span className="text-[8px] text-white/40 uppercase tracking-tighter">Playing</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                {isPlaying ? <Square size={14} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                            </button>
                        </div>
                    )}
                </div>

                {/* Hiệu ứng màu Lava giữ nguyên */}
                <div className="lava lava-1"></div>
                <div className="lava lava-2"></div>

                {/* Youtube Engine */}
                {isPlaying && (
                    <iframe
                        className="youtube-hidden"
                        src="https://www.youtube.com/embed/nTejAxg7byc?autoplay=1&mute=0&loop=1&playlist=nTejAxg7byc&enablejsapi=1"
                        allow="autoplay"
                    />
                )}
            </div>
        </div>
    );
};