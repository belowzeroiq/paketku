import styles from '../../styles/Home.module.css';

interface LockStatusProps {
  isLocked: boolean;
}

const LockStatus: React.FC<LockStatusProps> = ({ isLocked }) => {
  return (
    <div className={`${styles.lockStatus} ${isLocked ? styles.lockStatusLocked : styles.lockStatusUnlocked}`}>
      {isLocked ? '🔒' : '🔓'}
    </div>
  );
};

export default LockStatus;