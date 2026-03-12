'use client'

import { useAuth } from "@/store/useAuth";
import Link from "next/link";

export default function MainBtns() {
    const { user, logout} = useAuth();
    
    return (
        <div className="btn-wrap">
            {
                user && 
                <div className="info">
                    { user.id }
                </div>
            }
            <div className="btns">
                {
                    user ? 
                    <div className="link" onClick={() => {logout()}}>로그아웃</div> :
                    <Link className="link" href={"/login"}>로그인</Link>
                }
                
                <Link className="link" href={"/chat"}>채팅</Link>
            </div>
        </div>
    )
}