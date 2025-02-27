import React from "react";
import { Button, Card, Typography } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import styles from "../styles/monad-testnet.module.css";

const { Title, Paragraph, Text } = Typography;

const MonadTestnet = () => {
    const handleSwitchNetwork = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x279F', 
                            chainName: 'Monad Testnet',
                            nativeCurrency: {
                                name: 'Monad',
                                symbol: 'MON',
                                decimals: 18
                            },
                            rpcUrls: ['https://testnet-rpc.monad.xyz/'],
                            blockExplorerUrls: ['https://testnet.monadexplorer.com/']
                        }
                    ]
                });
            } catch (error) {
                console.error('添加 Monad Testnet 失败:', error);
            }
        } else {
            alert('请安装 MetaMask！');
        }
    };

    const networkDetails = [
        { label: 'Network Name', value: 'Monad Testnet' },
        { label: 'Chain ID', value: '10143' },
        { label: 'RPC URL', value: 'https://testnet-rpc.monad.xyz/' },
        { label: 'Block Explorer URL', value: 'https://testnet.monadexplorer.com/' },
        { label: 'Currency Symbol', value: 'MON' },
    ];

    return (
        <Card className={styles.container}>
            <Button className={styles.addTestnetBtn} onClick={handleSwitchNetwork}>Add to MetaMask</Button>
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

export default MonadTestnet;
