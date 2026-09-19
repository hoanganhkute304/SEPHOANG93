import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomCursor } from './components/CustomCursor';
import { Hero } from './components/Hero';
import { FullscreenVideo } from './components/FullscreenVideo';
import { FinalCTA } from './components/FinalCTA';
import { TelegramChatWidget } from './components/TelegramChatWidget';
import { HeroYouTubeBGM } from './components/HeroYouTubeBGM';
import { defaultGameFrames, GameFrame } from './components/QuadGameFrames';

export interface GalleryItem {
  id?: string;
  title?: string;
  image: string;
  video: string;
}

export interface Wallpaper {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  order: number;
  gallery?: GalleryItem[];
  gameFrames?: GameFrame[];
}

const defaultGallery: GalleryItem[] = [
  {
    title: "MUSHOKUTENSEI",
    image: "https://res.cloudinary.com/wos7u4ud/image/upload/v1789760397/act-like-mt-anime-season-1-just-got-announced-v0-wu3zimbd6qed1.webp",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789761228/New_Season_is_out.mp4"
  },
  {
    title: "RE: ZERO",
    image: "https://res.cloudinary.com/wos7u4ud/image/upload/v1789760397/am-i-the-only-one-that-thinks-the-re-zero-anime-and-novels-v0-2spe3p6vuqec1.webp",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789761230/Julius_Vs_Reid_Astrea_peak.mp4"
  },
  {
    title: "KONOSUBA",
    image: "https://res.cloudinary.com/wos7u4ud/image/upload/v1789760397/konosuba-season-3-key-visual-v0-tJDG8cIHwP5YOvwo2RlDNoVyMiDoVaZAKZBwHeYwo_U.webp",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789761226/%E5%A4%A9%E7%84%B6%E7%89%A9%E3%81%AE%E9%87%8E%E8%89%AF%E3%83%A1%E3%83%AD%E3%83%B3_3%E6%9C%9F%E7%AC%AC3%E8%A9%B1%E3%81%93%E3%81%AE%E8%B3%A2%E3%81%97%E3%81%84%E5%B0%91%E5%A5%B3%E3%81%AB%E5%86%8D%E6%95%99%E8%82%B2%E3%82%92%E3%82%88%E3%82%8A_TV%E3%82%A2%E3%83%8B%E3%83%A1%E3%81%93%E3%81%AE%E7%B4%A0%E6%99%B4%E3%82%89%E3%81%97%E3%81%84%E4%B8%96%E7%95%8C%E3%81%AB%E7%A5%9D%E7%A6%8F%E3%82%92%E5%A5%BD%E8%A9%95%E6%94%BE%E9%80%81%E4%B8%AD.mp4"
  },
  {
    title: "FRIREN",
    image: "https://res.cloudinary.com/wos7u4ud/image/upload/v1789760398/MV5BZTI4ZGMxN2UtODlkYS00MTBjLWE1YzctYzc3NDViMGI0ZmJmXkEyXkFqcGc._V1_.jpg",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789761230/noname.mp4"
  },
  {
    title: "Jujutsu Kaisen",
    image: "https://res.cloudinary.com/wos7u4ud/image/upload/v1789760398/Anime_Key_Visual_2.webp",
    video: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789761099/TV%E3%82%A2%E3%83%8B%E3%83%A1_%E5%89%8D%E7%B7%A8_%E6%9C%80%E7%B5%82%E5%9B%9E%E4%BB%99%E5%8F%B0%E7%B5%90%E7%95%8C3%E6%9C%8826%E6%97%A5_%E6%9C%A8_%E6%B7%B1%E5%A4%9C0%E6%99%8226%E5%88%86%E6%9C%AC%E7%B7%A8%E6%8B%A1%E5%A4%A7%E3%82%B9%E3%83%9A%E3%82%B7%E3%83%A3%E3%83%AB_MBS-TBS%E7%B3%BB28_%E5%B1%80%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%A4%E3%82%BA%E3%83%A0_TURBO%E6%9E%A0%E3%81%AB%E3%81%A6%E5%85%A8%E5%9B%BD%E5%90%8C%E6%99%82%E6%94%BE%E9%80%81_%E6%9C%80%E7%B5%82%E5%9B%9E%E3%81%AF%E6%9C%AC%E7%B7%A8%E5%B0%BA%E3%82%92%E6%8B%A1%E5%A4%A7%E3%81%97%E7%89%B9%E5%88%A5%E5%B0%BA_27%E5%88%86_%E3%81%A7%E3%81%AE%E6%94%BE%E9%80%81%E3%81%A8%E3%81%AA%E3%82%8A%E3%81%BE%E3%81%99.mp4"
  }
];

const fallbackWallpapers: Wallpaper[] = [
  {
    id: "jett-jinx",
    title: "JETT x JINX",
    subtitle: "CROSSOVER EDIT",
    url: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712320/jett-x-jinx-live-wallpaper.mp4",
    order: 1
  },
  {
    id: "sage-lny",
    title: "SAGE NIGHT MARKET",
    subtitle: "LUNAR NEW YEAR",
    url: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712317/valorant-lny-sage-night-market-live-wallpaper.mp4",
    order: 2,
    gameFrames: defaultGameFrames
  },
  {
    id: "jett-hd",
    title: "JETT BLADE STORM",
    subtitle: "",
    url: "https://res.cloudinary.com/wos7u4ud/video/upload/v1789712315/jett-valorant-hd-live-wallpaper-for-pc.mp4",
    order: 3,
    gallery: defaultGallery
  }
];

function App() {
  const [wallpapers] = useState<Wallpaper[]>(fallbackWallpapers);
  const [isEntered, setIsEntered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntered(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <CustomCursor />
      
      <AnimatePresence>
        {!isEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
            onClick={() => setIsEntered(true)}
            className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center cursor-pointer select-none"
          >
            <motion.div
              animate={{ scale: [1, 1.02, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="flex flex-col items-center gap-5 md:gap-6"
            >
              <span className="text-[#D90429] font-display text-5xl md:text-7xl lg:text-8xl tracking-[0.2em] font-black text-center drop-shadow-[0_0_20px_rgba(217,4,41,0.6)]">
                SẾP HOÀNG 93
              </span>
              <span className="text-white/60 font-mono text-xs md:text-sm tracking-[0.4em] uppercase border border-white/10 px-6 py-2 rounded-full bg-white/5">
                Chạm vào màn hình để bắt đầu
              </span>
            </motion.div>
            
            <div className="absolute bottom-12 w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 5, ease: "linear" }}
                 className="h-full bg-[#D90429] shadow-[0_0_10px_#D90429]"
               />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEntered && (
        <>
          <HeroYouTubeBGM />
          <TelegramChatWidget />
          <main className="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth relative z-0 bg-black">
            <Hero />
            {wallpapers.map((wp, index) => (
              <FullscreenVideo 
                key={wp.id} 
                index={index} 
                data={wp} 
              />
            ))}
            <FinalCTA />
          </main>
        </>
      )}
    </>
  );
}

export default App;