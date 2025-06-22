import { useState } from 'react';
import styles from '@styles/Home.module.css';
import Camera from '../Camera';
import QrScanner from '../QrScanner';
import LockStatus from '../LockStatus';
import OwnerPanel from '../OwnerPanel/OwnerPanel';
import { Delivery, FailedDelivery, TelegramSettingsType } from '@/app-types/types';

interface SystemMonitorProps {
  expectedPackages: string[];
  deliveredPackages: Delivery[];
  rejectedCount: number;
  logs: string[];
  telegramSettings: { enabled: boolean };
  log: (message: string) => void;
  showNotification: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({
  expectedPackages,
  deliveredPackages,
  rejectedCount,
  logs,
  telegramSettings,
  log,
  showNotification,
}) => {
  const resetSystem = () => {
    log('🔄 System reset complete');
    showNotification('🔄 System reset complete', 'info');
  };

  const testNotification = () => {
    showNotification('📲 Test notification - System working properly!', 'info');
    log('📲 Test notification sent to owner');
  };

  return (
    <div className={styles.panel}>
      <h2>🖥️ System Monitor</h2>
      
      <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}><strong>System Status:</strong></div>
        <div style={{ fontSize: '12px', color: '#00ff00' }}>● ONLINE - Waiting for packages</div>
        <div style={{ fontSize: '12px', marginTop: '5px' }}>Camera: <span>Ready</span></div>
        <div style={{ fontSize: '12px' }}>Database: <span>Connected</span></div>
        <div style={{ fontSize: '12px' }}>WiFi: <span>Connected</span></div>
        <div style={{ fontSize: '12px' }}>Telegram Bot: <span>{telegramSettings.enabled ? 'Configured ✅' : 'Not configured'}</span></div>
      </div>

      <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
        <div style={{ fontSize: '14px', marginBottom: '10px' }}><strong>Statistics:</strong></div>
        <div style={{ fontSize: '12px' }}>Expected: <span>{expectedPackages.length}</span></div>
        <div style={{ fontSize: '12px' }}>
          Delivered: <span>{deliveredPackages.length}</span>
          {deliveredPackages.length > 0 && (
            <div style={{ marginLeft: '10px', fontSize: '10px' }}>
              {deliveredPackages.map(pkg => (
                <div key={pkg.tracking}>
                  • {pkg.tracking} ({new Date(pkg.timestamp).toLocaleTimeString()})
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ fontSize: '12px' }}>Rejected: <span>{rejectedCount}</span></div>
      </div>

      <button className={styles.btn} onClick={resetSystem}>🔄 Reset System</button>
      <button className={styles.btn} onClick={testNotification}>📲 Test Notification</button>

      <div className={styles.statusLog}>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
};

export default SystemMonitor;