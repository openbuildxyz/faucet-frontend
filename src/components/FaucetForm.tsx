import React, { useState, useRef, useEffect } from "react";
import { Card, Input, Button, Typography, Image, Popover, notification } from "antd";
import styles from "../styles/faucet-form.module.css";
import { requestToken } from "@/api/faucet";
import { WalletOutlined, WarningOutlined,  CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import GitRank from './GitRank';
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { requestUser } from "@/api/user";
import type { } from 'antd';



const { Title, Paragraph, Text } = Typography;


const FaucetForm = () => {
  const { isAuthenticated, github, updateGithub } = useAuth();
  const [address, setAddress] = useState("");
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tx, setTx] = useState("");

  const [api, contextHolder] = notification.useNotification();


  const openNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const iconMap = {
      success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      error: <CloseCircleOutlined style={{ color: '#f5222d' }} />,
      info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
      warning: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
    };

    api.open({
      message: type.charAt(0).toUpperCase() + type.slice(1), // 首字母大写
      description: message,
      icon: iconMap[type],  // 使用图标映射
    });
  };

  const handleSubmit = async () => {
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
    if (!address || !isValidAddress) {
      openNotification("error", "Please enter a valid EVM wallet address")
      return;
    }

    if (!isAuthenticated) {
      openNotification("error", "please log in to continue!")
      return;
    }

    if (!github) {
      openNotification("error", "Please bind your GitHub in OpenBuiild first!")
      return;
    }

    setIsLoading(true);

    try {
      const response = await requestToken(address);
      // Check if response is successful and contains data
      if (response?.data?.tx) {
        setTx(response.data.tx);
        openNotification("success", "Transaction sent successfully!")
      } else {
        openNotification("error", response.message)
      }
    } catch (error) {
      openNotification("error", "An error occurred while sending tokens, please try again later")
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleFocus = async () => {
      if (!github) {
        const userResponse = await requestUser();
        if (userResponse.success) {
          updateGithub(github)
        }
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [github, updateGithub]);


  const explorer = process.env.NEXT_PUBLIC_MONAD_EXPLORER

  const wechatPopver = (
    <img src="/assistant.png" className={styles.wechatPng} alt="Large Image" width={300} height={300} />
  );


  return (
    <Card className={styles.container}>
      <Title level={2} className={styles.cardTitle}>
        Monad Faucet
      </Title>
      {contextHolder}
      <Input
        prefix={<WalletOutlined className={styles.walletIcon} />}
        placeholder="Enter your EVM wallet address"
        size="large"
        className={styles.addressInput}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      {tx && <Paragraph className={styles.cardDescription}>
        <a className={styles.toExplorer} href={`${explorer}${tx}`} target="_blank" rel="noopener noreferrer">View on MonadExplorer</a>
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
            src={`https://github-readme-stats.vercel.app/api?username=${github}&card_width=510&title_color=836EF9&show_icons=true`}
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
      <div className={styles.contactContainer}>
        <Text className={styles.contact}>If you have any questions or want to communicate with Nads, please join Monad China Devs Community: </Text>
        <div className={styles.iconContainer}>
          <Link
            href="https://t.me/OpenBuildxyz"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Telegram"
            className={styles.tgIcon}
          >
            <img src="/telegram.png" alt="telegram" width={30} height={30} />
          </Link>
          <div className={styles.wechatIcon} ref={containerRef}>
            <Popover content={wechatPopver}>
              <img src="/wechat.png" className={styles.wechat} alt="wechat" width={30} height={30} />
            </Popover>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default FaucetForm;
