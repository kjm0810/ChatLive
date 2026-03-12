'use client'

import { useAuth } from '@/store/useAuth';
import Link from 'next/link';
import dynamic from "next/dynamic";

function ChatHeader() {
  const { user, logout } = useAuth();

  return (
    <div className='header'>
      <div className="left">
        <h1>
          <Link href={'/'}>Chat Live</Link>
        </h1>
      </div>

      {user && (
        <div className="right">
          <span className="nick">
            {user.id}님
          </span>
          <div className="logout" onClick={logout}>
            로그아웃 ↩
          </div>
        </div>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(ChatHeader), {
  ssr: false
});