import React, { useState, useRef, useEffect } from 'react';
import { X, ExternalLink, Volume2, VolumeX } from 'lucide-react';

export function parseYouTubeUrl(url?: string) {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  if (!match) return null;
  const videoId = match[1];
  
  let start = 0;
  const tMatch = url.match(/[?&](?:t|start)=(\d+)/);
  if (tMatch) {
    start = parseInt(tMatch[1], 10);
  }
  return { videoId, start };
}

export interface GameFrame {
  id: string;
  name: string;
  shortName: string;
  rank: string;
  role?: string;
  server?: string;
  detail: string;
  image: string;
  video?: string;
  color?: string;
  glow?: string;
}

export const defaultGameFrames: GameFrame[] = [
  {
    id: "val",
    name: "VALORANT",
    shortName: "VALORANT",
    rank: "Ascendant",
    role: "NEON",
    server: "HONGKONG",
    detail: "Tay to gánh team, phản xạ Op đỉnh cao, xử lý tình huống thần tốc.",
    image: "https://res.cloudinary.com/wos7u4ud/image/upload/v1789757149/314834511c46674f52d7529cec371a07.jpg",
    video: "https://www.youtube.com/embed/AnGdzz-XWcE",
    color: "#ffffff",
    glow: "rgba(255, 255, 255, 0.08)"
  },
  {
    id: "tft",
    name: "TEAMFIGHT TACTICS",
    shortName: "TFT",
    rank: "Diamond",
    role: "SPAM 1V 3SAO",
    server: "VIETNAM",
    detail: "Xoay bài tư duy nhạy bén, giáo án độc lạ mỗi buổi tối livestream.",
    image: "https://res.cloudinary.com/wos7u4ud/image/upload/v1789757259/1903_Every-TFT-Set.jpg",
    video: "https://www.youtube.com/embed/8re3B91yli8?list=PLNLR0XKc_IdSaBcU6mp7cgY1U3gmI-o67",
    color: "#ffffff",
    glow: "rgba(255, 255, 255, 0.08)"
  },
  {
    id: "lol",
    name: "LEAGUE OF LEGENDS",
    shortName: "LOL",
    rank: "Grandmaster",
    role: "GAREN",
    server: "VIETNAM",
    detail: "Kỹ năng đè đường cực khét, outplay đẹp mắt, tạo tiếng cười cho anh em.",
    image: "https://res.cloudinary.com/wos7u4ud/image/upload/v1789757259/EGS_LeagueofLegends_RiotGames_S1_2560x1440-47eb328eac5ddd63ebd096ded7d0d5ab_1.jpg",
    video: "https://youtu.be/gMkuV5hh7-s?list=PLbAFXJC0J5GaupX-BYDsT12YfCUppoxHc&t=17",
    color: "#ffffff",
    glow: "rgba(255, 255, 255, 0.08)"
  },
  {
    id: "cs2",
    name: "COUNTER-STRIKE 2",
    shortName: "CS2",
    rank: "GLOBAL / 22K",
    role: "AK47",
    server: "HONGKONG",
    detail: "Sấy súng chuẩn từng pixel, bắt góc kê tâm chuẩn chỉ, clutch sắc bén.",
    image: "https://res.cloudinary.com/wos7u4ud/image/upload/v1789757148/cau-hinh-choi-cs2-2.jpg",
    video: "https://www.youtube.com/embed/c1Ea_lDFUOI",
    color: "#ffffff",
    glow: "rgba(255, 255, 255, 0.08)"
  }
];

export type FrameInteractiveMode = 'idle' | 'video' | 'info';

interface GameSquareItemProps {
  key?: React.Key;
  frame: GameFrame;
  idx: number;
  borderClass: string;
  mode: FrameInteractiveMode;
  isInView?: boolean;
  onFrameClick: () => void;
  onBackToVideo: () => void;
  onClose: () => void;
}

function GameSquareItem({
  frame,
  borderClass,
  mode,
  isInView = true,
  onFrameClick,
  onBackToVideo,
  onClose,
}: GameSquareItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  
  const [isMuted, setIsMuted] = useState(true);
  const isMutedRef = useRef(isMuted);
  
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytInfo = frame.video ? parseYouTubeUrl(frame.video) : null;

  const isSelected = mode === 'video' || mode === 'info';
  const isInfoOpen = mode === 'info';

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (!isInView) {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      setIsHovered(false);
      setIsVideoVisible(false);
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      window.dispatchEvent(new Event('page_audio_off'));
      window.dispatchEvent(new Event('page2_or_3_video_stop'));
      return;
    }

    if (isSelected) {
      setIsVideoVisible(true);
      if (videoRef.current) {
        videoRef.current.muted = isMutedRef.current;
        videoRef.current.volume = 1;
        videoRef.current.play().catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => {});
          }
        });
      }
      if (!isMutedRef.current) {
        window.dispatchEvent(new Event('page_audio_on'));
        window.dispatchEvent(new Event('request_hero_sound_off'));
      } else {
        window.dispatchEvent(new Event('page_audio_off'));
        window.dispatchEvent(new Event('request_hero_sound_on'));
      }
    } else if (isHovered) {
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
      hoverTimerRef.current = setTimeout(() => {
        setIsVideoVisible(true);
        if (videoRef.current) {
          videoRef.current.muted = isMutedRef.current;
          videoRef.current.volume = 1;
          videoRef.current.play().catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          });
        }
        if (!isMutedRef.current) {
          window.dispatchEvent(new Event('page_audio_on'));
          window.dispatchEvent(new Event('request_hero_sound_off'));
        } else {
          window.dispatchEvent(new Event('page_audio_off'));
          window.dispatchEvent(new Event('request_hero_sound_on'));
        }
      }, 1000);
    } else {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
      setIsVideoVisible(false);
      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      window.dispatchEvent(new Event('page_audio_off'));
      window.dispatchEvent(new Event('page2_or_3_video_stop'));
    }

    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      window.dispatchEvent(new Event('page_audio_off'));
      window.dispatchEvent(new Event('page2_or_3_video_stop'));
    };
  }, [isSelected, isHovered, isInView]);

  useEffect(() => {
    const handleHeroSoundState = (e: CustomEvent<{ isHeroActive: boolean }>) => {
      const isHeroActive = !!e.detail?.isHeroActive;
      if (isHeroActive) {
        setIsMuted(true);
        isMutedRef.current = true;
        if (videoRef.current) {
          videoRef.current.muted = true;
        }
      } else {
        setIsMuted(false);
        isMutedRef.current = false;
        if (videoRef.current) {
          videoRef.current.muted = false;
          videoRef.current.volume = 1;
        }
      }
    };

    window.addEventListener('hero_sound_state_change', handleHeroSoundState as EventListener);
    return () => {
      window.removeEventListener('hero_sound_state_change', handleHeroSoundState as EventListener);
    };
  }, []);

  const handleToggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    isMutedRef.current = nextMuted;

    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = 1;
    }

    if (!nextMuted) {
      window.dispatchEvent(new Event('page_audio_on'));
      window.dispatchEvent(new Event('request_hero_sound_off'));
    } else {
      window.dispatchEvent(new Event('page_audio_off'));
      window.dispatchEvent(new Event('request_hero_sound_on'));
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      onClick={onFrameClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative h-full w-full overflow-hidden ${borderClass} bg-black cursor-pointer select-none transition-colors duration-300`}
    >
      <img
        src={frame.image}
        alt={frame.name}
        referrerPolicy="no-referrer"
        onError={(e) => {
          if (ytInfo) {
            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytInfo.videoId}/hqdefault.jpg`;
          }
        }}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
          isHovered || isSelected ? 'scale-105' : 'scale-100'
        } ${
          isVideoVisible ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {frame.video && (
        ytInfo ? (
          <div
            className={`absolute inset-0 w-full h-full z-10 overflow-hidden pointer-events-none transition-all duration-700 ease-out ${
              isHovered || isSelected ? 'scale-105' : 'scale-100'
            } ${
              isVideoVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {(isHovered || isSelected) && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${ytInfo.videoId}?autoplay=1&mute=${isMuted ? '1' : '0'}&loop=1&playlist=${ytInfo.videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&start=${ytInfo.start}&enablejsapi=1`}
                title={frame.name}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] pointer-events-none border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            )}
          </div>
        ) : (
          <video
            ref={videoRef}
            loop
            muted={isMuted}
            playsInline
            preload="metadata"
            className={`absolute inset-0 w-full h-full object-cover z-10 transition-all duration-700 ease-out ${
              isHovered || isSelected ? 'scale-105' : 'scale-100'
            } ${
              isVideoVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <source src={frame.video} type="video/mp4" />
          </video>
        )
      )}

      {(isVideoVisible || mode === 'video') && (
        <button
          type="button"
          onClick={handleToggleMute}
          onPointerDown={(e) => e.stopPropagation()}
          className="hoverable absolute top-4 right-4 z-40 p-2.5 rounded-full bg-white hover:bg-white/90 text-black border border-black/10 backdrop-blur-md transition-all shadow-2xl cursor-pointer pointer-events-auto flex items-center justify-center hover:scale-105 active:scale-95"
          title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {isMuted ? (
            <VolumeX size={18} className="text-black" />
          ) : (
            <Volume2 size={18} className="text-black animate-pulse" />
          )}
        </button>
      )}

      <div
        className={`absolute inset-x-0 bottom-0 h-40 z-20 pointer-events-none bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${
          isInfoOpen ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <div
        className={`absolute inset-x-0 bottom-0 z-30 p-5 sm:p-7 md:p-9 pointer-events-none transition-all duration-300 ${
          isInfoOpen ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-white/70 block mb-1">
              {mode === 'video' ? 'ĐANG PHÁT VIDEO • CHẠM ĐỂ XEM THÔNG TIN' : 'CHẠM ĐỂ XEM'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display text-white uppercase tracking-wider font-extrabold drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              {frame.name}
            </h2>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono text-white/40 tracking-wider pb-1">
            {frame.rank.split('•')[0].trim()}
          </span>
        </div>
      </div>

      <div
        className={`absolute inset-0 z-30 bg-black/85 backdrop-blur-md p-5 sm:p-7 md:p-10 flex flex-col justify-between transition-opacity duration-300 ${
          isInfoOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4 transition-all duration-500 ease-out transform ${
            isInfoOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ transitionDelay: isInfoOpen ? '60ms' : '0ms' }}
        >
          <div>
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-white/40 block">
              HỒ SƠ TRÒ CHƠI
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-display text-white uppercase tracking-wider font-bold mt-0.5">
              {frame.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBackToVideo();
              }}
              className="hoverable flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 hover:border-white/50 bg-white/10 hover:bg-white/20 text-white text-xs font-mono tracking-wider transition-colors cursor-pointer"
              title="Quay về video"
            >
              <span>XEM VIDEO</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="hoverable flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/15 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-mono tracking-wider transition-colors cursor-pointer"
              title="Đóng"
            >
              <X size={14} />
              <span className="hidden sm:inline">ĐÓNG</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 my-auto py-2">
          <div
            className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 border-b border-white/5 pb-2.5 transition-all duration-500 ease-out transform ${
              isInfoOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ transitionDelay: isInfoOpen ? '130ms' : '0ms' }}
          >
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/40 sm:w-32 shrink-0">
              HẠNG HIỆN TẠI:
            </span>
            <span className="text-sm sm:text-base md:text-lg font-mono text-white font-bold tracking-wide">
              {frame.rank}
            </span>
          </div>

          {frame.role && (
            <div
              className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 border-b border-white/5 pb-2.5 transition-all duration-500 ease-out transform ${
                isInfoOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ transitionDelay: isInfoOpen ? '200ms' : '0ms' }}
            >
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/40 sm:w-32 shrink-0">
                VỊ TRÍ / TƯỚNG:
              </span>
              <span className="text-xs sm:text-sm md:text-base font-mono text-white/90">
                {frame.role}
              </span>
            </div>
          )}

          {frame.server && (
            <div
              className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 border-b border-white/5 pb-2.5 transition-all duration-500 ease-out transform ${
                isInfoOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ transitionDelay: isInfoOpen ? '270ms' : '0ms' }}
            >
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/40 sm:w-32 shrink-0">
                MÁY CHỦ:
              </span>
              <span className="text-xs sm:text-sm font-mono text-white/80">
                {frame.server}
              </span>
            </div>
          )}

          <div
            className={`flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 transition-all duration-500 ease-out transform ${
              isInfoOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            style={{ transitionDelay: isInfoOpen ? '340ms' : '0ms' }}
          >
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/40 sm:w-32 shrink-0">
              CHI TIẾT:
            </span>
            <span className="text-xs sm:text-sm md:text-base font-sans text-white/75 leading-relaxed">
              {frame.detail}
            </span>
          </div>
        </div>

        <div
          className={`pt-3 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-xs font-mono text-white/50 tracking-wider transition-all duration-500 ease-out transform ${
            isInfoOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ transitionDelay: isInfoOpen ? '410ms' : '0ms' }}
        >
          {ytInfo ? (
            <a
              href={frame.video}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hoverable inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/60 border border-red-500/40 text-red-200 hover:text-white transition-all shadow-sm font-semibold"
            >
              <ExternalLink size={13} />
              <span>XEM TRÊN YOUTUBE</span>
            </a>
          ) : (
            <span>SẾP HOÀNG 93 &bull; LIVESTREAM</span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBackToVideo();
            }}
            className="hoverable text-white/80 hover:text-white transition-colors underline underline-offset-4 decoration-white/30 hover:decoration-white cursor-pointer"
          >
            QUAY VỀ VIDEO ↺
          </button>
        </div>
      </div>
    </div>
  );
}

interface QuadGameFramesProps {
  frames?: GameFrame[];
  isInView?: boolean;
}

export function QuadGameFrames({
  frames = defaultGameFrames,
  isInView,
}: QuadGameFramesProps) {
  const [activeFrameState, setActiveFrameState] = useState<{
    idx: number | null;
    mode: FrameInteractiveMode;
  }>({ idx: null, mode: 'idle' });
  const [internalInView, setInternalInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setInternalInView(entry.isIntersecting && entry.intersectionRatio >= 0.3);
        });
      },
      { threshold: [0, 0.2, 0.35, 0.6] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const effectiveInView = isInView !== undefined ? isInView : internalInView;

  useEffect(() => {
    if (!effectiveInView) {
      setActiveFrameState({ idx: null, mode: 'idle' });
    }
  }, [effectiveInView]);

  const currentFrames = frames && frames.length === 4 ? frames : defaultGameFrames;

  const handleFrameClick = (idx: number) => {
    const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || 'ontouchstart' in window);

    setActiveFrameState((prev) => {
      if (prev.idx !== idx) {
        return { idx, mode: isMobile ? 'video' : (prev.mode === 'video' ? 'info' : 'video') };
      }

      if (prev.mode === 'video') {
        return { idx, mode: 'info' };
      } else if (prev.mode === 'info') {
        return { idx, mode: 'video' };
      } else {
        return { idx, mode: 'video' };
      }
    });
  };

  const handleBackToVideo = (idx: number) => {
    setActiveFrameState({ idx, mode: 'video' });
  };

  const handleCloseFrame = () => {
    setActiveFrameState({ idx: null, mode: 'idle' });
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-screen overflow-hidden bg-black select-none">
      <div className="absolute inset-0 w-full h-full grid grid-cols-1 sm:grid-cols-2 grid-rows-4 sm:grid-rows-2 z-0">
        {currentFrames.map((frame, idx) => {
          const borderClass =
            idx === 0
              ? 'sm:border-r border-b border-white/10'
              : idx === 1
              ? 'border-b border-white/10'
              : idx === 2
              ? 'sm:border-r border-b sm:border-b-0 border-white/10'
              : '';

          const itemMode: FrameInteractiveMode =
            activeFrameState.idx === idx ? activeFrameState.mode : 'idle';

          return (
            <GameSquareItem
              key={frame.id || idx}
              frame={frame}
              idx={idx}
              borderClass={borderClass}
              mode={itemMode}
              isInView={effectiveInView}
              onFrameClick={() => handleFrameClick(idx)}
              onBackToVideo={() => handleBackToVideo(idx)}
              onClose={handleCloseFrame}
            />
          );
        })}
      </div>
    </div>
  );
}