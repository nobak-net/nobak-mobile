import * as SecureStore from 'expo-secure-store';
import { StellarAccount } from './StellarAccount';
import SDK from './SDK';  // Import the SDK

class StellarAccountManager {
    private accounts: Map<string, StellarAccount>;
    private userId: string;
    private static instance: StellarAccountManager | null = null;

    private constructor(session: any) {
        this.userId = session.userId;
        this.accounts = new Map();
    }

    public static createInstance(session: any): StellarAccountManager {
        if (!this.instance || this.instance.userId !== session.userId) {
            this.instance = new StellarAccountManager(session);
        }
        return this.instance;
    }

    // Store account metadata under userId key
    private async storeAccountMetadata(): Promise<void> {
        const accountMetadata = Array.from(this.accounts.values()).map(account => ({
            publicKey: account.publicKey,
            name: account.name,
            publicKeySigner: account.publicKeySigner,
            // Include any other non-sensitive metadata
        }));
        await SecureStore.setItemAsync(this.userId, JSON.stringify(accountMetadata));
    }

    // Load account metadata from userId key
    private async loadAccountMetadata(): Promise<void> {
        const storedData = await SecureStore.getItemAsync(this.userId);
        if (storedData) {
            const accountMetadataList: Array<{ publicKey: string; name: string; publicKeySigner: string }> = JSON.parse(storedData);
            for (const accountMetadata of accountMetadataList) {
                const { publicKey, name, publicKeySigner } = accountMetadata;
                if (!this.accounts.has(publicKey)) {
                    // Initialize StellarAccount without sensitive data
                    const account = new StellarAccount(publicKey, '', publicKeySigner);
                    account.name = name;
                    this.accounts.set(publicKey, account);
                }
            }
        }
    }

    public async createAccount(password: string, name: string): Promise<StellarAccount> {
        const { publicKey, secretKey } = StellarAccount.generateKeypair();
        const publicKeySigner = publicKey;
        const newAccount = new StellarAccount(publicKey, secretKey, publicKeySigner);
        newAccount.name = name;

        // Store sensitive data under publicKey
        await newAccount.storeSensitiveData(password);

        // Add the new account to the manager
        this.accounts.set(publicKey, newAccount);

        // Store the account metadata under userId
        await this.storeAccountMetadata();

        // Sync with the API
        await this.syncWithAPI();

        return newAccount;
    }

    public async syncWithAPI(): Promise<void> {
        try {
            // const response = await SDK.initRecovery();
            // const ledgerAccounts = response?.data?.ledger_accounts || [];

            // for (const ledgerAccount of ledgerAccounts) {
            //     const publicKey = ledgerAccount.publicKey;
            //     const name = ledgerAccount.name || 'Default Account';
            //     const publicKeySigner = ledgerAccount.publicKeySigner || publicKey;

            //     if (!this.accounts.has(publicKey)) {
            //         const account = new StellarAccount(publicKey, '', publicKeySigner);
            //         account.name = name;
            //         this.accounts.set(publicKey, account);
            //     } else {
            //         // Update existing account's name and publicKeySigner if needed
            //         const account = this.accounts.get(publicKey)!;
            //         account.name = name;
            //         account.publicKeySigner = publicKeySigner;
            //     }
            // }

            // // Store updated account metadata
            // await this.storeAccountMetadata();
        } catch (error) {
            console.error('Error syncing with API:', error);
        }
    }

    public async getAllAccounts(): Promise<StellarAccount[]> {
        if (this.accounts.size === 0) {
            await this.loadAccountMetadata();
        }
        return Array.from(this.accounts.values());
    }

    public async getAccountName(publicKey: string): Promise<string | undefined> {
        if (!this.accounts.has(publicKey)) {
            await this.loadAccountMetadata();
        }
        const account = this.accounts.get(publicKey);
        return account?.name;
    }

    public async setAccountName(publicKey: string, name: string): Promise<void> {
        if (!this.accounts.has(publicKey)) {
            await this.loadAccountMetadata();
        }
        const account = this.accounts.get(publicKey);
        if (account) {
            account.name = name;
            await this.storeAccountMetadata();
        }
    }

    public async addAccount(account: StellarAccount, password: string): Promise<void> {
        this.accounts.set(account.publicKey, account);
        await account.storeSensitiveData(password);

        // Store the account metadata
        await this.storeAccountMetadata();

        await this.syncWithAPI();
    }

    public async removeAccount(publicKey: string): Promise<void> {
        this.accounts.delete(publicKey);
        await SecureStore.deleteItemAsync(`secret_${publicKey}`);
        await this.storeAccountMetadata();
        await this.syncWithAPI();
    }

    public async getAllAccountsWithBalance(): Promise<{ totalBalance: string; accounts: StellarAccount[] }> {
        const accounts = await this.getAllAccounts();
        const accountBalances = await Promise.all(accounts.map(account => account.getBalance()));

        const totalBalance = accountBalances.reduce((acc, balance) => acc + parseFloat(balance), 0).toFixed(7);

        return {
            totalBalance,
            accounts
        };
    }

    // Load sensitive data for a specific account when needed
    public async loadSensitiveDataForAccount(publicKey: string, password: string): Promise<void> {
        const account = this.accounts.get(publicKey);
        if (account) {
            await account.loadSensitiveData(password);
        }
    }
}

export { StellarAccountManager }
