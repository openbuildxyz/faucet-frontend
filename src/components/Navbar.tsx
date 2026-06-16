import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/navbar.module.css';
import { useState, useEffect } from 'react';
import { Button, Dropdown, message, Space,Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { requestAccessToken } from "@/api/faucet";
import { requestUser } from "@/api/user";
import { useAuth } from '../context/AuthContext';

const { Text } = Typography;

import type { MenuProps } from 'antd';


const CustomAvatar = ({ src, alt, size }) => {
  return (
    <div
      className={styles.avatar}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={size}  
        height={size} 
      />
    </div>
  );
};

const Navbar = () => {
  const { isAuthenticated, username, token, avatar, github, login, logout, updateToken } = useAuth();
  const router = useRouter();
  const [hasProcessed, setHasProcessed] = useState(false);

  const { code, error, error_description } = router.query;

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

      if (oauthCode && !hasProcessed) { // Ensure it only runs once
        console.log("Received OAuth code:", oauthCode);
        setHasProcessed(true); 
        try {
          const response = await requestAccessToken(oauthCode);
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
  }, [code, error, error_description, isAuthenticated, login, router, token, updateToken, hasProcessed]); //


  const handleSignIn = () => {
    const currentUrlWithoutParams = window.location.origin + router.pathname;
    const oauthUrl = `${process.env.NEXT_PUBLIC_OAUTH}&redirect_uri=${encodeURIComponent(currentUrlWithoutParams)}`;
    console.log(oauthUrl);
    router.push(oauthUrl);
  };

  const handleSignOut = () => {
    logout();
  };


  const items: MenuProps['items'] = [
    {
      key: '1',
      label: [github],
      // disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: <Text className={styles.signOutBtn}>Sign out</Text>,
      icon: <LogoutOutlined />,
      onClick: handleSignOut,
    },
  ];
  
  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Link href="/monad" className={styles.logo}>
            <Image
              src="/logo.png"
              alt="OpenBuild Faucet Logo"
              width={32}
              height={32}
              className={styles.logoImage}
            />
            <span className={styles.logoText}>OpenBuild</span>
          </Link>
          <div className={styles.links}>
            {isAuthenticated ? (
              <Dropdown menu={{ items }}>
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
