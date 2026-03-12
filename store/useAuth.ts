import { create } from "zustand";
import Cookies from "js-cookie";

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

// 초기 상태를 쿠키에서 읽어오기
const getUserFromCookie = (): User | null => {
  const cookieData = Cookies.get("user");
  return cookieData ? JSON.parse(cookieData) : null;
};

// 쿠키 저장/삭제 헬퍼
const setUserCookie = (user: User) => {
  Cookies.set("user", JSON.stringify(user), { expires: 1 }); // 1일
};

const removeUserCookie = () => {
  Cookies.remove("user");
};

// Zustand 상태
export const useAuth = create<AuthState>((set) => ({
  user: getUserFromCookie(),
  setUser: (user) => {
    set({ user });
    setUserCookie(user); // 쿠키에도 저장
  },
  logout: () => {
    set({ user: null });
    removeUserCookie(); // 쿠키 삭제
  },
}));