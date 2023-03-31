import 'regenerator-runtime/runtime';
import React, { useEffect, useState } from 'react';

import './assets/global.css';

import { SignInPrompt, SignOutButton } from './ui-components';
import { QrcodeView } from './qr-component-ts';
import { Button, ChakraProvider, Flex } from '@chakra-ui/react';

export default function App({ isSignedIn, contractId, wallet, contract }) {
  const [valueFromBlockchain, setValueFromBlockchain] = useState();
  const [inputValue, setInputValue] = useState();
  
  useEffect(()=>{
    setInputValue(wallet.accountId);
    getMyMaze();
  },[])

  async function getMyMaze(){
    let result = await wallet.viewMethod({ contractId: contractId, method: "getNickbyAddr", args: { _address : wallet.accountId }});
    console.log("getMyMaze : " + result)

    let myMaze = await wallet.viewMethod({ contractId: contractId, method: "getMaze", args: { _nickname : result }});
    console.log("myMaze : " + myMaze)
  }

  if (!isSignedIn) {
    return (
      <ChakraProvider>
        <SignInPrompt onClick={() => wallet.signIn()}/>
        {/* <InitView google={valueFromGoogle} onClick={()=> contract.createSubAcnt("testID")}/> */}
      </ChakraProvider>
    )
  }

  return (
    <ChakraProvider>
      <SignOutButton accountId={wallet.accountId} onClick={() => wallet.signOut()}/>
      <main>
        <Flex fontSize={"2xl"} justifyContent={"center"}>
          {wallet.accountId}
        </Flex>
        <form onSubmit={()=>{}} className="change">
          <div>
            <input
              autoComplete="off"
              defaultValue={wallet.accountId}
              onChange={e=>{
                setInputValue(e.target.value)
              }}
            />
            <Button color={'blackAlpha.800'} onClick={()=>setValueFromBlockchain(inputValue)}>Generate Maze</Button>
          </div>
        </form>
        {/* <InitView google={valueFromGoogle} onCick={()=> contract.createSubAcnt("testID1234")}/> */}
        <QrcodeView seedString={valueFromBlockchain} contractId={contractId} wallet={wallet}/>
      </main>
    </ChakraProvider>
  );
}