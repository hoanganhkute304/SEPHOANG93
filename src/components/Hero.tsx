import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black snap-center">
      {/* Lớp phủ tối để làm nổi bật chữ */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

      {/* VIDEO NỀN - Đã trang bị đầy đủ thuộc tính chống bung Fullscreen trên iOS/TikTok */}
      <video
        src="https://res.cloudinary.com/wos7u4ud/video/upload/v1789712315/jett-valorant-hd-live-wallpaper-for-pc.mp4" 
        autoPlay
        loop
        muted
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        controls={false}
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
      />

      {/* NỘI DUNG CHÍNH */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-white font-display font-black text-6xl md:text-8xl lg:text-9xl tracking-widest drop-shadow-[0_0_30px_rgba(217,4,41,0.6)] uppercase"
        >
          SẾP HOÀNG
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-4 text-[#D90429] font-mono text-xs md:text-sm lg:text-base tracking-[0.4em] uppercase font-bold bg-black/50 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm"
        >
          Gaming Creator • Tech Enthusiast
        </motion.p>
      </div>

      {/* Mũi tên hướng dẫn cuộn xuống */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 z-20 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-white/50 text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase">
          Cuộn xuống
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ChevronDown className="text-[#D90429]" size={28} />
        </motion.div>
      </motion.div>
    </section>
  );
}