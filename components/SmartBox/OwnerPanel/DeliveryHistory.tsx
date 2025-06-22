import styles from '@styles/Home.module.css';
import { Delivery, FailedDelivery } from '@types/types';

interface DeliveryHistoryProps {
  deliveries: Delivery[] | FailedDelivery[];
  failed?: boolean;
}

const DeliveryHistory: React.FC<DeliveryHistoryProps> = ({ deliveries, failed = false }) => {
  return (
    <div className={styles.deliveryHistory}>
      {deliveries.map((delivery, index) => (
        <div key={index} className={`${styles.historyItem} ${failed ? styles.historyItemFailed : ''}`}>
          <div><strong>{failed ? '❌' : '✅'} {delivery.tracking}</strong></div>
          {'reason' in delivery && (
            <div style={{ fontSize: '10px', color: '#ffcdd2' }}>Reason: {delivery.reason}</div>
          )}
          <div style={{ fontSize: '10px', color: '#aaa' }}>{delivery.timestamp}</div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryHistory;