import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Camera, Image, Trash, X } from '@tamagui/lucide-icons';
import { Spacer, Text, View, XStack, YStack, useTheme } from 'tamagui';
import { LoadingDialog } from '@core/presentation/components/elements/loadings/LoadingDialog';
import { useUserStore } from '@core/presentation/stores/userStore';
import { useAuth } from '@core/presentation/contexts/AuthContext';

type Props = {
  ref: React.RefObject<ActionSheetRef | null>;
};

const TRANSPARENT_COLOR = 'transparent';

export const EditProfileImageActionSheetModal: React.FC<Props> = ({ ref }) => {
  const { overlayBackground } = useTheme();
  const { t } = useTranslation();
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const updateUserProfile = useUserStore(state => state.updateUserProfile);

  const handleImagePicker = async (type: 'camera' | 'library') => {
    if (!userId) {
      return;
    }
    setIsLoading(true);
    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
      maxHeight: 1000,
      maxWidth: 1000,
    };

    try {
      const res = type === 'camera' ? await launchCamera(options) : await launchImageLibrary(options);

      const image = res.assets ? res.assets[0] : undefined;
      const uri = image?.uri;
      if (uri) {
        updateUserProfile(userId, uri, undefined, undefined, undefined)
      }
      ref?.current?.hide();
    } catch (error) {
      // TODO 権限関連のエラーハンドリングが必要
      console.error('ImagePicker Error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = () => {
    if (!userId) {
      return;
    }
    setIsLoading(true);
    updateUserProfile(userId, null, undefined, undefined, undefined)
    ref?.current?.hide();
    setIsLoading(false);
  };

  return (
    <>
      <LoadingDialog visible={isLoading} zIndex={200} />
      <ActionSheet ref={ref} defaultOverlayOpacity={0.15} overlayColor={overlayBackground?.val} containerStyle={styles.actionSheetContainer}>
        <View height='100%' padding='$5' marginHorizontal='$4' borderRadius='$10' backgroundColor='$background'>
          <YStack flex={1} justifyContent='space-between'>
            <YStack>
              <XStack justifyContent='space-between' alignItems='center' marginBottom='$3'>
                <Text fontSize='$6' fontWeight='bold'>
                  {t('CHANGE_PHOTO')}
                </Text>
                <View flex={1} alignItems='flex-end'>
                  <X size={20} onPress={() => ref?.current?.hide()} />
                </View>
              </XStack>
            </YStack>
            <Spacer size='$1' />
            <YStack paddingVertical='$3' onPress={() => handleImagePicker('library')}>
              <XStack gap='$4' alignItems='center'>
                <Image size='$1' />
                <Text flex={1} fontSize='$5'>
                  {t('SELECT_FROM_LIBRARY')}
                </Text>
              </XStack>
            </YStack>
            <YStack paddingVertical='$3' onPress={() => handleImagePicker('camera')}>
              <XStack gap='$4' alignItems='center'>
                <Camera size='$1' />
                <Text flex={1} fontSize='$5'>
                  {t('TAKE_PHOTO')}
                </Text>
              </XStack>
            </YStack>
            <YStack paddingVertical='$3' onPress={handleDeleteImage}>
              <XStack gap='$4' alignItems='center'>
                <Trash size='$1' color='$danger' />
                <Text flex={1} fontSize='$5' color='$danger'>
                  {t('DELETE_IMAGE')}
                </Text>
              </XStack>
            </YStack>
          </YStack>
        </View>
      </ActionSheet>
    </>
  );
};

const styles = StyleSheet.create({
  actionSheetContainer: {
    backgroundColor: TRANSPARENT_COLOR,
    height: 250,
    padding: 0,
  },
});
