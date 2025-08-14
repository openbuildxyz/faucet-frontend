import FaucetTitle from '../../components/FaucetTitle'
import NexusTestnet from '../../components/NexusTestnet'
import styles from '../../styles/page.module.css'
import Navbar from '../../components/Navbar'
import NexusFaucetForm from '@/components/NexusFaucetForm'


const Faucet = () => {
    return (
        <main className={styles.main}>
            <Navbar />
            <FaucetTitle />
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

