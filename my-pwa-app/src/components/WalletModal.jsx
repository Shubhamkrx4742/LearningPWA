import React from 'react';

const WalletIntegration = ({ walletAddress, setWalletAddress }) => {
  const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("User rejected the connection request", error);
      }
    } else {
      alert('MetaMask is not installed. Please install it to use Web3 features!');
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  return (
    <div className="wallet-card">
      <h3>Web3 Wallet Link</h3>
      {walletAddress ? (
        <div className="connected-state">
          <p className="success-text">✔ Connected Successfully</p>
          <code className="wallet-hash">{walletAddress}</code>
        </div>
      ) : (
        <button className="metamask-connect-btn" onClick={connectMetaMask}>
          Connect MetaMask Wallet
        </button>
      )}
    </div>
  );
};

export default WalletIntegration;