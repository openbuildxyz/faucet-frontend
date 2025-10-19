import FaucetTitle from '../../components/FaucetTitle'
import NexusTestnet from '../../components/NexusTestnet'
import styles from '../../styles/page.module.css'
import NexusFaucetForm from '@/components/NexusFaucetForm'


const Faucet = () => {
    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    <NexusTestnet />
                    <NexusFaucetForm />
                </div>
            </div>
        </main>
    )
};

export default Faucet;

