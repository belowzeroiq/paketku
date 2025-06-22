import styles from '@styles/Home.module.css';

interface TrackingListProps {
  expectedPackages: string[];
  removeTracking: (index: number) => void;
}

const TrackingList: React.FC<TrackingListProps> = ({ expectedPackages, removeTracking }) => {
  return (
    <div className={styles.trackingList}>
      {expectedPackages.map((tracking, index) => (
        <div key={index} className={styles.trackingItem}>
          <span>{tracking}</span>
          <button 
            className={styles.btn} 
            style={{ padding: '2px 8px', fontSize: '10px' }}
            onClick={() => removeTracking(index)}
          >
            ❌
          </button>
        </div>
      ))}
    </div>
  );
};

export default TrackingList;