import FaucetTitle from '../../components/FaucetTitle'
import FaucetForm from '../../components/FaucetForm'
import MonadTestnet from '../../components/MonadTestnet'
import styles from '../../styles/page.module.css'
import Navbar from '../../components/Navbar'


const Faucet = () => {
    return (
        <main className={styles.main}>
            <Navbar />
            <FaucetTitle />
            <div className={styles.container}>
                <div className={styles.grid}>
                    <MonadTestnet />
                    <FaucetForm />
                </div>
            </div>
        </main>
    )
};

export default Faucet;

