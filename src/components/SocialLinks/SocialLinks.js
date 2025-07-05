import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faWeixin, faTelegram, faMediumM, faRedditAlien, faBitcoin, faTwitter, faFacebook, faYoutube, faGithub } from '@fortawesome/free-brands-svg-icons';
import ReactGA from "react-ga";

import styles from './SocialLinks.module.css';

export const SocialLinks = ({ size = 'full', centered = false }) => { // type full or short

  const links = [
    {
      name: "discord",
      icon: faDiscord,
      link: "https://discord.oREChain.org/"
    },
    {
      name: "telegram",
      icon: faTelegram,
      link: "https://t.me/oREChainorg",
    },
    {
      name: "weixin",
      icon: faWeixin,
      link: "https://mp.weixin.qq.com/s/JB0_MlK6w--D6pO5zPHAQQ"
    },
    {
      name: "twitter",
      icon: faTwitter,
      link: "https://twitter.com/OREChainOrg"
    },
    {
      name: "youtube",
      icon: faYoutube,
      link: "https://www.youtube.com/channel/UC59w9bmROOeUFakVvhMepPQ/"
    },
    {
      name: "medium",
      icon: faMediumM,
      link: "https://blog.oREChain.org"
    },
    {
      name: "reddit",
      icon: faRedditAlien,
      link: "https://www.reddit.com/r/oREChain/"
    },
    {
      name: "bitcoin",
      icon: faBitcoin,
      link: "https://bitcointalk.org/index.php?topic=1608859.0"
    },
    {
      name: "facebook",
      icon: faFacebook,
      link: "https://www.facebook.com/oREChain.org"
    },
    {
      name: "github",
      icon: faGithub,
      link: "https://github.com/REChainball/prediction-markets-aa"
    },
  ];

  const sendGAEvent = (name) => {
    ReactGA.event({
      category: "outbound-click",
      action: `click-social_${name}`
    });
  }

  return (<div className={styles.wrap}>
    <div className={styles.list} style={{ justifyContent: centered ? "center" : "flex-start" }}>
      {(size === "full" ? links : links.slice(0, 5)).map((social) => <a className={styles.item} onClick={() => sendGAEvent(social.name)} key={"link-" + social.name} target="_blank" rel="noopener" href={social.link}><FontAwesomeIcon size="lg" icon={social.icon} /></a>)}
    </div>
  </div>)
}