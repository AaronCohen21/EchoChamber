import icon from './svg/icon.svg';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <div className={styles.headerDiv}>
      <div className={styles.logo}>
        <img src={icon} alt="EchoChamber Icon" />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <h1>ECHOCHAMBER</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
