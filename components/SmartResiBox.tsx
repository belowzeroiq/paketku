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

  const getNotificationIcon = () => {
    switch (notificationType) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <XCircle className="w-5 h-5" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = () => {
    switch (notificationType) {
      case "success":
        return "from-emerald-500/20 to-green-500/20 border-emerald-500/50";
      case "error":
        return "from-red-500/20 to-rose-500/20 border-red-500/50";
      case "warning":
        return "from-amber-500/20 to-yellow-500/20 border-amber-500/50";
      default:
        return "from-blue-500/20 to-indigo-500/20 border-blue-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen p-4 lg:p-8">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Smart Resi Box
            </h1>
            <p className="text-xl text-slate-400 mb-6">
              Next-Generation Package Delivery System
            </p>

            {/* Status Bar */}
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <div
                  className={`w-3 h-3 rounded-full ${isLocked ? "bg-red-500" : "bg-green-500"} animate-pulse`}
                ></div>
                <span className="text-sm text-white">
                  {isLocked ? "Secured" : "Unlocked"}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white">Online</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white">Protected</span>
              </div>
            </div>
          </div>

          {/* Notification */}
          {notification && (
            <div
              className={`mb-6 p-4 bg-gradient-to-r ${getNotificationColor()} rounded-2xl border backdrop-blur-sm animate-in slide-in-from-top duration-500`}
            >
              <div className="flex items-center gap-3 text-white">
                {getNotificationIcon()}
                <span className="font-medium">{notification}</span>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 backdrop-blur-sm">
              {[
                { id: "overview", label: "Overview", icon: Monitor },
                { id: "history", label: "History", icon: Clock },
                { id: "settings", label: "Settings", icon: Settings },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8">
              {/* Left Panel - Owner Controls */}
              <div className="xl:col-span-4 space-y-6">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Owner Panel
                    </h2>
                  </div>

                  {/* Add Package */}
                  <div className="space-y-4 mb-8">
                    <label className="block text-sm font-medium text-slate-300">
                      Add Expected Package
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={newTracking}
                        onChange={(e) => setNewTracking(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && addPackage()}
                        placeholder="Enter tracking number..."
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                      />
                      <button
                        onClick={addPackage}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>

                    {expectedPackages.length > 0 && (
                      <button
                        onClick={clearAllPackages}
                        className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-300 py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 border border-red-500/30"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear All Packages
                      </button>
                    )}
                  </div>

                  {/* Expected Packages */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Expected Packages
                      </h3>
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                        {expectedPackages.length}
                      </span>
                    </div>

                    <div className="bg-black/20 rounded-2xl p-4 max-h-64 overflow-y-auto border border-white/10">
                      {expectedPackages.length === 0 ? (
                        <div className="text-center py-8">
                          <Package className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                          <p className="text-slate-400">No packages expected</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {expectedPackages.map((tracking, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group"
                            >
                              <div className="flex items-center gap-3">
                                <Package className="w-4 h-4 text-blue-400" />
                                <span className="text-white font-mono text-sm">
                                  {tracking}
                                </span>
                              </div>
                              <button
                                onClick={() => removePackage(tracking)}
                                className="text-red-400 hover:text-red-300 p-1 opacity-0 group-hover:opacity-100 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-4 border border-blue-500/30">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-300 mb-1">
                        {expectedPackages.length}
                      </div>
                      <div className="text-xs text-blue-200">Expected</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl p-4 border border-green-500/30">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-300 mb-1">
                        {deliveredPackages.length}
                      </div>
                      <div className="text-xs text-green-200">Delivered</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-2xl p-4 border border-red-500/30">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-300 mb-1">
                        {failedDeliveries.length}
                      </div>
                      <div className="text-xs text-red-200">Failed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Panel - Smart Box */}
              <div className="xl:col-span-4">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Smart Box</h2>
                  </div>

                  {/* Box Visual */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 mb-8 text-center border border-slate-700 shadow-inner">
                    <div className="relative">
                      {/* Camera */}
                      <div
                        className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isScanning
                            ? "bg-gradient-to-r from-red-500 to-pink-600 animate-pulse shadow-lg shadow-red-500/50"
                            : "bg-gradient-to-r from-slate-600 to-slate-700 shadow-lg"
                        }`}
                      >
                        <Camera className="w-10 h-10 text-white" />
                      </div>

                      {/* Lock Status */}
                      <div
                        className={`w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isLocked
                            ? "bg-gradient-to-r from-red-500 to-rose-600 shadow-2xl shadow-red-500/50"
                            : "bg-gradient-to-r from-green-500 to-emerald-600 shadow-2xl shadow-green-500/50"
                        }`}
                      >
                        {isLocked ? (
                          <Lock className="w-12 h-12 text-white" />
                        ) : (
                          <Unlock className="w-12 h-12 text-white" />
                        )}
                      </div>

                      <div className="text-white">
                        <p className="text-lg mb-2">Box Status</p>
                        <p
                          className={`text-2xl font-bold ${isLocked ? "text-red-400" : "text-green-400"}`}
                        >
                          {isLocked ? "SECURED" : "UNLOCKED"}
                        </p>
                      </div>

                      {/* Scanning animation overlay */}
                      {isScanning && (
                        <div className="absolute inset-0 border-2 border-red-400 rounded-3xl animate-ping"></div>
                      )}
                    </div>
                  </div>

                  {/* Scan Controls */}
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-slate-300">
                      Scan Package
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={scanInput}
                        onChange={(e) => setScanInput(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && simulateScan()}
                        placeholder="Enter tracking number to scan..."
                        disabled={isScanning}
                        className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm disabled:opacity-50"
                      />
                      <button
                        onClick={simulateScan}
                        disabled={isScanning || !scanInput.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-purple-500/25 disabled:shadow-none"
                      >
                        {isScanning ? (
                          <>
                            <Eye className="w-5 h-5 animate-pulse" />
                            Scanning...
                          </>
                        ) : (
                          <>
                            <Scan className="w-5 h-5" />
                            Scan
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Activity Monitor */}
              <div className="xl:col-span-4">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      System Monitor
                    </h2>
                  </div>

                  {/* Activity Log */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Recent Activity
                    </h3>
                    <div className="bg-black/30 rounded-2xl p-4 h-64 overflow-y-auto border border-white/10">
                      {logs.length === 0 ? (
                        <div className="text-center py-8">
                          <Activity className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                          <p className="text-slate-400">No activity yet</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {logs
                            .slice(-20)
                            .reverse()
                            .map((log, index) => (
                              <div
                                key={index}
                                className="text-green-400 text-xs font-mono p-2 bg-green-500/10 rounded-lg border-l-2 border-green-500"
                              >
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
                    className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg font-medium"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset System
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Successful Deliveries */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Successful Deliveries
                  </h3>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {deliveredPackages.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">
                        No deliveries yet
                      </p>
                    </div>
                  ) : (
                    deliveredPackages.map((delivery, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-l-4 border-green-500 p-4 rounded-xl backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-mono text-lg text-white font-semibold">
                              {delivery.tracking}
                            </div>
                            <div className="text-sm text-green-300">
                              {delivery.timestamp}
                            </div>
                          </div>
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Failed Attempts */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Failed Attempts
                  </h3>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {failedDeliveries.length === 0 ? (
                    <div className="text-center py-12">
                      <Shield className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                      <p className="text-slate-400 text-lg">
                        No failed attempts
                      </p>
                    </div>
                  ) : (
                    failedDeliveries.map((failed, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-red-500/20 to-rose-500/20 border-l-4 border-red-500 p-4 rounded-xl backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-mono text-lg text-white font-semibold">
                              {failed.tracking}
                            </div>
                            <div className="text-sm text-red-300">
                              {failed.reason}
                            </div>
                            <div className="text-xs text-red-200">
                              {failed.timestamp}
                            </div>
                          </div>
                          <XCircle className="w-6 h-6 text-red-400" />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Telegram Bot Settings
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Bot Token
                    </label>
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
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Chat ID
                    </label>
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
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    />
                  </div>

                  <button
                    onClick={saveTelegramSettings}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-blue-500/25 font-medium text-lg"
                  >
                    <Bell className="w-5 h-5" />
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartResiBox;
