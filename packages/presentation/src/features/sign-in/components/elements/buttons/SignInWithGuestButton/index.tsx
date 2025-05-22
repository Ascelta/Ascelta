import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertDialog, Button, Paragraph } from 'tamagui';
import { OutlinedButton } from '../../../../../../components/elements/buttons/OutlinedButton';
import { useAuth } from '../../../../../../contexts/AuthContext';

export function SignInWithGuestButton(): React.JSX.Element {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const onPress = () => signIn('anonymous');
  return (
    <AlertDialog native>
      <AlertDialog.Trigger asChild>
        <OutlinedButton>
          <Paragraph size='$5' fontWeight='bold'>
            {t('CONTINUE_WITH_GUEST')}
          </Paragraph>
        </OutlinedButton>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content>
          <AlertDialog.Title>{t('GUEST_SIGN_IN_ALERT_TITLE')}</AlertDialog.Title>
          <AlertDialog.Description>{t('GUEST_SIGN_IN_ALERT_MESSAGE')}</AlertDialog.Description>
          <AlertDialog.Cancel asChild>
            <Button>{t('CANCEL')}</Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action onPress={onPress} asChild>
            <Button onPress={onPress}>{t('CONTINUE')}</Button>
          </AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
