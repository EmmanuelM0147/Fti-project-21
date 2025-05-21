import { useState, useEffect } from 'react';
import { web3Provider } from './provider';

export function useWeb3() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const initialized = await web3Provider.initialize();
        if (initialized) {
          const address = await web3Provider.connectWallet();
          setAccount(address);
          setIsConnected(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize Web3'));
        setIsConnected(false);
      }
    };

    const handleAccountChanged = (event: CustomEvent<string>) => {
      setAccount(event.detail);
    };

    const handleDisconnect = () => {
      setAccount(null);
      setIsConnected(false);
    };

    window.addEventListener('web3AccountChanged', handleAccountChanged as EventListener);
    window.addEventListener('web3Disconnected', handleDisconnect);

    init();

    return () => {
      window.removeEventListener('web3AccountChanged', handleAccountChanged as EventListener);
      window.removeEventListener('web3Disconnected', handleDisconnect);
      web3Provider.cleanup();
    };
  }, []);

  return { isConnected, account, error };
}