import { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import bcrypt from 'bcryptjs';

export async function hashPassword(plainTextPassword: string) {
    const saltRounds = 10; // 보통 10~12
    const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);
    return hashedPassword;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const id = req.body.id;
        const pw = await hashPassword(req.body.pw);

        if (id === '' || pw === '') {
            return res.status(500).json({ error: '아이디 혹은 비밀번호를 입력해주세요.' })
        }

        const idSelect = await db.query('select * from chat_user where id = $1', [id])

        if (idSelect.length > 0) { // 로그인
            console.log();
            const isValid = await bcrypt.compare(req.body.pw, idSelect[0].pw)

            if (!isValid) {
                return res.status(500).json({ error: '아이디 혹은 비밀번호를 입력해주세요.' })
            }
            else {
                return res.status(200).json(idSelect)
            }
        }
        else { // 회원가입
            const result = await db.query(
                'INSERT INTO chat_user (id, pw) VALUES ($1, $2) RETURNING *',
                [id, pw]
            );
            if (result[0]) {
                return res.status(200).json(result)
            }
        }
    }
    else {
        return res.status(500).json({ error: '잘못된 요청입니다.' })
    }
}