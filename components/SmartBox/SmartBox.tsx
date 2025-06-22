import { useState } from "react";
import styles from "@styles/Home.module.css";
import {
  Delivery,
  FailedDelivery,
  TelegramSettingsType,
} from "@/app-types/types";
import Camera from "./Camera";
import QrScanner from "./QrScanner";
import LockStatus from "./LockStatus";

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
  telegramSettings: TelegramSettingsType;
  log: (message: string) => void;
  showNotification: (
    message: string,
    type?: "info" | "success" | "warning",
  ) => void;
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
  const [scanInput, setScanInput] = useState("");

  const handleDelivery = (trackingNumber: string) => {
    setExpectedPackages((prev) => prev.filter((t) => t !== trackingNumber));
    setDeliveredPackages((prev) => [
      ...prev,
      {
        tracking: trackingNumber,
        timestamp: new Date().toLocaleString(),
      },
    ]);
    setIsBoxLocked(false);
    showNotification(
      `📦 Package delivered! Tracking: ${trackingNumber}`,
      "success",
    );

    setTimeout(() => {
      setIsBoxLocked(true);
      log("🔒 Box automatically locked");
    }, 10000);
  };

  const handleFailedDelivery = (trackingNumber: string) => {
    setRejectedCount((prev) => prev + 1);
    setFailedDeliveries((prev) => [
      ...prev,
      {
        tracking: trackingNumber,
        reason: "Tracking number not found",
        timestamp: new Date().toLocaleString(),
      },
    ]);
    showNotification(
      `🚨 Unauthorized delivery attempt: ${trackingNumber}`,
      "warning",
    );
  };

  const handleScan = () => {
    if (!scanInput.trim()) {
      log("❌ No barcode/QR code provided");
      return;
    }

    setIsScanning(true);
    log(`📷 Scanning: ${scanInput}`);

    setTimeout(() => {
      const isValid = expectedPackages.includes(scanInput);
      isValid ? handleDelivery(scanInput) : handleFailedDelivery(scanInput);
      setIsScanning(false);
      setScanInput("");
    }, 2000);
  };

  return (
    <div className={styles.panel}>
      <h2>📦 Smart Delivery Box</h2>
      <div className={styles.smartBox}>
        <Camera isScanning={isScanning} />
        <QrScanner isScanning={isScanning} code={scanInput} />

        <div className={styles.scanControl}>
          <input
            type="text"
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            placeholder="Enter tracking number..."
            onKeyPress={(e) => e.key === "Enter" && handleScan()}
          />
          <button
            className={`${styles.btn} ${isScanning ? styles.disabled : ""}`}
            onClick={handleScan}
            disabled={isScanning}
          >
            {isScanning ? "Scanning..." : "🔍 Scan"}
          </button>
        </div>

        <LockStatus isLocked={isBoxLocked} />
        <div className={styles.boxStatus}>
          Status: {isBoxLocked ? "LOCKED" : "UNLOCKED"}
        </div>
      </div>
    </div>
  );
};

export default SmartBox;
