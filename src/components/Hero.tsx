import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { brand } from '../data/brand';
import { MessageSquare, Music } from 'lucide-react';
import { Header } from './Header';

export function Hero() {
  const container = useRef<HTMLDivElement>(null);
  const loadingScreen = useRef<HTMLDivElement>(null);
  const logoLoading = useRef<HTMLImageElement>(null);
  const bgVideo = useRef<HTMLVideoElement>(null);
  const cta = useRef<HTMLDivElement>(null);
  const socialDock = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();
    tl.to(logoLoading.current, { opacity: 1, duration: 0.6, ease: "power2.inOut" })
      .to(logoLoading.current, { opacity: 0, duration: 0.3, delay: 0.2 })
      .to(loadingScreen.current, { yPercent: -100, duration: 0.7, ease: "power4.inOut" })
      .fromTo(bgVideo.current, { scale: 1.08 }, { scale: 1, duration: 1.4, ease: "power3.out" }, "-=0.5")
      .fromTo(cta.current, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.8")
      .fromTo(socialDock.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.6");
  }, { scope: container });

  return (
    <section id="home" ref={container} className="relative w-full h-screen overflow-hidden bg-bgBase snap-start snap-always shrink-0">
      <Header />
      <div ref={loadingScreen} className="absolute inset-0 z-50 bg-bgBase flex items-center justify-center">
        <img ref={logoLoading} src={brand.logo} alt={brand.name} className="h-24 w-auto object-contain opacity-0" />
      </div>

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-bgBase via-bgBase/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-bgBase via-bgBase/20 to-transparent z-10" />
        <video 
          ref={bgVideo}
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-90 scale-100 transition-transform duration-1000"
        >
          <source src="https://res.cloudinary.com/wos7u4ud/video/upload/v1789712315/jett-valorant-hd-live-wallpaper-for-pc.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-20 h-full w-full px-6 md:px-10 lg:px-14 flex flex-col justify-end pb-24 md:pb-28">
        <div ref={cta} className="flex flex-col gap-3.5 items-start">
          <div className="flex items-center gap-3 md:gap-4 text-accent font-display tracking-[0.2em] text-3xl md:text-5xl lg:text-6xl drop-shadow-2xl">
            <span>STREAMER</span>
            <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-white" />
            <span>DEVELOPER</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 md:gap-3.5">
            <div className="inline-block bg-[#E6002B] px-4 py-1.5 text-white font-display tracking-[0.25em] text-xs md:text-sm font-bold uppercase shadow-lg shadow-[#E6002B]/40">
              SẾP HOÀNG 93
            </div>
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('toggle_hero_youtube_bgm'));
              }}
              className="hoverable inline-flex items-center gap-2 bg-black/75 hover:bg-black/95 border border-white/20 hover:border-accent/80 px-3 py-1.5 rounded-sm text-white/90 hover:text-white font-mono text-xs tracking-wider transition-all duration-300 backdrop-blur-md group shadow-md"
              title="Bật/Tắt BGM"
            >
              <Music size={13} className="text-accent group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold tracking-wider uppercase">BGM: GG EZ</span>
              <div className="flex items-end gap-0.5 h-2.5">
                <span className="w-0.5 h-2.5 bg-accent rounded-full animate-pulse" />
                <span className="w-0.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-0.5 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={socialDock}
        className="absolute bottom-5 left-28 sm:left-36 md:bottom-8 md:left-1/2 md:-translate-x-1/2 z-30 pointer-events-auto"
      >
        <div className="inline-flex flex-row flex-nowrap items-center gap-2 md:gap-3 bg-black/85 backdrop-blur-xl border border-white/20 p-1.5 md:px-4 md:py-2.5 rounded-full md:rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
          <a 
            href="https://discord.gg/3Y2v4wZkec" 
            target="_blank" 
            rel="noreferrer"
            title="Discord"
            className="hoverable group w-8 h-8 sm:w-9 sm:h-9 md:w-auto md:h-auto rounded-full md:rounded-xl flex items-center justify-center md:inline-flex md:gap-2 px-0 md:px-4 py-0 md:py-2 bg-white/5 border border-white/10 text-white font-bold tracking-widest text-[11px] md:text-xs transition-all duration-300 hover:border-[#5865F2] hover:bg-[#5865F2]/25 hover:scale-105 whitespace-nowrap shadow-sm shrink-0"
          >
            <MessageSquare size={16} className="text-[#5865F2] group-hover:scale-110 transition-transform shrink-0" />
            <span className="hidden md:inline">DISCORD</span>
          </a>

          <a 
            href="https://www.youtube.com/@SEP_HOANG_93" 
            target="_blank" 
            rel="noreferrer"
            title="YouTube"
            className="hoverable group w-8 h-8 sm:w-9 sm:h-9 md:w-auto md:h-auto rounded-full md:rounded-xl flex items-center justify-center md:inline-flex md:gap-2 px-0 md:px-4 py-0 md:py-2 bg-white/5 border border-white/10 text-white font-bold tracking-widest text-[11px] md:text-xs transition-all duration-300 hover:border-[#FF0000] hover:bg-[#FF0000]/25 hover:scale-105 whitespace-nowrap shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="text-[#FF0000] group-hover:scale-110 transition-transform shrink-0">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="hidden md:inline">YOUTUBE</span>
          </a>

          <a 
            href="https://www.tiktok.com/@neon_9393" 
            target="_blank" 
            rel="noreferrer"
            title="TikTok"
            className="hoverable group w-8 h-8 sm:w-9 sm:h-9 md:w-auto md:h-auto rounded-full md:rounded-xl flex items-center justify-center md:inline-flex md:gap-2 px-0 md:px-4 py-0 md:py-2 bg-white/5 border border-white/10 text-white font-bold tracking-widest text-[11px] md:text-xs transition-all duration-300 hover:border-[#00f2fe] hover:bg-[#00f2fe]/25 hover:scale-105 whitespace-nowrap shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="text-[#00f2fe] group-hover:scale-110 transition-transform shrink-0">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 006.5 15.7a6.33 6.33 0 006.33 6.33 6.33 6.33 0 006.32-6.33v-5.83a8.28 8.28 0 003.85 1.54V8.04a5.07 5.07 0 01-3.41-1.35z"/>
            </svg>
            <span className="hidden md:inline">TIKTOK</span>
          </a>

          <a 
            href="https://www.tiktok.com/@sep_hoang_93" 
            target="_blank" 
            rel="noreferrer"
            title="Instagram"
            className="hoverable group w-8 h-8 sm:w-9 sm:h-9 md:w-auto md:h-auto rounded-full md:rounded-xl flex items-center justify-center md:inline-flex md:gap-2 px-0 md:px-4 py-0 md:py-2 bg-white/5 border border-white/10 text-white font-bold tracking-widest text-[11px] md:text-xs transition-all duration-300 hover:border-[#E1306C] hover:bg-[#E1306C]/25 hover:scale-105 whitespace-nowrap shadow-sm shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" className="text-[#E1306C] group-hover:scale-110 transition-transform shrink-0">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
            <span className="hidden md:inline">INSTAGRAM</span>
          </a>
        </div>
      </div>
    </section>
  );
}