import type React from "react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";
import { Button, Dropdown, message, Space, Typography } from "antd";
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
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const { isAuthenticated, username, avatar, github, login, logout, updateToken } = useAuth();
  const [hasProcessed, setHasProcessed] = useState(false);
  const router = useRouter();
  const { code, error, error_description } = router.query;

  // 处理 OAuth 回调
  useEffect(() => {
    const processCode = async () => {
      const oauthCode = Array.isArray(code) ? code[0] : code;
      const oauthError = Array.isArray(error) ? error[0] : error;
      const oauthErrorDescription = Array.isArray(error_description)
        ? error_description[0]
        : error_description;
      if (oauthError) {
        console.error("OpenBuild OAuth failed:", oauthError, oauthErrorDescription);
        message.error(oauthErrorDescription || "OpenBuild authorization was not completed.");
        await router.replace(router.pathname, undefined, { shallow: true });
        return;
      }

      if (oauthCode && !hasProcessed) {
        setHasProcessed(true);
        try {
          const redirectUri = window.location.origin + router.pathname;
          const response = await requestAccessToken(oauthCode, redirectUri);
          if (!response.success || !response.data?.token) {
            console.error("OAuth token exchange failed:", response.message);
            message.error(response.message || "OpenBuild sign in failed.");
            return;
          }

          updateToken(response.data.token);
          const userResponse = await requestUser(response.data.token);
          if (!userResponse.success || !userResponse.data) {
            console.error("OpenBuild user request failed:", userResponse.message);
            message.error(userResponse.message || "Unable to load OpenBuild user profile.");
            return;
          }

          const respUid = userResponse.data.uid;
          const respUsername = userResponse.data.username;
          const respAvatar = userResponse.data.avatar;
          const respGithub = userResponse.data.github;
          login(respUsername, respAvatar, String(respUid || ""), respGithub);
          await router.replace(router.pathname, undefined, { shallow: true });
        } catch (error) {
          console.error(error);
          message.error(error instanceof Error ? error.message : "OpenBuild sign in failed.");
        }
      }
    };

    if (router.isReady && !isAuthenticated && !hasProcessed) {
      processCode();
    }
  }, [code, error, error_description, isAuthenticated, login, router, updateToken, hasProcessed]);

  const handleSignIn = () => {
    const currentUrlWithoutParams = window.location.origin + router.pathname;
    const oauthBaseUrl = (process.env.NEXT_PUBLIC_OAUTH || "").trim();
    const oauthUrl = `${oauthBaseUrl}&redirect_uri=${encodeURIComponent(currentUrlWithoutParams)}`;
    router.push(oauthUrl);
  };

  const handleSignOut = () => {
    logout();
  };

  const handleMenuToggle = () => {
    // 点击切换菜单
    setIsMenuOpen((prev) => !prev);
  };

  const handleMouseLeave = () => {
    // 延迟关闭菜单，防止用户移到下拉菜单时立即消失
    closeTimer.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 300); // 300ms 容错时间
  };

  const handleMouseEnter = () => {
    // 鼠标重新移入时取消关闭
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
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
        {/* 链下拉菜单：点击展开，移出延迟关闭 */}
        <div
          className={styles.faucetMenu}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className={styles.menuButton} onClick={handleMenuToggle}>
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
