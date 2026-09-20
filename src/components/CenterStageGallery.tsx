import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MoveHorizontal, Volume2, VolumeX } from 'lucide-react';

export interface GalleryItem {
  id?: string;
  title?: string;
  image: string;
  video: string;
}

interface CenterStageGalleryProps {
  items: GalleryItem[];
  isInView?: boolean;
}

function getCircularOffset(i: number, activeIndex: number, length: number): number {
  if (length <= 1) return 0;
  let diff = (i - activeIndex) % length;
  if (diff > length / 2) {
    diff -= length;
  } else if (diff < -length / 2) {
    diff += length;
  }
  return diff;
}

export function CenterStageGallery({
  items,
  isInView,
}: CenterStageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoveringCenter, setIsHoveringCenter] = useState(false);
  const [showCenterVideo, setShowCenterVideo] = useState(false);
  
  const [isMuted, setIsMuted] = useState(true);
  const isMutedRef = useRef(isMuted); 
  
  const [internalInView, setInternalInView] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragCurrentX, setDragCurrentX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef<number>(0);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

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
  const total = items.length;

  const goToNext = () => {
    if (total === 0) return;
    setActiveIndex(prev => (prev + 1) % total);
  };

  const goToPrev = () => {
    if (total === 0) return;
    setActiveIndex(prev => (prev - 1 + total) % total);
  };

  useEffect(() => {
    if (!effectiveInView) {
      if (!isMutedRef.current) {
        setIsMuted(true);
        isMutedRef.current = true;
        if (videoRef.current) videoRef.current.muted = true;
        window.dispatchEvent(new Event('page_audio_off'));
        window.dispatchEvent(new Event('request_hero_sound_on'));
      }
    }
  }, [effectiveInView]);

  useEffect(() => {
    setShowCenterVideo(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    if (!effectiveInView) return;

    hoverTimerRef.current = setTimeout(() => {
      setShowCenterVideo(true);
      if (videoRef.current) {
        videoRef.current.muted = isMutedRef.current;
        videoRef.current.volume = 1;
        videoRef.current.play().catch(() => {});
      }
    }, 700);

    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, [activeIndex, effectiveInView]);

  useEffect(() => {
    const handleHeroSoundState = (e: CustomEvent<{ isHeroActive: boolean }>) => {
      const isHeroActive = !!e.detail?.isHeroActive;
      if (isHeroActive) {
        setIsMuted(true);
        isMutedRef.current = true;
        if (videoRef.current) videoRef.current.muted = true;
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

  const clampedActiveIndex = Math.max(0, Math.min(items.length - 1, activeIndex));
  if (clampedActiveIndex !== activeIndex && items.length > 0) {
    setActiveIndex(clampedActiveIndex);
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartX(e.clientX);
    setDragCurrentX(e.clientX);
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || dragStartX === null) return;
    setDragCurrentX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || dragStartX === null) return;
    const diff = (dragCurrentX ?? e.clientX) - dragStartX;
    if (diff < -40) goToNext();
    else if (diff > 40) goToPrev();
    setIsDragging(false);
    setDragStartX(null);
    setDragCurrentX(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > 20) {
      const now = Date.now();
      if (now - lastWheelTime.current < 250) return;
      lastWheelTime.current = now;
      if (e.deltaX > 20) goToNext();
      else goToPrev();
    }
  };

  const handleScrubberInteraction = (clientX: number, rect: DOMRect) => {
    const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setActiveIndex(Math.round(fraction * (items.length - 1)));
  };

  const handleScrubberMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    handleScrubberInteraction(e.clientX, rect);
    const onMouseMove = (moveEvent: MouseEvent) => handleScrubberInteraction(moveEvent.clientX, rect);
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6 select-none z-20">
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className="relative w-full h-[22rem] sm:h-[26rem] md:h-[30rem] lg:h-[34rem] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ perspective: '1200px' }}
      >
        {items.map((item, i) => {
          const offset = getCircularOffset(i, activeIndex, total);
          const absOffset = Math.abs(offset);
          const isCenter = offset === 0;
          const maxVisible = Math.min(3, Math.floor((total - 1) / 2));
          const isVisible = absOffset <= maxVisible;
          const isBuffer = absOffset === maxVisible + 1;
          
          if (!isVisible && !isBuffer) return null;
          
          const translateX = offset * 210 + (offset !== 0 ? (offset > 0 ? 40 : -40) : 0);
          const scale = isCenter ? 1.15 : Math.max(0.65, 0.9 - absOffset * 0.12);
          const opacity = isBuffer ? 0 : (isCenter ? 1 : Math.max(0.2, 0.75 - absOffset * 0.22));
          const zIndex = isBuffer ? 0 : (30 - absOffset * 5);
          const rotateY = offset * -14;

          return (
            <div
              key={i}
              onClick={() => { if (!isCenter && !isDragging) setActiveIndex(i); }}
              onMouseEnter={() => { if (isCenter) setIsHoveringCenter(true); }}
              onMouseLeave={() => { if (isCenter) setIsHoveringCenter(false); }}
              className={`absolute transition-all duration-500 ease-out origin-center rounded-xl overflow-hidden shadow-2xl ${isCenter ? 'border-2 border-[#E4AA24]/90 shadow-[0_0_35px_rgba(228,170,36,0.35)]' : 'border border-white/10 hover:border-white/30 cursor-pointer'} ${isBuffer ? 'pointer-events-none' : ''}`}
              style={{
                width: 'clamp(180px, 20vw, 260px)',
                height: 'clamp(280px, 32vw, 420px)',
                transform: `translateX(${translateX}px) scale(${scale * (isCenter && isHoveringCenter ? 1.05 : 1)}) rotateY(${rotateY}deg)`,
                opacity,
                zIndex,
              }}
            >
              <img
                src={item.image}
                alt={`Story ${i + 1}`}
                className={`absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-all duration-700 ease-out ${isCenter && isHoveringCenter ? 'scale-105' : 'scale-100'} ${isCenter && showCenterVideo ? 'opacity-0' : 'opacity-100'}`}
                loading="lazy"
              />
              
              {isCenter && (
                <video
                  ref={videoRef}
                  src={item.video}
                  loop
                  muted={isMuted}
                  playsInline
                  webkit-playsinline="true"
                  x5-playsinline="true"
                  controls={false}
                  className={`absolute inset-0 w-full h-full object-cover pointer-events-none select-none transition-all duration-700 ease-out scale-105 ${showCenterVideo ? 'opacity-100' : 'opacity-0'}`}
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-30">
                <span className={`text-[11px] font-display uppercase tracking-widest px-2 py-0.5 rounded backdrop-blur-md ${isCenter ? 'bg-[#E4AA24] text-black font-bold' : 'bg-black/60 text-white/70 border border-white/10'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                
                {isCenter && (
                  <button
                    type="button"
                    onClick={handleToggleMute}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="hoverable pointer-events-auto relative z-50 p-1.5 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 backdrop-blur-md transition-all shadow-xl cursor-pointer active:scale-95 flex items-center justify-center hover:scale-110"
                    title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                  >
                    {isMuted ? <VolumeX size={15} className="text-white/70 hover:text-white" /> : <Volume2 size={15} className="text-emerald-400 animate-pulse" />}
                  </button>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3 pointer-events-none z-10">
                <div className="text-[12px] font-display uppercase tracking-wider text-white drop-shadow-md truncate">
                  {item.title || `STORY EPISODE #${i + 1}`}
                </div>
              </div>
            </div>
          );
        })}

        <button onClick={goToPrev} className="hoverable absolute left-4 lg:left-12 z-40 p-3 rounded-full bg-black/60 border border-white/20 text-white transition-all backdrop-blur-md hover:bg-[#E4AA24] hover:text-black cursor-pointer hover:border-[#E4AA24] shadow-xl"><ChevronLeft size={24} /></button>
        <button onClick={goToNext} className="hoverable absolute right-4 lg:right-12 z-40 p-3 rounded-full bg-black/60 border border-white/20 text-white transition-all backdrop-blur-md hover:bg-[#E4AA24] hover:text-black cursor-pointer hover:border-[#E4AA24] shadow-xl"><ChevronRight size={24} /></button>
      </div>

      <div className="w-full max-w-xl px-6 mt-4 flex flex-col items-center gap-3">
        <div onMouseDown={handleScrubberMouseDown} className="relative w-full h-8 flex items-center cursor-pointer group py-2">
          <div className="w-full h-[2px] bg-white/15 relative overflow-hidden rounded-full">
            <div className="h-full bg-gradient-to-r from-[#E4AA24]/50 to-[#E4AA24] transition-all duration-300" style={{ width: `${((activeIndex + 1) / items.length) * 100}%` }} />
          </div>
          <div className="absolute inset-x-0 flex justify-between pointer-events-none px-0.5">
            {items.map((_, idx) => (
              <div key={idx} className={`transition-all duration-300 ${idx === activeIndex ? 'h-4 w-[3px] bg-[#E4AA24] shadow-[0_0_8px_#E4AA24]' : 'h-2 w-[1.5px] bg-white/30 group-hover:bg-white/50'}`} />
            ))}
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-all duration-300 flex flex-col items-center" style={{ left: `${(activeIndex / (items.length - 1)) * 100}%` }}>
            <div className="w-1.5 h-6 bg-[#E4AA24] rounded-sm shadow-[0_0_12px_#E4AA24]" />
          </div>
        </div>
        <div className="flex items-center justify-center w-full text-xs tracking-widest uppercase font-mono">
          <div className="flex items-center justify-center gap-2 max-w-full min-w-0">
            <MoveHorizontal size={14} className="text-[#E4AA24] animate-pulse shrink-0" />
            <span className="text-[#E4AA24] font-display font-bold tracking-wider text-xs sm:text-sm md:text-base truncate drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              {items[activeIndex]?.title || `STORY EPISODE #${activeIndex + 1}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}