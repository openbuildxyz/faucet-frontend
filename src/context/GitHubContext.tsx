// src/context/GitHubContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// 定义 Context 的类型
interface GitHubContextType {
  gitusername: string;
  updateGitUsername: (username: string) => void;
}

// 创建 Context 并给出默认值
const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

// 自定义 hook 用于访问 GitHubContext
export const useGitHub = (): GitHubContextType => {
  const context = useContext(GitHubContext);
  if (!context) {
    throw new Error('useGitHub must be used within a GitHubProvider');
  }
  return context;
};

// GitHubProvider 组件，用于管理 GitHub 用户名
interface GitHubProviderProps {
  children: ReactNode;
}

export const GitHubProvider: React.FC<GitHubProviderProps> = ({ children }) => {
  const [gitusername, setGitusername] = useState<string>('');

  useEffect(() => {
    const github = sessionStorage.getItem('github');
    if (github) {
      setGitusername(github);
    }
  }, []);

  // 更新 GitHub 用户名并保存到 sessionStorage
  const updateGitUsername = (username: string) => {
    sessionStorage.setItem('github', username);
    setGitusername(username);
  };

  return (
    <GitHubContext.Provider value={{ gitusername, updateGitUsername }}>
      {children}
    </GitHubContext.Provider>
  );
};
