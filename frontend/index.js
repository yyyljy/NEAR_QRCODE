// React
import { createRoot } from 'react-dom/client';
import App from './App';
import { Contract } from './near-interface';

// NEAR
import { Wallet } from './near-wallet';

const CONTRACT_ADDRESS = process.env.CONTRACT_NAME

// When creating the wallet you can optionally ask to create an access key
// Having the key enables to call non-payable methods without interrupting the user to sign
// const wallet = new Wallet({ createAccessKeyFor: CONTRACT_ADDRESS })
const wallet = new Wallet({ createAccessKeyFor: process.env.CONTRACT_NAME })
const contract = new Contract({ contractId: process.env.CONTRACT_NAME, walletToUse: wallet });

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp()

  root.render(
    <App isSignedIn={isSignedIn} contractId={CONTRACT_ADDRESS} wallet={wallet} contract={contract} />
  );
}