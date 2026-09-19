import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Heart, Maximize2, X, Wifi, Battery, Signal } from 'lucide-react';

export interface GirlfriendData {
  name: string;
  nickname: string;
  daysTogether: string;
  image?: string;
  images: string[];
  quote: string;
  traits?: string[];
}

export const DEFAULT_GF_IMAGES = [
  "https://res.cloudinary.com/wos7u4ud/image/upload/v1789796009/IMG_41904_CH_0.png",
  "https://res.cloudinary.com/wos7u4ud/image/upload/v1789796009/IMG_8893.png",
  "https://res.cloudinary.com/wos7u4ud/image/upload/v1789796008/BDA221B1-8490-405E-B3EC-98FF2700A1AC.jpg",
  "https://res.cloudinary.com/wos7u4ud/image/upload/v1789796007/8DFA9060-C99A-4202-B20B-9D1E09E7FD8A.jpg",
  "https://res.cloudinary.com/wos7u4ud/image/upload/v1789796007/521951249_17874586245387588_2114022508938138560_n.jpg"
];

export const DEFAULT_GF_DATA: GirlfriendData = {
  name: "CÔNG CHÚA NHỎ",
  nickname: "ahxunriuu",
  daysTogether: "1,250+ NGÀY",
  image: DEFAULT_GF_IMAGES[2],
  images: DEFAULT_GF_IMAGES,
  quote: "",
  traits: ["Nụ cười rạng rỡ", "Hậu phương số 1", "Đồng hành leo rank", "Dịu dàng & Đáng yêu"]
};

export function GirlfriendSection() {
  const [data] = useState<GirlfriendData>(() => {
    try {
      const saved = localStorage.getItem('sephoang_girlfriend_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.images && parsed.images.length === 5) {
          return parsed;
        }
      }
    } catch (_) {}
    return DEFAULT_GF_DATA;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState("09:41");
  const lastUserAction = useRef<number>(0);

  const images = data.images?.length === 5 ? data.images : DEFAULT_GF_IMAGES;
  const total = images.length;

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  const goToNext = () => {
    lastUserAction.current = Date.now();
    setDirection(1);
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  const goToPrev = () => {
    lastUserAction.current = Date.now();
    setDirection(-1);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      if (Date.now() - lastUserAction.current < 4000) return;
      setDirection(1);
      setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, total]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.96,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.96,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };

  return (
    <div 
      id="girlfriend-phone-gallery-root"
      className="relative w-full max-w-[95rem] mx-auto my-auto flex flex-col items-center justify-center select-none py-2 px-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-center justify-center py-1 sm:py-2">
        <div className="absolute w-[260px] sm:w-[310px] md:w-[350px] h-[460px] sm:h-[530px] md:h-[580px] rounded-[50px] bg-gradient-to-tr from-pink-500/25 via-rose-500/15 to-purple-500/20 blur-3xl -z-10 pointer-events-none transform rotate-[5.5deg] scale-105" />
        
        <div 
          className="relative transition-transform duration-500 ease-out transform rotate-[5.5deg] hover:rotate-[4.5deg]"
          style={{ transformOrigin: 'center center' }}
        >
          <div 
            className="relative w-[230px] sm:w-[270px] md:w-[310px] lg:w-[330px] h-[450px] sm:h-[520px] md:h-[570px] lg:h-[590px] rounded-[44px] sm:rounded-[50px] p-[8px] sm:p-[10px] bg-gradient-to-b from-[#2a2a30] via-[#1b1b22] to-[#121216] border-[3px] sm:border-[4px] border-[#3f3f4a]/70 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_10px_25px_rgba(244,114,182,0.2),inset_0_1px_2px_rgba(255,255,255,0.3)] ring-1 ring-white/10 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute -left-[5px] top-24 w-[3px] h-8 bg-[#3a3a46] rounded-l-sm" />
            <div className="absolute -left-[5px] top-36 w-[3px] h-10 bg-[#3a3a46] rounded-l-sm" />
            <div className="absolute -left-[5px] top-50 w-[3px] h-10 bg-[#3a3a46] rounded-l-sm" />
            <div className="absolute -right-[5px] top-32 w-[3px] h-14 bg-[#3a3a46] rounded-r-sm" />

            <div className="relative w-full h-full rounded-[36px] sm:rounded-[40px] overflow-hidden bg-black flex flex-col justify-between select-none shadow-[inset_0_0_20px_rgba(0,0,0,0.9)]">
              <div className="absolute top-0 inset-x-0 z-40 px-6 pt-3 pb-2 flex items-center justify-between text-white/90 text-xs font-semibold pointer-events-none">
                <span className="font-mono tracking-tight text-[11px] sm:text-[13px] text-white/90 drop-shadow-md pl-1">
                  {currentTime}
                </span>
                
                <div className="w-24 sm:w-28 h-[22px] sm:h-[25px] bg-black rounded-full flex items-center justify-between px-2.5 border border-white/10 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0d] border border-blue-400/40 relative flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-blue-500/80 animate-pulse" />
                  </div>
                  <Heart size={11} className="text-pink-400 fill-pink-400 animate-pulse" />
                </div>
                
                <div className="flex items-center gap-1.5 text-white/90 drop-shadow-md pr-1">
                  <Signal size={12} />
                  <Wifi size={12} />
                  <Battery size={14} className="text-emerald-400" />
                </div>
              </div>

              <div 
                className="absolute inset-0 pointer-events-none z-30 opacity-25 bg-gradient-to-tr from-transparent via-white/20 to-transparent" 
                style={{ clipPath: 'polygon(0 0, 100% 0, 45% 100%, 0 100%)' }}
              />

              <div className="relative w-full h-full flex-1 overflow-hidden bg-black">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -35 || info.velocity.x < -200) {
                        goToNext();
                      } else if (info.offset.x > 35 || info.velocity.x > 200) {
                        goToPrev();
                      }
                    }}
                    onTap={() => {
                      setLightboxImg(images[currentIndex]);
                    }}
                    className="absolute inset-0 w-full h-full cursor-pointer active:cursor-grabbing"
                    title="Chạm để phóng to"
                  >
                    <img 
                      src={images[currentIndex]} 
                      alt={`Em bé photo ${currentIndex + 1}`}
                      className="w-full h-full object-cover select-none pointer-events-none"
                      draggable={false}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImg(images[currentIndex]);
                      }}
                      className="hoverable absolute top-12 right-4 z-20 p-2 rounded-full bg-black/50 backdrop-blur-md text-white/90 hover:text-white border border-white/20 hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
                      title="Phóng to"
                    >
                      <Maximize2 size={16} />
                    </button>

                    <div className="absolute bottom-12 inset-x-0 px-5 z-20 flex flex-col gap-1.5 pointer-events-none">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-white/60 font-mono text-[10px] border border-white/10">
                          {currentIndex + 1} / {total}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-light text-white/50 tracking-widest lowercase font-sans select-none drop-shadow">
                          ahxunriuu
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                  }}
                  className="hoverable absolute left-2.5 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white/90 hover:text-white hover:bg-black/80 hover:scale-110 active:scale-90 transition-all shadow-xl cursor-pointer"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="hoverable absolute right-2.5 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white/90 hover:text-white hover:bg-black/80 hover:scale-110 active:scale-90 transition-all shadow-xl cursor-pointer"
                  aria-label="Ảnh tiếp theo"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="absolute bottom-0 inset-x-0 z-40 pb-2.5 pt-1.5 flex flex-col items-center gap-2 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
                <div className="flex items-center gap-1.5">
                  {images.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => {
                        lastUserAction.current = Date.now();
                        setDirection(dotIdx > currentIndex ? 1 : -1);
                        setCurrentIndex(dotIdx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 hoverable cursor-pointer ${
                        dotIdx === currentIndex 
                          ? 'w-6 bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]' 
                          : 'w-1.5 bg-white/30 hover:bg-white/60'
                      }`}
                      aria-label={`Ảnh ${dotIdx + 1}`}
                    />
                  ))}
                </div>
                <div className="w-28 sm:w-32 h-[4px] bg-white/50 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {lightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImg(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={() => setLightboxImg(null)}
              className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-white/20 cursor-pointer"
              title="Nhấn để đóng"
            >
              <img
                src={lightboxImg}
                alt="Full photo"
                className="w-full h-full max-h-[85vh] object-contain hover:scale-[0.99] transition-transform duration-200"
              />
              <button
                type="button"
                onClick={() => setLightboxImg(null)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-black/70 hover:bg-white/20 text-white transition-all shadow-xl hoverable cursor-pointer z-10"
                title="Đóng"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}