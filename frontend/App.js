import 'regenerator-runtime/runtime';
import React from 'react';

import './assets/global.css';

import { InitView, SignInPrompt, SignOutButton } from './ui-components';
import { NearPromise, near } from "near-sdk-js";
import { QrcodeView } from './qr-component-ts';
import { Button, ChakraProvider, Flex, FormLabel } from '@chakra-ui/react';

export default function App({ isSignedIn, contractId, wallet, contract }) {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();
  
  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);
  
  const [valueFromGoogle, setValueFromGoogle] = React.useState();

  React.useEffect(() => {
    getGreeting()
      .then(setValueFromBlockchain)
      .catch(alert)
      .finally(() => {
        setUiPleaseWait(false);
      });
    }
  , []);

  function changeGreeting(e) {
    e.preventDefault();
    setUiPleaseWait(true);
    const { greetingInput } = e.target.elements;
    
    wallet.callMethod({ method: 'set_greeting', args: { message: greetingInput.value }, contractId })
      .then(async () => {return getGreeting();})
      .then(setValueFromBlockchain)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }

  function getGreeting(){
    return wallet.viewMethod({ method: 'get_greeting', contractId })
  }

  function createMaze(){
    wallet.callMethod({ method: 'createMaze', args: {_nickname : valueFromBlockchain}})
  }

  if (!isSignedIn) {
    return (
      <ChakraProvider>
        <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()}/>
        <InitView google={valueFromGoogle} onClick={()=> contract.createSubAcnt("testID")}/>
      </ChakraProvider>
    )
  }
  return (
    <ChakraProvider>
      <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/>
      <main className={uiPleaseWait ? 'please-wait' : ''}>
        <h1>
          <span className="greeting">{valueFromBlockchain}</span>
        </h1>
        <form onSubmit={changeGreeting} className="change">
          <div>
            <Flex alignItems={"center"}>
              <div>NickName:</div>
            </Flex>
            <input
              autoComplete="off"
              defaultValue={valueFromBlockchain}
              id="greetingInput"
            />
            <button>
              <Button color={'blackAlpha.800'}>Create Maze</Button>
              <div className="loader"></div>
            </button>
          </div>
        </form>
        {/* <InitView google={valueFromGoogle} onCick={()=> contract.createSubAcnt("testID1234")}/> */}
        <QrcodeView seedString={valueFromBlockchain}/>
      </main>
    </ChakraProvider>
  );
}