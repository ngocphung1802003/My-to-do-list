import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Music } from 'lucide-react';

export const MusicPlayer = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    return (
        <div className="fixed bottom-8 right-8 z-[100] group select-none transition-all duration-500 hover:scale-110">
            <style>{`
        .music-card {
          width: 190px;
          height: 254px;
          background: #212121;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .card-glass {
          width: 100%;
          height: 100%;
          z-index: 10;
          position: absolute;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .title-tag {
          padding: 4px 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-top: 15px;
          font-size: 10px;
          border-radius: 12px;
          color: rgba(0, 0, 0, 0.8);
          font-weight: bold;
          text-transform: uppercase;
        }

        .album-art {
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, #3B82F6, #8B5CF6);
          margin: 25px auto;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .song-name {
          color: white;
          font-size: 14px;
          font-weight: 800;
          text-align: center;
          margin-top: -10px;
        }

        .artist-name {
          color: rgba(0, 0, 0, 0.5);
          font-size: 10px;
          margin-top: 5px;
        }

        .lava-1 {
          width: 80px;
          height: 80px;
          background-color: #8319a3;
          filter: blur(20px);
          border-radius: 50%;
          position: absolute;
          top: 30px;
          left: 20px;
          animation: lava-move-1 8s infinite alternate;
        }

        .lava-2 {
          width: 80px;
          height: 80px;
          background-color: #1dd195;
          filter: blur(20px);
          border-radius: 50%;
          position: absolute;
          bottom: 30px;
          right: 20px;
          animation: lava-move-2 8s infinite alternate;
        }

        @keyframes lava-move-1 {
          0% { top: 10%; left: 10%; }
          100% { top: 60%; left: 50%; }
        }

        @keyframes lava-move-2 {
          0% { bottom: 10%; right: 10%; }
          100% { bottom: 60%; right: 50%; }
        }

        /* Ẩn Iframe */
        .youtube-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
            <div className={`music-card ${isCollapsed ? 'card-collapsed' : ''}`}>
                <div className="card-glass group">
                    {/* Nút thu nhỏ/mở rộng */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -top-2 -right-2 bg-white/20 p-1.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity z-50 text-white"
                    >
                        {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {!isCollapsed ? (
                        <>
                            <span className="text-[10px] text-white/50 font-bold uppercase mt-4 tracking-widest">Now Playing</span>
                            <div className="album-art">
                                <Music className="text-white w-8 h-8" />
                            </div>
                            <p className="text-white font-bold text-sm px-4 text-center truncate w-full">Nobody New</p>
                            <p className="text-white/40 text-[10px] mt-1 uppercase tracking-widest">The Marías</p>
                            <div className="flex gap-1.5 mt-6">
                                {[0.1, 0.3, 0.2, 0.4].map((d, i) => (
                                    <div key={i} className="w-1 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="album-art album-art-mini" onClick={() => setIsCollapsed(false)}>
                            <Music className="text-white w-4 h-4" />
                        </div>
                    )}
                </div>

                <div className="lava-1"></div>
                <div className="lava-2"></div>

                <iframe
                    className="youtube-hidden"
                    src="https://www.youtube.com/embed/nTejAxg7byc?autoplay=1&mute=0&loop=1&playlist=nTejAxg7byc&enablejsapi=1"
                    allow="autoplay"
                />
            </div>
        </div>
    );
};