import 'regenerator-runtime/runtime';
import React from 'react';

import './assets/global.css';

import { EducationalText, InitView, SignInPrompt, SignOutButton } from './ui-components';
import { NearPromise, near } from "near-sdk-js";
import { QrcodeView } from './qr-component-ts';
// import * as nearAPI from "near-api-js";


export default function App({ isSignedIn, contractId, wallet, contract }) {
  const [valueFromBlockchain, setValueFromBlockchain] = React.useState();
  
  const [uiPleaseWait, setUiPleaseWait] = React.useState(true);
  
  const [valueFromGoogle, setValueFromGoogle] = React.useState();

  // Get blockchain state once on component load
  React.useEffect(() => {
    getGreeting()
      .then(setValueFromBlockchain)
      .catch(alert)
      .finally(() => {
        setUiPleaseWait(false);
      });
    }
  , []);

  /// If user not signed-in with wallet - show prompt
  if (!isSignedIn) {
    // Sign-in flow will reload the page later
    return (
      <>
        <SignInPrompt greeting={valueFromBlockchain} onClick={() => wallet.signIn()}/>
        <InitView google={valueFromGoogle} onClick={()=> contract.createSubAcnt("testID")}/>
      </>
    )
  }

  function changeGreeting(e) {
    e.preventDefault();
    setUiPleaseWait(true);
    const { greetingInput } = e.target.elements;
    
    // use the wallet to send the greeting to the contract
    wallet.callMethod({ method: 'set_greeting', args: { message: greetingInput.value }, contractId })
      .then(async () => {return getGreeting();})
      .then(setValueFromBlockchain)
      .finally(() => {
        setUiPleaseWait(false);
      });
  }

  function getGreeting(){
    // use the wallet to query the contract's greeting
    return wallet.viewMethod({ method: 'get_greeting', contractId })
  }

  return (
    <>
      <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/>
      <main className={uiPleaseWait ? 'please-wait' : ''}>
        <h1>
          Hi <span className="greeting">{valueFromBlockchain}</span>
        </h1>
        <form onSubmit={changeGreeting} className="change">
          <label>Your NickName:</label>
          <div>
            <input
              autoComplete="off"
              defaultValue={valueFromBlockchain}
              id="greetingInput"
            />
            <button>
              <span>Save</span>
              <div className="loader"></div>
            </button>
          </div>
        </form>
        {/* <InitView google={valueFromGoogle} onClick={()=> contract.createSubAcnt("testID1234")}/> */}
        <QrcodeView seedString={valueFromBlockchain}/>
      </main>
    </>
  );
}