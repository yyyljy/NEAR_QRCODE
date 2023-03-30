import { Button } from '@chakra-ui/react';
import React from 'react';

export function SignInPrompt({greeting, onClick}) {
  return (
    <main>
      <h1>
        The contract says: <span className="greeting">{greeting}</span>
      </h1>
      <h3>
        Welcome to NEAR!
      </h3>
      <p>
        Your contract is storing a greeting message in the NEAR blockchain. To
        change it you need to sign in using the NEAR Wallet. It is very simple,
        just use the button below.
      </p>
      <p>
        Do not worry, this app runs in the test network ("testnet"). It works
        just like the main network ("mainnet"), but using NEAR Tokens that are
        only for testing!
      </p>
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

