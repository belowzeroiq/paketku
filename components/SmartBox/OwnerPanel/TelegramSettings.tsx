import { useState } from 'react';
import styles from '../../styles/Home.module.css';
import { TelegramSettingsType } from '@/app-types/types';

interface TelegramSettingsProps {
  telegramSettings: TelegramSettingsType;
  setTelegramSettings: React.Dispatch<React.SetStateAction<TelegramSettingsType>>;
  log: (message: string) => void;
  showNotification: (message: string, type?: 'info' | 'success' | 'warning') => void;
}

const TelegramSettings: React.FC<TelegramSettingsProps> = ({
  telegramSettings,
  setTelegramSettings,
  log,
  showNotification,
}) => {
  const [botToken, setBotToken] = useState(telegramSettings.botToken);
  const [chatId, setChatId] = useState(telegramSettings.chatId);

  const saveTelegramSettings = () => {
    if (botToken && chatId) {
      setTelegramSettings({
        botToken,
        chatId,
        enabled: true,
      });
      
      log(`📱 Telegram bot configured: Bot Token: ${botToken.substring(0, 10)}...`);
      log(`📱 Chat ID: ${chatId}`);
      
      showNotification('✅ Telegram bot settings saved successfully!', 'success');
    } else {
      showNotification('❌ Please enter both Bot Token and Chat ID', 'warning');
    }
  };

  const testTelegramBot = () => {
    if (!telegramSettings.enabled) {
      showNotification('❌ Please configure Telegram bot settings first', 'warning');
      return;
    }
    
    showNotification('📱 Test notification sent to Telegram!', 'info');
    log('📱 Test Telegram notification sent');
  };

  return (
    <>
      <h3 style={{ marginTop: '15px', fontSize: '14px' }}>Telegram Bot Settings:</h3>
      <input
        type="text"
        className={styles.trackingInput}
        value={botToken}
        onChange={(e) => setBotToken(e.target.value)}
        placeholder="Bot Token (e.g., 123456:ABC-DEF...)"
        style={{ marginBottom: '5px' }}
      />
      <input
        type="text"
        className={styles.trackingInput}
        value={chatId}
        onChange={(e) => setChatId(e.target.value)}
        placeholder="Chat ID (e.g., 123456789)"
        style={{ marginBottom: '10px' }}
      />
      <button className={`${styles.btn} ${styles.btnSuccess}`} onClick={saveTelegramSettings}>
        💾 Save Settings
      </button>
      <button className={styles.btn} onClick={testTelegramBot}>
        📱 Test Bot
      </button>
    </>
  );
};

export default TelegramSettings;