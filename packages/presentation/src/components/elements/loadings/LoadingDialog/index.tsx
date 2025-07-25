import React from 'react';
import { Dialog, Spinner } from 'tamagui';

type Props = {
  visible: boolean;
  zIndex?: number;
};

export const LoadingDialog: React.FC<Props> = ({ visible, zIndex }) => {
  return (
    <>
      <Dialog open={visible}>
        <Dialog.Portal>
          <Dialog.Overlay key='overlay' backgroundColor='transparent' />
          <Dialog.Content key='content' zIndex={zIndex}>
            <Spinner />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
};
