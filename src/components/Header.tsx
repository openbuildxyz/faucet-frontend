import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import { Button, Dropdown, Space, Typography } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { requestAccessToken } from "@/api/faucet";
import { requestUser } from "@/api/user";
import { useAuth } from "../context/AuthContext";

const { Text } = Typography;

interface ChainItem {
  name: string;
  path: string;
  color: string;
}

const chains: ChainItem[] = [
  { name: "Monad", path: "/monad", color: "#18f335" },
  { name: "0G", path: "/0g", color: "#18f335" },
  { name: "Nexus", path: "/nexus", color: "#18f335" },
  { name: "Camp", path: "/camp", color: "#18f335" },
];

const CustomAvatar = ({ src, alt, size }: { src: string; alt: string; size: number }) => (
  <div
    className={styles.avatar}
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <Image src={src} alt={alt} width={size} height={size} />
  </div>
);

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, username, avatar, github, login, logout, updateToken } = useAuth();
  const [hasProcessed, setHasProcessed] = useState(false);
  const router = useRouter();
  const { code } = router.query;

  // 处理 OAuth 回调
  useEffect(() => {
    const processCode = async () => {
      if (code && !hasProcessed) {
        setHasProcessed(true);
        try {
          const response = await requestAccessToken(code);
          if (response.success) {
            updateToken(response.data?.token);
            const userResponse = await requestUser();
            if (userResponse.success) {
              const respUid = userResponse.data?.uid;
              const respUsername = userResponse.data?.username;
              const respAvatar = userResponse.data?.avatar;
              const respGithub = userResponse.data?.github;
              login(respUsername, respAvatar, respUid, respGithub);
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    if (!isAuthenticated && !hasProcessed) {
      processCode();
    }
  }, [code, isAuthenticated, login, updateToken, hasProcessed]);

  const handleSignIn = () => {
    const currentUrlWithoutParams = window.location.origin + router.pathname;
    const oauthUrl = `${process.env.NEXT_PUBLIC_OAUTH}&redirect_uri=${currentUrlWithoutParams}`;
    router.push(oauthUrl);
  };

  const handleSignOut = () => {
    logout();
  };

  const dropdownItems = [
    {
      key: "1",
      label: github,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: <Text>Sign out</Text>,
      icon: <LogoutOutlined />,
      onClick: handleSignOut,
    },
  ];

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <Image src="/logo.png" alt="OpenBuild Logo" width={32} height={32} className={styles.logoIcon} />
        <span className={styles.logoText}>OpenBuild</span>
      </Link>

      <nav className={styles.nav}>
        {/* 链下拉菜单：鼠标移出后自动关闭 */}
        <div
          className={styles.faucetMenu}
          onMouseLeave={() => setIsMenuOpen(false)}
        >
          <button
            className={styles.menuButton}
            onMouseEnter={() => setIsMenuOpen(true)}
          >
            Faucets
          </button>
          {isMenuOpen && (
            <div className={styles.dropdown}>
              {chains.map((chain) => (
                <Link
                  key={chain.name}
                  href={chain.path}
                  className={styles.dropdownItem}
                  style={{ "--chain-color": chain.color } as React.CSSProperties}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {chain.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 登录/用户菜单 */}
        <div className={styles.userMenu}>
          {isAuthenticated ? (
            <Dropdown menu={{ items: dropdownItems }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <CustomAvatar src={avatar} alt={username} size={40} />
                </Space>
              </a>
            </Dropdown>
          ) : (
            <Button type="default" className={styles.signInButton} onClick={handleSignIn}>
              <Text className={styles.signInText}>Sign In</Text>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
