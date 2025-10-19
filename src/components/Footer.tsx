import styles from "./Footer.module.css"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <p>© 2025 OpenBuild. Built for Web3 developers.</p>
        <div className={styles.footerLinks}>
          <a href="https://github.com/openbuildxyz/openbuild-frontend" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://x.com/OpenBuildxyz" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </div>
      </div>
    </footer>
  )
}
