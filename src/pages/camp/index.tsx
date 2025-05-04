import FaucetTitle from '../../components/FaucetTitle'
import CampFaucetForm from '../../components/CampFaucetForm'
import CampTestnet from '../../components/CampTestnet'
import styles from '../../styles/page.module.css'
import Navbar from '../../components/Navbar'


const Faucet = () => {
    return (
        <main className={styles.main}>
            <Navbar />
            <FaucetTitle />
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

