'use client'

import { useAuth } from "@/store/useAuth";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const { setUser } = useAuth();
    const [id, setId] = useState('guest1');
    const [pw, setPw] = useState('guest1');

    const [errMsg, setErrMsg] = useState('');

    const idRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    // ID input 키 이벤트
    const handleIdKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Tab" || e.key === "Enter") {
            e.preventDefault(); // 기본 탭 이동 막기
            passwordRef.current?.focus(); // pw input으로 포커스 이동
        }
    }

    // PW input 키 이벤트
    const handlePwKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            submit();
        }
    }

    const submit = async () => {
        if (id === '') {
            idRef.current?.focus();
            setErrMsg('ID를 입력해주세요.');
        }
        else if (pw === '') {
            passwordRef.current?.focus();
            setErrMsg('PW를 입력해주세요.');
        }
        else {
            setErrMsg('');
        }

        const form = {
            id: id,
            pw: pw
        }
        const res = await fetch('/api/login', {method: 'POST',headers: {'Content-Type': 'application/json',},body: JSON.stringify(form)});
        const data = await res.json();

        if (res.status === 500) {
            setErrMsg(data.error);
        }
        else {
            setUser({
                user_index: data[0].user_index,
                id: data[0].id
            });

            router.push("/chat");
        }
    }

    return (
        <div className="login-page">
            <div className="login">
                <div className="title">
                    <span className="heading">로그인 / 회원가입</span>
                    <div className="exp">
                        접속 시도한 정보가 존재하면 로그인, 없으면 회원가입으로 처리됩니다. <br/>
                        임의 접속을 원하시면 guest1 / guest1로 접속 해주세요.
                    </div>
                </div>
                
                <div className="input-wrap">
                    <div className="input-item">
                        <div className="key">
                            ID
                        </div>
                        <div className="value">
                            <input type="text" ref={idRef} value={id} onChange={(e) => {setId(e.target.value)}} autoFocus placeholder="아이디" onKeyDown={handleIdKeyDown}/>
                        </div>
                    </div>

                    <div className="input-item">
                        <div className="key">
                            PW
                        </div>
                        <div className="value">
                            <input type="password" ref={passwordRef} value={pw} onChange={(e) => {setPw(e.target.value)}} placeholder="비밀번호" onKeyDown={handlePwKeyDown}/>
                        </div>
                    </div>
                </div>
                {
                    errMsg !== '' &&
                    <div className="errmsg">
                        {errMsg}
                    </div>
                }
                
                
                <button type="button" className="btn" onClick={submit}>
                    로그인
                </button>
            </div>
        </div>
    )
}
