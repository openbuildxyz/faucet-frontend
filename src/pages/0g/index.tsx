import FaucetTitle from '../../components/FaucetTitle'
import ZeroFaucetForm from '../../components/0gFaucetForm'
import ZerogTestnet from '../../components/0gTestnet'
import styles from '../../styles/page.module.css'
import Navbar from '../../components/Navbar'


const Faucet = () => {
    return (
        <main className={styles.main}>
            <Navbar />
            <FaucetTitle />
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

