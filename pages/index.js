<>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Smart Resi Box Simulator</title>
  <style
    dangerouslySetInnerHTML={{
      __html:
        "\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n        }\n        \n        body {\n            font-family: 'Arial', sans-serif;\n            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);\n            min-height: 100vh;\n            padding: 20px;\n        }\n        \n        .container {\n            max-width: 1400px;\n            margin: 0 auto;\n            display: grid;\n            grid-template-columns: 1fr 1fr 1fr;\n            gap: 20px;\n            height: calc(100vh - 40px);\n        }\n        \n        .panel {\n            background: rgba(255, 255, 255, 0.1);\n            backdrop-filter: blur(10px);\n            border-radius: 15px;\n            padding: 20px;\n            border: 1px solid rgba(255, 255, 255, 0.2);\n            color: white;\n        }\n        \n        h2 {\n            color: #fff;\n            margin-bottom: 15px;\n            text-align: center;\n            font-size: 18px;\n        }\n        \n        .owner-panel {\n            display: flex;\n            flex-direction: column;\n        }\n        \n        .tracking-input {\n            background: rgba(0, 0, 0, 0.3);\n            border: 1px solid rgba(255, 255, 255, 0.3);\n            border-radius: 8px;\n            color: white;\n            padding: 10px;\n            margin-bottom: 10px;\n            font-size: 14px;\n        }\n        \n        .tracking-input::placeholder {\n            color: rgba(255, 255, 255, 0.6);\n        }\n        \n        .btn {\n            background: linear-gradient(45deg, #ff6b6b, #ff8e8e);\n            border: none;\n            color: white;\n            padding: 8px 16px;\n            border-radius: 20px;\n            cursor: pointer;\n            font-weight: bold;\n            transition: all 0.3s ease;\n            margin: 5px 0;\n            font-size: 12px;\n        }\n        \n        .btn:hover {\n            transform: translateY(-2px);\n            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);\n        }\n        \n        .btn-success {\n            background: linear-gradient(45deg, #51cf66, #69db7c);\n        }\n        \n        .btn-warning {\n            background: linear-gradient(45deg, #ffa726, #ffcc02);\n        }\n        \n        .tracking-list {\n            background: rgba(0, 0, 0, 0.3);\n            border: 1px solid rgba(255, 255, 255, 0.3);\n            border-radius: 8px;\n            padding: 10px;\n            height: 200px;\n            overflow-y: auto;\n            font-size: 12px;\n            margin-bottom: 10px;\n        }\n        \n        .tracking-item {\n            padding: 5px;\n            margin: 2px 0;\n            background: rgba(255, 255, 255, 0.1);\n            border-radius: 4px;\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n        }\n        \n        .tracking-item.delivered {\n            background: rgba(76, 175, 80, 0.3);\n        }\n        \n        .smart-box {\n            background: #2d3748;\n            border-radius: 15px;\n            padding: 20px;\n            margin: 10px 0;\n            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n            position: relative;\n            text-align: center;\n        }\n        \n        .camera {\n            width: 60px;\n            height: 60px;\n            background: linear-gradient(45deg, #333, #555);\n            border-radius: 50%;\n            margin: 10px auto;\n            position: relative;\n            border: 3px solid #666;\n        }\n        \n        .camera::after {\n            content: '📷';\n            position: absolute;\n            top: 50%;\n            left: 50%;\n            transform: translate(-50%, -50%);\n            font-size: 24px;\n        }\n        \n        .camera.scanning {\n            border-color: #ff6b6b;\n            animation: scan-pulse 1s ease-in-out infinite;\n        }\n        \n        @keyframes scan-pulse {\n            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }\n            50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 107, 107, 0); }\n        }\n        \n        .lock-status {\n            width: 80px;\n            height: 80px;\n            border-radius: 50%;\n            margin: 15px auto;\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-size: 32px;\n            transition: all 0.3s ease;\n        }\n        \n        .lock-status.locked {\n            background: linear-gradient(45deg, #e53e3e, #c53030);\n            box-shadow: 0 0 20px rgba(229, 62, 62, 0.5);\n        }\n        \n        .lock-status.unlocked {\n            background: linear-gradient(45deg, #38a169, #2f855a);\n            box-shadow: 0 0 20px rgba(56, 161, 105, 0.5);\n        }\n        \n        .qr-scanner {\n            background: rgba(0, 0, 0, 0.3);\n            border: 2px dashed rgba(255, 255, 255, 0.3);\n            border-radius: 8px;\n            padding: 20px;\n            margin: 10px 0;\n            text-align: center;\n            min-height: 100px;\n            display: flex;\n            flex-direction: column;\n            justify-content: center;\n            align-items: center;\n        }\n        \n        .qr-scanner.scanning {\n            border-color: #ff6b6b;\n            animation: border-pulse 1s ease-in-out infinite;\n        }\n        \n        @keyframes border-pulse {\n            0%, 100% { border-color: #ff6b6b; }\n            50% { border-color: #ff8e8e; }\n        }\n        \n        .status-log {\n            background: rgba(0, 0, 0, 0.3);\n            border: 1px solid rgba(255, 255, 255, 0.3);\n            border-radius: 8px;\n            color: #00ff00;\n            padding: 10px;\n            height: 200px;\n            overflow-y: auto;\n            font-family: 'Courier New', monospace;\n            font-size: 11px;\n            margin-top: 10px;\n        }\n        \n        .notification {\n            background: rgba(255, 193, 7, 0.2);\n            border: 1px solid rgba(255, 193, 7, 0.5);\n            border-radius: 8px;\n            padding: 10px;\n            margin: 10px 0;\n            font-size: 12px;\n            text-align: center;\n        }\n        \n        .scan-input {\n            display: flex;\n            gap: 10px;\n            margin: 10px 0;\n        }\n        \n        .scan-input input {\n            flex: 1;\n            background: rgba(0, 0, 0, 0.3);\n            border: 1px solid rgba(255, 255, 255, 0.3);\n            border-radius: 8px;\n            color: white;\n            padding: 8px;\n            font-size: 12px;\n        }\n        \n        .scan-input input::placeholder {\n            color: rgba(255, 255, 255, 0.6);\n        }\n        \n        .delivery-history {\n            background: rgba(0, 0, 0, 0.3);\n            border: 1px solid rgba(255, 255, 255, 0.3);\n            border-radius: 8px;\n            padding: 10px;\n            height: 150px;\n            overflow-y: auto;\n            font-size: 11px;\n            margin-top: 10px;\n        }\n        \n        .history-item {\n            padding: 5px;\n            margin: 2px 0;\n            background: rgba(76, 175, 80, 0.2);\n            border-radius: 4px;\n            border-left: 3px solid #4caf50;\n        }\n        \n        .history-item.failed {\n            background: rgba(244, 67, 54, 0.2);\n            border-left: 3px solid #f44336;\n        }\n    "
    }}
  />
  <div className="container">
    {/* Owner Panel */}
    <div className="panel owner-panel">
      <h2>📱 Owner Interface</h2>
      <input
        type="text"
        className="tracking-input"
        id="newTracking"
        placeholder="Enter tracking number..."
      />
      <button className="btn btn-success" onclick="addTracking()">
        ➕ Add Expected Package
      </button>
      <h3 style={{ marginTop: 15, fontSize: 14 }}>Expected Packages:</h3>
      <div className="tracking-list" id="trackingList" />
      <button className="btn btn-warning" onclick="clearAllTracking()">
        🗑️ Clear All
      </button>
      <h3 style={{ marginTop: 15, fontSize: 14 }}>Telegram Bot Settings:</h3>
      <input
        type="text"
        className="tracking-input"
        id="botToken"
        placeholder="Bot Token (e.g., 123456:ABC-DEF...)"
        style={{ marginBottom: 5 }}
      />
      <input
        type="text"
        className="tracking-input"
        id="chatId"
        placeholder="Chat ID (e.g., 123456789)"
        style={{ marginBottom: 10 }}
      />
      <button className="btn btn-success" onclick="saveTelegramSettings()">
        💾 Save Settings
      </button>
      <button className="btn" onclick="testTelegramBot()">
        📱 Test Bot
      </button>
      <div
        className="notification"
        id="ownerNotification"
        style={{ display: "none" }}
      />
      <h3 style={{ marginTop: 15, fontSize: 14 }}>Delivery History:</h3>
      <div className="delivery-history" id="deliveryHistory" />
      <h3 style={{ marginTop: 15, fontSize: 14 }}>
        Failed/Unauthorized Attempts:
      </h3>
      <div className="delivery-history" id="failedHistory" />
    </div>
    {/* Smart Box Panel */}
    <div className="panel">
      <h2>📦 Smart Resi Box</h2>
      <div className="smart-box">
        <div className="camera" id="camera" />
        <div className="qr-scanner" id="qrScanner">
          <div>📱 QR/Barcode Scanner</div>
          <div style={{ fontSize: 12, marginTop: 5 }}>
            Waiting for package...
          </div>
        </div>
        <div className="scan-input">
          <input
            type="text"
            id="scanInput"
            placeholder="Simulate QR/Barcode scan..."
          />
          <button className="btn" onclick="simulateScan()">
            🔍 Scan
          </button>
        </div>
        <div className="lock-status locked" id="lockStatus">
          🔒
        </div>
        <div style={{ fontSize: 12, marginTop: 5 }}>
          Box Status: <span id="boxStatus">LOCKED</span>
        </div>
      </div>
      <div className="status-log" id="statusLog" />
    </div>
    {/* System Monitor Panel */}
    <div className="panel">
      <h2>🖥️ System Monitor</h2>
      <div
        style={{
          background: "rgba(0, 0, 0, 0.3)",
          padding: 15,
          borderRadius: 8,
          marginBottom: 15
        }}
      >
        <div style={{ fontSize: 14, marginBottom: 10 }}>
          <strong>System Status:</strong>
        </div>
        <div id="systemStatus" style={{ fontSize: 12, color: "#00ff00" }}>
          ● ONLINE - Waiting for packages
        </div>
        <div style={{ fontSize: 12, marginTop: 5 }}>
          Camera: <span id="cameraStatus">Ready</span>
        </div>
        <div style={{ fontSize: 12 }}>
          Database: <span id="dbStatus">Connected</span>
        </div>
        <div style={{ fontSize: 12 }}>
          WiFi: <span id="wifiStatus">Connected</span>
        </div>
        <div style={{ fontSize: 12 }}>
          Telegram Bot: <span id="telegramStatus">Not configured</span>
        </div>
      </div>
      <div
        style={{
          background: "rgba(0, 0, 0, 0.3)",
          padding: 15,
          borderRadius: 8,
          marginBottom: 15
        }}
      >
        <div style={{ fontSize: 14, marginBottom: 10 }}>
          <strong>Statistics:</strong>
        </div>
        <div style={{ fontSize: 12 }}>
          Expected: <span id="expectedCount">0</span>
        </div>
        <div style={{ fontSize: 12 }}>
          Delivered: <span id="deliveredCount">0</span>
        </div>
        <div style={{ fontSize: 12 }}>
          Rejected: <span id="rejectedCount">0</span>
        </div>
      </div>
      <button className="btn" onclick="resetSystem()">
        🔄 Reset System
      </button>
      <button className="btn" onclick="testNotification()">
        📲 Test Notification
      </button>
    </div>
  </div>
</>
