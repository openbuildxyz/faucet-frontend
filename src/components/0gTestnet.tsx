import React from "react";
import { Button, Card, Typography } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import styles from "../styles/0g-testnet.module.css";

const { Title, Paragraph, Text } = Typography;

const ZerogTestnet = () => {
    const handleSwitchNetwork = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x138D7', 
                            chainName: '0G-Galileo-Testnet',
                            nativeCurrency: {
                                name: 'OG',
                                symbol: 'OG',
                                decimals: 18
                            },
                            rpcUrls: ['https://evmrpc-testnet.0g.ai/'],
                            blockExplorerUrls: ['https://chainscan-galileo.0g.ai/']
                        }
                    ]
                });
            } catch (error) {
                console.error('添加 0G-Galileo-Testnet 失败:', error);
            }
        } else {
            alert('请安装 MetaMask！');
        }
    };

    const networkDetails = [
        { label: 'Network Name', value: '0G-Galileo-Testnet' },
        { label: 'Chain ID', value: '80087' },
        { label: 'RPC URL', value: 'https://evmrpc-testnet.0g.ai/' },
        { label: 'Block Explorer URL', value: '	https://chainscan-galileo.0g.ai/' },
        { label: 'Currency Symbol', value: '0G' },
    ];

    return (
        <Card className={styles.container}>
            <div className={styles.addTestContainer}>
            <Button className={styles.addTestnetBtn} onClick={handleSwitchNetwork}>Add to MetaMask</Button>
            </div>
            {networkDetails.map((detail, index) => (
                <div key={index} className={styles.field}>
                    <Text className={styles.label}>{detail.label}</Text>
                    <div className={styles.valueContainer}>
                        <Text className={styles.value}>{detail.value}</Text>
                        <Text
                            copyable={{
                                text: detail.value,
                                icon: [
                                    <CopyOutlined key="copy" className={styles.copyIcon} />,
                                    <CopyOutlined key="copied" className={styles.copyIcon} />,
                                ],
                            }}
                        />
                    </div>
                </div>
            ))}
        </Card>
    );
}

export default ZerogTestnet;
