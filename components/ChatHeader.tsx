'use client'

import { useAuth } from '@/store/useAuth';
import Link from 'next/link';
import dynamic from "next/dynamic";

function ChatHeader() {
  const { user, logout } = useAuth();

  return (
    <div className="header">
      <div className="container header-inner">
        <div className="left">
          <h1 className="brand">
            <Link href={"/"}>
              <span className="badge">LIVE</span>
              Chat Live
            </Link>
          </h1>
        </div>

        {user && (
          <div className="right">
            <span className="nick">
              <span className="status-dot" />
              {user.id}님
            </span>
            <button type="button" className="logout" onClick={logout}>
              <span>로그아웃</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="9 10 4 15 9 20" />
                <path d="M20 4v7a4 4 0 0 1-4 4H4" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(ChatHeader), {
  ssr: false
});
