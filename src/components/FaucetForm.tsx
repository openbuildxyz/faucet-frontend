'use client'

import React, { useState } from "react";
import { Card, Input, Button, Typography, message } from "antd";
import styles from "../styles/faucet-form.module.css";

const { Title, Paragraph } = Typography;

export function FaucetForm() {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!address) {
      message.error("请输入有效的钱包地址");
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically call your API to request tokens
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
      message.success("代币已成功发送到您的钱包");
    } catch (error) {
      message.error("发送代币时出错，请稍后再试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={styles.faucetCard}>
      <Title level={2} className={styles.cardTitle}>
        Linea Sepolia 水龙头
      </Title>
      <Paragraph className={styles.cardDescription}>
        在这里获取测试网 ETH 和其他测试代币
      </Paragraph>
      <Input
        placeholder="输入您的钱包地址"
        size="large"
        className={styles.addressInput}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <Button 
        type="primary" 
        size="large" 
        block 
        className={styles.submitButton}
        onClick={handleSubmit}
        loading={isLoading}
      >
        领取代币
      </Button>
    </Card>
  );
}