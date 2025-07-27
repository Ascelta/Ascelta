import { Alert as RNAlert } from 'react-native';

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface AlertOptions {
  title: string;
  message?: string;
  buttons: AlertButton[];
}

export class Alert {
  static show(options: AlertOptions): void {
    const { title, message, buttons } = options;
    const alertButtons = buttons.map((button: AlertButton) => ({
      text: button.text,
      style: button.style,
      onPress: button.onPress,
    }));

    RNAlert.alert(title, message, alertButtons);
  }
}
