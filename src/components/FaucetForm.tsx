import React, { useState, useRef, useEffect } from "react";
import { Card, Input, Button, Typography, message, Image } from "antd";
import styles from "../styles/faucet-form.module.css";
import { requestToken } from "@/api/faucet";
import { WalletOutlined, WarningOutlined } from '@ant-design/icons';
import GitRank from './GitRank';
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

const { Title, Paragraph, Text } = Typography;


const FaucetForm = () => {
  const { isAuthenticated, username, token, avatar, github, login, logout, updateToken } = useAuth();
  const [address, setAddress] = useState("");
  const [showImage, setShowImage] = useState(false);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tx, setTx] = useState("");


  const handleClickWechat = () => {
    setShowImage(prev => !prev);
  };

  // 点击容器外部时，关闭图片
  const handleOutsideClick = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setShowImage(false); // 点击外部时关闭图片
    }
  };

  const handleSubmit = async () => {
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
    if (!address || !isValidAddress) {
      message.error("Please enter a valid EVM wallet address");
      return;
    }

    if (!isAuthenticated) {
      message.error("please log in to continue!")
      return;
    }

    if (!github) {
      message.error("Please bind your GitHub in OpenBuiild first!")
      return;
    }

    setIsLoading(true);

    try {
      const response = await requestToken(address);
      // Check if response is successful and contains data
      if (response?.data?.tx) {
        setTx(response.data.tx);
        message.success("Transaction sent successfully!");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error("An error occurred while sending tokens, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const explorer = process.env.NEXT_PUBLIC_MONAD_EXPLORER 

  return (
    <Card className={styles.container}>
      <Title level={2} className={styles.cardTitle}>
        Monad Faucet
      </Title>
      <Input
        prefix={<WalletOutlined className={styles.walletIcon} />}
        placeholder="Enter your EVM wallet address"
        size="large"
        className={styles.addressInput}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      {tx && <Paragraph className={styles.cardDescription}>
        <a href={`${explorer}${tx}`} target="_blank" rel="noopener noreferrer">View on MonadExplorer</a>
      </Paragraph>}
      <Button
        type="primary"
        size="large"
        block
        className={styles.submitButton}
        onClick={handleSubmit}
        loading={isLoading}
        disabled={!address}
      >
        Get Testnet MON
      </Button>
      <Paragraph className={styles.note}>
        Note: Testnet tokens are for test only and have no real value.
        Your GitHub rank determines the amount you can get every 24 hours.<br />
      </Paragraph>
      <GitRank />
      {isAuthenticated ?
        github ?
          <Image
            src={`https://github-readme-stats.vercel.app/api?username=${github}`}
            alt="GitHub Stats"
          />
          :
          <Paragraph>
            <WarningOutlined className={styles.WarnGit} />
            <Text className={styles.note}>Please bind your GitHub in OpenBuiild first, click <Link className={styles.toOpenBuild} href="https://openbuild.xyz/profile" target="_blank">here</Link> to blind. </Text>
          </Paragraph>
        :
        <Paragraph>
          <WarningOutlined className={styles.WarnGit} />
          <Text className={styles.note}>Please <Link className={styles.toOpenBuild} href={process.env.NEXT_PUBLIC_OAUTH}>Sign in</Link> to get your GiitHub Rank. </Text>
        </Paragraph>
      }
      <div className={styles.iconContainer}>
        <Text className={styles.contact}>If you have any questions, please contact: </Text>
        <Link
          href="https://t.me/OpenBuildxyz"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Telegram"
          className="inline-block"
        >
          <img src="/telegram.png" alt="telegram" width={30} height={30} />
        </Link>
        <div className={styles.wechatContainer} ref={containerRef}>
          <img src="/wechat.png" className={styles.wechat} alt="wechat" width={30} height={30} onClick={handleClickWechat} />
          {showImage &&
            <div className={styles.clickImage}>
              <img src="/assistant.png" className={styles.wechatPng} alt="Large Image" width={300} height={300} onClick={handleClickWechat} />
            </div>
          }
        </div>
      </div>
    </Card>
  );
}

export default FaucetForm;
