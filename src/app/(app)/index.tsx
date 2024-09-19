import { StyleSheet, Text, View } from "react-native";
import * as React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { Layout, colors, texts, Button, AccountCard } from 'nobak-native-design-system';
import { StellarAccount } from '@/src/utils/StellarAccount';
import { StellarAccountManager } from '@/src/utils/StellarAccountManager';
import navigation from "@/src/utils/Navigation";
import { Routes } from "@/src/utils/Routes";

interface AccountWithBalance {
    publicKey: string;
    balance: string;
}

export default function Index() {
    const { session } = useAuth();
    const [accounts, setAccounts] = React.useState<StellarAccount[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAccounts = async () => {
            try {
                if (session) {
                    const accountManager = StellarAccountManager.createInstance(session);
                    const accountsWithBalances = await accountManager.getAllAccountsWithBalance();
    
                    // Check if accountsWithBalances.accounts is an array
                    if (Array.isArray(accountsWithBalances.accounts)) {
                        // console.log("accountsWithBalances.accounts", accountsWithBalances.accounts)
                        setAccounts(accountsWithBalances.accounts);
                    } else {
                        console.error('Fetched accounts data is not an array:', accountsWithBalances.accounts);
                    }
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
        if (session) {
            const accountManager = StellarAccountManager.createInstance(session);
            await accountManager.createAccount('your_password_here', "Account #1");
            const mergedAccounts = await accountManager.getAllAccounts();
            setAccounts(mergedAccounts);
        }
    };

    console.log("accounts", accounts)

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
                <Button text="Add" onPress={() => navigation.go(Routes.AddAccount)} />

            </View>
            <View>
                {loading ? (
                    <Text style={{ color: colors.primary[100], ...texts.P1Light }}>Loading...</Text>
                ) : (
                    accounts.map((account, index) => (
                        <AccountCard
                            key={index}
                            name={account.name}
                            publicKey={account.publicKey}
                            balance={""}
                            canSign={account.canSign}
                            isBackedUp={account.isBackedUp}
                            viewAccount={() => navigation.go(Routes.AccountDetails, { publicKey: account.publicKey })} // Pass the publicKey for navigation
                        />
                    ))
                )}
            </View>
        </Layout>
    );
}