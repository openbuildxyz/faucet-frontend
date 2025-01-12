import styles from '../styles/faucet-title.module.css'

const FaucetTitle = () => {
  return (
    <div className={styles.hero}>
      <h1 className={styles.title}>
        Web3 Testnet Faucet ✨
      </h1>
      <p className={styles.description}>
        Get testnet tokens to start building and testing your decentralized applications. Part of OpenBuild&apos;s developer tools suite.
      </p>
    </div>
  )
}

export default FaucetTitle;