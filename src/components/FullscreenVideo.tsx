import { useState, useEffect, useRef } from 'react';
import { Cpu, Globe, ExternalLink, Check, Copy, Monitor, Send, Shield, Zap, Layers, CreditCard, QrCode } from 'lucide-react';
import { motion } from 'motion/react';
import { CenterStageGallery, GalleryItem } from './CenterStageGallery';
import { QuadGameFrames, GameFrame, defaultGameFrames } from './QuadGameFrames';
import { GirlfriendSection } from './GirlfriendSection';

const mySetupData = [
  { id: "main", item: "MAIN", detail: "MSI B550 Gaming Plus" },
  { id: "cpu", item: "CPU", detail: "Ryzen 7 5700X3D" },
  { id: "ram", item: "RAM", detail: "32GB/3600 RGB (16x2)" },
  { id: "ssd", item: "NVME", detail: "1TB Adata Legend 900 Pro Gen 4" },
  { id: "cool", item: "COOLING", detail: "AIO 240 AstroShel V2" },
  { id: "vga", item: "VGA", detail: "Sapphire Pure RX 7800 XT 16GB" },
  { id: "psu", item: "PSU", detail: "Giga 750W 80Plus Gold" },
  { id: "case", item: "CASE", detail: "2 Màn hình + 5 Fan RGB" }
];

export interface SkillItem {
  id: string;
  title: string;
  category: string;
  tier: string;
  percentage: number;
  desc: string;
  highlights: string[];
  color: string;
}

const mySkillsData: SkillItem[] = [
  {
    id: "skill1",
    title: "CODE PYTHON",
    category: "BACKEND & AUTOMATION",
    tier: "EXPERT TIER",
    percentage: 98,
    desc: "Lập trình Python chuyên sâu: Xử lý dữ liệu, xây dựng tool automation, web scraping tốc độ cao, backend API với FastAPI/Django và AI agent thông minh.",
    highlights: [
      "FastAPI & Django REST APIs",
      "Automation Scripts & Selenium",
      "Data Processing & Pandas/NumPy",
      "Asyncio & Multi-threading Speed"
    ],
    color: "#38BDF8"
  },
  {
    id: "skill2",
    title: "CODE WEB",
    category: "FULLSTACK WEB DEVELOPMENT",
    tier: "MASTER TIER",
    percentage: 96,
    desc: "Thiết kế & lập trình website fullstack hiện đại, responsive hoàn hảo trên mọi thiết bị, UI/UX gaming cao cấp, tải trang cực nhanh mượt.",
    highlights: [
      "React, Next.js & TypeScript",
      "Tailwind CSS & Modern Animation",
      "Node.js, Express & Database Sync",
      "RESTful API & Realtime WebSockets"
    ],
    color: "#05D59E"
  },
  {
    id: "skill3",
    title: "CODE BOT DISCORD",
    category: "DISCORD ECOSYSTEM & TOOLS",
    tier: "ADVANCED TIER",
    percentage: 95,
    desc: "Phát triển Discord Bot tùy biến cho streamer & gaming server: Quản trị server tự động, cấp role theo rank, minigame, nhạc 24/7 và thông báo stream.",
    highlights: [
      "Discord.js v14 & Pycord Architecture",
      "Interactive Slash Commands & Modals",
      "Music Streaming & High Quality Audio",
      "Live Stream Alerts & Auto Roles"
    ],
    color: "#5865F2"
  },
  {
    id: "skill4",
    title: "CODE BOT TELEGRAM",
    category: "TELEGRAM AUTOMATION & BOT API",
    tier: "EXPERT TIER",
    percentage: 94,
    desc: "Xây dựng Bot Telegram tự động hóa toàn diện: Nhắn tin 2 chiều tức thì, quản lý nhóm & kênh, tích hợp thanh toán, webhook và Telegram Mini Apps.",
    highlights: [
      "Telegram Bot API & Webhooks",
      "Telegram Mini Apps (TMA) Webview",
      "2-Way Direct Customer Chat Gateway",
      "Auto Notification & Group Security"
    ],
    color: "#0088CC"
  }
];

export interface WebProject {
  id: string;
  title: string;
  category: string;
  image: string;
  note: string;
  url: string;
  status: string;
  tags: string[];
  color: string;
}

const initialWebData: WebProject[] = [
  {
    id: "web-hub",
    title: "PROFILE HUB",
    category: "",
    image: "https://res.cloudinary.com/wos7u4ud/image/upload/v1789842151/Screenshot_2026-09-20_012154.png",
    note: "",
    url: "https://SEPHOANG93.onrender.com",
    status: "ONLINE 24/7",
    tags: [ "Portfolio", "Profile Hub", "Gaming Community"],
    color: "#FF4655"
  },
  {
    id: "web-tracker",
    title: "MENU ONLINE THONMAY",
    category: "ESPORTS STATS ENGINE",
    image: "https://res.cloudinary.com/wos7u4ud/image/upload/v1789796724/Screenshot_2026-09-19_124454.png",
    note: "",
    url: "https://thonmay.onrender.com/",
    status: "",
    tags: ["FNB", "MENU", "ORDER", "POS"],
    color: "#0AC8B9"
  },
  {
    id: "web-community",
    title: "TROLLTROLL VIET NAM",
    category: "GAMING COMMUNITY HUB",
    image: "https://res.cloudinary.com/wos7u4ud/image/upload/v1789841511/Screenshot_2026-09-20_011041.png",
    note: "",
    url: "https://mictroll.onrender.com/",
    status: "",
    tags: ["Discord Hub", "Custom Tournaments", "PC Build Advice"],
    color: "#5865F2"
  }
];

export const JETT_JINX_TABS = [
  { id: 'girlfriend', label: 'Girlfriend', color: '#FF69B4', desc: 'Người Thương' },
  { id: 'setup', label: 'SETUP', color: '#F59E0B', desc: 'Góc Gaming' },
  { id: 'skills', label: 'SKILLS', color: '#05D59E', desc: 'Kỹ Năng & Chuyên Môn' },
  { id: 'web', label: 'WEB', color: '#00f2fe', desc: 'Nền Tảng Website' },
  { id: 'donate', label: 'DONATE', color: '#FF4655', desc: 'Ủng Hộ' },
];

const DEFAULT_DONATE_DATA = {
  bankName: "TECHCOMBANK",
  accountNumber: "19038047393017",
  accountHolder: "NGUYEN HOANG ANH",
  momo: "19038047393017",
  qrImage: "https://res.cloudinary.com/wos7u4ud/image/upload/v1789756704/1789756566420_130112542375474982_6410038216856147229_03b955be958baee84ffe5375810fff4a.jpg",
  note: "SEPHOANG + [TÊN] + LỜI NHẮN"
};

interface VideoProps {
  data: {
    id: string;
    title: string;
    subtitle: string;
    url: string;
    order: number;
    gallery?: GalleryItem[];
    gameFrames?: GameFrame[];
  };
  index: number;
}

export function FullscreenVideo({ data, index }: VideoProps) {
  const [activeModal, setActiveModal] = useState<string | null>(data.id === 'jett-jinx' ? 'girlfriend' : null);
  const [copiedDonateKey, setCopiedDonateKey] = useState<string | null>(null);
  const [copiedSpecId, setCopiedSpecId] = useState<string | null>(null);

  const handleCopySpec = (spec: { id: string; item: string; detail: string }) => {
    navigator.clipboard.writeText(`${spec.item}: ${spec.detail}`);
    setCopiedSpecId(spec.id);
    setTimeout(() => setCopiedSpecId(null), 2000);
  };

  const handleCopyDonate = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedDonateKey(key);
    setTimeout(() => setCopiedDonateKey(null), 2000);
  };

  const isJettJinx = data.id === 'jett-jinx';
  const isSage = data.id === 'sage-lny';
  const isPage3 = index === 2;

  const sectionRef = useRef<HTMLElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
          setIsInView(visible);
        });
      },
      { threshold: [0, 0.2, 0.35, 0.6] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (bgVideoRef.current) {
      if (!isInView) {
        bgVideoRef.current.pause();
      } else {
        bgVideoRef.current.play().catch(() => {});
      }
    }
  }, [isInView]);

  if (isSage) {
    return (
      <section 
        ref={sectionRef}
        id={`wp-${data.id}`} 
        className="relative w-full h-screen overflow-hidden bg-black shrink-0 flex items-center justify-center snap-start snap-always"
      >
        <QuadGameFrames 
          frames={data.gameFrames && data.gameFrames.length === 4 ? data.gameFrames : defaultGameFrames}
          isInView={isInView}
        />
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      id={`wp-${data.id}`} 
      className="relative w-full h-screen overflow-hidden bg-bgBase shrink-0 flex items-center justify-center snap-start snap-always"
    >
      <div className="absolute inset-0 z-0">
        <video 
          ref={bgVideoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
          key={data.url}
        >
          <source src={data.url} type="video/mp4" />
        </video>
        <div className={`absolute inset-0 z-10 pointer-events-none ${isPage3 ? 'bg-black/90 backdrop-blur-md' : 'bg-gradient-to-t from-bgBase/90 via-bgBase/20 to-bgBase/40'}`} />
      </div>
      
      <div className={`relative w-full mx-auto px-6 lg:px-12 h-full pointer-events-none ${isJettJinx ? 'z-40' : 'z-20'} ${isPage3 ? 'max-w-[100rem] flex items-center justify-center' : 'max-w-7xl flex flex-col justify-end pb-24 sm:pb-28 md:pb-32'}`}>
        {isPage3 ? (
          <div className="absolute inset-0 w-full h-full pointer-events-none flex flex-col justify-center py-24 px-6 lg:px-12 xl:px-24">
            <div className="absolute top-24 lg:top-32 left-6 lg:left-12 xl:left-24 pointer-events-auto max-w-2xl z-30">
               <h2 className="text-4xl md:text-5xl lg:text-7xl font-display text-white uppercase leading-[0.9] drop-shadow-2xl">
                 {data.title}
               </h2>
            </div>
            <div className="pointer-events-auto w-full z-20 mt-6 lg:mt-8 px-2 max-w-[95rem] mx-auto">
               <CenterStageGallery 
                 items={data.gallery && data.gallery.length > 0 ? data.gallery : []}
                 isInView={isInView}
               />
            </div>
            <div className="absolute bottom-16 lg:bottom-24 right-6 lg:right-12 xl:right-24 pointer-events-auto text-right z-30">
               {data.subtitle && !data.subtitle.toUpperCase().includes("DAILY") && !data.subtitle.toUpperCase().includes("EPISODES") && !/\d+\s*\/\s*\d+/.test(data.subtitle) ? (
                 <span className="text-2xl md:text-3xl tracking-wider text-[#E4AA24] uppercase font-bold drop-shadow-md block mb-2 font-display">
                   {data.subtitle}
                 </span>
               ) : null}
            </div>
          </div>
        ) : (
          <>
        {!isJettJinx && (
          <div className="mb-6 pointer-events-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
              <div className="flex items-center gap-4">
                 <span className="text-accent font-display text-2xl md:text-3xl">0{index + 1}</span>
                 <div className="h-[2px] w-12 md:w-24 bg-accent/80" />
              </div>
              <span className="text-sm tracking-[0.3em] text-white uppercase font-bold drop-shadow-md">{data.subtitle}</span>
            </div>
            
            <h2 className="text-5xl md:text-8xl lg:text-[9rem] font-display text-white uppercase leading-[0.85] drop-shadow-2xl">
              {data.title}
            </h2>
          </div>
        )}
        
        {isJettJinx && (
          <div className="w-full flex flex-col items-start gap-6 relative pointer-events-none">
            <div className="flex flex-row flex-wrap items-center gap-2 md:gap-3 lg:gap-4 pt-1 pointer-events-auto relative z-50">
              {JETT_JINX_TABS.map((tab) => {
                const isActive = activeModal === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveModal(isActive ? null : tab.id)}
                    className={`hoverable group relative inline-flex items-center px-3 py-1.5 sm:px-3.5 sm:py-2 md:px-5 md:py-2.5 lg:px-6 lg:py-3 rounded-xl backdrop-blur-md font-display tracking-widest text-[10px] sm:text-[11px] md:text-xs lg:text-sm uppercase font-bold transition-all duration-300 active:scale-95 overflow-hidden ${
                      isActive
                        ? 'text-white scale-105 shadow-2xl'
                        : 'bg-black/85 text-white/80 hover:text-white hover:scale-105 hover:bg-black'
                    }`}
                    style={{
                      borderColor: tab.color,
                      borderWidth: isActive ? '2px' : '1px',
                      backgroundColor: isActive ? `${tab.color}25` : 'rgba(0,0,0,0.85)',
                      boxShadow: isActive ? `0 0 20px ${tab.color}70` : undefined,
                    }}
                  >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                    {isActive && (
                      <span 
                        className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full mr-1.5 md:mr-2 animate-pulse shrink-0" 
                        style={{ backgroundColor: tab.color, boxShadow: `0 0 8px ${tab.color}` }} 
                      />
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        </>
        )}
      </div>

      <div 
        className={`absolute inset-0 z-35 flex flex-col justify-center items-center p-2 sm:p-4 pt-1 sm:pt-2 pb-28 sm:pb-30 md:pb-28 lg:pb-32 transition-all duration-300 ease-in-out ${activeModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className="absolute inset-x-0 top-0 bottom-24 md:bottom-28 bg-transparent cursor-pointer"
          onClick={() => setActiveModal(null)}
        />
        
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`relative z-10 w-full ${
            activeModal === 'girlfriend' 
              ? 'max-w-full xl:max-w-[96rem]' 
              : activeModal === 'web' 
              ? 'max-w-full sm:max-w-xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl' 
              : activeModal === 'donate' 
              ? 'max-w-full sm:max-w-lg md:max-w-4xl lg:max-w-5xl' 
              : 'max-w-full sm:max-w-xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl'
          } max-h-[calc(100vh-175px)] sm:max-h-[calc(100vh-160px)] md:max-h-[calc(100vh-140px)] my-auto px-2 sm:px-4 md:px-6 py-1 bg-transparent border-none shadow-none transition-all duration-300 ease-out pointer-events-auto touch-pan-y flex flex-col justify-center items-center ${activeModal ? 'translate-y-0 scale-100' : 'translate-y-3 scale-95'} ${activeModal === 'girlfriend' ? 'overflow-hidden' : 'overflow-y-auto custom-scrollbar'}`}
        >
          {activeModal === 'setup' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-full md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto my-auto flex flex-col justify-center pt-0.5 pb-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl bg-black/70 border border-[#F59E0B]/30 mb-2.5 md:mb-4 backdrop-blur-md">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-6 h-6 md:w-9 md:h-9 rounded-lg bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B]">
                    <Cpu size={15} className="md:w-5 md:h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] md:text-sm font-mono font-bold text-[#F59E0B] tracking-widest block uppercase">
                      BATTLESTATION RIG TELEMETRY // HUD v2.4
                    </span>
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-white/50">SYS DIAGNOSTIC: 100% ONLINE & OPTIMIZED</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 md:gap-2.5 text-[9px] sm:text-[10px] md:text-xs font-mono">
                  <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    STREAM 4K 60FPS
                  </span>
                  <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B]">
                    OC STABLE
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3.5 md:gap-5 w-full items-stretch">
                <div className="lg:col-span-7 flex flex-col gap-2 md:gap-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] sm:text-[11px] md:text-xs font-mono font-bold text-white/70 tracking-widest uppercase flex items-center gap-1.5">
                      <Zap size={13} className="text-[#F59E0B]" />
                      BAY 01 // CORE HORSEPOWER
                    </span>
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-white/40">CHẠM ĐỂ COPY</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 md:gap-3.5 flex-1">
                    {mySetupData.slice(0, 4).map(spec => (
                      <div 
                        key={spec.id} 
                        onClick={() => handleCopySpec(spec)}
                        title="Chạm để sao chép thông số"
                        className="hoverable bg-gradient-to-br from-[#18151c]/95 to-[#0d0c10]/95 border border-[#F59E0B]/30 hover:border-[#F59E0B] p-2.5 sm:p-3.5 md:p-5 lg:p-6 rounded-xl md:rounded-2xl flex flex-col justify-between gap-1.5 sm:gap-2 md:gap-3 shadow-md hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all group cursor-pointer active:scale-95 backdrop-blur-md relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#F59E0B]/5 rounded-full blur-xl pointer-events-none" />
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] text-[10px] sm:text-[11px] md:text-xs font-mono font-bold tracking-wider">
                            {spec.item}
                          </span>
                          {copiedSpecId === spec.id ? (
                            <span className="text-[9px] sm:text-[10px] md:text-xs font-mono font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full animate-pulse border border-emerald-500/40">
                               ĐÃ COPY
                            </span>
                          ) : (
                            <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-white/30 group-hover:text-white/70 transition-colors uppercase flex items-center gap-1">
                              <Copy size={10} className="md:w-3.5 md:h-3.5" /> COPY
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="text-xs sm:text-sm md:text-lg lg:text-xl text-white font-bold group-hover:text-[#F59E0B] transition-colors leading-snug font-sans block">
                            {spec.detail}
                          </span>
                          <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-white/40 mt-0.5 block">
                            {spec.item === 'CPU' ? '8 Cores / 16 Threads 3D V-Cache' : 
                             spec.item === 'VGA' ? '16GB GDDR6 Pure White' :
                             spec.item === 'RAM' ? '3600MHz Dual Channel' : 'PCIe 4.0 Dual M.2 Armor'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-2 md:gap-3">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] sm:text-[11px] md:text-xs font-mono font-bold text-white/70 tracking-widest uppercase flex items-center gap-1.5">
                      <Layers size={13} className="text-[#F59E0B]" />
                      BAY 02 // THERMAL & STORAGE
                    </span>
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-white/40">AIRFLOW & POWER</span>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-2.5 flex-1 justify-between">
                    {mySetupData.slice(4).map(spec => (
                      <div 
                        key={spec.id} 
                        onClick={() => handleCopySpec(spec)}
                        title="Chạm để sao chép thông số"
                        className="hoverable bg-[#111116]/90 border border-white/15 hover:border-[#F59E0B]/60 px-3 py-2 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3.5 rounded-xl md:rounded-2xl flex items-center justify-between gap-2.5 shadow-sm hover:bg-[#F59E0B]/10 transition-all group cursor-pointer active:scale-98"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-12 sm:w-14 md:w-16 text-[10px] sm:text-[11px] md:text-xs font-mono font-bold text-[#F59E0B] shrink-0">
                            {spec.item}
                          </span>
                          <span className="text-[11px] sm:text-xs md:text-sm lg:text-base text-white font-semibold group-hover:text-[#F59E0B] transition-colors truncate">
                            {spec.detail}
                          </span>
                        </div>
                        {copiedSpecId === spec.id ? (
                          <span className="text-[9px] sm:text-[10px] md:text-xs font-mono font-bold text-emerald-400 shrink-0">ĐÃ COPY</span>
                        ) : (
                          <Copy size={12} className="md:w-3.5 md:h-3.5 text-white/20 group-hover:text-white/70 transition-colors shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-2.5 sm:mt-3.5 md:mt-5 flex justify-center w-full">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent('open_chat_with_preset', {
                      detail: {
                        topicId: 'build_pc',
                        title: 'Build PC',
                        message: 'Chào Sếp Hoàng, mình đang cần build PC gaming / làm việc theo ngân sách. Nhờ bạn tư vấn giúp!'
                      }
                    }));
                  }}
                  className="hoverable group relative inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 md:px-8 md:py-3.5 rounded-xl md:rounded-2xl bg-gradient-to-r from-[#F59E0B]/20 via-[#F59E0B]/35 to-[#F59E0B]/20 border border-[#F59E0B] text-white font-display text-[11px] sm:text-xs md:text-sm uppercase tracking-wider font-bold shadow-[0_0_20px_rgba(245,158,11,0.25)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
                >
                  <Monitor className="text-[#F59E0B] group-hover:animate-pulse" size={16} />
                  <span>CẦN BUILD PC THEO TẦM TIỀN? CHAT VỚI MÌNH NGAY</span>
                  <Send className="text-[#F59E0B] group-hover:translate-x-1.5 transition-transform" size={14} />
                </button>
              </div>
            </motion.div>
          )}

          {activeModal === 'skills' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-full md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto my-auto flex flex-col justify-center pt-0.5 pb-2"
            >
              <div className="flex items-center justify-between gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl bg-black/70 border border-emerald-500/30 mb-2.5 md:mb-4 backdrop-blur-md">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-6 h-6 md:w-9 md:h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Shield size={15} className="md:w-5 md:h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] md:text-sm font-mono font-bold text-emerald-400 tracking-widest uppercase block">
                      PRO COMBAT MATRIX // TACTICAL DOSSIER
                    </span>
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-white/50">CHUYÊN NGÀNH & THỰC CHIẾN</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] sm:text-[10px] md:text-xs font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  S-TIER GRADE
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3.5 md:gap-5 w-full items-stretch">
                <div className="lg:col-span-7 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#0c1c17]/95 to-[#08100e]/95 border border-emerald-500/40 p-3.5 sm:p-4 md:p-6 lg:p-7 flex flex-col justify-between shadow-[0_5px_25px_rgba(16,185,129,0.15)] backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[9px] sm:text-[10px] md:text-xs font-bold border border-emerald-500/40">
                        FLAGSHIP SPECIALIZATION
                      </span>
                      <span className="text-lg sm:text-xl md:text-3xl font-mono font-black text-emerald-400 tracking-wider">
                        98%
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-display uppercase text-white font-bold tracking-wide mb-1.5 md:mb-2.5 group-hover:text-emerald-400 transition-colors">
                      {mySkillsData[0].title}
                    </h3>
                    <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-white/75 leading-relaxed font-sans mb-3 md:mb-4">
                      {mySkillsData[0].desc}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-emerald-400/80 font-bold uppercase tracking-wider block mb-1.5">
                      CORE CAPABILITIES & FRAMEWORKS:
                    </span>
                    <div className="flex flex-wrap gap-1 md:gap-1.5">
                      {mySkillsData[0].highlights.map((h, idx) => (
                        <span key={idx} className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-[10px] sm:text-[11px] md:text-xs font-mono flex items-center gap-1">
                          <span className="w-1 h-1 rounded-full bg-emerald-400" />
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-2 md:gap-3">
                  {mySkillsData.slice(1).map((skill) => (
                    <div 
                      key={skill.id}
                      className="rounded-xl md:rounded-2xl bg-[#0f1416]/90 border border-white/15 hover:border-emerald-400/50 p-2.5 sm:p-3.5 md:p-4 lg:p-5 flex flex-col justify-between gap-1.5 md:gap-2.5 shadow-sm hover:bg-emerald-950/20 transition-all backdrop-blur-md group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] sm:text-[10px] md:text-xs font-mono font-bold text-white/50 uppercase tracking-wider">
                          {skill.category}
                        </span>
                        <span className="text-[9px] sm:text-[10px] md:text-xs font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                          {skill.percentage}%
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm md:text-base lg:text-lg font-display uppercase text-white font-bold group-hover:text-emerald-300 transition-colors">
                        {skill.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] md:text-xs text-white/70 font-sans line-clamp-2">
                        {skill.desc}
                      </p>
                      <div className="w-full bg-white/10 h-1.5 md:h-2 rounded-full overflow-hidden mt-0.5">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeModal === 'web' && (
            <motion.div 
              initial={{ opacity: 0, rotateX: 6, y: 20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-full md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto my-auto flex flex-col justify-center pt-0.5 pb-2"
            >
              <div className="flex items-center justify-between gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 md:px-5 md:py-3 rounded-xl md:rounded-2xl bg-[#0d121c]/90 border border-[#00f2fe]/30 mb-2.5 md:mb-4 backdrop-blur-md">
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] inline-block shadow-sm" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] inline-block shadow-sm" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F] inline-block shadow-sm" />
                  </div>
                  <div className="px-2.5 py-0.5 md:px-3.5 md:py-1 rounded-lg bg-black/50 border border-white/10 text-[10px] sm:text-[11px] md:text-xs font-mono text-white/70 flex items-center gap-1.5 truncate">
                    <Globe size={12} className="text-[#00f2fe] shrink-0" />
                    <span className="truncate">sephoang.ecosystem/cloud-apps</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-3 shrink-0">
                  <span className="text-[9px] sm:text-[10px] md:text-xs font-mono text-[#00f2fe] hidden sm:inline-flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f2fe] animate-ping" />
                    SSL SECURED
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3.5 md:gap-5 w-full items-stretch">
                {initialWebData[0] && (
                  <div className="lg:col-span-7 flex flex-col rounded-xl md:rounded-2xl bg-gradient-to-br from-[#0c1424]/95 to-[#080d17]/95 border border-[#00f2fe]/35 overflow-hidden shadow-[0_5px_25px_rgba(0,242,254,0.15)] backdrop-blur-md group">
                    <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 w-full overflow-hidden bg-black shrink-0">
                      <img 
                        src={initialWebData[0].image} 
                        alt={initialWebData[0].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424] via-transparent to-black/40" />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[#00f2fe] font-mono text-[9px] sm:text-[10px] md:text-xs font-bold border border-[#00f2fe]/30">
                        {initialWebData[0].category}
                      </span>
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md text-emerald-400 font-mono text-[9px] sm:text-[10px] md:text-xs font-bold border border-emerald-500/40 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {initialWebData[0].status}
                      </span>
                    </div>
                    <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col justify-between flex-1 gap-2 sm:gap-3">
                      <div>
                        <h3 className="text-sm sm:text-base md:text-xl lg:text-2xl font-display uppercase text-white font-bold mb-1 group-hover:text-[#00f2fe] transition-colors">
                          {initialWebData[0].title}
                        </h3>
                        <p className="text-[11px] sm:text-xs md:text-sm text-white/75 leading-relaxed font-sans line-clamp-2">
                          {initialWebData[0].note}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
                        <div className="flex flex-wrap gap-1 md:gap-1.5">
                          {initialWebData[0].tags.map((tag, tIdx) => (
                            <span key={tIdx} className="px-2 py-0.5 md:px-2.5 md:py-1 rounded bg-white/10 text-white/60 text-[9px] sm:text-[10px] md:text-xs font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a 
                            href={initialWebData[0].url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="hoverable inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 md:px-5 md:py-2 rounded-lg md:rounded-xl bg-[#00f2fe] text-black font-display font-bold text-[11px] sm:text-xs md:text-sm uppercase tracking-wider hover:bg-[#00f2fe]/80 transition-all shadow-md active:scale-95"
                          >
                            <span>Truy cập</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="lg:col-span-5 flex flex-col gap-2 sm:gap-2.5 max-h-[300px] sm:max-h-[360px] lg:max-h-[440px] xl:max-h-[500px] overflow-y-auto pr-1.5 custom-scrollbar">
                  {initialWebData.slice(1).map((web) => (
                    <div 
                      key={web.id}
                      className="rounded-xl md:rounded-2xl bg-[#0f1522]/90 border border-white/15 hover:border-[#00f2fe]/50 p-2.5 sm:p-3 md:p-3.5 flex flex-col justify-between gap-1.5 sm:gap-2 shadow-sm hover:bg-[#00f2fe]/5 transition-all backdrop-blur-md group shrink-0"
                    >
                      <div className="flex items-start gap-2.5 sm:gap-3">
                        <img 
                          src={web.image} 
                          alt={web.title}
                          className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-lg object-cover shrink-0 border border-white/10 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5 mb-0.5">
                            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-[#00f2fe] uppercase truncate">
                              {web.category}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 shrink-0">
                                {web.status}
                            </span>
                          </div>
                          <h4 className="text-xs sm:text-sm md:text-base font-display uppercase text-white font-bold truncate group-hover:text-[#00f2fe] transition-colors">
                            {web.title}
                          </h4>
                          <p className="text-[10px] sm:text-[11px] text-white/65 font-sans line-clamp-2 mt-0.5">
                            {web.note}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1.5 border-t border-white/10">
                        <div className="flex gap-1 flex-wrap">
                          {web.tags.slice(0, 3).map((t, idx) => (
                            <span key={idx} className="text-[9px] sm:text-[10px] font-mono text-white/50">
                              #{t}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a 
                            href={web.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="hoverable inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 hover:bg-[#00f2fe] hover:text-black text-white text-[10px] sm:text-[11px] font-mono font-bold transition-all"
                          >
                            <span>Mở</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeModal === 'donate' && (
            <div className="flex flex-col gap-3 sm:gap-3.5 md:gap-5 w-full max-w-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto my-auto justify-center pt-0.5 pb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3.5 md:gap-5 items-stretch w-full">
                <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-[#1a1215]/95 to-[#0d0d0f]/95 border border-[#FF4655]/40 p-3.5 sm:p-5 md:p-6 lg:p-7 flex flex-col justify-between shadow-[0_5px_25px_rgba(255,70,85,0.2)] backdrop-blur-md">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4655]/20 blur-2xl rounded-full pointer-events-none" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-2.5 md:mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 md:w-9 md:h-9 rounded-lg bg-[#FF4655]/20 text-[#FF4655] flex items-center justify-center">
                          <CreditCard size={18} className="md:w-5 md:h-5" />
                        </div>
                        <span className="font-mono text-[11px] md:text-sm font-bold text-white/70 tracking-wider">CHUYỂN KHOẢN NHANH</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF4655]/20 border border-[#FF4655]/40 text-[#FF4655] text-[10px] md:text-xs font-mono font-bold">
                        SEPHOANG93
                      </span>
                    </div>
                    <div className="space-y-2 md:space-y-3.5">
                      <div>
                        <span className="text-[9px] md:text-xs font-mono text-white/50 tracking-wider block uppercase">NGÂN HÀNG</span>
                        <p className="text-sm md:text-xl font-bold text-white font-display tracking-wider mt-0.5">{DEFAULT_DONATE_DATA.bankName}</p>
                      </div>
                      <div>
                        <span className="text-[9px] md:text-xs font-mono text-white/50 tracking-wider block uppercase">SỐ TÀI KHOẢN</span>
                        <div className="flex items-center gap-2.5 mt-0.5">
                          <span className="text-xl sm:text-2xl md:text-4xl font-mono font-black text-[#FF4655] tracking-wider">{DEFAULT_DONATE_DATA.accountNumber}</span>
                          <button
                            onClick={() => handleCopyDonate('bank', DEFAULT_DONATE_DATA.accountNumber)}
                            className="hoverable p-1.5 md:p-2 rounded-lg bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer active:scale-95"
                            title="Sao chép STK"
                          >
                            {copiedDonateKey === 'bank' ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] md:text-xs font-mono text-white/50 tracking-wider block uppercase">CHỦ TÀI KHOẢN</span>
                        <p className="text-xs md:text-base font-bold text-white font-mono tracking-wider mt-0.5">{DEFAULT_DONATE_DATA.accountHolder}</p>
                      </div>
                      <div className="pt-2 border-t border-white/10">
                        <span className="text-[9px] md:text-xs font-mono text-white/50 tracking-wider block uppercase">CÚ PHÁP CHUYỂN NHẬN</span>
                        <p className="text-[11px] md:text-sm font-mono text-[#F59E0B] mt-0.5 font-bold">{DEFAULT_DONATE_DATA.note}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-white/10 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-white/60 text-[10px] md:text-xs">TECHCOMBANK:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-[11px] md:text-sm">{DEFAULT_DONATE_DATA.momo}</span>
                        <button 
                          onClick={() => handleCopyDonate('momo', DEFAULT_DONATE_DATA.momo)}
                          className="text-white/40 hover:text-white p-1"
                        >
                          {copiedDonateKey === 'momo' ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-[#15151a]/95 to-[#0a0a0d]/95 border border-white/15 p-3.5 sm:p-5 md:p-6 lg:p-7 flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-md">
                  <div className="flex items-center gap-1.5 mb-2 sm:mb-3 text-[10px] sm:text-xs md:text-sm font-mono text-white/80 uppercase tracking-wider font-semibold">
                    <QrCode size={15} className="text-[#FF4655]" />
                    QUÉT MÃ QR NHẬN DIỆN
                  </div>
                  <div className="p-2 sm:p-3 md:p-4 bg-white rounded-xl md:rounded-2xl shadow-lg w-full max-w-[180px] sm:max-w-[220px] md:max-w-[280px] flex items-center justify-center overflow-hidden">
                    <img 
                      src={DEFAULT_DONATE_DATA.qrImage} 
                      alt="VietQR Donate Sếp Hoàng" 
                      className="w-full h-auto max-h-[180px] sm:max-h-[220px] md:max-h-[280px] object-contain rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModal === 'girlfriend' && (
            <GirlfriendSection />
          )}
        </div>
      </div>
    </section>
  );
}