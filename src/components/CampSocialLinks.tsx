import type React from "react"
import Link from "next/link"
import { Github, Twitter, } from "lucide-react"
import { FaDiscord, FaTelegramPlane, FaWeixin } from "react-icons/fa"
import styles from "../styles/social-links.module.css"
import { Popover, Typography } from "antd"

const { Title } = Typography;

export default function SocialLinks() {

  return (
    <div className={styles.container}>
      <div className={styles.iconContainer}>
        <SocialLink href="https://x.com/campnetworkxyz" icon={<Twitter size={16} />} label="Twitter" />
        <SocialLink href="https://t.me/CampNetworkCommunitys" icon={<FaTelegramPlane size={16} />} label="Telegram" />
        <SocialLink href="https://discord.gg/campnetwork" icon={<FaDiscord size={16} />} label="Telegram" />
      </div>
    </div>
  )
}

interface SocialLinkProps {
  href: string
  icon: React.ReactNode
  label: string
}
const wechatPopver = (
  <img src="/assistant.png" className={styles.wechatPng} alt="WeChat" width={300} height={300} />
);



function SocialLink({ href, icon, label }: SocialLinkProps) {
  if (label == "WeChat") {
    return (
      <Link
        href={href}
        className={styles.iconLink}
        aria-label={label}
        onClick={(e) => e.preventDefault()}
      >
        <Popover content={wechatPopver}>
          <span className={styles.iconWechat}>{icon}</span>
        </Popover>
      </Link>
    )
  } {
    return (
      <Link
        href={href}
        className={styles.iconLink}
        aria-label={label}
        target="__blank"
      >
        <span className={styles.icon}>{icon}</span>
      </Link>
    )
  }
}

