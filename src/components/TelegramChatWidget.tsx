import { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  X, 
  Monitor, 
  Gamepad2, 
  Globe, 
  Download, 
  ExternalLink,
  ChevronDown,
  MessageSquare
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'hoang' | 'system';
  text: string;
  time: string;
  topic?: string;
  status?: 'sending' | 'sent' | 'error';
}

const TELEGRAM_BOT_TOKEN = "8823460701:AAGhEPsXQPVC-lJUE2YRTqo48bWLtx4OGqg";
const TELEGRAM_CHAT_ID = "5011578485";
const TELEGRAM_USERNAME = "hoanganhhentai";

// 4 câu hỏi có sẵn theo yêu cầu chính xác của người dùng
const PRESET_TOPICS = [
  {
    id: 'build_pc',
    title: 'Build PC',
    icon: Monitor,
    message: 'Chào Sếp Hoàng, mình đang cần tư vấn cấu hình build PC gaming / làm việc theo ngân sách. Nhờ Sếp tư vấn giúp với ạ!'
  },
  {
    id: 'build_web',
    title: 'Build WEB',
    icon: Globe,
    message: 'Chào Sếp, mình đang cần thiết kế và xây dựng website / ứng dụng theo yêu cầu. Nhờ Sếp trao đổi chi tiết giúp ạ!'
  },
  {
    id: 'install_app',
    title: 'Install app',
    icon: Download,
    message: 'Sếp ơi, hướng dẫn mình cách tải và cài đặt ứng dụng / phần mềm hỗ trợ với ạ!'
  },
  {
    id: 'play_together',
    title: 'Playtogether',
    icon: Gamepad2,
    message: 'Sếp Hoàng ơi! Mình muốn xin slot chơi chung / leo rank giao lưu cùng Sếp nhé!'
  }
];

// Hàm tạo mã định danh máy / phiên độc nhất cho từng thiết bị
function getOrCreateSessionId(): string {
  try {
    let sid = sessionStorage.getItem('sh93_chat_session_id');
    if (!sid) {
      const rand = Math.floor(1000 + Math.random() * 9000);
      sid = `#K${rand}`;
      sessionStorage.setItem('sh93_chat_session_id', sid);
    }
    return sid;
  } catch {
    return `#K${Math.floor(1000 + Math.random() * 9000)}`;
  }
}

export function TelegramChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showContactInput, setShowContactInput] = useState(false);
  
  // Mã phiên định danh độc nhất cho máy này (xoá khi thoát web)
  const [sessionId] = useState<string>(() => getOrCreateSessionId());

  // Trạng thái ẩn câu hỏi nhanh khi đã ấn 1 lần
  const [showQuickTopics, setShowQuickTopics] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sh93_quick_topics_hidden') !== 'true';
    } catch {
      return true;
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLElement>(null);

  // Tự động đóng chat khi người dùng bấm ra ngoài
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Set các message_id Telegram đã xử lý để tránh hiển thị trùng trong phiên
  const processedTelegramIdsRef = useRef<Set<number>>(new Set());

  // Khởi tạo lịch sử chat từ SessionStorage (Thoát web là tự động xoá sạch và bắt đầu đoạn chat mới)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('sh93_session_chat_msgs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'welcome-msg',
        sender: 'system',
        text: `Xin chào! Bạn đang kết nối với Sếp Hoàng (Mã máy của bạn: ${getOrCreateSessionId()}). Tin nhắn gửi ở đây sẽ tới thẳng Telegram của Sếp và phản hồi riêng về máy của bạn.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  // Tự động cuộn xuống tin nhắn mới nhất khi mở hoặc có tin mới
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Lưu lịch sử chat vào sessionStorage (chỉ tồn tại trong phiên duyệt web hiện tại)
  useEffect(() => {
    try {
      sessionStorage.setItem('sh93_session_chat_msgs', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Lắng nghe sự kiện thoát khỏi trang để đảm bảo dọn sạch phiên chat
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        sessionStorage.removeItem('sh93_session_chat_msgs');
        sessionStorage.removeItem('sh93_chat_session_id');
        sessionStorage.removeItem('sh93_quick_topics_hidden');
      } catch {}
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // POLLING TỰ ĐỘNG: Lấy tin nhắn phản hồi từ Sếp Hoàng trên Telegram
  // ĐẶC BIỆT: CHỈ NHẬN TIN NHẮN PHẢN HỒI ĐÍCH DANH CHO MÁY NÀY (Định danh theo sessionId)
  useEffect(() => {
    let isMounted = true;

    const fetchTelegramUpdates = async () => {
      try {
        const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.ok && Array.isArray(data.result) && isMounted) {
          const newReplies: ChatMessage[] = [];

          for (const update of data.result) {
            const msg = update.message;
            if (!msg || !msg.message_id) continue;

            const msgId = msg.message_id;
            const fromId = String(msg.from?.id || msg.chat?.id || '');
            const isFromBot = Boolean(msg.from?.is_bot);

            // Kiểm tra: Tin nhắn xuất phát từ chính Sếp Hoàng (ID: 5011578485, không phải bot)
            if (fromId === TELEGRAM_CHAT_ID && !isFromBot && msg.text) {
              if (!processedTelegramIdsRef.current.has(msgId)) {
                
                // KIỂM TRA ĐÍCH DANH: Sếp trả lời riêng cho máy này hay máy khác?
                const replyToText = msg.reply_to_message?.text || '';
                const isReplyToThisClient = replyToText.includes(`[${sessionId}]`) || replyToText.includes(sessionId);
                const isDirectTaggedToClient = msg.text.includes(sessionId);

                // Nếu có tin nhắn trong phiên của máy này đã được gửi và Sếp reply đúng tin đó
                const isReplyToMySentMessage = Boolean(
                  msg.reply_to_message && 
                  messages.some(m => m.sender === 'user' && replyToText.includes(m.text))
                );

                // CHỈ CHẤP NHẬN NẾU TIN PHẢN HỒI NÀY THUỘC VỀ ĐÚNG MÁY NÀY
                if (isReplyToThisClient || isDirectTaggedToClient || isReplyToMySentMessage) {
                  processedTelegramIdsRef.current.add(msgId);

                  // Lọc bỏ tag session khỏi text hiển thị cho đẹp nếu Sếp có gõ
                  let cleanText = msg.text.replace(sessionId, '').trim();
                  if (!cleanText) cleanText = msg.text;

                  const msgDate = msg.date ? new Date(msg.date * 1000) : new Date();
                  const timeStr = msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  newReplies.push({
                    id: `tg-${msgId}`,
                    sender: 'hoang',
                    text: cleanText,
                    time: timeStr
                  });
                }
              }
            }
          }

          if (newReplies.length > 0) {
            setMessages(prev => [...prev, ...newReplies]);

            // Nếu đang đóng ô chat thì tăng số thông báo
            if (!isOpen) {
              setUnreadCount(prev => prev + newReplies.length);
            }
          }
        }
      } catch {
        // im lặng nếu lỗi mạng tạm thời
      }
    };

    // Chạy ngay lần đầu tiên
    fetchTelegramUpdates();

    // Polling định kỳ mỗi 2 giây
    const interval = setInterval(fetchTelegramUpdates, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isOpen, sessionId, messages]);

  // HÀM GỬI TIN TỔNG QUÁT (Dùng cho cả nhập tay lẫn câu hỏi nhanh)
  const sendChatMessage = async (content: string, topicName: string) => {
    const finalContent = content.trim();
    if (!finalContent || isSending) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = 'msg-' + Date.now();

    // Thêm tin nhắn của User vào khung chat
    const userMessage: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: finalContent,
      time: nowTime,
      topic: topicName,
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsSending(true);

    // Gửi tin nhắn qua Telegram Bot tới Sếp Hoàng với mã định danh máy [sessionId]
    // Hướng dẫn Sếp Reply trực tiếp để phản hồi đúng máy khách này
    const formattedTelegramText = 
`⚡ [TIN NHẮN TỪ KHÁCH: ${sessionId}]
📌 Chủ đề: ${topicName}
💬 Nội dung:
"${finalContent}"
👤 Liên hệ: ${contactInfo.trim() || 'Chưa để lại số'}
⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}

👉 Sếp bấm "Reply" (Trả lời) tin nhắn này để phản hồi riêng về máy [${sessionId}]`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: formattedTelegramText
        })
      });

      const resData = await response.json();

      if (resData.ok) {
        setMessages(prev => 
          prev.map(m => m.id === userMsgId ? { ...m, status: 'sent' } : m)
        );
      } else {
        throw new Error(resData.description || 'Lỗi gửi tin');
      }
    } catch (err) {
      console.error("Lỗi gửi Telegram:", err);
      setMessages(prev => 
        prev.map(m => m.id === userMsgId ? { ...m, status: 'error' } : m)
      );
    } finally {
      setIsSending(false);
    }
  };

  // KHI ẤN CÂU HỎI NHANH: Gửi luôn tin nhắn và ẩn ngay phần câu hỏi nhanh
  const handleQuickTopicClick = (topic: typeof PRESET_TOPICS[0]) => {
    // 1. Gửi luôn tin nhắn
    sendChatMessage(topic.message, topic.title);
    
    // 2. Ẩn phần câu hỏi nhanh đi
    setShowQuickTopics(false);
    try {
      sessionStorage.setItem('sh93_quick_topics_hidden', 'true');
    } catch {}
  };

  const handleSendMessage = () => {
    sendChatMessage(inputText, 'Liên hệ chung');
  };

  // Lắng nghe sự kiện mở chat tự động từ các nút chức năng (ví dụ: Bạn cần build PC?)
  useEffect(() => {
    const handleOpenWithPreset = (e: Event) => {
      const customEvent = e as CustomEvent<{ topicId?: string; title?: string; message?: string }>;
      setIsOpen(true);
      const detail = customEvent.detail;
      if (detail && detail.message) {
        sendChatMessage(detail.message, detail.title || 'Build PC');
      }
    };
    window.addEventListener('open_chat_with_preset', handleOpenWithPreset);
    return () => window.removeEventListener('open_chat_with_preset', handleOpenWithPreset);
  }, []);

  return (
    <aside 
      ref={widgetRef}
      id="telegram-chat-widget"
      aria-label="Telegram Chat Widget"
      className="fixed bottom-5 right-5 z-[150] flex flex-col items-end font-sans"
    >
      {/* CỬA SỔ CHAT: THIẾT KẾ GỌN GÀNG, NHẸ NHÀNG, KHÔNG MÀU MÈ */}
      {isOpen && (
        <section 
          aria-label="Cửa sổ trò chuyện trực tiếp"
          className="w-[350px] sm:w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-6rem)] bg-[#121215] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden mb-3.5 backdrop-blur-md"
        >
          {/* HEADER GỌN GÀNG */}
          <div className="bg-[#18181c] border-b border-white/10 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-white text-xs font-bold font-mono">
                  SH
                </div>
                <div 
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#18181c]" 
                  title="Sếp Hoàng đang trực tuyến trên Telegram"
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    Sếp Hoàng 93
                  </h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-white/70">
                    {sessionId}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400/90 font-mono">
                  Kênh riêng máy bạn • 2 chiều trực tiếp
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <a
                href={`https://t.me/${TELEGRAM_USERNAME}`}
                target="_blank"
                rel="noreferrer"
                title="Mở ứng dụng Telegram"
                className="hoverable p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ExternalLink size={15} />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="hoverable p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                title="Thu gọn"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* VÙNG DANH SÁCH TIN NHẮN */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#0d0d0f] hide-scrollbar text-xs">
            {messages.map((msg) => {
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="text-center my-2">
                    <p className="inline-block px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 text-[11px] text-white/60 leading-relaxed max-w-[90%]">
                      {msg.text}
                    </p>
                  </div>
                );
              }

              if (msg.sender === 'hoang') {
                return (
                  <div key={msg.id} className="flex flex-col items-start max-w-[85%]">
                    <span className="text-[10px] font-mono text-emerald-400 mb-1 ml-1 font-semibold">
                      Sếp Hoàng (Telegram)
                    </span>
                    <div className="rounded-2xl rounded-tl-xs px-3.5 py-2.5 bg-[#1f1f24] border border-white/10 text-white text-[13px] leading-relaxed shadow-sm">
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-white/40 font-mono mt-1 ml-1">
                      {msg.time}
                    </span>
                  </div>
                );
              }

              // Tin nhắn của User
              return (
                <div key={msg.id} className="flex flex-col items-end ml-auto max-w-[85%]">
                  {msg.topic && (
                    <span className="text-[9px] font-mono text-sky-400 mb-1 mr-1">
                      {msg.topic}
                    </span>
                  )}
                  <div className="rounded-2xl rounded-tr-xs px-3.5 py-2.5 bg-[#2563eb] text-white text-[13px] leading-relaxed shadow-sm">
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono mt-1 mr-1">
                    <span>{msg.time}</span>
                    <span>
                      {msg.status === 'sending' && '• Đang gửi'}
                      {msg.status === 'sent' && '• Đã gửi Sếp'}
                      {msg.status === 'error' && '• Lỗi'}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* 4 CÂU HỎI CÓ SẴN (ẤN 1 LẦN LÀ GỬI LUÔN VÀ ẨN NGAY ĐI) */}
          {showQuickTopics && (
            <div className="border-t border-white/10 bg-[#151518] p-2.5 transition-all">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-white/40 mb-1.5 px-1">
                <span>Chọn nhanh chủ đề (gửi ngay):</span>
                <button 
                  onClick={() => {
                    setShowQuickTopics(false);
                    try { sessionStorage.setItem('sh93_quick_topics_hidden', 'true'); } catch {}
                  }}
                  className="hover:text-white text-white/40"
                  title="Ẩn câu hỏi nhanh"
                >
                  <X size={12} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {PRESET_TOPICS.map((topic) => {
                  const Icon = topic.icon;

                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleQuickTopicClick(topic)}
                      disabled={isSending}
                      className="hoverable flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-left text-[11px] bg-white/[0.03] border-white/5 text-white/80 hover:bg-white/[0.09] hover:text-white transition-colors active:scale-95 disabled:opacity-40"
                    >
                      <Icon size={13} className="shrink-0 text-sky-400" />
                      <span className="truncate font-medium">{topic.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* NHẬP TIN NHẮN & NÚT GỬI */}
          <div className="p-3 bg-[#121215] border-t border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowContactInput(!showContactInput)}
                className="text-[10px] font-mono text-white/40 hover:text-white/70 flex items-center gap-1 transition-colors"
              >
                <span>{showContactInput ? 'Ẩn thông tin liên hệ' : '+ Để lại SĐT / Zalo / Telegram'}</span>
                <ChevronDown size={11} className={`transform transition-transform ${showContactInput ? 'rotate-180' : ''}`} />
              </button>
              {contactInfo && !showContactInput && (
                <span className="text-[10px] font-mono text-emerald-400 truncate max-w-[140px]">
                  ✓ {contactInfo}
                </span>
              )}
            </div>

            {showContactInput && (
              <input
                type="text"
                placeholder="Số điện thoại, Zalo hoặc Telegram của bạn..."
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white text-xs font-mono outline-none focus:border-white/30 placeholder:text-white/30"
              />
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                placeholder="Nhắn tin cho Sếp Hoàng..."
                className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-xs outline-none focus:border-white/30 placeholder:text-white/30 transition-colors"
              />

              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isSending}
                className="hoverable px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white rounded-lg flex items-center justify-center transition-colors shrink-0"
                title="Gửi tin nhắn"
              >
                <Send size={14} className={isSending ? 'animate-pulse' : ''} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* NÚT BẤM GÓC DƯỚI PHẢI: ĐÃ BỎ CHỮ 'CHAT VỚI SẾP', CHỈ ĐỂ LOGO TRÒN TINH TẾ */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setUnreadCount(0);
        }}
        aria-expanded={isOpen}
        aria-controls="telegram-chat-widget"
        className="hoverable group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#18181c] hover:bg-[#202026] text-white border border-white/15 shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
        title="Chat với Sếp Hoàng"
      >
        <div className="relative flex items-center justify-center">
          <MessageSquare size={20} className="text-white/90" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#18181c] shadow-[0_0_8px_#10b981]" />
        </div>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-red-500 text-[10px] font-mono font-bold text-white leading-none shadow-md">
            {unreadCount}
          </span>
        )}
      </button>
    </aside>
  );
}

