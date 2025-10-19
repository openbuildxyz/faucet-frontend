import FaucetForm from '../../components/FaucetForm'
import MonadTestnet from '../../components/MonadTestnet'
import styles from '../../styles/page.module.css'


const Faucet = () => {
    return (
        <main className={styles.main}>
            {/* <FaucetTitle /> */}
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

