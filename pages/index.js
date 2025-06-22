import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "/script.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Arial', sans-serif;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          min-height: 100vh; padding: 20px;
        }
        .container { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; height: calc(100vh - 40px); }
        .panel { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius: 15px; padding: 20px; border: 1px solid rgba(255,255,255,0.2); color: white; }
        h2 { color: #fff; margin-bottom: 15px; text-align: center; font-size: 18px; }
        .owner-panel { display: flex; flex-direction: column; }
        .tracking-input { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; color: white; padding: 10px; margin-bottom: 10px; font-size: 14px; }
        .btn { background: linear-gradient(45deg, #ff6b6b, #ff8e8e); border: none; color: white; padding: 8px 16px; border-radius: 20px; cursor: pointer; font-weight: bold; transition: all 0.3s ease; margin: 5px 0; font-size: 12px; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .btn-success { background: linear-gradient(45deg, #51cf66, #69db7c); }
        .btn-warning { background: linear-gradient(45deg, #ffa726, #ffcc02); }
        .tracking-list, .status-log, .delivery-history { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 10px; overflow-y: auto; font-size: 12px; margin-bottom: 10px; }
        .tracking-item { padding: 5px; margin: 2px 0; background: rgba(255,255,255,0.1); border-radius: 4px; display: flex; justify-content: space-between; align-items: center; }
        .tracking-item.delivered { background: rgba(76, 175, 80, 0.3); }
        .smart-box { background: #2d3748; border-radius: 15px; padding: 20px; margin: 10px 0; box-shadow: 0 10px 30px rgba(0,0,0,0.5); position: relative; text-align: center; }
        .camera { width: 60px; height: 60px; background: linear-gradient(45deg, #333, #555); border-radius: 50%; margin: 10px auto; position: relative; border: 3px solid #666; }
        .camera::after { content: '📷'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 24px; }
        .camera.scanning { border-color: #ff6b6b; animation: scan-pulse 1s ease-in-out infinite; }
        @keyframes scan-pulse { 0%,100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,107,107,0.7); } 50% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255,107,107,0); } }
        .lock-status { width: 80px; height: 80px; border-radius: 50%; margin: 15px auto; display: flex; align-items: center; justify-content: center; font-size: 32px; transition: all 0.3s ease; }
        .lock-status.locked { background: linear-gradient(45deg, #e53e3e, #c53030); box-shadow: 0 0 20px rgba(229,62,62,0.5); }
        .lock-status.unlocked { background: linear-gradient(45deg, #38a169, #2f855a); box-shadow: 0 0 20px rgba(56,161,105,0.5); }
        .qr-scanner { background: rgba(0,0,0,0.3); border: 2px dashed rgba(255,255,255,0.3); border-radius: 8px; padding: 20px; margin: 10px 0; text-align: center; min-height: 100px; display: flex; flex-direction: column; justify-content: center; align-items: center; }
        .notification { background: rgba(255,193,7,0.2); border: 1px solid rgba(255,193,7,0.5); border-radius: 8px; padding: 10px; margin: 10px 0; font-size: 12px; text-align: center; }
      `}</style>
      <div className="container">
        <div className="panel owner-panel">
          <h2>📱 Owner Interface</h2>
          <input type="text" className="tracking-input" id="newTracking" placeholder="Enter tracking number..." />
          <button className="btn btn-success" onClick={() => {}}>➕ Add Expected Package</button>
          <h3 style={{marginTop: '15px', fontSize: '14px'}}>Expected Packages:</h3>
          <div className="tracking-list" id="trackingList"></div>
          <button className="btn btn-warning" onClick={() => {}}>🗑️ Clear All</button>
          <h3 style={{marginTop: '15px', fontSize: '14px'}}>Telegram Bot Settings:</h3>
          <input type="text" className="tracking-input" id="botToken" placeholder="Bot Token..." style={{marginBottom: '5px'}} />
          <input type="text" className="tracking-input" id="chatId" placeholder="Chat ID..." style={{marginBottom: '10px'}} />
          <button className="btn btn-success" onClick={() => {}}>💾 Save Settings</button>
          <button className="btn" onClick={() => {}}>📱 Test Bot</button>
          <div className="notification" id="ownerNotification" style={{display: 'none'}}></div>
          <h3 style={{marginTop: '15px', fontSize: '14px'}}>Delivery History:</h3>
          <div className="delivery-history" id="deliveryHistory"></div>
          <h3 style={{marginTop: '15px', fontSize: '14px'}}>Failed/Unauthorized Attempts:</h3>
          <div className="delivery-history" id="failedHistory"></div>
        </div>
        <div className="panel">
          <h2>📦 Smart Resi Box</h2>
          <div className="smart-box">
            <div className="camera" id="camera"></div>
            <div className="qr-scanner" id="qrScanner">
              <div>📱 QR/Barcode Scanner</div>
              <div style={{fontSize: '12px', marginTop: '5px'}}>Waiting for package...</div>
            </div>
            <div className="scan-input">
              <input type="text" id="scanInput" placeholder="Simulate QR/Barcode scan..." />
              <button className="btn" onClick={() => {}}>🔍 Scan</button>
            </div>
            <div className="lock-status locked" id="lockStatus">🔒</div>
            <div style={{fontSize: '12px', marginTop: '5px'}}>Box Status: <span id="boxStatus">LOCKED</span></div>
          </div>
          <div className="status-log" id="statusLog"></div>
        </div>
        <div className="panel">
          <h2>🖥️ System Monitor</h2>
          <div style={{background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', marginBottom: '15px'}}>
            <div style={{fontSize: '14px', marginBottom: '10px'}}><strong>System Status:</strong></div>
            <div id="systemStatus" style={{fontSize: '12px', color: '#00ff00'}}>● ONLINE - Waiting for packages</div>
            <div style={{fontSize: '12px', marginTop: '5px'}}>Camera: <span id="cameraStatus">Ready</span></div>
            <div style={{fontSize: '12px'}}>Database: <span id="dbStatus">Connected</span></div>
            <div style={{fontSize: '12px'}}>WiFi: <span id="wifiStatus">Connected</span></div>
            <div style={{fontSize: '12px'}}>Telegram Bot: <span id="telegramStatus">Not configured</span></div>
          </div>
          <button className="btn" onClick={() => {}}>🔄 Reset System</button>
          <button className="btn" onClick={() => {}}>📲 Test Notification</button>
        </div>
      </div>
    </>
  )
}
