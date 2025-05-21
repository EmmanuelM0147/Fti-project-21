import { ethers } from 'ethers';

class Web3Provider {
  private static instance: Web3Provider;
  private provider: ethers.providers.Web3Provider | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): Web3Provider {
    if (!Web3Provider.instance) {
      Web3Provider.instance = new Web3Provider();
    }
    return Web3Provider.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      if (typeof window === 'undefined') {
        throw new Error('Window object not available');
      }

      if (!window.ethereum) {
        throw new Error('No Ethereum provider found. Please install MetaMask.');
      }

      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.isInitialized = true;
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', this.handleAccountsChanged);
      window.ethereum.on('chainChanged', this.handleChainChanged);

      return true;
    } catch (error) {
      console.error('Failed to initialize Web3 provider:', error);
      return false;
    }
  }

  private handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // Handle disconnected state
      this.isInitialized = false;
      window.dispatchEvent(new CustomEvent('web3Disconnected'));
    } else {
      window.dispatchEvent(new CustomEvent('web3AccountChanged', { detail: accounts[0] }));
    }
  };

  private handleChainChanged = () => {
    // Reload the page on chain change as recommended by MetaMask
    window.location.reload();
  };

  async connectWallet(): Promise<string> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const accounts = await this.provider.send('eth_requestAccounts', []);
      return accounts[0];
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  getProvider(): ethers.providers.Web3Provider | null {
    return this.provider;
  }

  async getSigner(): Promise<ethers.Signer | null> {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }
      return this.provider.getSigner();
    } catch (error) {
      console.error('Failed to get signer:', error);
      return null;
    }
  }

  cleanup() {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', this.handleChainChanged);
    }
    this.isInitialized = false;
    this.provider = null;
  }
}

export const web3Provider = Web3Provider.getInstance();