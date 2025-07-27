import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAsync } from 'react-use';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Image as ImageIcon } from '@tamagui/lucide-icons';
import { Form, Input, ScrollView, Text, View, XStack, YStack } from 'tamagui';
import { z } from 'zod';
import { AppConfig } from '@core/shared/configs/appConfig';
import { CloseButton } from '@core/presentation/components/elements/buttons/CloseButton';
import { TextButton } from '@core/presentation/components/elements/buttons/TextButton';
import { Header } from '@core/presentation/components/layouts/headers/Header';
import { MediaPicker } from '@core/presentation/components/parts/medias/MediaPicker';
import { PostLayout } from '@core/presentation/components/parts/posts/PostLayout';
import { useAuth } from '@core/presentation/contexts/AuthContext';
import { useUserStore } from '@core/presentation/stores/userStore';

// テキストか画像のいずれかが必須であることを検証するスキーマ
const scheme = z
  .object({
    text: z.string().max(AppConfig.POST_TEXT_MAX_LENGTH),
    images: z.array(z.string()).max(AppConfig.MAX_MEDIA_COUNT),
  })
  .refine(({ text, images }) => text.trim() !== '' || images.length > 0);

type FormData = z.infer<typeof scheme>;

type Props = {
  onSubmit: (userId: string, data: FormData) => Promise<void>;
};

export const CreatePostForm: React.FC<Props> = ({ onSubmit }) => {
  const { userId } = useAuth();
  if (!userId) {
    return null;
  }
  const { t } = useTranslation();
  const { bottom } = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const fetchUser = useUserStore(state => state.fetchUser);
  const userData = useUserStore(state => state.userMap[userId]);

  useAsync(async () => {
    if (userId && !userData) {
      await fetchUser(userId);
    }
  }, [userId, userData]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(scheme),
    defaultValues: {
      text: '',
      images: [],
    },
    mode: 'onChange',
  });

  const watchedText = watch('text');
  const watchedImages = watch('images');
  const remainingChars = AppConfig.POST_TEXT_MAX_LENGTH - watchedText.length;
  const canPickMedia = watchedImages.length < AppConfig.MAX_MEDIA_COUNT;
  const pickerIconOpacity = canPickMedia ? 1 : 0.5;
  const selectionLimit = AppConfig.MAX_MEDIA_COUNT - watchedImages.length;

  const handleMediaSelect = (mediaPaths: Array<string>) => {
    setValue('images', [...watchedImages, ...mediaPaths], { shouldValidate: true });
  };

  const handleRemoveImage = (index: number) => {
    setValue(
      'images',
      watchedImages.filter((_: string, i: number) => i !== index),
      { shouldValidate: true },
    );
  };

  const getTextLimitColor = () => {
    if (remainingChars >= 20) {
      return '$subtle';
    }
    if (remainingChars >= 0) {
      return '$warning';
    }
    return '$error';
  };

  return (
    <>
      <Form onSubmit={handleSubmit(data => onSubmit(userId, data))} flex={1}>
        <Header
          leading={<CloseButton />}
          action={
            <Form.Trigger asChild disabled={!isValid || isSubmitting}>
              <TextButton text={t('POST')} disabled={!isValid || isSubmitting} isLoading={isSubmitting} />
            </Form.Trigger>
          }
        />
        <ScrollView
          ref={scrollViewRef}
          keyboardShouldPersistTaps='always'
          onLayout={event => {
            const { height } = event.nativeEvent.layout;
            setScrollViewHeight(height);
            setIsScrollable(contentHeight > height);
          }}
          onContentSizeChange={(_, contentHeightValue) => {
            setContentHeight(contentHeightValue);
            setIsScrollable(contentHeightValue > scrollViewHeight);
          }}
        >
          <PostLayout
            isLoading={userData?.isLoading}
            userDetail={userData?.data?.vUserDetail}
            images={watchedImages}
            onRemoveImage={handleRemoveImage}
            showRemoveButton={true}
            content={
              <YStack gap='$3' flex={1}>
                {/* テキスト入力エリア */}
                <Controller
                  control={control}
                  name='text'
                  render={({ field: { onChange, value } }: { field: { onChange: (text: string) => void; value: string } }) => (
                    <Input
                      autoFocus
                      multiline
                      scrollEnabled={false}
                      placeholder='今何してる？'
                      value={value}
                      placeholderTextColor='$subtle'
                      onChangeText={onChange}
                      borderWidth={0}
                      padding={0}
                      lineHeight={18}
                      minHeight={100}
                    />
                  )}
                />
              </YStack>
            }
          />
        </ScrollView>
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={bottom - 6}>
          <View
            animation='quick'
            paddingHorizontal='$2'
            paddingBottom={bottom}
            flexDirection='row'
            justifyContent='space-between'
            alignItems='center'
            borderTopWidth={isScrollable ? 1 : 0}
            borderTopColor='$borderColor'
            backgroundColor='$background'
          >
            <XStack justifyContent='flex-start' alignItems='center' gap='$1'>
              <MediaPicker source='camera' mediaType='photo' onSelect={handleMediaSelect} disabled={!canPickMedia} selectionLimit={selectionLimit}>
                <View padding='$3' opacity={pickerIconOpacity} paddingHorizontal='$2'>
                  <Camera size='$1' />
                </View>
              </MediaPicker>
              <MediaPicker source='library' mediaType='photo' onSelect={handleMediaSelect} disabled={!canPickMedia} selectionLimit={selectionLimit}>
                <View padding='$3' opacity={pickerIconOpacity} paddingHorizontal='$2'>
                  <ImageIcon size='$1' />
                </View>
              </MediaPicker>
            </XStack>
            <View paddingRight='$2'>
              <Text animation='quick' color={getTextLimitColor()} fontSize='$2'>
                {remainingChars} / {AppConfig.POST_TEXT_MAX_LENGTH}
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Form>
    </>
  );
};
