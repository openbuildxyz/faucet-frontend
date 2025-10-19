import FaucetTitle from '../../components/FaucetTitle'
import ZeroFaucetForm from '../../components/0gFaucetForm'
import ZerogTestnet from '../../components/0gTestnet'
import styles from '../../styles/page.module.css'

const Faucet = () => {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <ZerogTestnet />
                    <ZeroFaucetForm />
                </div>
            </div>
        </main>
    )
};

export default Faucet;

