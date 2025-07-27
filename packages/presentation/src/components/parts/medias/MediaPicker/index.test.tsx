import React from 'react';
import { Linking } from 'react-native';
import { ErrorCode, ImagePickerResponse } from 'react-native-image-picker';
import { defaultConfig } from '@tamagui/config/v4';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { TamaguiProvider, Text, createTamagui } from 'tamagui';
import { MediaPicker } from '@core/presentation/components/parts/medias/MediaPicker/index.tsx';


// Mocks
const mockLaunchCamera = jest.fn();
const mockLaunchImageLibrary = jest.fn();
jest.mock('react-native-image-picker', () => {
  return {
    launchCamera: mockLaunchCamera,
    launchImageLibrary: mockLaunchImageLibrary,
  };
});

// Alert mock
const mockAlertShow = jest.fn();
jest.mock('@core/presentation/components/alerts', () => ({
  Alert: {
    show: mockAlertShow,
  },
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
}));

describe('MediaPicker', () => {
  const testButton = 'Test Button';
  const config = createTamagui(defaultConfig);
  const mockOnSelect = jest.fn();
  const defaultProps = {
    source: 'camera' as const,
    mediaType: 'photo' as const,
    onSelect: mockOnSelect,
    selectionLimit: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <TamaguiProvider config={config}>
        <MediaPicker {...defaultProps} {...props}>
          <Text>{testButton}</Text>
        </MediaPicker>
      </TamaguiProvider>,
    );
  };

  describe('正常系', () => {
    describe('カメラからの画像選択', () => {
      it('カメラから画像を選択して onSelect が正しく呼ばれること', async () => {
        const mockResponse: ImagePickerResponse = {
          assets: [{ uri: 'file://image1.jpg' }, { uri: 'file://image2.jpg' }],
        };
        mockLaunchCamera.mockResolvedValue(mockResponse);

        renderComponent();

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockLaunchCamera).toHaveBeenCalledTimes(1);
          expect(mockLaunchCamera).toHaveBeenCalledWith({
            quality: 0.7,
            maxWidth: 1200,
            maxHeight: 1200,
            mediaType: 'photo',
          });
          expect(mockOnSelect).toHaveBeenCalledTimes(1);
          expect(mockOnSelect).toHaveBeenCalledWith(['file://image1.jpg', 'file://image2.jpg']);
        });
      });

      it('カメラから単一画像を選択して onSelect が正しく呼ばれること', async () => {
        const mockResponse: ImagePickerResponse = {
          assets: [{ uri: 'file://single-image.jpg' }],
        };
        mockLaunchCamera.mockResolvedValue(mockResponse);

        renderComponent();

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockOnSelect).toHaveBeenCalledWith(['file://single-image.jpg']);
        });
      });
    });

    describe('ライブラリからの画像選択', () => {
      it('ライブラリから画像を選択して onSelect が正しく呼ばれること', async () => {
        const mockResponse: ImagePickerResponse = {
          assets: [{ uri: 'file://library1.jpg' }, { uri: 'file://library2.jpg' }],
        };
        mockLaunchImageLibrary.mockResolvedValue(mockResponse);

        renderComponent({ source: 'library' });

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockLaunchImageLibrary).toHaveBeenCalledTimes(1);
          expect(mockLaunchImageLibrary).toHaveBeenCalledWith({
            quality: 0.7,
            maxWidth: 1200,
            maxHeight: 1200,
            mediaType: 'photo',
            selectionLimit: 5,
          });
          expect(mockOnSelect).toHaveBeenCalledWith(['file://library1.jpg', 'file://library2.jpg']);
        });
      });

      it('selectionLimit が正しく適用されること', async () => {
        const mockResponse: ImagePickerResponse = {
          assets: [{ uri: 'file://image.jpg' }],
        };
        mockLaunchImageLibrary.mockResolvedValue(mockResponse);

        renderComponent({ source: 'library', selectionLimit: 10 });

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockLaunchImageLibrary).toHaveBeenCalledWith(
            expect.objectContaining({
              selectionLimit: 10,
            }),
          );
        });
      });
    });

    describe('ユーザーキャンセル', () => {
      it('ユーザーがキャンセルした場合 onSelect が呼ばれないこと', async () => {
        const mockResponse: ImagePickerResponse = {
          didCancel: true,
        };
        mockLaunchCamera.mockResolvedValue(mockResponse);

        renderComponent();

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockLaunchCamera).toHaveBeenCalledTimes(1);
        });

        expect(mockOnSelect).not.toHaveBeenCalled();
      });
    });

    describe('レンダリング', () => {
      it('children が正しくレンダリングされること', () => {
        renderComponent();
        expect(screen.getByText('Test Button')).toBeTruthy();
      });
    });
  });

  describe('準正常系', () => {
    describe('disabled状態', () => {
      it('disabled が true の時に onPress が呼ばれないこと', async () => {
        renderComponent({ disabled: true });

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        // 少し待ってからアサーション
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(mockLaunchCamera).not.toHaveBeenCalled();
        expect(mockOnSelect).not.toHaveBeenCalled();
      });
    });

    describe('空の assets', () => {
      it('assets が空配列の場合 onSelect が呼ばれないこと', async () => {
        const mockResponse: ImagePickerResponse = {
          assets: [],
        };
        mockLaunchCamera.mockResolvedValue(mockResponse);

        renderComponent();

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockLaunchCamera).toHaveBeenCalledTimes(1);
        });

        expect(mockOnSelect).not.toHaveBeenCalled();
      });

      it('assets が undefined の場合 onSelect が呼ばれないこと', async () => {
        const mockResponse: ImagePickerResponse = {
          assets: undefined,
        };
        mockLaunchCamera.mockResolvedValue(mockResponse);

        renderComponent();

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockLaunchCamera).toHaveBeenCalledTimes(1);
        });

        expect(mockOnSelect).not.toHaveBeenCalled();
      });
    });

    describe('uri が undefined の assets', () => {
      it('一部の asset.uri が undefined の場合、有効な uri のみが onSelect に渡されること', async () => {
        const mockResponse: ImagePickerResponse = {
          assets: [{ uri: 'file://valid-image1.jpg' }, { uri: undefined }, { uri: 'file://valid-image2.jpg' }, { uri: undefined }],
        };
        mockLaunchCamera.mockResolvedValue(mockResponse);

        renderComponent();

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockOnSelect).toHaveBeenCalledWith(['file://valid-image1.jpg', 'file://valid-image2.jpg']);
        });
      });

      it('すべての asset.uri が undefined の場合 onSelect が呼ばれないこと', async () => {
        const mockResponse: ImagePickerResponse = {
          assets: [{ uri: undefined }, { uri: undefined }],
        };
        mockLaunchCamera.mockResolvedValue(mockResponse);

        renderComponent();

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockLaunchCamera).toHaveBeenCalledTimes(1);
        });

        expect(mockOnSelect).not.toHaveBeenCalled();
      });
    });
  });

  describe('異常系', () => {
    describe('権限エラー (permission)', () => {
      it('カメラソースで権限エラーが発生した場合、エラーダイアログが表示されること', async () => {
        const mockResponse: ImagePickerResponse = {
          errorCode: 'permission' as ErrorCode,
        };
        mockLaunchCamera.mockResolvedValue(mockResponse);

        renderComponent({ source: 'camera' });

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockAlertShow).toHaveBeenCalledWith({
            title: 'MEDIA_PICKER_ERROR_PERMISSION_TITLE',
            message: 'MEDIA_PICKER_ERROR_PERMISSION_CAMERA_DESCRIPTION',
            buttons: [
              { text: 'CANCEL', style: 'cancel' },
              { text: 'OPEN_SETTINGS', style: 'default', onPress: Linking.openSettings },
            ],
          });
        });

        expect(mockOnSelect).not.toHaveBeenCalled();
      });

      it('ライブラリソースで権限エラーが発生した場合、エラーダイアログが表示されること', async () => {
        const mockResponse: ImagePickerResponse = {
          errorCode: 'permission' as ErrorCode,
        };
        mockLaunchImageLibrary.mockResolvedValue(mockResponse);

        renderComponent({ source: 'library' });

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockAlertShow).toHaveBeenCalledWith({
            title: 'MEDIA_PICKER_ERROR_PERMISSION_TITLE',
            message: 'MEDIA_PICKER_ERROR_PERMISSION_LIBRARY_DESCRIPTION',
            buttons: [
              { text: 'CANCEL', style: 'cancel' },
              { text: 'OPEN_SETTINGS', style: 'default', onPress: Linking.openSettings },
            ],
          });
        });
      });

      it('設定ボタンのコールバックで Linking.openSettings が呼ばれること', async () => {
        const mockResponse: ImagePickerResponse = {
          errorCode: 'permission' as ErrorCode,
        };
        mockLaunchCamera.mockResolvedValue(mockResponse);

        renderComponent();

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockAlertShow).toHaveBeenCalled();
        });

        // Alert.show に渡されたボタンのコールバックを確認
        const alertCall = mockAlertShow.mock.calls[0][0];
        const openSettingsButton = alertCall.buttons.find((btn: any) => btn.text === 'OPEN_SETTINGS');

        expect(openSettingsButton).toBeDefined();
        expect(openSettingsButton.onPress).toBe(Linking.openSettings);
      });
    });

    describe('カメラ利用不可エラー (camera_unavailable)', () => {
      it('カメラ利用不可エラーが発生した場合、エラーダイアログが表示されること', async () => {
        const mockResponse: ImagePickerResponse = {
          errorCode: 'camera_unavailable' as ErrorCode,
        };
        mockLaunchCamera.mockResolvedValue(mockResponse);

        renderComponent();

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockAlertShow).toHaveBeenCalledWith({
            title: 'MEDIA_PICKER_ERROR_CAMERA_UNAVAILABLE_TITLE',
            message: 'MEDIA_PICKER_ERROR_CAMERA_UNAVAILABLE_DESCRIPTION',
            buttons: [{ text: 'OK', style: 'default' }],
          });
        });

        expect(mockOnSelect).not.toHaveBeenCalled();
      });
    });

    describe('その他エラー (others)', () => {
      it('その他エラーが発生した場合、エラーダイアログが表示されること', async () => {
        const mockResponse: ImagePickerResponse = {
          errorCode: 'others' as ErrorCode,
        };
        mockLaunchCamera.mockResolvedValue(mockResponse);

        renderComponent();

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockAlertShow).toHaveBeenCalledWith({
            title: 'MEDIA_PICKER_ERROR_OTHERS_TITLE',
            message: 'MEDIA_PICKER_ERROR_OTHERS_DESCRIPTION',
            buttons: [{ text: 'OK', style: 'default' }],
          });
        });

        expect(mockOnSelect).not.toHaveBeenCalled();
      });

      it('selectMedia で例外が発生した場合、othersエラーが設定されること', async () => {
        const error = new Error('Unexpected error');
        mockLaunchCamera.mockRejectedValue(error);

        renderComponent();

        const button = screen.getByText(testButton);
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockAlertShow).toHaveBeenCalledWith({
            title: 'MEDIA_PICKER_ERROR_OTHERS_TITLE',
            message: 'MEDIA_PICKER_ERROR_OTHERS_DESCRIPTION',
            buttons: [{ text: 'OK', style: 'default' }],
          });
        });

        expect(console.error).toHaveBeenCalledWith('Error selecting media:', error);
        expect(mockOnSelect).not.toHaveBeenCalled();
      });
    });

    describe('未対応ソースエラー', () => {
      it('サポートされていないソースでエラーが発生すること', async () => {
        const invalidSource = 'invalid-source' as any;

        renderComponent({ source: invalidSource });

        const button = screen.getByText('Test Button');
        fireEvent.click(button);

        await waitFor(() => {
          expect(mockAlertShow).toHaveBeenCalledWith({
            title: 'MEDIA_PICKER_ERROR_OTHERS_TITLE',
            message: 'MEDIA_PICKER_ERROR_OTHERS_DESCRIPTION',
            buttons: [{ text: 'OK', style: 'default' }],
          });
        });

        expect(console.error).toHaveBeenCalledWith(
          'Error selecting media:',
          expect.objectContaining({
            message: 'Unsupported source: invalid-source',
          }),
        );
      });
    });

    describe('getErrorDescription のエラーケース', () => {
      it('権限エラーで未対応のソースが指定された場合にエラーが発生すること', async () => {
        // selectMedia で無効なソースによるエラーが発生するため、
        // permission エラーの処理まで到達しない
        const invalidSource = 'invalid-source' as any;
        renderComponent({ source: invalidSource });

        const button = screen.getByText('Test Button');
        fireEvent.click(button);

        await waitFor(() => {
          // 無効なソースエラーで others エラーとして処理される
          expect(mockAlertShow).toHaveBeenCalledWith({
            title: 'MEDIA_PICKER_ERROR_OTHERS_TITLE',
            message: 'MEDIA_PICKER_ERROR_OTHERS_DESCRIPTION',
            buttons: [{ text: 'OK', style: 'default' }],
          });
        });

        // selectMedia内でのエラーによりコンソールエラーが出力される
        expect(console.error).toHaveBeenCalled();
      });
    });
  });
});
