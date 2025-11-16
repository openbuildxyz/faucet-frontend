import { Button, Input, Card, Alert, Typography, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Copy, ExternalLink, InfoIcon } from 'lucide-react'
import { useState } from 'react'
import styles from './index.module.css'

const { Title, Text, Paragraph } = Typography

interface TierData {
    key: string
    ranks: string[]
    amount: string
}

export default function NexusFaucet() {
    const [address, setAddress] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [copiedField, setCopiedField] = useState<string | null>(null)

    const networkConfig = {
        networkName: 'Nexus Chain',
        rpcUrl: 'https://testnet3.rpc.nexus.xyz',
        chainId: '3940',
        symbol: 'NEX',
        explorer: 'https://testnet3.rpc.nexus.xyz',
    }

    const tiers: TierData[] = [
        { key: '1', ranks: ['S', 'A+', 'A', 'A-'], amount: '5 NEX' },
        { key: '2', ranks: ['B+', 'B', 'B-'], amount: '4 NEX' },
        { key: '3', ranks: ['C+', 'C'], amount: '3.5 NEX' },
        { key: '4', ranks: ['D+', 'D'], amount: '3 NEX' },
    ]

    const columns: ColumnsType<TierData> = [
        {
            title: 'GitHub Rank',
            dataIndex: 'ranks',
            key: 'ranks',
            render: (ranks: string[]) => (
                <Space size="small" wrap>
                    {ranks.map((rank) => (
                        <span key={rank} className={styles.rankBadge}>
                            {rank}
                        </span>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Claim Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right',
            render: (amount: string) => (
                <Text strong className={styles.tierAmount}>
                    {amount}
                </Text>
            ),
        },
    ]

    const handleCopy = async (text: string, field: string) => {
        await navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    const handleAddToMetaMask = async () => {
        try {
            if (typeof window.ethereum !== 'undefined') {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: `0x${parseInt(networkConfig.chainId).toString(16)}`,
                            chainName: networkConfig.networkName,
                            nativeCurrency: {
                                name: 'NEX',
                                symbol: networkConfig.symbol,
                                decimals: 18,
                            },
                            rpcUrls: [networkConfig.rpcUrl],
                            blockExplorerUrls: [networkConfig.explorer],
                        },
                    ],
                })
            } else {
                alert('Please install MetaMask to add this network')
            }
        } catch (error) {
            console.error('Failed to add network:', error)
        }
    }

    const handleClaim = async () => {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)
    }

    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <div className={styles.header}>
                            <img src="/nexus.jpg" alt="Nexus" width={60} height={60} />
                            <Title level={1} className={styles.title}>
                                Nexus Faucet
                            </Title>
                        </div>
                        <Paragraph className={styles.subtitle}>
                            {'Get testnet tokens for development and testing on the Nexus blockchain.'}
                        </Paragraph>
                    </div>
                </div>
            </section>

            <section className={styles.content}>
                <div className={styles.container}>
                    <Card className={styles.claimCardFullWidth} bordered={false}>
                        <Space direction="vertical" size="large" className={styles.fullWidth}>
                            <Title level={2} className={styles.cardTitle}>
                                {'Claim Test Tokens'}
                            </Title>

                            <Alert
                                message={
                                    <Space size="small">
                                        <InfoIcon className="h-4 w-4" />
                                        <span>
                                            <strong>Note:</strong> Testnet tokens are for test only and have no real value.
                                            Your GitHub Rank determines the amount you can get every 24 hours.
                                        </span>
                                    </Space>
                                }
                                type="info"
                                className={styles.alert}
                            />

                            <div className={styles.faucetForm}>
                                <div className={styles.inputGroup}>
                                    <Text className={styles.inputLabel}>{'Wallet Address'}</Text>
                                    <Input
                                        size="large"
                                        placeholder="0x..."
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className={styles.input}
                                    />
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    loading={isLoading}
                                    onClick={handleClaim}
                                    disabled={!address}
                                    className={styles.claimButton}
                                >
                                    {isLoading ? 'Processing...' : 'Claim Testnet Tokens'}
                                </Button>
                            </div>
                        </Space>
                    </Card>

                    <div className={styles.topCardsGrid}>
                        {/* Network Information */}
                        <Card
                            className={styles.card}
                            title={
                                <div className={styles.cardHeader}>
                                    <Title level={2} className={styles.cardTitle}>
                                        {'Network Information'}
                                    </Title>
                                    <Button
                                        type="primary"
                                        onClick={handleAddToMetaMask}
                                        className={styles.metaMaskButton}
                                    >
                                        {'Add to MetaMask'}
                                    </Button>
                                </div>
                            }
                            bordered={false}
                        >
                            <Space direction="vertical" size="middle" className={styles.fullWidth}>
                                {/* Network Name */}
                                <div className={styles.field}>
                                    <div className={styles.fieldContent}>
                                        <Text className={styles.fieldLabel}>{'NETWORK NAME'}</Text>
                                        <Text className={styles.fieldValue}>{networkConfig.networkName}</Text>
                                    </div>
                                    <Button
                                        type="text"
                                        icon={<Copy className="h-4 w-4" />}
                                        onClick={() => handleCopy(networkConfig.networkName, 'name')}
                                        className={styles.copyButton}
                                    />
                                </div>

                                {/* RPC URL */}
                                <div className={styles.field}>
                                    <div className={styles.fieldContent}>
                                        <Text className={styles.fieldLabel}>{'RPC URL'}</Text>
                                        <Text className={styles.fieldValueTruncate}>{networkConfig.rpcUrl}</Text>
                                    </div>
                                    <Button
                                        type="text"
                                        icon={<Copy className="h-4 w-4" />}
                                        onClick={() => handleCopy(networkConfig.rpcUrl, 'rpc')}
                                        className={styles.copyButton}
                                    />
                                </div>

                                {/* Chain ID */}
                                <div className={styles.field}>
                                    <div className={styles.fieldContent}>
                                        <Text className={styles.fieldLabel}>{'CHAIN ID'}</Text>
                                        <Text className={styles.fieldValue}>{networkConfig.chainId}</Text>
                                    </div>
                                    <Button
                                        type="text"
                                        icon={<Copy className="h-4 w-4" />}
                                        onClick={() => handleCopy(networkConfig.chainId, 'chain')}
                                        className={styles.copyButton}
                                    />
                                </div>

                                {/* Currency Symbol */}
                                <div className={styles.field}>
                                    <div className={styles.fieldContent}>
                                        <Text className={styles.fieldLabel}>{'CURRENCY SYMBOL'}</Text>
                                        <Text className={styles.fieldValue}>{networkConfig.symbol}</Text>
                                    </div>
                                    <Button
                                        type="text"
                                        icon={<Copy className="h-4 w-4" />}
                                        onClick={() => handleCopy(networkConfig.symbol, 'symbol')}
                                        className={styles.copyButton}
                                    />
                                </div>

                                {/* Block Explorer */}
                                <div className={styles.field}>
                                    <div className={styles.fieldContent}>
                                        <Text className={styles.fieldLabel}>{'BLOCK EXPLORER'}</Text>
                                        <a
                                            href={networkConfig.explorer}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.explorerLink}
                                        >
                                            {networkConfig.explorer}
                                            <ExternalLink className="h-3 w-3 shrink-0" />
                                        </a>
                                    </div>
                                    <Button
                                        type="text"
                                        icon={<Copy className="h-4 w-4" />}
                                        onClick={() => handleCopy(networkConfig.explorer, 'explorer')}
                                        className={styles.copyButton}
                                    />
                                </div>

                                {copiedField && (
                                    <Text type="success" className={styles.copiedMessage}>
                                        {'✓ Copied to clipboard!'}
                                    </Text>
                                )}
                            </Space>
                        </Card>

                        {/* GitHub Rank Tiers */}
                        <Card className={styles.card} bordered={false}>
                            <Space direction="vertical" size="large" className={styles.fullWidth}>
                                <div>
                                    <Title level={2} className={styles.cardTitle}>
                                        {'GitHub Rank Rewards'}
                                    </Title>
                                    <Paragraph className={styles.sectionDescription}>
                                        {'Your GitHub account rank determines how many testnet tokens you can claim every 24 hours.'}
                                    </Paragraph>
                                </div>

                                <Table
                                    columns={columns}
                                    dataSource={tiers}
                                    pagination={false}
                                    className={styles.table}
                                />
                            </Space>
                        </Card>
                    </div>

                    {/* Community Section */}
                    <Card className={styles.communityCard} bordered={false}>
                        <Text className={styles.communityText}>
                            {'Welcome to follow and join the '}
                            <span className={styles.communityAccent}>Nexus Community</span>
                        </Text>
                    </Card>
                </div>
            </section>
        </main>
    )
}
