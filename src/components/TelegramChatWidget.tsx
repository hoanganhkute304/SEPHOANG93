import { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Phone } from 'lucide-react';

export function TelegramChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState(''); // Thêm state lưu cách liên lạc
  const [isSending, setIsSending] = useState(false);
  const [sentStatus, setSentStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const BOT_TOKEN = "8823460701:AAGhEPsXQPVC-lJUE2YRTqo48bWLtx4OGqg";
  const CHAT_ID = "5011578485";

  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      if (e.detail?.message) setMessage(e.detail.message);
    };
    window.addEventListener('open_chat_with_preset', handleOpenChat);
    return () => window.removeEventListener('open_chat_with_preset', handleOpenChat);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || !contact.trim()) return;
    setIsSending(true);
    setSentStatus('idle');

    try {
      // Đính kèm thông tin liên lạc vào tin nhắn báo về máy bạn
      const text = `💬 *CÓ KHÁCH CẦN TƯ VẤN:*\n\n` + 
                   `📌 *Liên hệ:* ${contact}\n` +
                   `📝 *Nội dung:* ${message}`;
                   
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: 'Markdown'
        })
      });

      if (response.ok) {
        setSentStatus('success');
        setMessage('');
        setContact('');
        setTimeout(() => {
          setSentStatus('idle');
          setIsOpen(false); 
        }, 2000);
      } else {
        setSentStatus('error');
      }
    } catch (error) {
      setSentStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div id="telegram-chat-widget" className="fixed bottom-6 right-6 z-[150] flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="w-80 md:w-96 bg-[#0D0D0D]/95 border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] mb-4 overflow-hidden pointer-events-auto backdrop-blur-xl animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-[#D90429] p-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold font-display uppercase tracking-wider">Để lại lời nhắn</h3>
              <p className="text-white/80 text-xs">Mình sẽ phản hồi sớm nhất có thể</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-black transition-colors p-1">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-4 flex flex-col gap-3">
            <div className="relative">
              <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="SĐT, Zalo hoặc Telegram của bạn..."
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white text-sm outline-none focus:border-[#D90429]"
              />
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập nội dung cần tư vấn..."
              className="w-full h-24 bg-black/50 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-[#D90429] resize-none"
            />
            
            {sentStatus === 'success' && <span className="text-green-400 text-xs text-center font-bold">Đã gửi! Mình sẽ liên hệ lại sớm.</span>}
            {sentStatus === 'error' && <span className="text-red-400 text-xs text-center font-bold">Lỗi kết nối.</span>}
            
            <button
              onClick={handleSendMessage}
              disabled={isSending || !message.trim() || !contact.trim()}
              className="hoverable w-full bg-[#D90429] hover:bg-[#EF233C] disabled:bg-white/10 disabled:text-white/40 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors uppercase tracking-widest text-xs mt-1"
            >
              {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {isSending ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hoverable pointer-events-auto flex items-center justify-center w-14 h-14 bg-[#D90429] hover:bg-[#EF233C] text-white rounded-full shadow-[0_0_20px_rgba(217,4,41,0.5)] transition-transform hover:scale-110 active:scale-95"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}