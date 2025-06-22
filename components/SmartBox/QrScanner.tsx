import styles from '../../styles/Home.module.css';

interface QrScannerProps {
  isScanning: boolean;
  scannedCode: string;
}

const QrScanner: React.FC<QrScannerProps> = ({ isScanning, scannedCode }) => {
  return (
    <div className={`${styles.qrScanner} ${isScanning ? styles.qrScannerScanning : ''}`}>
      <div>📱 QR/Barcode Scanner</div>
      {isScanning ? (
        <>
          <div style={{ fontSize: '12px', marginTop: '5px' }}>🔍 Scanning...</div>
          <div style={{ fontSize: '12px', marginTop: '5px' }}>{scannedCode}</div>
        </>
      ) : (
        <div style={{ fontSize: '12px', marginTop: '5px' }}>Waiting for package...</div>
      )}
    </div>
  );
};

export default QrScanner;