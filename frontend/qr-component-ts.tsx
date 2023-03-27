import React from 'react';
import QRCode from "qrcode";
import { hashUrlMaker, pathLengthCalculator } from './qrmap';

export function QrcodeView({seedString}:{seedString:string}) {
  const [toDataURL, setToDataURL] = React.useState<string>();
  const [result, setResult] = React.useState<{from:number[], to:number[], len:number}>();

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
  React.useEffect(()=>{
    if(seedString) {
      urlString = hashUrlMaker({seedString});
      if(toDataURL!==urlString) setResult(pathLengthCalculator({hashUrlStr: urlString}));
      console.log(urlString.split(".kr/")[1]);
    }
    QRCode.toDataURL(urlString, opt, function (err, url) {
      setToDataURL(url);
    });
  },[seedString])
  
  return (
    <div>
      <img src={toDataURL}/>
      <PathLength result={result}/>
    </div>
  )
}

export function PathLength({result}){
  if(result){
    return(
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
  } else{
    return(
      <p>NO PATH</p>
    )
  }
}