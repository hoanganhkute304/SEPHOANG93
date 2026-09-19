import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Volume1, Music, Sliders, Check, Link as LinkIcon, RotateCcw } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  tag: string;
  src: string;
}

export const defaultPlaylist: AudioTrack[] = [
  {
    id: "cyber-pulse",
    title: "CYBER PULSE (MAIN THEME)",
    artist: "SẾP HOÀNG 93 GAMING",
    tag: "CYBER SYNTH",
    src: "/audio/cyber-pulse.mp3"
  },
  {
    id: "neon-racer",
    title: "NEON OVERDRIVE",
    artist: "VALORANT CLUTCH BEAT",
    tag: "ELECTRO GAMING",
    src: "/audio/neon-racer.mp3"
  },
  {
    id: "arcade-rush",
    title: "ARCADE RUSH",
    artist: "SPEEDRUN BATTLE",
    tag: "GLITCH ELECTRONIC",
    src: "/audio/arcade-rush.mp3"
  },
  {
    id: "victory-anthem",
    title: "VICTORY ANTHEM",
    artist: "ESPORTS GLORY",
    tag: "CHAMPIONS THEME",
    src: "/audio/victory-anthem.mp3"
  }
];

interface HeroAudioPlayerProps {
  isEditMode?: boolean;
}

export function HeroAudioPlayer({ isEditMode }: HeroAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [playlist, setPlaylist] = useState<AudioTrack[]>(defaultPlaylist);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.45);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [needsUserGesture, setNeedsUserGesture] = useState<boolean>(false);
  const [customTrackUrl, setCustomTrackUrl] = useState<string>('');
  const [customTrackTitle, setCustomTrackTitle] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string>('');

  const currentTrack = playlist[currentTrackIndex] || defaultPlaylist[0];

  // Load saved music preference from Firestore/localStorage
  useEffect(() => {
    async function loadSavedMusic() {
      try {
        const local = localStorage.getItem('sh93_bgm_config');
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed.customTrack && parsed.customTrack.src) {
            setPlaylist([parsed.customTrack, ...defaultPlaylist]);
            setCurrentTrackIndex(0);
          }
          if (parsed.trackIndex !== undefined && parsed.trackIndex < defaultPlaylist.length) {
            setCurrentTrackIndex(parsed.trackIndex);
          }
          if (typeof parsed.volume === 'number') {
            setVolume(parsed.volume);
          }
        }

        // Check Firestore doc
        const snap = await getDoc(doc(db, "wallpapers", "hero-music"));
        if (snap.exists()) {
          const data = snap.data();
          if (data.customTrack && data.customTrack.src) {
            setPlaylist([data.customTrack, ...defaultPlaylist]);
            setCurrentTrackIndex(0);
          } else if (data.trackId) {
            const idx = defaultPlaylist.findIndex(t => t.id === data.trackId);
            if (idx !== -1) setCurrentTrackIndex(idx);
          }
        }
      } catch (err) {
        console.warn("Could not load music settings from cloud", err);
      }
    }
    loadSavedMusic();
  }, []);

  // Update volume on audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Attempt initial playback or wait for first user gesture
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;

    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setNeedsUserGesture(false);
      } catch {
        // Autoplay blocked by browser policy
        setIsPlaying(false);
        setNeedsUserGesture(true);
      }
    };

    tryPlay();

    // Auto-play on first user click anywhere if waiting for gesture
    const handleFirstInteraction = () => {
      if (audio && audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
          setNeedsUserGesture(false);
        }).catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // When track index changes, load and play
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.src;
    audio.load();
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, playlist]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setNeedsUserGesture(false);
      }).catch(err => {
        console.error("Audio playback error", err);
      });
    }
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = percent * duration;
  };

  const handleSaveCustomTrack = async () => {
    if (!customTrackUrl.trim()) return;
    const newTrack: AudioTrack = {
      id: `custom-${Date.now()}`,
      title: customTrackTitle.trim() || 'CUSTOM GAMING TRACK',
      artist: 'SẾP HOÀNG PICK',
      tag: 'CUSTOM BGM',
      src: customTrackUrl.trim()
    };
    const updated = [newTrack, ...defaultPlaylist.filter(t => !t.id.startsWith('custom-'))];
    setPlaylist(updated);
    setCurrentTrackIndex(0);
    setIsPlaying(true);
    setSaveStatus('Đã lưu bài nhạc!');
    setTimeout(() => setSaveStatus(''), 2500);

    // Save to localStorage
    try {
      localStorage.setItem('sh93_bgm_config', JSON.stringify({ customTrack: newTrack, volume }));
      await setDoc(doc(db, "wallpapers", "hero-music"), { customTrack: newTrack, volume }, { merge: true });
    } catch {
      // ignore
    }
  };

  const handleResetDefault = () => {
    setPlaylist(defaultPlaylist);
    setCurrentTrackIndex(0);
    localStorage.removeItem('sh93_bgm_config');
    setCustomTrackUrl('');
    setCustomTrackTitle('');
    setSaveStatus('Đã khôi phục mặc định');
    setTimeout(() => setSaveStatus(''), 2500);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative inline-flex items-center">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="auto"
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={handleNextTrack}
      />

      {/* Main Bar / Pill on Header */}
      <div 
        id="header-music-widget"
        className="flex items-center gap-2 md:gap-3 bg-black/80 hover:bg-black/90 backdrop-blur-md border border-white/20 hover:border-accent/60 px-3 py-1.5 md:px-3.5 md:py-2 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-all duration-300"
      >
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className={`hoverable relative flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full transition-all duration-300 ${
            isPlaying 
              ? 'bg-accent text-white shadow-[0_0_12px_rgba(217,4,41,0.6)] scale-105' 
              : 'bg-white/10 hover:bg-white/20 text-white'
          }`}
          title={isPlaying ? "Tạm dừng nhạc" : "Phát nhạc nền"}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <Pause size={13} className="fill-current" />
          ) : (
            <Play size={13} className="fill-current ml-0.5" />
          )}
        </button>

        {/* Equalizer Wave / Playing Visualizer */}
        <div 
          onClick={togglePlay}
          className="flex items-end gap-0.5 h-3.5 cursor-pointer px-0.5"
          title={isPlaying ? "Đang phát nhạc" : "Đã tạm dừng"}
        >
          <span className={`w-0.5 bg-accent rounded-full transition-all duration-200 ${isPlaying ? 'animate-[bounce_0.8s_ease-in-out_infinite] h-3.5' : 'h-1 bg-white/30'}`} style={{ animationDelay: '0ms' }} />
          <span className={`w-0.5 bg-accent rounded-full transition-all duration-200 ${isPlaying ? 'animate-[bounce_0.6s_ease-in-out_infinite] h-2.5' : 'h-1.5 bg-white/30'}`} style={{ animationDelay: '150ms' }} />
          <span className={`w-0.5 bg-accent rounded-full transition-all duration-200 ${isPlaying ? 'animate-[bounce_0.9s_ease-in-out_infinite] h-4' : 'h-1 bg-white/30'}`} style={{ animationDelay: '300ms' }} />
          <span className={`w-0.5 bg-accent rounded-full transition-all duration-200 ${isPlaying ? 'animate-[bounce_0.7s_ease-in-out_infinite] h-2' : 'h-1.5 bg-white/30'}`} style={{ animationDelay: '450ms' }} />
        </div>

        {/* Track Title Display */}
        <div 
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          className="hoverable flex flex-col justify-center cursor-pointer max-w-[110px] md:max-w-[160px] text-left select-none"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] md:text-[10px] font-mono text-accent font-bold tracking-wider uppercase">
              BGM
            </span>
            {needsUserGesture && !isPlaying && (
              <span className="text-[8px] bg-accent/30 text-white px-1 rounded animate-pulse">
                BẤM ĐỂ BẬT
              </span>
            )}
          </div>
          <span className="text-[11px] md:text-xs font-bold text-white tracking-wide truncate leading-tight">
            {currentTrack.title}
          </span>
        </div>

        {/* Skip Track Button */}
        <button
          onClick={handleNextTrack}
          className="hoverable p-1 text-white/60 hover:text-white transition-colors"
          title="Bài tiếp theo"
          aria-label="Next track"
        >
          <SkipForward size={14} />
        </button>

        {/* Volume Mute Toggle */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="hoverable p-1 text-white/60 hover:text-white transition-colors"
          title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          aria-label="Mute toggle"
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={14} className="text-red-400" />
          ) : volume < 0.5 ? (
            <Volume1 size={14} />
          ) : (
            <Volume2 size={14} />
          )}
        </button>

        {/* Menu / Playlist Trigger */}
        <button
          onClick={() => setIsOpenMenu(!isOpenMenu)}
          className={`hoverable p-1 rounded transition-colors ${isOpenMenu ? 'text-accent bg-white/10' : 'text-white/60 hover:text-white'}`}
          title="Danh sách bài nhạc & Cài đặt"
          aria-label="Playlist options"
        >
          <Sliders size={13} />
        </button>
      </div>

      {/* Prominent Floating "Click to Unmute / Play BGM" Banner if browser blocked autoplay */}
      {needsUserGesture && !isPlaying && (
        <div 
          onClick={togglePlay}
          className="absolute top-12 left-0 right-0 sm:right-auto sm:w-72 bg-accent/95 hover:bg-accent text-white px-3.5 py-2 rounded-xl shadow-[0_10px_25px_rgba(217,4,41,0.5)] border border-white/20 backdrop-blur-md flex items-center gap-2.5 cursor-pointer z-50 animate-bounce transition-all duration-300"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Volume2 size={13} className="text-white animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold tracking-wide uppercase">Bật nhạc nền Hero</span>
            <span className="text-[9px] text-white/80">Nhấn vào đây để phát nhạc gaming sống động</span>
          </div>
        </div>
      )}

      {/* Audio Drawer / Popup Modal */}
      {isOpenMenu && (
        <>
          {/* Backdrop click to close */}
          <div 
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs" 
            onClick={() => setIsOpenMenu(false)}
          />

          <div 
            id="hero-audio-menu"
            className="absolute top-14 right-0 z-50 w-80 sm:w-96 bg-[#0E0E0E]/95 border border-white/15 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-white select-none animate-in fade-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Music size={15} className="text-accent" />
                <span className="font-display tracking-[0.2em] text-sm text-white font-bold">
                  GAMING SOUNDTRACK
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent/20 text-accent font-semibold border border-accent/30">
                {currentTrack.tag}
              </span>
            </div>

            {/* Now Playing Card */}
            <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col truncate pr-2">
                  <span className="text-[10px] font-mono text-white/50 tracking-wider">ĐANG PHÁT</span>
                  <span className="text-sm font-bold text-white truncate">{currentTrack.title}</span>
                  <span className="text-[11px] text-white/60">{currentTrack.artist}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handlePrevTrack}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 transition-colors"
                    title="Bài trước"
                  >
                    <SkipBack size={14} />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-lg bg-accent hover:bg-accentHover text-white flex items-center justify-center shadow-[0_0_12px_rgba(217,4,41,0.5)] transition-transform active:scale-95"
                    title={isPlaying ? "Tạm dừng" : "Phát"}
                  >
                    {isPlaying ? <Pause size={14} className="fill-current" /> : <Play size={14} className="fill-current ml-0.5" />}
                  </button>
                  <button
                    onClick={handleNextTrack}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-white/80 transition-colors"
                    title="Bài tiếp"
                  >
                    <SkipForward size={14} />
                  </button>
                </div>
              </div>

              {/* Progress Bar & Seek */}
              <div className="flex flex-col gap-1">
                <div 
                  onClick={handleSeek}
                  className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer relative overflow-hidden group"
                >
                  <div 
                    className="h-full bg-accent rounded-full transition-all duration-100 relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <div className="flex justify-between text-[10px] font-mono text-white/40">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 pt-1">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className="text-white/60 hover:text-white"
                >
                  {isMuted ? <VolumeX size={14} className="text-accent" /> : <Volume2 size={14} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if (isMuted) setIsMuted(false);
                  }}
                  className="w-full h-1 bg-white/10 accent-accent rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-mono text-white/60 w-8 text-right">
                  {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                </span>
              </div>
            </div>

            {/* Playlist Section */}
            <div className="mt-3">
              <div className="text-[10px] font-mono text-white/50 tracking-wider mb-1.5 uppercase">
                Danh sách bài nhạc ({playlist.length})
              </div>
              <div className="flex flex-col gap-1 max-h-40 overflow-y-auto pr-1">
                {playlist.map((track, idx) => {
                  const isThisTrack = idx === currentTrackIndex;
                  return (
                    <div
                      key={track.id}
                      onClick={() => {
                        setCurrentTrackIndex(idx);
                        setIsPlaying(true);
                      }}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                        isThisTrack 
                          ? 'bg-accent/20 border border-accent/40 text-white' 
                          : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="font-mono text-[10px] text-white/40 w-4">
                          0{idx + 1}
                        </span>
                        <div className="flex flex-col truncate">
                          <span className={`text-xs font-medium truncate ${isThisTrack ? 'text-accent font-bold' : ''}`}>
                            {track.title}
                          </span>
                          <span className="text-[10px] text-white/40 truncate">
                            {track.artist}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9px] font-mono text-white/40 px-1.5 py-0.5 rounded bg-white/5 border border-white/10">
                          {track.tag}
                        </span>
                        {isThisTrack && isPlaying && (
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom URL Input for Sếp Hoàng */}
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/50 tracking-wider uppercase flex items-center gap-1">
                  <LinkIcon size={11} className="text-accent" />
                  Đổi nhạc / Thêm link MP3 riêng
                </span>
                {playlist.some(t => t.id.startsWith('custom-')) && (
                  <button
                    onClick={handleResetDefault}
                    className="text-[9px] font-mono text-white/40 hover:text-accent flex items-center gap-0.5"
                    title="Khôi phục nhạc gốc"
                  >
                    <RotateCcw size={10} />
                    Mặc định
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <input
                  type="text"
                  placeholder="Tên bài hát (VD: Sếp Hoàng Clutches)"
                  value={customTrackTitle}
                  onChange={(e) => setCustomTrackTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-accent"
                />
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    placeholder="Dán link file nhạc (.mp3, .ogg)..."
                    value={customTrackUrl}
                    onChange={(e) => setCustomTrackUrl(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-accent"
                  />
                  <button
                    onClick={handleSaveCustomTrack}
                    disabled={!customTrackUrl.trim()}
                    className="px-3 py-1.5 bg-accent hover:bg-accentHover disabled:opacity-40 rounded-lg text-xs font-bold text-white transition-all shrink-0"
                  >
                    Áp dụng
                  </button>
                </div>
                {saveStatus && (
                  <span className="text-[10px] text-green-400 flex items-center gap-1">
                    <Check size={11} /> {saveStatus}
                  </span>
                )}
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-3 pt-2 text-center">
              <button
                onClick={() => setIsOpenMenu(false)}
                className="text-[11px] text-white/50 hover:text-white tracking-widest font-mono uppercase"
              >
                Đóng bảng điều khiển
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
