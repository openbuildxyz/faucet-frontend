import { FaucetTitle } from '../components/FaucetTitle'
import { FaucetForm } from '../components/FaucetForm'
import { NetworkStats } from '../components/NetworkStats'
import styles from '../styles/page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <FaucetTitle />
      <div className={styles.container}>
        <div className={styles.grid}>
          <FaucetForm />
          <NetworkStats />
        </div>
      </div>
    </main>
  )
}

