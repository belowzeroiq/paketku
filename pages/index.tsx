import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import OwnerPanel from '../components/SmartBox/OwnerPanel/OwnerPanel';
import SmartBox from '../components/SmartBox/SmartBox';
import SystemMonitor from '../components/SmartBox/SystemMonitor/SystemMonitor';
import { Delivery, FailedDelivery, TelegramSettingsType } from '../app-types/types';

export default function Home() {
  const [expectedPackages, setExpectedPackages] = useState<string[]>([]);
  const [deliveredPackages, setDeliveredPackages] = useState<Delivery[]>([]);
  const [failedDeliveries, setFailedDeliveries] = useState<FailedDelivery[]>([]);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [isBoxLocked, setIsBoxLocked] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [telegramSettings, setTelegramSettings] = useState<TelegramSettingsType>({
    botToken: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || '',
    enabled: Boolean(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN && process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID)
  });
  const [logs, setLogs] = useState<string[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'info' | 'success' | 'warning';
    visible: boolean;
  }>({ message: '', type: 'info', visible: false });

  const log = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const showNotification = (message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, visible: false }));
    }, 5000);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Smart Resi Box Simulator</title>
        <meta name="description" content="Smart Residential Delivery Box Simulator" />
      </Head>

      <div className={styles.panelContainer}>
        <OwnerPanel
          expectedPackages={expectedPackages}
          deliveredPackages={deliveredPackages}
          failedDeliveries={failedDeliveries}
          telegramSettings={telegramSettings}
          notification={notification}
          setExpectedPackages={setExpectedPackages}
          setTelegramSettings={setTelegramSettings}
          log={log}
          showNotification={showNotification}
        />

        <SmartBox
          expectedPackages={expectedPackages}
          isBoxLocked={isBoxLocked}
          isScanning={isScanning}
          setExpectedPackages={setExpectedPackages}
          setDeliveredPackages={setDeliveredPackages}
          setFailedDeliveries={setFailedDeliveries}
          setRejectedCount={setRejectedCount}
          setIsBoxLocked={setIsBoxLocked}
          setIsScanning={setIsScanning}
          telegramSettings={telegramSettings}
          log={log}
          showNotification={showNotification}
        />

        <SystemMonitor
          expectedPackages={expectedPackages}
          deliveredPackages={deliveredPackages}
          rejectedCount={rejectedCount}
          logs={logs}
          telegramSettings={telegramSettings}
          log={log}
          showNotification={showNotification}
        />
      </div>
    </div>
  );
}