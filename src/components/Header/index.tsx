import {ActiveLink} from '../ActiveLink';
import { SignInInButton } from '../SignInButton';
import styles from './styles.module.scss';

export function Header() {

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a className={styles.active} href="">Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a href="">Posts</a>
          </ActiveLink>
        </nav>
        <SignInInButton />
      </div>
    </header>
  )
} 