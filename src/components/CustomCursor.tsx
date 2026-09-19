import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Tắt custom cursor trên điện thoại/cảm ứng để đỡ tốn tài nguyên
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;
    let cursorX = -100;
    let cursorY = -100;
    let isHovering = false;
    let isInsideChat = false;

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const target = e.target as HTMLElement | null;
      isInsideChat = Boolean(target?.closest('#telegram-chat-widget') || target?.closest('#floating-bgm-controller'));
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isHoverable = target.closest('a') || target.closest('button') || target.closest('.hoverable');
      isHovering = !!isHoverable;
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);

    let animationFrameId: number;

    // Dùng API nội tại của trình duyệt để render siêu mượt mà không dùng thư viện ngoài
    const render = () => {
      // Nội suy để con trỏ chạy mượt (Lerp)
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;

      if (cursor) {
        if (isInsideChat) {
          cursor.style.opacity = '0';
        } else {
          cursor.style.opacity = '1';
          // Sử dụng translate3d đẩy xử lý sang GPU
          cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`;
          
          if (isHovering) {
            cursor.style.backgroundColor = 'rgba(217, 4, 41, 0.25)';
            cursor.style.border = '1px solid #D90429';
          } else {
            cursor.style.backgroundColor = '#fff';
            cursor.style.border = 'none';
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] hidden md:block transition-colors duration-200"
      style={{ willChange: 'transform' }} // Gợi ý cho GPU
    />
  );
}