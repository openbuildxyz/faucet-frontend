'use client'

import React from 'react'
import { Card, Typography } from 'antd'
import styles from '../styles/network-stats.module.css'

const { Title, Text } = Typography

const STATS = [
  {
    network: 'Ethereum Sepolia',
    balance: '157.5 ETH',
    requests: '1.2k',
    className: styles.cardGreen
  },
  {
    network: 'Arbitrum Sepolia',
    balance: '245.8 ETH',
    requests: '856',
    className: styles.cardPurple
  },
  {
    network: 'Optimism Sepolia',
    balance: '180.2 ETH',
    requests: '654',
    className: styles.cardYellow
  }
]

const NetworkStats = () => {
  return (
    <div className={styles.container}>
      <Title level={2} className={styles.title}>Network Statistics</Title>
      <div className={styles.grid}>
        {STATS.map((stat, i) => (
          <Card key={i} className={`${styles.card} ${stat.className}`}>
            <div className={styles.cardContent}>
              <div>
                <Text strong className={styles.networkName}>{stat.network}</Text>
                <Text className={styles.label}>Available Balance</Text>
                <Text strong className={styles.balance}>{stat.balance}</Text>
              </div>
              <div className={styles.requests}>
                <Text className={styles.label}>24h Requests</Text>
                <Text strong className={styles.requestCount}>{stat.requests}</Text>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default NetworkStats;