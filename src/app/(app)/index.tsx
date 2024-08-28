import { StyleSheet, Text, View } from "react-native";
import * as React from 'react';
import { Link } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Layout, colors, texts, AccountActions, Button } from 'nobak-native-design-system';
import { getAccountBalance, StellarAccount } from '../../utils/StellarAccount';
import { StellarAccountManager } from '../../utils/StellarAccountManager';

import { router } from 'expo-router';

interface AccountWithBalance {
    publicKey: string;
    balance: string;
}
export default function Index() {
    const { session } = useAuth();
    const [accounts, setAccounts] = React.useState<StellarAccount[]>([]);
    const [loading, setLoading] = React.useState(true);
    console.log('session', session)

    React.useEffect(() => {
        const fetchAccounts = async () => {
            try {
                if (session) {
                    const accountManager = StellarAccountManager.createInstance(session.ledger_accounts);
                    const accountsWithBalances = await accountManager.getAllAccountsWithBalance();
                    setAccounts(accountsWithBalances.accounts);
                }
            } catch (error) {
                console.error('Error fetching accounts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, [session]);

    const handleCreateAccount = async () => {
        try {
            // Assuming you have access to the session object    
            if (session) {
                // Create an instance of StellarAccountManager using the session
                const accountManager = StellarAccountManager.createInstance(session);
    
                // Create a new account using the account manager
                const newAccount = await accountManager.createAccount('your_password_here');
                console.log("New Account Created:", newAccount);
    
                // Fetch and set the updated accounts with their balances
                const accountsWithBalances = await accountManager.getAllAccountsWithBalance();
                setAccounts(accountsWithBalances.accounts);
            }
        } catch (error) {
            console.error('Error creating account:', error);
        }
    };

    return (
        <Layout style={{ backgroundColor: colors.primary[2400], gap: 12 }}>
            <Text style={{ color: colors.primary[100], ...texts.H3Bold }}>Balance</Text>
            <View>
                <Text style={{ color: colors.primary[100], ...texts.CaptionBold }}>Browsing with:</Text>
                {session && session.ledger_accounts && session.ledger_accounts.length > 0 && (
                    <Text selectable={true} style={{ color: colors.primary[100], ...texts.P1Light }}>
                        {session.ledger_accounts[0].address}
                    </Text>
                )}
                <Button text="Create New Account" onPress={handleCreateAccount} />
            </View>
            <View>
                {loading ? (
                    <Text style={{ color: colors.primary[100], ...texts.P1Light }}>Loading...</Text>
                ) : (
                    accounts.map((account, index) => (
                        <View key={index}>
                            <Text style={{ color: colors.primary[100], ...texts.P1Light }}>
                                Account: {account.publicKey}
                            </Text>
                            <Text style={{ color: colors.primary[100], ...texts.P1Light }}>
                                Balance:  XLM
                            </Text>
                        </View>
                    ))
                )}
            </View>
        </Layout>
    );
}