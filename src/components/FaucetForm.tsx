import React, { useState, useRef, useEffect} from "react";
import { Card, Input, Button, Typography, message, Image } from "antd";
import styles from "../styles/faucet-form.module.css";
import { requestToken } from "@/api/faucet";
import { WalletOutlined } from '@ant-design/icons';
import GitRank from './GitRank';
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;


const FaucetForm = () => {
  const [address, setAddress] = useState("");
  const [gitusername, setGitusername] = useState("");
  const [showImage, setShowImage] = useState(false);
  const containerRef = useRef(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [tx, setTx] = useState("");
  const username = "smallfu6";


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

    setIsLoading(true);

    try {
      const response = await requestToken(address, '1', 'DMON', '20143');
      // Check if response is successful and contains data
      if (response?.data?.tx) {
        setTx(response.data.tx);
        message.success(`Transaction sent successfully! Transaction ID: ${response.data.tx}`);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      // message.error("An error occurred while sending tokens, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick); // 监听点击事件
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick); // 清除事件监听
    };
  }, []);

  return (
    <Card className={styles.container}>
      <Title level={2} className={styles.cardTitle}>
        Monad Faucet
      </Title>
      {/* <Paragraph className={styles.claimLimit}>
        Fast and reliable. 1 DMON / 24 hrs
      </Paragraph> */}

      {/* <Paragraph className={styles.label}>
        Enter your EVM wallet address
      </Paragraph> */}
      <Input
        prefix={<WalletOutlined className={styles.walletIcon} />}
        placeholder="Enter your EVM wallet address"
        size="large"
        className={styles.addressInput}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      {/* <Paragraph className={styles.requestFre}>(Maximum 1 request every 24 hours)</Paragraph> */}

      {tx && <Paragraph className={styles.cardDescription}>
        Transaction: <a href={`https://explorer.monad-devnet.devnet101.com/tx/${tx}`} target="_blank" rel="noopener noreferrer">View on Etherscan</a>
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
      <Image
        src={`https://github-readme-stats.vercel.app/api?username=${username}`}
        alt="GitHub Stats"
      />
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
          <img src="/wechat.png" className={styles.wechat} alt="wechat" width={30} height={30}  onClick={handleClickWechat} />
          {showImage &&
            <div className={styles.clickImage}>
              <img src="/assistant.png"  className={styles.wechatPng}  alt="Large Image" width={300} height={300} onClick={handleClickWechat} />
            </div>
          }
        </div>
      </div>
    </Card>
  );
}

export default FaucetForm;
