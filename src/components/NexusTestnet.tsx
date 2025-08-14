import React from "react";
import { Button, Card, Typography } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import styles from "../styles/nexus-testnet.module.css";

const { Title, Paragraph, Text } = Typography;

const NexusTestnet = () => {
    const handleSwitchNetwork = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0xF64', 
                            chainName: 'Nexus Chain',
                            nativeCurrency: {
                                name: 'Nexus',
                                symbol: 'NEX',
                                decimals: 18
                            },
                            rpcUrls: ['https://testnet3.rpc.nexus.xyz'],
                            blockExplorerUrls: ['https://testnet3.explorer.nexus.xyz']
                        }
                    ]
                });
            } catch (error) {
                console.error('添加 basecamp 失败:', error);
            }
        } else {
            alert('请安装 MetaMask！');
        }
    };

    const networkDetails = [
        { label: 'Network Name', value: 'Nexus Chain' },
        { label: 'Chain ID', value: '3940' },
        { label: 'RPC URL', value: 'https://testnet3.rpc.nexus.xyz' },
        { label: 'Block Explorer URL', value: 'https://testnet3.explorer.nexus.xyz' },
        { label: 'Currency Symbol', value: 'NEX' },
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

export default NexusTestnet;
