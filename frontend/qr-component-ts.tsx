import React from 'react';
import QRCode from "qrcode";
import { hashUrlMaker, pathLengthCalculator } from './qrmap';
import { Button, Flex } from '@chakra-ui/react';

export function QrcodeView({seedString, contractId, wallet}) {
  const [toDataURL, setToDataURL] = React.useState<string>();
  const [result, setResult] = React.useState<{from:number[], to:number[], len:number}>();
  // const [toDataURL, setToDataURL] = React.useState();
  // const [result, setResult] = React.useState();

  let urlString = "";
  // let urlString = `https://block-chain.kr/${seedString}`
    
  const opt: QRCode.QRCodeToStringOptions &
  QRCode.QRCodeToDataURLOptions &
  QRCode.QRCodeRenderersOptions = {
    errorCorrectionLevel: "H",
    margin: 0,
    scale: 5,
    width: 1,
    color: { dark: "#00000000", light: "#000000ff" },
  };
  React.useEffect(() => {
    if(seedString) {
      urlString = hashUrlMaker({seedString});
      if(toDataURL!==urlString) setResult(pathLengthCalculator({hashUrlStr: urlString}));
      console.log(urlString.split(".kr/")[1]);
    }
    QRCode.toDataURL(urlString, opt, function (err, url) {
      setToDataURL(url);
    });
  },[seedString])

  function createMaze(){
    wallet.callMethod(
      { 
        contractId: contractId, 
        method: "createNickname", 
        args: { 
          _nickname : seedString
        }
      }
    );
  }
  
  return (
    <Flex direction={"column"}>
      <img src={toDataURL}/>
      <PathLength result={result}/>
      <Button color={'blackAlpha.800'} onClick={()=>{
        createMaze()
        }}>Create Maze</Button>
    </Flex>
  )
}

export function PathLength({result}){
  if(result){
    return (
      <>
        <p>(ROW, COL)</p>
        <div>
          From : {`(${result.from[0]},${result.from[1]})` }
        </div>
        <div>
          To : {`(${result.to[0]},${result.to[1]})` }
        </div>
        <div>
          Path Length : {result.len}
        </div>
      </>
    )
  } else {
    return (
      <p>NO PATH</p>
    )
  }
}