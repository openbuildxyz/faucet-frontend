import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/navbar.module.css';
import { useState, useEffect } from 'react';
import { Button, Dropdown, Space,Typography } from 'antd';
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

  const { code } = router.query;

  useEffect(() => {
    const processCode = async () => {
      if (code && !hasProcessed) { // Ensure it only runs once
        console.log("Received OAuth code:", code);
        setHasProcessed(true); // Mark as processed
        try {
          const response = await requestAccessToken(code);
          if (response.success) {
            updateToken(response.data?.token);
            const userResponse = await requestUser();
            if (userResponse.success) {
              const token = response.data?.token;
              const respUid = userResponse.data?.uid;
              const respUsername = userResponse.data?.username;
              const respAvatar = userResponse.data?.avatar;
              const respGithub = userResponse.data?.github;
              login(respUsername, token, respAvatar, respUid, respGithub);
            }
          } else {
            // Handle failure
          }
        } catch (error) {
          // Handle error
        }
      }
    };
  
    if (!isAuthenticated && !hasProcessed) {
      processCode();
    }
  }, [code, isAuthenticated, login, token, updateToken, hasProcessed]); //


  const handleSignIn = () => {
    router.push(process.env.NEXT_PUBLIC_OAUTH);
  };

  const handleSignOut = () => {
    logout();
    router.push('/monad');
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
