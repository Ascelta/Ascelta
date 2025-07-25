import React, { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Paragraph, Spacer, View, XStack, styled } from 'tamagui';
import { Toast } from 'toastify-react-native';
import { AuthProviderType } from '@core/domain';
import { LoadingDialog } from '@core/presentation/components/elements/loadings/LoadingDialog';
import { useAuth } from '@core/presentation/contexts/AuthContext';

type Props = {
  type: AuthProviderType;
  icon?: ReactNode;
  text: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
};

export const OAuthButton: React.FC<Props> = ({ type, icon, text, backgroundColor, borderColor, textColor }) => {
  const [loadingDialogVisible, setLoadingDialogVisible] = useState(false);
  const { signIn } = useAuth();
  const { t } = useTranslation();
  const StaticButton = styled(Button, {
    borderRadius: '$12',
    backgroundColor: backgroundColor,
    borderColor: backgroundColor,
    hoverStyle: {
      backgroundColor: backgroundColor,
      borderColor: backgroundColor,
    },
    pressStyle: {
      backgroundColor: backgroundColor,
      borderColor: backgroundColor,
    },
    focusStyle: {
      backgroundColor: backgroundColor,
      borderColor: backgroundColor,
    },
    borderWidth: '$0.125',
  });
  const onPress = async (type: AuthProviderType) => {
    try {
      setLoadingDialogVisible(true);
      await signIn(type);
    } catch (error: any) {
      // キャンセルエラーの場合は何も表示しない
      if (error?.message?.includes('User cancelled') || error?.message?.includes('cancelled') || error?.message?.includes('org.openid.appauth.general error -3')) {
        return; // Toast表示なしで終了
      }
      // その他のエラーは全て同じメッセージで表示（セキュリティ考慮）
      Toast.error(t('SIGN_IN_ERROR'));
    } finally {
      setLoadingDialogVisible(false);
    }
  };
  return (
    <>
      <LoadingDialog visible={loadingDialogVisible} />
      <StaticButton borderColor={borderColor} onPress={() => onPress(type)}>
        <XStack flex={1} width='100%' alignItems='center' justifyContent='center'>
          <View width='24' height='24' justifyContent='center' alignItems='center'>
            {icon ?? null}
          </View>
          <Spacer size='$6' />
          <View>
            <Paragraph color={textColor} size='$5' fontWeight='bold'>
              {text}
            </Paragraph>
          </View>
          <Spacer size='24' />
        </XStack>
      </StaticButton>
    </>
  );
};
