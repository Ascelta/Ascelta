import React from 'react';
import { Dialog, Spinner } from 'tamagui';

type Props = {
  visible: boolean;
  zIndex?: number;
  dialogId?: string;
};

export const LoadingDialog: React.FC<Props> = ({ visible, zIndex, dialogId = 'default' }) => {
  const keyBase = `loading-dialog-${dialogId}`;
  
  return (
    <>
      <Dialog open={visible}>
        <Dialog.Portal>
          <Dialog.Overlay key={`${keyBase}-overlay`} backgroundColor='transparent' />
          <Dialog.Content key={`${keyBase}-content`} zIndex={zIndex}>
            <Spinner />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
};
