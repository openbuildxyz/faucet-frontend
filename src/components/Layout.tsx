import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Header from './Header';
import Footer from './Footer';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      {/* {!shouldHideNavbar && <Header />} */}
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
