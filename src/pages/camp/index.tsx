import FaucetTitle from '../../components/FaucetTitle'
import CampFaucetForm from '../../components/CampFaucetForm'
import CampTestnet from '../../components/CampTestnet'
import styles from '../../styles/page.module.css'


const Faucet = () => {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <CampTestnet />
                    <CampFaucetForm />
                </div>
            </div>
        </main>
    )
};

export default Faucet;

