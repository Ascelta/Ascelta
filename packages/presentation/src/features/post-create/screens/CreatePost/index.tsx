import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'solito/router';
import { Alert } from '@core/presentation/components/alerts';
import { useUseCases } from '@core/presentation/contexts/UseCaseContext';
import { CreatePostForm } from '@core/presentation/features/post-create/components/CreatePostForm';

export const CreatePost: React.FC = () => {
  const { t } = useTranslation();
  const { back } = useRouter();
  const { createPostUseCase } = useUseCases();

  return (
    <CreatePostForm
      onSubmit={async (userId, data) => {
        try {
          await createPostUseCase.execute({
            userId,
            text: data.text.trim(),
            imageUrls: data.images.length > 0 ? data.images : undefined,
          });
          back();
        } catch (error) {
          console.error('Post creation failed:', error);
          Alert.show({
            title: 'Error',
            message: 'Failed to create post. Please try again later.',
            buttons: [
              {
                text: t('OK'),
              },
            ],
          });
        }
      }}
    />
  );
};
