import FaucetTitle from '../../components/FaucetTitle'
import FaucetForm from '../../components/FaucetForm'
import NetworkStats from '../../components/NetworkStats'
import styles from '../../styles/page.module.css'
import Navbar from '../../components/Navbar'


const Faucet = () => {
    return (
        <main className={styles.main}>
            <Navbar />
            <FaucetTitle />
            <div className={styles.container}>
                <div className={styles.grid}>
                    <FaucetForm />
                    <NetworkStats />
                </div>
            </div>
        </main>
    )
};

export default Faucet;

