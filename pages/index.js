// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [newTracking, setNewTracking] = useState('');
  const [expectedPackages, setExpectedPackages] = useState([]);
  const [deliveredPackages, setDeliveredPackages] = useState([]);
  const [failedDeliveries, setFailedDeliveries] = useState([]);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [logMessages, setLogMessages] = useState([]);
  const [boxLocked, setBoxLocked] = useState(true);

  const log = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogMessages(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const addTracking = () => {
    if (newTracking && !expectedPackages.includes(newTracking)) {
      setExpectedPackages([...expectedPackages, newTracking]);
      log(`✅ Added expected package: ${newTracking}`);
      setNewTracking('');
    } else if (expectedPackages.includes(newTracking)) {
      log(`⚠️ Tracking number already exists: ${newTracking}`);
    }
  };

  const clearAllTracking = () => {
    setExpectedPackages([]);
    log('🗑️ Cleared all expected packages');
  };

  const simulateScan = () => {
    if (!newTracking) {
      log('❌ No barcode/QR code provided');
      return;
    }
    
    const scannedCode = newTracking;
    const trackingIndex = expectedPackages.indexOf(scannedCode);
    
    if (trackingIndex !== -1) {
      unlockBox(scannedCode, trackingIndex);
    } else {
      log(`❌ Invalid tracking number: ${scannedCode}`);
      setRejectedCount(rejectedCount + 1);
      setFailedDeliveries([...failedDeliveries, {
        tracking: scannedCode,
        reason: 'Tracking number not found in database',
        timestamp: new Date().toLocaleString()
      }]);
    }
  };

  const unlockBox = (tracking, index) => {
    setBoxLocked(false);
    const updatedExpected = [...expectedPackages];
    updatedExpected.splice(index, 1);
    setExpectedPackages(updatedExpected);
    setDeliveredPackages([...deliveredPackages, {
      tracking,
      timestamp: new Date().toLocaleString()
    }]);
    log('🔓 Box unlocked - courier can place package');
    setTimeout(() => setBoxLocked(true), 5000);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Smart Resi Box Simulator</h1>
      <input
        value={newTracking}
        onChange={e => setNewTracking(e.target.value)}
        placeholder="Enter tracking number..."
      />
      <button onClick={addTracking}>Add Package</button>
      <button onClick={clearAllTracking}>Clear All</button>
      <button onClick={simulateScan}>Simulate Scan</button>
      <div>
        <h2>Expected Packages:</h2>
        <ul>
          {expectedPackages.map((pkg, idx) => <li key={idx}>{pkg}</li>)}
        </ul>
      </div>
      <div>
        <h2>Delivered Packages:</h2>
        <ul>
          {deliveredPackages.map((pkg, idx) => <li key={idx}>{pkg.tracking} at {pkg.timestamp}</li>)}
        </ul>
      </div>
      <div>
        <h2>Failed Deliveries:</h2>
        <ul>
          {failedDeliveries.map((pkg, idx) => <li key={idx}>{pkg.tracking} failed because {pkg.reason}</li>)}
        </ul>
      </div>
      <div>
        <h2>Box Status: {boxLocked ? 'LOCKED' : 'UNLOCKED'}</h2>
      </div>
      <div>
        <h2>Logs:</h2>
        <pre>{logMessages.join('\n')}</pre>
      </div>
    </div>
  );
}
