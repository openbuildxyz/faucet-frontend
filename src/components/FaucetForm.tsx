import React, { useState } from "react";
import { Card, Input, Button, Typography, message } from "antd";
import styles from "../styles/faucet-form.module.css";
import { requestToken } from "@/api/faucet";

const { Title, Paragraph } = Typography;

const FaucetForm = () => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tx, setTx] = useState("");

  const handleSubmit = async () => {
    const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);

    if (!address || !isValidAddress) {
      message.error("Please enter a valid wallet address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await requestToken(address, '0.01', 'eth', '10021');
      // Check if response is successful and contains data
      if (response?.data?.tx) {
        setTx(response.data.tx);
        message.success(`Transaction sent successfully! Transaction ID: ${response.data.tx}`);
      } else {
        message.error("Transaction failed or no transaction data available");
      }
    } catch (error) {
      // message.error("An error occurred while sending tokens, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={styles.faucetCard}>
      <Title level={2} className={styles.cardTitle}>
        ETH Sepolia Faucet
      </Title>
      <Paragraph className={styles.cardDescription}>
        Get testnet ETH and other test tokens here
      </Paragraph>

      <Paragraph className={styles.claimLimit}>
        You can only claim 0.01 ETH at a time.
      </Paragraph>

      <Input
        placeholder="Enter your wallet address"
        size="large"
        className={styles.addressInput}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      {tx && <Paragraph className={styles.cardDescription}>
        Transaction: <a href={`https://sepolia.etherscan.io/tx/${tx}`} target="_blank" rel="noopener noreferrer">View on Etherscan</a>
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
        Claim Tokens
      </Button>
    </Card>
  );
}

export default FaucetForm;
