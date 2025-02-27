// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// 定义 Context 的类型
interface AuthContextType {
  isAuthenticated: boolean;
  username: string;
  token: string;
  avatar: string;
  uid: string;
  github: string;  // 新增 github 字段
  login: (username: string, token: string, avatar: string, uid: string, github: string) => void;
  logout: () => void;
  updateToken: (username: string) => void;
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

  // 从 sessionStorage 中恢复用户认证状态
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    const storedUsername = sessionStorage.getItem('username');
    const storedAvatar = sessionStorage.getItem('avatar');
    const storedUid = sessionStorage.getItem('uid');
    const storedGithub = sessionStorage.getItem('github'); // 获取 github 信息

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
    sessionStorage.setItem('token', token);
    setToken(token);
  };


  // 登录并保存用户信息到 sessionStorage
  const login = (username: string, token: string, avatar: string, uid: string, github: string) => {
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('avatar', avatar);
    sessionStorage.setItem('uid', uid); // 保存 uid
    sessionStorage.setItem('github', github); // 保存 github 信息
    setIsAuthenticated(true);
    setUsername(username);
    setToken(token);
    setAvatar(avatar);
    setUid(uid); // 更新 uid
    setGithub(github); // 更新 github
    setIsAuthenticated(true);
  };

  // 登出并清除用户信息
  const logout = () => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('avatar');
    sessionStorage.removeItem('uid'); // 清除 uid
    sessionStorage.removeItem('github'); // 清除 github 信息
    setIsAuthenticated(false);
    setUsername('');
    setToken('');
    setAvatar('');
    setUid(''); // 清除 uid
    setGithub(''); // 清除 github
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, token, avatar, uid, github, login, logout, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};
