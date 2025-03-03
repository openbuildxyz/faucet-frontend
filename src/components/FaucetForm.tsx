import React, { useState, useRef, useEffect, ReactNode } from "react";
import { Card, Input, Button, Typography, Image, Popover, message, Modal } from "antd";
import styles from "../styles/faucet-form.module.css";
import { requestToken } from "@/api/faucet";
import { GithubOutlined, TwitterOutlined, WalletOutlined } from '@ant-design/icons';
import GitRank from './GitRank';
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { requestUser } from "@/api/user";
import SocialLinks from "./SocialLinks";


const { Title, Paragraph, Text } = Typography;


const FaucetForm = () => {
  const { isAuthenticated, github, updateGithub } = useAuth();
  const [address, setAddress] = useState("");
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tx, setTx] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  // const [api, contextHolder] = notification.useNotification();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };



  // const openNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
  //   const iconMap = {
  //     success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
  //     error: <CloseCircleOutlined style={{ color: '#f5222d' }} />,
  //     info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
  //     warning: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
  //   };

  //   api.open({
  //     message: type.charAt(0).toUpperCase() + type.slice(1), // 首字母大写
  //     description: message,
  //     icon: iconMap[type],  // 使用图标映射
  //   });
  // };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setModalContent(<Text className={styles.modalNote}>Please <Link className={styles.toOpenBuild} href={process.env.NEXT_PUBLIC_OAUTH} target="_blank">Sign in</Link> to get your GiitHub Rank！ </Text>);
      showModal();
      return;
    }

    if (!github) {
      setModalContent(<Text className={styles.modalNote}>Please <Link className={styles.toOpenBuild} href="https://openbuild.xyz/profile" target="_blank">Bind</Link>  your GitHub in OpenBuiild first！ </Text>);
      showModal();
      return;
    }


    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
    if (!address || !isValidAddress) {
      message.error("Please enter a valid EVM wallet address!")
      return;
    }


    setIsLoading(true);

    try {
      const response = await requestToken(address);
      if (response?.data?.tx) {
        setTx(response.data.tx);
        message.success("Transaction sent successfully!")
      } else {
        message.error(response.message)
      }
    } catch (error) {
      message.error("An error occurred, please try again later!")
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleFocus = async () => {
      if (isAuthenticated && !github) {
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


  return (
    <Card className={styles.container}>
      <div className={styles.content}>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <Text>{modalContent}</Text>
        </Modal>
        <Title level={2} className={styles.cardTitle}>
          Monad Faucet
        </Title>
        {/* {contextHolder} */}
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
        <div className={styles.gitContent}>
          {isAuthenticated && github &&
            <Image
              src={`https://github-readme-stats.vercel.app/api?username=${github}&card_width=510&title_color=836EF9&show_icons=true`}
              alt="GitHub Stats"
            />
            //   :
            //   <Paragraph>
            //     <WarningOutlined className={styles.WarnGit} />
            //     <Text className={styles.note}>Please bind your GitHub in OpenBuiild first, click <Link className={styles.toOpenBuild} href="https://openbuild.xyz/profile" target="_blank">here</Link> to blind. </Text>
            //   </Paragraph>
            // :
            // <Paragraph>
            //   <WarningOutlined className={styles.WarnGit} />
            //   <Text className={styles.note}>Please <Link className={styles.toOpenBuild} href={process.env.NEXT_PUBLIC_OAUTH}>Sign in</Link> to get your GiitHub Rank. </Text>
            // </Paragraph>
          }
        </div>

        <div className={styles.contactContainer}>
          <Text className={styles.contact}>If you have any questions or want to communicate with Nads, please join Monad China Devs Community. </Text>
        </div>
      </div>
      <SocialLinks />
    </Card>
  );
}

export default FaucetForm;
