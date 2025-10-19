import Link from "next/link"
import styles from "../styles/index.module.css"

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Web3 Testnet Faucet <span className={styles.sparkle}>✨</span>
          </h1>
          <p className={styles.subtitle}>
            Get testnet tokens to start building and testing your DApp across multiple blockchain networks.
          </p>

          <div className={styles.ctaButtons}>
            {/* <Link href="/faucet/monad" className={styles.primaryButton}>
              Get Started
            </Link> */}
            <Link href="/monad" className={styles.secondaryButton}>
              Try Monad Faucet
            </Link>
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🌐</div>
            <h3 className={styles.featureTitle}>Multi-Chain Support</h3>
            <p className={styles.featureText}>
              Access faucets for 10+ blockchain networks including Ethereum, Polygon, Arbitrum, Optimism, and more.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureTitle}>Instant Distribution</h3>
            <p className={styles.featureText}>
              Receive testnet tokens instantly to your wallet. No waiting, no hassle. Start testing immediately.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3 className={styles.featureTitle}>GitHub Integration</h3>
            <p className={styles.featureText}>
              Your GitHub rank determines daily limits. Higher ranks receive more tokens to support active developers.
            </p>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>ℹ️</div>
            <h3 className={styles.infoTitle}>About Testnet Tokens</h3>
            <p className={styles.infoText}>
              Testnet tokens are for testing purposes only and have no real value. They allow developers to test their
              applications without spending real cryptocurrency.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>🎯</div>
            <h3 className={styles.infoTitle}>How It Works</h3>
            <p className={styles.infoText}>
              Select your network from the menu, connect your wallet, and request tokens. Simple, fast, and reliable for
              all your testing needs.
            </p>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>💡</div>
            <h3 className={styles.infoTitle}>Developer Friendly</h3>
            <p className={styles.infoText}>
              Built by developers, for developers. Clean interface, reliable service, and support for the latest
              blockchain networks.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
