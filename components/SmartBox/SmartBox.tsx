import { useState } from 'react';
import styles from '../../styles/Home.module.css';
import Camera from './Camera';
import QrScanner from './QrScanner';
import LockStatus from './LockStatus';
import { Delivery, FailedDelivery, TelegramSettings } from '../../types/types';

interface SmartBoxProps {
  expectedPackages: string[];
  isBoxLocked: boolean;
  isScanning: boolean;
  setExpectedPackages: React.Dispatch<React.SetStateAction<string[]>>;
  setDeliveredPackages: React.Dispatch<React.SetStateAction<Delivery[]>>;
  setFailedDeliveries: React.Dispatch<React.SetStateAction<FailedDelivery[]>>;
  setRejectedCount: React.Dispatch<React.SetStateAction<number>>;
  setIsBoxLocked: React.Dispatch<React.SetStateAction<boolean>>;
  setIsScanning: React.Dispatch<React.SetStateAction<boolean>>;
  telegramSettings: TelegramSettings;
  log: (message: string) => void;
  showNotification: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

const SmartBox: React.FC<SmartBoxProps> = ({
  expectedPackages,
  isBoxLocked,
  isScanning,
  setExpectedPackages,
  setDeliveredPackages,
  setFailedDeliveries,
  setRejectedCount,
  setIsBoxLocked,
  setIsScanning,
  telegramSettings,
  log,
  showNotification,
}) => {
  const [scanInput, setScanInput] = useState('');

  const handleScan = () => {
    if (!scanInput.trim()) {
      log('❌ No barcode/QR code provided');
      return;
    }

    setIsScanning(true);
    log(`📷 Camera detected barcode: ${scanInput}`);
    log('🔍 Processing QR/Barcode...');

    setTimeout(() => {
      const trackingIndex = expectedPackages.indexOf(scanInput);
      
      if (trackingIndex !== -1) {
        log(`✅ Valid tracking number found: ${scanInput}`);
        log('🔓 Unlocking box...');
        
        // Remove from expected packages
        setExpectedPackages(prev => prev.filter((_, i) => i !== trackingIndex));
        
        // Add to delivered packages
        setDeliveredPackages(prev => [
          ...prev,
          {
            tracking: scanInput,
            timestamp: new Date().toLocaleString()
          }
        ]);
        
        // Unlock the box
        setIsBoxLocked(false);
        
        showNotification(`📦 Package delivered! Tracking: ${scanInput}`, 'success');
        
        if (telegramSettings.enabled) {
          log(`📱 Sending Telegram notification about successful delivery`);
        }
        
        // Auto-lock after 10 seconds
        setTimeout(() => {
          setIsBoxLocked(true);
          log('🔒 Box automatically locked');
        }, 10000);
      } else {
        log(`❌ Invalid tracking number: ${scanInput}`);
        log('🔒 Access denied - box remains locked');
        
        setRejectedCount(prev => prev + 1);
        
        setFailedDeliveries(prev => [
          ...prev,
          {
            tracking: scanInput,
            reason: 'Tracking number not found in database',
            timestamp: new Date().toLocaleString()
          }
        ]);
        
        showNotification(`🚨 Unauthorized delivery attempt with tracking: ${scanInput}`, 'warning');
        
        if (telegramSettings.enabled) {
          log(`📱 Sending Telegram alert about unauthorized attempt`);
        }
      }
      
      setIsScanning(false);
      setScanInput('');
    }, 2000);
  };

  return (
    <div className={styles.panel}>
      <h2>📦 Smart Resi Box</h2>
      <div className={styles.smartBox}>
        <Camera isScanning={isScanning} />
        <QrScanner isScanning={isScanning} scannedCode={scanInput} />
        
        <div className={styles.scanInput}>
          <input
            type="text"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            placeholder="Simulate QR/Barcode scan..."
            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
          />
          <button className={styles.btn} onClick={handleScan}>
            🔍 Scan
          </button>
        </div>
        
        <LockStatus isLocked={isBoxLocked} />
        <div style={{ fontSize: '12px', marginTop: '5px' }}>
          Box Status: {isBoxLocked ? 'LOCKED' : 'UNLOCKED'}
        </div>
      </div>
    </div>
  );
};

export default SmartBox;