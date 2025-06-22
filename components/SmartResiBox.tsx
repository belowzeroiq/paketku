import React, { useState, useEffect } from "react";
import styles from "../styles/SmartResiBox.module.css";
import {
  Package,
  Camera,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Settings,
  Bell,
  RotateCcw,
  Shield,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Scan,
  User,
  Monitor,
  Zap,
  Eye,
  AlertTriangle,
} from "lucide-react";

const SmartResiBox = () => {
  const [expectedPackages, setExpectedPackages] = useState<string[]>([]);
  const [deliveredPackages, setDeliveredPackages] = useState<
    Array<{ tracking: string; timestamp: string }>
  >([]);
  const [failedDeliveries, setFailedDeliveries] = useState<
    Array<{ tracking: string; reason: string; timestamp: string }>
  >([]);
  const [isLocked, setIsLocked] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState<
    "success" | "error" | "warning" | "info"
  >("info");
  const [telegramSettings, setTelegramSettings] = useState({
    botToken: "",
    chatId: "",
  });

  // Form states
  const [newTracking, setNewTracking] = useState("");
  const [scanInput, setScanInput] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "history" | "settings"
  >("overview");

  // Password protection for settings
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Default admin password (in production, this should be environment variable)
  const ADMIN_PASSWORD = "admin123";

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const showNotification = (
    message: string,
    type: "success" | "error" | "warning" | "info" = "info",
  ) => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => setNotification(""), 5000);
  };

  const addPackage = () => {
    if (!newTracking.trim()) return;

    if (expectedPackages.includes(newTracking.trim())) {
      showNotification("Package already exists!", "warning");
      return;
    }

    setExpectedPackages((prev) => [...prev, newTracking.trim()]);
    addLog(`✅ Added expected package: ${newTracking}`);
    setNewTracking("");
    showNotification("Package added successfully!", "success");
  };

  const removePackage = (tracking: string) => {
    setExpectedPackages((prev) => prev.filter((pkg) => pkg !== tracking));
    addLog(`🗑️ Removed package: ${tracking}`);
  };

  const clearAllPackages = () => {
    setExpectedPackages([]);
    addLog("🗑️ Cleared all expected packages");
    showNotification("All packages cleared!", "info");
  };

  const simulateScan = async () => {
    if (!scanInput.trim() || isScanning) return;

    setIsScanning(true);
    addLog(`📷 Scanning: ${scanInput}`);

    // Simulate scanning delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const trackingExists = expectedPackages.includes(scanInput.trim());

    if (trackingExists) {
      // Successful delivery
      setIsLocked(false);
      setExpectedPackages((prev) =>
        prev.filter((pkg) => pkg !== scanInput.trim()),
      );
      setDeliveredPackages((prev) => [
        ...prev,
        {
          tracking: scanInput.trim(),
          timestamp: new Date().toLocaleString(),
        },
      ]);

      addLog(`✅ Package delivered: ${scanInput}`);
      addLog("🔓 Box unlocked");
      showNotification("Package delivered successfully!", "success");

      // Auto-lock after 5 seconds
      setTimeout(() => {
        setIsLocked(true);
        addLog("🔒 Box automatically locked");
      }, 5000);
    } else {
      // Failed delivery
      setFailedDeliveries((prev) => [
        ...prev,
        {
          tracking: scanInput.trim(),
          reason: "Invalid tracking number",
          timestamp: new Date().toLocaleString(),
        },
      ]);

      addLog(`❌ Access denied: ${scanInput}`);
      showNotification("Unauthorized delivery attempt!", "error");
    }

    setIsScanning(false);
    setScanInput("");
  };

  const resetSystem = () => {
    setExpectedPackages([]);
    setDeliveredPackages([]);
    setFailedDeliveries([]);
    setIsLocked(true);
    setIsScanning(false);
    setLogs([]);
    setNotification("");
    setScanInput("");
    setNewTracking("");
    addLog("🔄 System reset complete");
    showNotification("System reset complete!", "info");
  };

  const saveTelegramSettings = () => {
    if (!telegramSettings.botToken.trim() || !telegramSettings.chatId.trim()) {
      showNotification("Please fill in all Telegram settings", "warning");
      return;
    }
    addLog("📱 Telegram settings saved");
    showNotification("Telegram bot configured!", "success");
  };

  const handleTabClick = (tabId: "overview" | "history" | "settings") => {
    if (tabId === "settings") {
      if (!isAuthenticated) {
        setShowPasswordModal(true);
        return;
      }
    }
    setActiveTab(tabId);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setActiveTab("settings");
      setShowPasswordModal(false);
      setPasswordInput("");
      setPasswordError("");
      addLog("🔐 Admin authenticated for settings access");
      showNotification("Access granted to settings", "success");
    } else {
      setPasswordError("Incorrect password. Please try again.");
      setPasswordInput("");
      addLog("🚫 Failed authentication attempt");
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPasswordInput("");
    setPasswordError("");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab("overview");
    addLog("🚪 Admin logged out from settings");
    showNotification("Logged out from settings", "info");
  };

  return (
    <div className={styles.container}>
      {/* Animated background elements */}
      <div className={styles.backgroundOrbs}>
        <div className={styles.orb1}></div>
        <div className={styles.orb2}></div>
        <div className={styles.orb3}></div>
      </div>

      <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <Package className={styles.logoIcon} />
          </div>
          <h1 className={styles.title}>Smart Resi Box</h1>
          <p className={styles.subtitle}>
            Next-Generation Package Delivery System
          </p>

          {/* Status Bar */}
          <div className={styles.statusBar}>
            <div className={styles.statusItem}>
              <div
                className={`${styles.statusDot} ${isLocked ? styles.locked : styles.unlocked}`}
              ></div>
              <span>{isLocked ? "Secured" : "Unlocked"}</span>
            </div>
            <div className={styles.statusItem}>
              <Activity className={styles.statusIcon} />
              <span>Online</span>
            </div>
            <div className={styles.statusItem}>
              <Shield className={styles.statusIcon} />
              <span>Protected</span>
            </div>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`${styles.notification} ${styles[notificationType]}`}>
            <div className={styles.notificationContent}>
              {notificationType === "success" && (
                <CheckCircle className={styles.notificationIcon} />
              )}
              {notificationType === "error" && (
                <XCircle className={styles.notificationIcon} />
              )}
              {notificationType === "warning" && (
                <AlertTriangle className={styles.notificationIcon} />
              )}
              {notificationType === "info" && (
                <Bell className={styles.notificationIcon} />
              )}
              <span>{notification}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className={styles.tabNavigation}>
          <div className={styles.tabContainer}>
            {[
              { id: "overview", label: "Overview", icon: Monitor },
              { id: "history", label: "History", icon: Clock },
              { id: "settings", label: "Settings", icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleTabClick(id as any)}
                className={`${styles.tab} ${activeTab === id ? styles.activeTab : ""}`}
              >
                <Icon className={styles.tabIcon} />
                {label}
                {id === "settings" && isAuthenticated && (
                  <div className={styles.authenticatedIndicator}></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className={styles.overviewGrid}>
            {/* Statistics Cards */}
            <div className={styles.statsSection}>
              <div className={styles.statsGrid}>
                <div className={`${styles.statCard} ${styles.expectedStat}`}>
                  <div className={styles.statValue}>
                    {expectedPackages.length}
                  </div>
                  <div className={styles.statLabel}>Expected</div>
                </div>
                <div className={`${styles.statCard} ${styles.deliveredStat}`}>
                  <div className={styles.statValue}>
                    {deliveredPackages.length}
                  </div>
                  <div className={styles.statLabel}>Delivered</div>
                </div>
                <div className={`${styles.statCard} ${styles.failedStat}`}>
                  <div className={styles.statValue}>
                    {failedDeliveries.length}
                  </div>
                  <div className={styles.statLabel}>Failed</div>
                </div>
              </div>
            </div>

            {/* Smart Box Panel */}
            <div className={styles.smartBoxPanel}>
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div className={styles.panelIcon}>
                    <Package className={styles.icon} />
                  </div>
                  <h2>Smart Box</h2>
                </div>

                {/* Box Visual */}
                <div className={styles.boxVisual}>
                  <div className={styles.boxContainer}>
                    {/* Camera */}
                    <div
                      className={`${styles.camera} ${isScanning ? styles.cameraScanning : ""}`}
                    >
                      <Camera className={styles.cameraIcon} />
                    </div>

                    {/* Lock Status */}
                    <div
                      className={`${styles.lockStatus} ${isLocked ? styles.locked : styles.unlocked}`}
                    >
                      {isLocked ? (
                        <Lock className={styles.lockIcon} />
                      ) : (
                        <Unlock className={styles.lockIcon} />
                      )}
                    </div>

                    <div className={styles.statusText}>
                      <p>Box Status</p>
                      <p
                        className={`${styles.statusValue} ${isLocked ? styles.lockedText : styles.unlockedText}`}
                      >
                        {isLocked ? "SECURED" : "UNLOCKED"}
                      </p>
                    </div>

                    {/* Scanning animation overlay */}
                    {isScanning && (
                      <div className={styles.scanningOverlay}></div>
                    )}
                  </div>
                </div>

                {/* Scan Controls */}
                <div className={styles.scanSection}>
                  <label className={styles.label}>Scan Package</label>
                  <div className={styles.inputGroup}>
                    <input
                      type="text"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && simulateScan()}
                      placeholder="Enter tracking number to scan..."
                      disabled={isScanning}
                      className={`${styles.input} ${isScanning ? styles.disabled : ""}`}
                    />
                    <button
                      onClick={simulateScan}
                      disabled={isScanning || !scanInput.trim()}
                      className={`${styles.button} ${styles.scanButton} ${isScanning || !scanInput.trim() ? styles.disabled : ""}`}
                    >
                      {isScanning ? (
                        <>
                          <Eye
                            className={`${styles.buttonIcon} ${styles.scanning}`}
                          />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Scan className={styles.buttonIcon} />
                          Scan
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* System Monitor Panel */}
            <div className={styles.monitorPanel}>
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <div className={styles.panelIcon}>
                    <Monitor className={styles.icon} />
                  </div>
                  <h2>System Monitor</h2>
                </div>

                {/* Activity Log */}
                <div className={styles.activitySection}>
                  <h3>Recent Activity</h3>
                  <div className={styles.activityLog}>
                    {logs.length === 0 ? (
                      <div className={styles.emptyState}>
                        <Activity className={styles.emptyIcon} />
                        <p>No activity yet</p>
                      </div>
                    ) : (
                      <div className={styles.logContainer}>
                        {logs
                          .slice(-20)
                          .reverse()
                          .map((log, index) => (
                            <div key={index} className={styles.logEntry}>
                              {log}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reset Button */}
                <button
                  onClick={resetSystem}
                  className={`${styles.button} ${styles.resetButton}`}
                >
                  <RotateCcw className={styles.buttonIcon} />
                  Reset System
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className={styles.historyGrid}>
            {/* Successful Deliveries */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelIcon}>
                  <CheckCircle className={styles.icon} />
                </div>
                <h2>Successful Deliveries</h2>
              </div>

              <div className={styles.historyList}>
                {deliveredPackages.length === 0 ? (
                  <div className={styles.emptyState}>
                    <Package className={styles.emptyIcon} />
                    <p>No deliveries yet</p>
                  </div>
                ) : (
                  deliveredPackages.map((delivery, index) => (
                    <div
                      key={index}
                      className={`${styles.historyItem} ${styles.success}`}
                    >
                      <div className={styles.historyContent}>
                        <div className={styles.trackingNumber}>
                          {delivery.tracking}
                        </div>
                        <div className={styles.timestamp}>
                          {delivery.timestamp}
                        </div>
                      </div>
                      <CheckCircle className={styles.historyIcon} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Failed Attempts */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelIcon}>
                  <XCircle className={styles.icon} />
                </div>
                <h2>Failed Attempts</h2>
              </div>

              <div className={styles.historyList}>
                {failedDeliveries.length === 0 ? (
                  <div className={styles.emptyState}>
                    <Shield className={styles.emptyIcon} />
                    <p>No failed attempts</p>
                  </div>
                ) : (
                  failedDeliveries.map((failed, index) => (
                    <div
                      key={index}
                      className={`${styles.historyItem} ${styles.error}`}
                    >
                      <div className={styles.historyContent}>
                        <div className={styles.trackingNumber}>
                          {failed.tracking}
                        </div>
                        <div className={styles.reason}>{failed.reason}</div>
                        <div className={styles.timestamp}>
                          {failed.timestamp}
                        </div>
                      </div>
                      <XCircle className={styles.historyIcon} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className={styles.settingsGrid}>
            {/* Owner Panel */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelIcon}>
                  <User className={styles.icon} />
                </div>
                <h2>Package Management</h2>
              </div>

              {/* Add Package */}
              <div className={styles.addPackageSection}>
                <label className={styles.label}>Add Expected Package</label>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    value={newTracking}
                    onChange={(e) => setNewTracking(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addPackage()}
                    placeholder="Enter tracking number..."
                    className={styles.input}
                  />
                  <button
                    onClick={addPackage}
                    className={`${styles.button} ${styles.addButton}`}
                  >
                    <Plus className={styles.buttonIcon} />
                  </button>
                </div>

                {expectedPackages.length > 0 && (
                  <button
                    onClick={clearAllPackages}
                    className={`${styles.button} ${styles.clearButton}`}
                  >
                    <Trash2 className={styles.buttonIcon} />
                    Clear All Packages
                  </button>
                )}
              </div>

              {/* Expected Packages */}
              <div className={styles.packagesSection}>
                <div className={styles.sectionHeader}>
                  <h3>Expected Packages</h3>
                  <span className={styles.badge}>
                    {expectedPackages.length}
                  </span>
                </div>

                <div className={styles.packagesList}>
                  {expectedPackages.length === 0 ? (
                    <div className={styles.emptyState}>
                      <Package className={styles.emptyIcon} />
                      <p>No packages expected</p>
                    </div>
                  ) : (
                    <div className={styles.packagesContainer}>
                      {expectedPackages.map((tracking, index) => (
                        <div key={index} className={styles.packageItem}>
                          <div className={styles.packageInfo}>
                            <Package className={styles.packageIcon} />
                            <span className={styles.trackingNumber}>
                              {tracking}
                            </span>
                          </div>
                          <button
                            onClick={() => removePackage(tracking)}
                            className={styles.removeButton}
                          >
                            <Trash2 className={styles.removeIcon} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Telegram Settings */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div className={styles.panelIcon}>
                  <Settings className={styles.icon} />
                </div>
                <h2>Telegram Bot Settings</h2>
              </div>

              <div className={styles.settingsForm}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Bot Token</label>
                  <input
                    type="text"
                    value={telegramSettings.botToken}
                    onChange={(e) =>
                      setTelegramSettings((prev) => ({
                        ...prev,
                        botToken: e.target.value,
                      }))
                    }
                    placeholder="Enter your bot token..."
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Chat ID</label>
                  <input
                    type="text"
                    value={telegramSettings.chatId}
                    onChange={(e) =>
                      setTelegramSettings((prev) => ({
                        ...prev,
                        chatId: e.target.value,
                      }))
                    }
                    placeholder="Enter your chat ID..."
                    className={styles.input}
                  />
                </div>

                <button
                  onClick={saveTelegramSettings}
                  className={`${styles.button} ${styles.saveButton}`}
                >
                  <Bell className={styles.buttonIcon} />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartResiBox;
