"use client"

import Link from 'next/link'
import Image from 'next/image'
import styles from '../styles/navbar.module.css'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/favicon-16x16.png"
              alt="OpenBuild Logo"
              width={32}
              height={32}
              className={styles.logoImage}
            />
            <span className={styles.logoText}>OpenBuild</span>
          </Link>
          <div className={styles.links}>
            <Link href="#" className={styles.link}>Learn</Link>
            <Link href="#" className={styles.link}>Challenges</Link>
            <Link href="#" className={styles.link}>Bounties</Link>
            <Link href="#" className={styles.link}>SkillHub</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;