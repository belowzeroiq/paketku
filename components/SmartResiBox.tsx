import React, { useState, useEffect } from "react";
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
  const [telegramSettings, setTelegramSettings] = useState({
    botToken: "",
    chatId: "",
  });

  // Form states
  const [newTracking, setNewTracking] = useState("");
  const [scanInput, setScanInput] = useState("");

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 4000);
  };

  const addPackage = () => {
    if (!newTracking.trim()) return;

    if (expectedPackages.includes(newTracking.trim())) {
      showNotification("⚠️ Package already exists!");
      return;
    }

    setExpectedPackages((prev) => [...prev, newTracking.trim()]);
    addLog(`✅ Added expected package: ${newTracking}`);
    setNewTracking("");
    showNotification("📦 Package added successfully!");
  };

  const removePackage = (tracking: string) => {
    setExpectedPackages((prev) => prev.filter((pkg) => pkg !== tracking));
    addLog(`🗑️ Removed package: ${tracking}`);
  };

  const clearAllPackages = () => {
    setExpectedPackages([]);
    addLog("🗑️ Cleared all expected packages");
    showNotification("🗑️ All packages cleared!");
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
      showNotification("📦 Package delivered successfully!");

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
      showNotification("🚨 Unauthorized delivery attempt!");
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
    showNotification("🔄 System reset!");
  };

  const saveTelegramSettings = () => {
    if (!telegramSettings.botToken.trim() || !telegramSettings.chatId.trim()) {
      showNotification("❌ Please fill in all Telegram settings");
      return;
    }
    addLog("📱 Telegram settings saved");
    showNotification("✅ Telegram bot configured!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white text-center mb-8 flex items-center justify-center gap-3">
          <Package className="w-8 h-8" />
          Smart Resi Box Simulator
        </h1>

        {/* Notification */}
        {notification && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg text-white text-center animate-pulse">
            {notification}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Owner Panel */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Owner Panel
            </h2>

            {/* Add Package */}
            <div className="space-y-3 mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTracking}
                  onChange={(e) => setNewTracking(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addPackage()}
                  placeholder="Enter tracking number..."
                  className="flex-1 bg-black/30 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 text-sm"
                />
                <button
                  onClick={addPackage}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {expectedPackages.length > 0 && (
                <button
                  onClick={clearAllPackages}
                  className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            {/* Expected Packages */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white/80 mb-2">
                Expected Packages ({expectedPackages.length})
              </h3>
              <div className="bg-black/30 rounded-lg p-3 max-h-32 overflow-y-auto">
                {expectedPackages.length === 0 ? (
                  <p className="text-white/60 text-sm text-center py-2">
                    No packages expected
                  </p>
                ) : (
                  expectedPackages.map((tracking, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-white/10 rounded mb-2 last:mb-0"
                    >
                      <span className="text-white text-sm font-mono">
                        {tracking}
                      </span>
                      <button
                        onClick={() => removePackage(tracking)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Telegram Settings */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white/80">
                Telegram Bot Settings
              </h3>
              <input
                type="text"
                value={telegramSettings.botToken}
                onChange={(e) =>
                  setTelegramSettings((prev) => ({
                    ...prev,
                    botToken: e.target.value,
                  }))
                }
                placeholder="Bot Token"
                className="w-full bg-black/30 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 text-sm"
              />
              <input
                type="text"
                value={telegramSettings.chatId}
                onChange={(e) =>
                  setTelegramSettings((prev) => ({
                    ...prev,
                    chatId: e.target.value,
                  }))
                }
                placeholder="Chat ID"
                className="w-full bg-black/30 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 text-sm"
              />
              <button
                onClick={saveTelegramSettings}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Save Settings
              </button>
            </div>
          </div>

          {/* Smart Box Panel */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Smart Box
            </h2>

            {/* Box Visual */}
            <div className="bg-gray-800 rounded-xl p-6 mb-4 text-center">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isScanning ? "bg-red-500 animate-pulse" : "bg-gray-600"
                }`}
              >
                <Camera className="w-8 h-8 text-white" />
              </div>

              <div
                className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isLocked
                    ? "bg-red-500 shadow-lg shadow-red-500/50"
                    : "bg-green-500 shadow-lg shadow-green-500/50"
                }`}
              >
                {isLocked ? (
                  <Lock className="w-10 h-10 text-white" />
                ) : (
                  <Unlock className="w-10 h-10 text-white" />
                )}
              </div>

              <p className="text-white text-sm">
                Status:{" "}
                <span
                  className={`font-bold ${isLocked ? "text-red-400" : "text-green-400"}`}
                >
                  {isLocked ? "LOCKED" : "UNLOCKED"}
                </span>
              </p>
            </div>

            {/* Scan Input */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-white/80">
                Scan Package
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && simulateScan()}
                  placeholder="Enter tracking number to scan..."
                  disabled={isScanning}
                  className="flex-1 bg-black/30 border border-white/30 rounded-lg px-3 py-2 text-white placeholder-white/60 text-sm disabled:opacity-50"
                />
                <button
                  onClick={simulateScan}
                  disabled={isScanning || !scanInput.trim()}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  {isScanning ? "Scanning..." : "Scan"}
                </button>
              </div>
            </div>
          </div>

          {/* Monitor Panel */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">
              System Monitor
            </h2>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-300">
                  {expectedPackages.length}
                </div>
                <div className="text-xs text-blue-200">Expected</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-green-300">
                  {deliveredPackages.length}
                </div>
                <div className="text-xs text-green-200">Delivered</div>
              </div>
              <div className="bg-red-500/20 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-red-300">
                  {failedDeliveries.length}
                </div>
                <div className="text-xs text-red-200">Failed</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-white/80 mb-2">
                Recent Activity
              </h3>
              <div className="bg-black/30 rounded-lg p-3 h-32 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-white/60 text-sm">No activity yet</p>
                ) : (
                  logs.slice(-10).map((log, index) => (
                    <div
                      key={index}
                      className="text-green-400 text-xs mb-1 font-mono"
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetSystem}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset System
            </button>
          </div>
        </div>

        {/* Delivery History */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Successful Deliveries */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              ✅ Successful Deliveries
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {deliveredPackages.length === 0 ? (
                <p className="text-white/60 text-sm">No deliveries yet</p>
              ) : (
                deliveredPackages.map((delivery, index) => (
                  <div
                    key={index}
                    className="bg-green-500/20 border-l-4 border-green-500 p-3 rounded"
                  >
                    <div className="font-mono text-sm text-white">
                      {delivery.tracking}
                    </div>
                    <div className="text-xs text-green-300">
                      {delivery.timestamp}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Failed Attempts */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">
              ❌ Failed Attempts
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {failedDeliveries.length === 0 ? (
                <p className="text-white/60 text-sm">No failed attempts</p>
              ) : (
                failedDeliveries.map((failed, index) => (
                  <div
                    key={index}
                    className="bg-red-500/20 border-l-4 border-red-500 p-3 rounded"
                  >
                    <div className="font-mono text-sm text-white">
                      {failed.tracking}
                    </div>
                    <div className="text-xs text-red-300">{failed.reason}</div>
                    <div className="text-xs text-red-200">
                      {failed.timestamp}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartResiBox;
