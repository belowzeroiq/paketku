import { useState, useEffect } from "react";
import styles from "@styles/Home.module.css";
import { TelegramSettingsType } from "@/app-types/types";

interface TelegramSettingsProps {
  telegramSettings: TelegramSettingsType;
  setTelegramSettings: React.Dispatch<
    React.SetStateAction<TelegramSettingsType>
  >;
  log: (message: string) => void;
  showNotification: (
    message: string,
    type?: "info" | "success" | "warning",
  ) => void;
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
        enabled: true,
      });
      log("📱 Using Telegram settings from environment variables");
    }
  }, []);

  const saveTelegramSettings = () => {
    if (usingEnvVars) {
      showNotification(
        "ℹ️ Using environment variables - settings cannot be modified",
        "info",
      );
      return;
    }

    if (botToken && chatId) {
      setTelegramSettings({
        botToken,
        chatId,
        enabled: true,
      });

      log(
        `📱 Telegram bot configured: Bot Token: ${botToken.substring(0, 10)}...`,
      );
      log(`📱 Chat ID: ${chatId}`);

      showNotification(
        "✅ Telegram bot settings saved successfully!",
        "success",
      );
    } else {
      showNotification("❌ Please enter both Bot Token and Chat ID", "warning");
    }
  };

  const testTelegramBot = async () => {
    if (!telegramSettings.enabled) {
      showNotification(
        "❌ Please configure Telegram bot settings first",
        "warning",
      );
      return;
    }

    try {
      const response = await fetch("/api/telegram-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          botToken: usingEnvVars
            ? process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN
            : botToken,
          chatId: usingEnvVars
            ? process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID
            : chatId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showNotification("📱 Test notification sent to Telegram!", "success");
      log("📱 Test Telegram notification sent");
    } catch (error) {
      let errorMessage = "Unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      showNotification("❌ Failed to send test notification", "warning");
      log(`📱 Failed to send Telegram test: ${errorMessage}`);
    }
  };

  return (
    <>
      <button
        className={`${styles.btn} ${styles.btnSuccess}`}
        onClick={saveTelegramSettings}
        disabled={usingEnvVars}
      >
        {usingEnvVars ? "Using Vercel Config" : "💾 Save Settings"}
      </button>
      <button className={styles.btn} onClick={testTelegramBot}>
        📱 Test Bot
      </button>
    </>
  );
};

export default TelegramSettings;
