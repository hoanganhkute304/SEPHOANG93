import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function HeroYouTubeBGM() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [isPageMediaPlaying, setIsPageMediaPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const manualPauseRef = useRef(false);
  const activeMediaCountRef = useRef(0);

  // ĐƯỜNG DẪN FILE NHẠC TỪ CLOUDINARY CỦA BẠN
  const AUDIO_SRC = 'https://res.cloudinary.com/wos7u4ud/video/upload/v1789797773/M.Sasuke_-_GG_EZ_LYRICS.mp3';

  // Play / Pause an toàn với thẻ HTML5 Audio
  const safePlay = () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = 1; // Mức âm lượng: 1 là Max, 0.5 là 50%
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          (window as any).__heroSoundActive = true;
          window.dispatchEvent(new CustomEvent('hero_sound_state_change', { detail: { isHeroActive: true } }));
        }).catch((err) => {
          console.warn("Trình duyệt tạm thời chặn Audio, chờ người dùng click chuột:", err);
        });
      }
    } catch {}
  };

  const safePause = () => {
    if (!audioRef.current) return;
    try {
      audioRef.current.pause();
      setIsPlaying(false);
      (window as any).__heroSoundActive = false;
      window.dispatchEvent(new CustomEvent('hero_sound_state_change', { detail: { isHeroActive: false } }));
    } catch {}
  };

  // Đồng bộ trạng thái Tắt/Mở âm (Muted)
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Tự động phát khi người dùng click, gõ phím hoặc chạm vào màn hình lần đầu
  useEffect(() => {
    const handleFirstGesture = () => {
      if (!userInteracted) {
        setUserInteracted(true);
        if (audioRef.current && !manualPauseRef.current && !isPageMediaPlaying) {
          audioRef.current.muted = false;
          safePlay();
        }
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [userInteracted, isPageMediaPlaying]);

  // Lắng nghe sự kiện bật/tắt tiếng của các video khác (trang 2, 3) để ngắt nhạc nền tự động
  useEffect(() => {
    const handleAudioOn = () => {
      activeMediaCountRef.current = Math.max(1, activeMediaCountRef.current + 1);
      setIsPageMediaPlaying(true);
      safePause();
    };

    const handleAudioOff = () => {
      activeMediaCountRef.current = Math.max(0, activeMediaCountRef.current - 1);
      if (activeMediaCountRef.current === 0) {
        setIsPageMediaPlaying(false);
        if (!manualPauseRef.current) safePlay();
      }
    };

    window.addEventListener('page_audio_on', handleAudioOn);
    window.addEventListener('page_audio_off', handleAudioOff);
    window.addEventListener('hero_music_pause', handleAudioOn);
    window.addEventListener('hero_music_resume', handleAudioOff);

    return () => {
      window.removeEventListener('page_audio_on', handleAudioOn);
      window.removeEventListener('page_audio_off', handleAudioOff);
      window.removeEventListener('hero_music_pause', handleAudioOn);
      window.removeEventListener('hero_music_resume', handleAudioOff);
    };
  }, []);

  // Hàm chuyển đổi Trạng thái Phát/Dừng khi người dùng bấm nút
  const togglePlay = () => {
    if (isPlaying) {
      manualPauseRef.current = true;
      setIsMuted(true);
      safePause();
    } else {
      manualPauseRef.current = false;
      setIsMuted(false);
      safePlay();
    }
  };

  // Bắt sự kiện khi người dùng bấm vào nút "BGM: GG EZ" từ file Hero.tsx
  useEffect(() => {
    const handleToggleFromHero = () => {
      if (!userInteracted) setUserInteracted(true);
      togglePlay();
    };

    window.addEventListener('toggle_hero_youtube_bgm', handleToggleFromHero);
    return () => {
      window.removeEventListener('toggle_hero_youtube_bgm', handleToggleFromHero);
    };
  }, [isPlaying, userInteracted]);

  return (
    <>
      {/* THẺ AUDIO GỐC CỦA HTML5 (NẰM ẨN) */}
      <audio 
        ref={audioRef} 
        src={AUDIO_SRC} 
        loop 
        preload="auto" 
        className="hidden"
      />

      {/* NÚT TẮT/BẬT LƠ LỬNG Ở GÓC DƯỚI BÊN PHẢI */}
      <div 
        id="floating-bgm-controller"
        className="fixed bottom-5 right-[5.25rem] z-[150] flex items-center font-sans"
      >
        <button
          onClick={() => {
            if (!userInteracted) setUserInteracted(true);
            togglePlay();
          }}
          className="hoverable group relative flex items-center gap-2 px-3 py-2.5 rounded-full bg-[#18181c] hover:bg-[#202026] text-white border border-white/15 shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
          title={isPlaying ? "Tắt nhạc nền (GG EZ)" : "Bật nhạc nền (GG EZ)"}
        >
          {isPlaying ? (
            <>
              <div className="flex items-center gap-0.5 h-3.5 px-0.5">
                <span className="w-0.5 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="w-0.5 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-0.5 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                <span className="w-0.5 h-3.5 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
              </div>
              <Volume2 size={16} className="text-red-500" />
              <span className="hidden sm:inline text-[11px] font-mono font-bold tracking-wider text-white/90 pr-1">
                BGM: GG EZ
              </span>
            </>
          ) : (
            <>
              <VolumeX size={16} className="text-white/50 group-hover:text-white transition-colors" />
              <span className="hidden sm:inline text-[11px] font-mono font-semibold tracking-wider text-white/50 group-hover:text-white pr-1 transition-colors">
                BẬT NHẠC
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
}