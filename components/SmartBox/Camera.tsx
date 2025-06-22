import styles from '../../styles/Home.module.css';

interface CameraProps {
  isScanning: boolean;
}

const Camera: React.FC<CameraProps> = ({ isScanning }) => {
  return (
    <div className={`${styles.camera} ${isScanning ? styles.cameraScanning : ''}`}>
      <div className={styles.cameraIcon}>📷</div>
    </div>
  );
};

export default Camera;