import { Button } from '@chakra-ui/react';
import React from 'react';

export function SignInPrompt({ onClick }) {
  return (
    <main>
      <br/>
      <p style={{ textAlign: 'center' }}>
        <Button color={'blackAlpha.800'} onClick={onClick}>Sign in with NEAR Wallet</Button>
      </p>
    </main>
  );
}

export function SignOutButton({accountId, onClick}) {
  return (
    <Button color={'blackAlpha.800'} style={{ float: 'right' }} onClick={onClick}>
      Sign out {accountId}
    </Button>
  );
}

export function InitView({google, onClick}) {
  return (
    <>
      <main>
        <Button color={'blackAlpha.800'} onClick={onClick}>CREATE ACCOUNT</Button>
      </main>
    </>
  )
}

