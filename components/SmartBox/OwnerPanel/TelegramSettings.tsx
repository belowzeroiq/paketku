import { useState, useEffect } from 'react';
import styles from '@styles/Home.module.css';
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
  const [usingEnvVars, setUsingEnvVars] = useState(false);

  // Initialize with environment variables if available
  useEffect(() => {
    const envBotToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const envChatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    if (envBotToken && envChatId) {
      setBotToken(envBotToken);
      setChatId(envChatId);
      setUsingEnvVars(true);
      setTelegramSettings({
        botToken: envBotToken,
        chatId: envChatId,
        enabled: true
      });
      log('📱 Using Telegram settings from environment variables');
    }
  }, []);

  const saveTelegramSettings = () => {
    if (usingEnvVars) {
      showNotification('ℹ️ Using environment variables - settings cannot be modified', 'info');
      return;
    }

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

  const testTelegramBot = async () => {
    if (!telegramSettings.enabled) {
      showNotification('❌ Please configure Telegram bot settings first', 'warning');
      return;
    }

    try {
      // Use API route for actual sending
      const response = await fetch('/api/telegram-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botToken: usingEnvVars ? process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN : botToken,
          chatId: usingEnvVars ? process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID : chatId
        })
      });

      if (response.ok) {
        showNotification('📱 Test notification sent to Telegram!', 'success');
        log('📱 Test Telegram notification sent');
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      showNotification('❌ Failed to send test notification', 'warning');
      log(`📱 Failed to send Telegram test: ${error.message}`);
    }
  };

  return (
    <>
      <h3 style={{ marginTop: '15px', fontSize: '14px' }}>Telegram Bot Settings:</h3>
      
      {usingEnvVars && (
        <div className={styles.notification}>
          Using environment variables configured in Vercel
        </div>
      )}

      <input
        type="text"
        className={styles.trackingInput}
        value={botToken}
        onChange={(e) => setBotToken(e.target.value)}
        placeholder="Bot Token (e.g., 123456:ABC-DEF...)"
        style={{ marginBottom: '5px' }}
        disabled={usingEnvVars}
      />
      <input
        type="text"
        className={styles.trackingInput}
        value={chatId}
        onChange={(e) => setChatId(e.target.value)}
        placeholder="Chat ID (e.g., 123456789)"
        style={{ marginBottom: '10px' }}
        disabled={usingEnvVars}
      />
      <button 
        className={`${styles.btn} ${styles.btnSuccess}`} 
        onClick={saveTelegramSettings}
        disabled={usingEnvVars}
      >
        {usingEnvVars ? 'Using Vercel Config' : '💾 Save Settings'}
      </button>
      <button className={styles.btn} onClick={testTelegramBot}>
        📱 Test Bot
      </button>
    </>
  );
};

export default TelegramSettings;