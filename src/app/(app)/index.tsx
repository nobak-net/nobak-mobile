import { ScrollView, StyleSheet, Text, View } from "react-native";
import * as React from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { Layout, colors, texts, Button, AccountCard, Symbol, InfoCard, DigitalDisplay } from 'nobak-native-design-system';
import { StellarAccount } from '@/src/utils/StellarAccount';
import { StellarAccountManager } from '@/src/utils/StellarAccountManager';
import navigation from "@/src/utils/Navigation";
import { Routes } from "@/src/utils/Routes";
import { useDevMode } from "@/src/context";

interface AccountWithBalance {
    publicKey: string;
    balance: string;
}

export default function Index() {
    const { session } = useAuth();
    const [accounts, setAccounts] = React.useState<StellarAccount[]>([]);
    const [balance, setBalance] = React.useState<string>('');
    const { isDevMode } = useDevMode();

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const accountManager = StellarAccountManager.createInstance(session, isDevMode);
                const accountsWithBalances = await accountManager.getAllAccountsWithBalance();

                // Check if accountsWithBalances.accounts is an array
                if (Array.isArray(accountsWithBalances.accounts)) {
                    // console.log("accountsWithBalances.accounts", accountsWithBalances.accounts)
                    setAccounts(accountsWithBalances.accounts);
                    setBalance(accountsWithBalances.totalBalance)
                } else {
                    console.error('Fetched accounts data is not an array:', accountsWithBalances.accounts);
                }
            } catch (error) {
                console.error('Error fetching accounts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, [session, isDevMode]);

    const handleCreateAccount = async () => {
        if (session) {
            const accountManager = StellarAccountManager.createInstance(session, isDevMode);
            await accountManager.createAccount('your_password_here', "Account #1");
            const mergedAccounts = await accountManager.getAllAccounts();
            setAccounts(mergedAccounts);
        }
    };


    return (

        <Layout style={{ backgroundColor: colors.primary[2400], gap: 12 }}>
            <ScrollView style={{ height: '100%' }}>
                {balance &&
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ ...texts.H4Bold, color: colors.primary[800] }}>Total Balance</Text>
                        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: 8, borderWidth: 1, borderColor: colors.primary[800], borderRadius: 8, backgroundColor: colors.primary[1800] }}>
                            <DigitalDisplay value={`$${balance}`} secondaryColor={colors.primary[800]} color={colors.primary[100]} />
                        </View>
                    </View>
                }

                {/* <Text style={{ color: colors.primary[100], ...texts.CaptionBold }}>Browsing with:</Text>
                {session && session.ledger_accounts && session.ledger_accounts.length > 0 && (
                    <Text selectable={true} style={{ color: colors.primary[100], ...texts.P1Light }}>
                        {session.ledger_accounts[0].address}
                    </Text>
                )} */}
                <View style={{ display: 'flex', flexDirection: 'row', gap: 8, alignSelf: 'flex-start' }}>
                    <Button text="Add Account" theme="dark" icon="Collections" type="iconText" buttonStyle={{ variant: 'primary', size: 'small' }} onPress={() => navigation.go(Routes.AddAccount)} />
                    <Button text="Send" theme="dark" icon="Send" type="iconText" buttonStyle={{ variant: 'primary', size: 'small' }} onPress={() => navigation.go(Routes.AddAccount)} />
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', gap: 4, alignItems: 'center', marginTop: 24 }}>
                    <Symbol type="Star" color={colors.primary[100]} />
                    <Text style={{ color: colors.primary[100], ...texts.H3Bold }}>Accounts</Text>
                </View>
                <View>
                    {loading ? (
                        <Text style={{ color: colors.primary[100], ...texts.P1Light }}>Loading...</Text>
                    ) : (
                        accounts.length !== 0 ? accounts.map((account, index) => (
                            <AccountCard
                                key={index}
                                name={account.name}
                                publicKey={account.publicKey}
                                balance={""}
                                canSign={account.canSign}
                                isBackedUp={account.isBackedUp}
                                viewAccount={() => navigation.go(Routes.AccountDetails, { publicKey: account.publicKey })} // Pass the publicKey for navigation
                            />
                        )) :
                            <InfoCard symbol="" title="Empty" description="You have no accounts set yet" />
                    )}
                </View>
            </ScrollView>

        </Layout>
    );
}