import { brand } from '../data/brand';

export function Header() {
  return (
    <header className="absolute top-0 left-0 w-full z-30 bg-gradient-to-b from-black/85 via-black/40 to-transparent py-3 md:py-5 transition-all duration-500 pointer-events-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 flex flex-row items-center justify-between gap-2 md:gap-4">
        <a href="#home" className="flex items-center gap-3 hoverable shrink-0">
          <img src={brand.logo} alt={brand.name} className="h-7 md:h-10 w-auto object-contain drop-shadow-md" />
        </a>
        <div className="flex items-center gap-2 md:gap-4 text-accent font-bold tracking-[0.3em] text-[10px] md:text-xs shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_10px_rgba(217,4,41,0.8)] ml-1 md:ml-2" />
            <span className="hidden md:inline">LIVE SHOWCASE</span>
          </div>
        </div>
      </div>
    </header>
  );
}