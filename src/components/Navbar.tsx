import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/navbar.module.css';
import { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import { requestAccessToken } from "@/api/faucet";
import { requestUser } from "@/api/user";


const CustomAvatar = ({ src, alt, size }) => {
  return (
    <div className={styles.avatar} style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', position: 'relative' }}>
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
};


const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const router = useRouter();
  const { code } = router.query;

  useEffect(() => {
    // 检查会话存储中的 token 和 username
    const token = sessionStorage.getItem('token');
    const storedUsername = sessionStorage.getItem('username');
    const storedAvatar = sessionStorage.getItem('avatar');

    // 定义一个 async 函数来处理 code 参数
    const processCode = async () => {
      if (code) {
        console.log("Received OAuth code:", code);
        try {
          const response = await requestAccessToken(code);
          console.log(response)
          if (response.success) {
            sessionStorage.setItem("token", response.data?.token);
            // 请求 user
            const userResponse = await requestUser();
            if (userResponse.success) {
              sessionStorage.setItem("uid", userResponse.data?.uid);
              sessionStorage.setItem("username", userResponse.data?.username);
              sessionStorage.setItem("avatar", userResponse.data?.avatar);
              setAvatar(userResponse.data?.avatar);
            }
          } else {
            //
          }
        } catch (error) {
        }
      }
    };

    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      if (storedAvatar) {
        setAvatar(storedAvatar);
      }
    } else {
      // 调用处理 code 的函数
      processCode();
    }
  }, [code, avatar]); // 当 code 变化时重新执行

  const handleSignIn = () => {
    router.push(process.env.NEXT_PUBLIC_OAUTH);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/favicon-16x16.png"
              alt="OpenBuild Logo"
              width={32}
              height={32}
              className={styles.logoImage}
            />
            <span className={styles.logoText}>OpenBuild</span>
          </Link>
          <div className={styles.links}>
            <Link href="https://openbuild.xyz/learn/courses" className={styles.link}>Learn</Link>
            <Link href="https://openbuild.xyz/learn/challenges" className={styles.link}>Challenges</Link>
            <Link href="https://openbuild.xyz/bounties" className={styles.link}>Bounties</Link>
            <Link href="https://openbuild.xyz/shilling" className={styles.link}>SkillHub</Link>
            {isAuthenticated ? (
              <CustomAvatar src={avatar} alt={username} size="40px" />
            ) : (
              <Button className={styles.signInButton} onClick={handleSignIn}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
