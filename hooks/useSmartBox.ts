import { useState } from 'react';
import { Delivery, FailedDelivery, TelegramSettingsType } from '../app-types/types';

export const useSmartBox = () => {
  const [isBoxLocked, setIsBoxLocked] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (
    scannedCode: string,
    expectedPackages: string[],
    setExpectedPackages: React.Dispatch<React.SetStateAction<string[]>>,
    setDeliveredPackages: React.Dispatch<React.SetStateAction<Delivery[]>>,
    setFailedDeliveries: React.Dispatch<React.SetStateAction<FailedDelivery[]>>,
    setRejectedCount: React.Dispatch<React.SetStateAction<number>>,
    telegramSettings: TelegramSettingsType,
    log: (message: string) => void,
    showNotification: (message: string, type?: 'info' | 'success' | 'warning') => void
  ) => {
    if (isScanning) return;

    setIsScanning(true);

    setTimeout(() => {
      const trackingIndex = expectedPackages.indexOf(scannedCode);
      
      if (trackingIndex !== -1) {
        log(`✅ Valid tracking number found: ${scannedCode}`);
        log('🔓 Unlocking box...');
        
        unlockBox(
          scannedCode,
          trackingIndex,
          setExpectedPackages,
          setDeliveredPackages,
          setIsBoxLocked,
          telegramSettings,
          log,
          showNotification
        );
      } else {
        log(`❌ Invalid tracking number: ${scannedCode}`);
        log('🔒 Access denied - box remains locked');
        
        setRejectedCount(prev => prev + 1);
        
        setFailedDeliveries(prev => [
          ...prev,
          {
            tracking: scannedCode,
            reason: 'Tracking number not found in database',
            timestamp: new Date().toLocaleString()
          }
        ]);
        
        showNotification(`🚨 Unauthorized delivery attempt with tracking: ${scannedCode}`, 'warning');
        
        // Simulate Telegram notification
        if (telegramSettings.enabled) {
          log(`📱 Sending Telegram alert about unauthorized attempt`);
        }
      }
      
      setIsScanning(false);
    }, 2000);
  };

  const unlockBox = (
    tracking: string,
    trackingIndex: number,
    setExpectedPackages: React.Dispatch<React.SetStateAction<string[]>>,
    setDeliveredPackages: React.Dispatch<React.SetStateAction<Delivery[]>>,
    setIsBoxLocked: React.Dispatch<React.SetStateAction<boolean>>,
    telegramSettings: TelegramSettingsType,
    log: (message: string) => void,
    showNotification: (message: string, type?: 'info' | 'success' | 'warning') => void
  ) => {
    setIsBoxLocked(false);
    
    setExpectedPackages(prev => prev.filter((_, i) => i !== trackingIndex));
    
    setDeliveredPackages(prev => [
      ...prev,
      {
        tracking,
        timestamp: new Date().toLocaleString()
      }
    ]);
    
    showNotification(`📦 Package delivered! Tracking: ${tracking}`, 'success');
    
    if (telegramSettings.enabled) {
      log(`📱 Sending Telegram notification about successful delivery`);
    }
    
    // Auto-lock after 10 seconds
    setTimeout(() => {
      setIsBoxLocked(true);
      log('🔒 Box automatically locked');
    }, 10000);
  };

  return {
    isBoxLocked,
    isScanning,
    handleScan,
    unlockBox,
  };
};