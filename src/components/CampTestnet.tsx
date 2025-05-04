import React from "react";
import { Button, Card, Typography } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import styles from "../styles/camp-testnet.module.css";

const { Title, Paragraph, Text } = Typography;

const CampTestnet = () => {
    const handleSwitchNetwork = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x1CB53C1ADA', 
                            chainName: 'basecamp',
                            nativeCurrency: {
                                name: 'camp',
                                symbol: 'CAMP',
                                decimals: 18
                            },
                            rpcUrls: ['https://rpc-campnetwork.xyz/'],
                            blockExplorerUrls: ['https://basecamp.cloud.blockscout.com/']
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
        { label: 'Network Name', value: 'basecamp' },
        { label: 'Chain ID', value: '123420001114' },
        { label: 'RPC URL', value: 'https://rpc.basecamp.t.raas.gelato.cloud/' },
        { label: 'Block Explorer URL', value: 'https://basecamp.cloud.blockscout.com/' },
        { label: 'Currency Symbol', value: 'CAMP' },
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

export default CampTestnet;
