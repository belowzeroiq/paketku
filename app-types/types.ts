export interface Delivery {
  tracking: string;
  timestamp: string;
}

export interface FailedDelivery {
  tracking: string;
  reason: string;
  timestamp: string;
}

export interface TelegramSettingsType {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

export interface Notification {
  message: string;
  type: 'info' | 'success' | 'warning';
  visible: boolean;
}