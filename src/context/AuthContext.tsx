// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from "js-cookie";
import { requestUser } from "@/api/user";


// 定义 Context 的类型
interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  token: string;
  avatar: string;
  uid: string;
  github: string;  // 新增 github 字段
  login: (username: string, avatar: string, uid: string, github: string) => void;
  logout: () => void;
  updateToken: (username: string) => void;
  updateGithub: (github: string) => void;
}

// 创建 Context 并给出默认值
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 自定义 hook 用于访问 AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider 组件，用于管理用户认证信息
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [uid, setUid] = useState<string>(''); // 新增 uid 状态
  const [github, setGithub] = useState<string>('');  // 新增 github 状态

  // 从 localStorage 中恢复用户认证状态
  useEffect(() => {
    const storedToken = Cookies.get("token");
    if (storedToken && !isAuthenticated) {
      const userResponse = requestUser();
      if (userResponse.success) {
        const respUid = userResponse.data?.uid;
        const respUsername = userResponse.data?.username;
        const respAvatar = userResponse.data?.avatar;
        const respGithub = userResponse.data?.github;
        login(respUsername, token, respAvatar, respUid, respGithub);
      } else {
        
      }
    }


    const storedUsername = localStorage.getItem('username');
    const storedAvatar = localStorage.getItem('avatar');
    const storedUid = localStorage.getItem('uid');
    const storedGithub = localStorage.getItem('github');

    if (storedToken && storedUsername) {
      setIsAuthenticated(true);
      setToken(storedToken);
      setUsername(storedUsername);
      if (storedAvatar) setAvatar(storedAvatar);
      if (storedUid) setUid(storedUid); // 恢复 uid
      if (storedGithub) setGithub(storedGithub); // 恢复 github
    } 
  }, []);


  const updateToken = (token: string) => {
    Cookies.set("token", token, { expires: 7 });
    setToken(token);
  };


  const updateGithub = (github: string) => {
    localStorage.setItem('github', github);
  };

  // 登录并保存用户信息到 
  const login = (username: string, avatar: string, uid: string, github: string) => {
    localStorage.setItem('username', username);
    localStorage.setItem('avatar', avatar);
    localStorage.setItem('uid', uid); // 保存 uid
    localStorage.setItem('github', github); // 保存 github 信息
    setIsAuthenticated(true);
    setUsername(username);
    setAvatar(avatar);
    setUid(uid); // 更新 uid
    setGithub(github); // 更新 github
    setIsAuthenticated(true);
  };

  // 登出并清除用户信息
  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    localStorage.removeItem('uid'); // 清除 uid
    localStorage.removeItem('github'); // 清除 github 信息
    setIsAuthenticated(false);
    setUsername('');
    setToken('');
    setAvatar('');
    setUid(''); // 清除 uid
    setGithub(''); // 清除 github

    // 移除 token
    Cookies.remove("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, token, avatar, uid, github, login, logout, updateToken, updateGithub }}>
      {children}
    </AuthContext.Provider>
  );
};
