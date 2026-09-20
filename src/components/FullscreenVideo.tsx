import { useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { Wallpaper } from '../App';
import { CenterStageGallery } from './CenterStageGallery';
import { QuadGameFrames } from './QuadGameFrames';

interface Props {
  index: number;
  data: Wallpaper;
}

export function FullscreenVideo({ index, data }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isInView = useInView(containerRef, { amount: 0.5 });

  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        // Tự động phát khi cuộn tới
        videoRef.current.play().catch(() => {});
      } else {
        // Tạm dừng khi cuộn qua để nhẹ máy
        videoRef.current.pause();
      }
    }
  }, [isInView]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-screen snap-center overflow-hidden flex flex-col items-center justify-center bg-black"
    >
      {/* Lớp phủ đen nhẹ 40% để dễ đọc chữ */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

      {/* VIDEO NỀN - Đã thêm giáp chống bung Fullscreen trên Mobile/TikTok */}
      <video
        ref={videoRef}
        src={data.url}
        loop
        muted
        autoPlay
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        controls={false}
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
      />

      {/* NỘI DUNG CHÍNH (Chữ, Gallery, Game Frames) */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center p-6 text-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: false, amount: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-white font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-wider drop-shadow-[0_0_30px_rgba(255,255,255,0.3)] uppercase pointer-events-auto">
            {data.title}
          </h2>
          {data.subtitle && (
            <p className="text-[#D90429] mt-2 font-mono font-bold tracking-[0.3em] text-sm md:text-base lg:text-lg pointer-events-auto">
              {data.subtitle}
            </p>
          )}
        </motion.div>

        {/* Khôi phục khả năng click/chạm cho phần thư viện ảnh và thông tin Rank game */}
        <div className="pointer-events-auto w-full max-w-[1400px]">
          {data.gallery && <CenterStageGallery items={data.gallery} />}
          {data.gameFrames && <QuadGameFrames frames={data.gameFrames} />}
        </div>
      </div>
    </section>
  );
}