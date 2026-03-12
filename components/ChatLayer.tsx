'use client'

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
// import { io } from "socket.io-client";
import { useAuth } from '@/store/useAuth';
import socket from "@/lib/socket";

export default function ChatLayer() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [specialMessages, setSpecialMessages] = useState<Message[]>([]);
  const [nowSpecialMessage, setNowSpecialMessage] = useState<Message | null>(null);
  const [isScrollDown, setIsScrollDown] = useState(true);

  const { user } = useAuth();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messageWrapRef = useRef<HTMLDivElement | null>(null);
  // const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;

  // const socket = io(socketUrl, {
  //   auth: user, // eslint-disable-next-line react-hooks/purity
  //   transports: ["websocket"],
  //   autoConnect: false, // import 시 자동 연결 방지
  // });


  // 스크롤 감지
  useEffect(() => {
    const el = messageWrapRef.current;
    if (!el) return;

    const onScroll = () => {
      const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setIsScrollDown(distanceToBottom <= 120); // 바닥에서 120px 이내면 true
    };

    el.addEventListener("scroll", onScroll);
    onScroll(); // 초기 상태 체크

    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // 메시지 도착 시 자동 스크롤
  useEffect(() => {
    if (isScrollDown && messageWrapRef.current) {
      messageWrapRef.current.scrollTop = messageWrapRef.current.scrollHeight;
    }
  }, [messages, isScrollDown]);
  // 1초마다 input 포커스
  useEffect(() => {
    if (!user) router.push("/login");
    const interval = setInterval(() => inputRef.current?.focus(), 1000);
    return () => clearInterval(interval);
  }, [user]);

  // Socket 연결
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    };
    socket.disconnect();
    if (!socket.connected) socket.connect();

    socket.auth = user

    socket.on("connect", () => console.log("✅ connected:", socket.id));
    socket.on("chat", (msg: Message) => setMessages(prev => [...prev, msg]));

    socket.on("chat-special", (msg: Message) => {
      setMessages(prev => [...prev, msg]);
      setNowSpecialMessage(null);
      setTimeout(() => {
        setNowSpecialMessage(msg);  
      }, 100);
      // setSpecialMessages(prev => [...prev, msg]);
      
    });

    return () => {
      socket.off("connect");
      socket.off("chat");
      socket.off("chat-special");
    };
  }, []);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { // Shift를 누르지 않은 경우
      e.preventDefault();
      sendMessage();
    }
    if (e.key === "Enter" && e.shiftKey) { // Shift+Enter인 경우
      // 예: 줄바꿈 추가
      specialMessage();
    }
  }

  const scrollDown = () => {
    if (messageWrapRef.current) {
      messageWrapRef.current.scrollTop = messageWrapRef.current.scrollHeight;
    }
  }

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("chat", {
      user_index: JSON.stringify(user?.user_index),
      id: JSON.stringify(user?.id),
      message
    });
    setMessage("");
  }

  const specialMessage = () => {
    if (!message.trim()) return;
    socket.emit("chat-special", {
      user_index: JSON.stringify(user?.user_index),
      id: JSON.stringify(user?.id),
      message
    });
    setMessage("");
  }

  return (
    <div className="chat-page">
      {
        nowSpecialMessage !== null &&
        <div className="special-message-wrap">
          {
            Array.from({ length: 30 }).map((_, index) => (
              <div className="special-message" key={`specialMessage-${index}`} style={{
                // eslint-disable-next-line react-hooks/purity
                top: `${Math.random() * 80 + 10}%`,
                // eslint-disable-next-line react-hooks/purity
                left: `${Math.random() * 80 + 10}%`,
                // eslint-disable-next-line react-hooks/purity
                color: `hsl(${Math.random() * 360}, 100%, 75%)`,
                fontWeight: "bold",
                fontSize: "24px",
                animation: `firework 3.5s ease-out forwards`,
              }}>{nowSpecialMessage?.message}</div>
            ))
          }
        </div>
      }
      <div className="message-wrap" ref={messageWrapRef}>
        {messages.map((msg: Message , i: number) => (
          <div key={`messsage-${i}`} className={`message ${Number(msg.user_index) === Number(user?.user_index) ? 'me' : ''} ${Number(msg.user_index) === -1 ? 'system': ''}`}>
            <span className="time">
              {msg.time}
            </span>
            <div className="nick">
              {String(msg.id).replaceAll(`"`, '')}
            </div>
            <div className="msg-content">
              {msg.message}
            </div>
          </div>
        ))}
      </div>
        
      <div className="chat-input-wrap">
        {!isScrollDown && 
          <div className="btn-down" onClick={scrollDown}>
            ↓
          </div>
        }
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지 입력"
          ref={inputRef}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="btn normal"
        >
          전송
        </button>
        <button
          onClick={specialMessage}
          className="btn special"
        >
          스페셜
        </button>

      </div>
      <style jsx>{`
          @keyframes firework {
            0% {
              transform: scale(0) translate(-50%, -50%);
              opacity: 0;
            }
            25% {
              transform: scale(1.5) translate(-50%, -50%);
              opacity: 1;
            }
            75% {
              transform: scale(1.5) translate(-50%, -50%);
              opacity: 1;
            }
            100% {
              transform: scale(1) translate(-50%, -50%);
              opacity: 0;
            }
          }
        `}</style>
    </div>
  );
}