'use client'

import { useAuth } from "@/store/useAuth";
import Link from "next/link";

export default function MainBtns() {
  const { user, logout } = useAuth();

  return (
    <div className="btn-wrap">
      {user && (
        <div className="info">
          <span className="label">접속 계정</span>
          <strong>{user.id}</strong>
        </div>
      )}
      <div className="btns">
        {user ? (
          <button type="button" className="link" onClick={logout}>
            로그아웃
          </button>
        ) : (
          <Link className="link" href={"/login"}>
            로그인
          </Link>
        )}

        <Link className="link solid" href={"/chat"}>
          채팅 입장
        </Link>
      </div>
    </div>
  );
}
