import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { ErrorCode, MediaType, OptionsCommon, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { View } from 'tamagui';
import { Alert } from '@core/presentation/components/alerts';

type Source = 'camera' | 'library';

type Props = {
  source: Source;
  mediaType: MediaType;
  onSelect: (mediaPaths: Array<string>) => void;
  disabled?: boolean;
  selectionLimit: number;
} & React.PropsWithChildren;

const defaultOptions: Partial<OptionsCommon> = {
  quality: 0.7,
  maxWidth: 1200,
  maxHeight: 1200,
};

export const MediaPicker: React.FC<Props> = ({ source, mediaType, onSelect, disabled = false, selectionLimit, children }) => {
  const { t } = useTranslation();

  const selectMedia = async () => {
    switch (source) {
      case 'camera':
        return await launchCamera({
          ...defaultOptions,
          mediaType,
          presentationStyle: 'fullScreen',
        });
      case 'library':
        return await launchImageLibrary({
          ...defaultOptions,
          mediaType,
          selectionLimit,
        });
      default:
        throw new Error(`Unsupported source: ${source}`);
    }
  };

  const getErrorTitle = (errorCode: ErrorCode): string => {
    switch (errorCode) {
      case 'camera_unavailable':
        return t('MEDIA_PICKER_ERROR_CAMERA_UNAVAILABLE_TITLE');
      case 'permission':
        return t('MEDIA_PICKER_ERROR_PERMISSION_TITLE');
      case 'others':
        return t('MEDIA_PICKER_ERROR_OTHERS_TITLE');
      default:
        return t('MEDIA_PICKER_ERROR_OTHERS_TITLE');
    }
  };

  const getErrorDescription = (errorCode: ErrorCode): string => {
    switch (errorCode) {
      case 'camera_unavailable':
        return t('MEDIA_PICKER_ERROR_CAMERA_UNAVAILABLE_DESCRIPTION');
      case 'permission':
        switch (source) {
          case 'camera':
            return t('MEDIA_PICKER_ERROR_PERMISSION_CAMERA_DESCRIPTION');
          case 'library':
            return t('MEDIA_PICKER_ERROR_PERMISSION_LIBRARY_DESCRIPTION');
          default:
            throw new Error(`Unimplemented source: ${source}`);
        }
      case 'others':
        return t('MEDIA_PICKER_ERROR_OTHERS_DESCRIPTION');
      default:
        return t('MEDIA_PICKER_ERROR_OTHERS_DESCRIPTION');
    }
  };

  const showErrorAlert = (errorCode: ErrorCode) => {
    const title = getErrorTitle(errorCode);
    const message = getErrorDescription(errorCode);

    switch (errorCode) {
      case 'camera_unavailable':
      case 'others':
        Alert.show({
          title,
          message,
          buttons: [{ text: t('OK'), style: 'default' }],
        });
        break;
      case 'permission':
        Alert.show({
          title,
          message,
          buttons: [
            { text: t('CANCEL'), style: 'cancel' },
            { text: t('OPEN_SETTINGS'), style: 'default', onPress: Linking.openSettings },
          ],
        });
        break;
    }
  };

  const onPress = async () => {
    try {
      const { didCancel, errorCode, assets } = await selectMedia();
      if (didCancel) {
        return;
      }
      if (errorCode) {
        showErrorAlert(errorCode);
        return;
      }
      const mediaPaths = assets?.map(asset => asset.uri).filter((uri): uri is string => uri !== undefined) ?? [];
      if (mediaPaths.length > 0) {
        onSelect(mediaPaths);
      }
    } catch (error) {
      console.error('Error selecting media:', error);
      showErrorAlert('others');
    }
  };

  return (
    <>
      <View onPress={onPress} disabled={disabled}>
        {children}
      </View>
    </>
  );
};
