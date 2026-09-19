import { useState } from 'react';
import { brand } from '../data/brand';
import { Copy, Check } from 'lucide-react';

export function FinalCTA() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const contactList = [
    {
      key: 'telegram',
      label: 'TELEGRAM',
      value: 'hoanganhhentai',
      link: 'https://t.me/hoanganhhentai',
    },
    {
      key: 'discord',
      label: 'DISCORD',
      value: 'hoanganhkute304',
      link: 'https://discord.com',
    },
    {
      key: 'email',
      label: 'EMAIL',
      value: 'hoanganh3042003@gmail.com',
      link: 'mailto:hoanganh3042003@gmail.com',
    },
    {
      key: 'sdt',
      label: 'SDT',
      value: '+084: 0981083304',
      link: 'tel:+84981083304',
    }
  ];

  const handleCopy = (key: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-bgBase snap-start snap-always shrink-0 flex flex-col items-center justify-center select-none">
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-75"
        >
          <source src="https://res.cloudinary.com/wos7u4ud/video/upload/v1787243756/13_04_Homescreen.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-bgBase via-bgBase/60 to-transparent" />
      </div>
      
      {/* TIÊU ĐỀ CHÍNH GIỮA (ĐÃ BỎ DÒNG SẾP HOÀNG 93 - VALORANT/LOL) */}
      <div className="relative z-10 text-center flex flex-col items-center px-4">
        <h2 className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-display text-white leading-none drop-shadow-2xl">
          SEE YOU<br/><span className="text-accent">IN GAME.</span>
        </h2>
      </div>

      {/* FOOTER BẢN QUYỀN GÓC TRÁI DƯỚI CÙNG */}
      <div className="absolute bottom-6 md:bottom-8 left-6 md:left-12 hidden sm:flex items-center gap-3 z-20">
        <img src={brand.logo} alt={brand.name} className="h-5 w-auto object-contain opacity-40" />
        <p className="text-[10px] tracking-[0.2em] text-white/40">{brand.tagline}</p>
      </div>

      {/* THÔNG TIN LIÊN HỆ Ở DƯỚI CÙNG GÓC PHẢI - HÀNG NGANG, CHỈ CHỮ VÀ NÚT COPY */}
      {/* Yêu cầu: Bỏ số điện thoại nhưng giữ nguyên vị trí, không được dịch chuyển các ô khác vì bị che bởi bật nhạc và chat */}
      <div className="absolute bottom-6 md:bottom-8 right-6 md:right-12 z-30 flex flex-row flex-wrap items-center justify-end gap-4 sm:gap-6 pointer-events-auto">
        {contactList.map((item) => {
          if (item.key === 'sdt') {
            return (
              <div 
                key={item.key} 
                className="invisible pointer-events-none select-none flex items-center gap-1.5"
                aria-hidden="true"
              >
                <div className="font-mono text-xs sm:text-sm flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                    {item.label}
                  </span>
                  <span className="font-semibold tracking-wide">
                    {item.value}
                  </span>
                </div>
                <div className="p-1 w-[22px] h-[22px]" />
              </div>
            );
          }

          const isCopied = copiedKey === item.key;

          return (
            <div 
              key={item.key} 
              className="flex items-center gap-1.5 group"
            >
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs sm:text-sm text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] hover:text-accent transition-colors flex items-center gap-2"
              >
                <span className="text-white/50 font-bold uppercase tracking-wider text-[11px] sm:text-xs">
                  {item.label}
                </span>
                <span className="font-semibold text-white tracking-wide group-hover:text-accent transition-colors">
                  {item.value}
                </span>
              </a>

              <button
                onClick={() => handleCopy(item.key, item.value)}
                title={`Sao chép ${item.value}`}
                className="hoverable p-1 text-white/40 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                {isCopied ? (
                  <Check size={14} className="text-green-400" />
                ) : (
                  <Copy size={14} className="opacity-60 group-hover:opacity-100 hover:scale-110 transition-all" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
