import { useState } from 'react';
import DeliveryHistory from './DeliveryHistory';
//import TelegramSettings from './TelegramSettings';
import styles from '@styles/Home.module.css';
import { Delivery, FailedDelivery, TelegramSettings } from '@app-types/types';
import TrackingList from './TrackingList';

interface OwnerPanelProps {
  expectedPackages: string[];
  deliveredPackages: Delivery[];
  failedDeliveries: FailedDelivery[];
  telegramSettings: TelegramSettings;
  notification: { message: string; type: 'info' | 'success' | 'warning'; visible: boolean };
  setExpectedPackages: React.Dispatch<React.SetStateAction<string[]>>;
  setTelegramSettings: React.Dispatch<React.SetStateAction<TelegramSettings>>;
  log: (message: string) => void;
  showNotification: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

const OwnerPanel: React.FC<OwnerPanelProps> = ({
  expectedPackages,
  deliveredPackages,
  failedDeliveries,
  telegramSettings,
  notification,
  setExpectedPackages,
  setTelegramSettings,
  log,
  showNotification,
}) => {
  const [newTracking, setNewTracking] = useState('');

  const addTracking = () => {
    const tracking = newTracking.trim();
    
    if (tracking && !expectedPackages.includes(tracking)) {
      setExpectedPackages(prev => [...prev, tracking]);
      setNewTracking('');
      log(`✅ Added expected package: ${tracking}`);
    } else if (expectedPackages.includes(tracking)) {
      log(`⚠️ Tracking number already exists: ${tracking}`);
    }
  };

  const removeTracking = (index: number) => {
    const newPackages = [...expectedPackages];
    const removed = newPackages.splice(index, 1)[0];
    setExpectedPackages(newPackages);
    log(`🗑️ Removed expected package: ${removed}`);
  };

  const clearAllTracking = () => {
    setExpectedPackages([]);
    log('🗑️ Cleared all expected packages');
  };

  return (
    <div className={styles.panel}>
      <h2>📱 Owner Interface</h2>
      
      <input
        type="text"
        className={styles.trackingInput}
        value={newTracking}
        onChange={(e) => setNewTracking(e.target.value)}
        placeholder="Enter tracking number..."
        onKeyPress={(e) => e.key === 'Enter' && addTracking()}
      />
      
      <button className={`${styles.btn} ${styles.btnSuccess}`} onClick={addTracking}>
        ➕ Add Expected Package
      </button>

      <h3 style={{ marginTop: '15px', fontSize: '14px' }}>Expected Packages:</h3>
      <TrackingList 
        expectedPackages={expectedPackages} 
        removeTracking={removeTracking} 
      />

      <button className={`${styles.btn} ${styles.btnWarning}`} onClick={clearAllTracking}>
        🗑️ Clear All
      </button>

      <TelegramSettings
        telegramSettings={telegramSettings}
        setTelegramSettings={setTelegramSettings}
        log={log}
        showNotification={showNotification}
      />

      {notification.visible && (
        <div className={`${styles.notification} ${
          notification.type === 'success' ? styles.notificationSuccess : 
          notification.type === 'warning' ? styles.notificationWarning : ''
        }`}>
          {notification.message}
        </div>
      )}

      <h3 style={{ marginTop: '15px', fontSize: '14px' }}>Delivery History:</h3>
      <DeliveryHistory deliveries={deliveredPackages} />

      <h3 style={{ marginTop: '15px', fontSize: '14px' }}>Failed/Unauthorized Attempts:</h3>
      <DeliveryHistory deliveries={failedDeliveries} failed />
    </div>
  );
};

export default OwnerPanel;