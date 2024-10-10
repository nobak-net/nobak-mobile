import React, { type ReactElement, type FunctionComponent } from "react";
import { Modal, Text, View, Image } from 'react-native';
import { SignClientTypes, SessionTypes } from "@walletconnect/types";
import {
  useInitialization,
  web3wallet,
  web3WalletPair,
} from '../utils/WalletConnect';
import { getSdkError } from '@walletconnect/utils';
import { StellarAccount } from "@/src/utils/StellarAccount";
import { StellarAccountManager } from '@/src/utils/StellarAccountManager';
import { router } from 'expo-router';
import { Header, colors, texts, Button } from 'nobak-native-design-system';
import { useDevMode } from '@/src/context/DevModeContext';
import { usePasswordPrompt } from "../hooks/usePasswordPrompt";
type WalletProviderProps = {
  children: ReactElement;
};

type WalletContextType = {
  url: string | null;
  signTransaction: () => void;
  updateUri: (wcuri: string) => void;
  getUri: () => string;
  pair: () => void;
  disconnect: () => void;
  appMetadata: any;
  successfulSession: boolean;
  selectedAccount: StellarAccount | null;
  setSelectedAccount: React.Dispatch<React.SetStateAction<StellarAccount | null>>;
};

export const WalletContext = React.createContext<WalletContextType>(
  {} as WalletContextType
);

export const WalletProvider: FunctionComponent<WalletProviderProps> = ({
  children,
}) => {
  const initialized = useInitialization();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [wcuri, setWCuri] = React.useState("");
  const [currentProposal, setCurrentProposal] = React.useState<any>(undefined);
  const [appMetadata, setAppMetadata] = React.useState<any>(undefined);
  const [requestSession, setRequestSession] = React.useState<any>(null);
  const [requestEventData, setRequestEventData] = React.useState<any>(null);
  const [successfulSession, setSuccessfulSession] = React.useState(false);
  const { isDevMode } = useDevMode();
  const { promptPassword } = usePasswordPrompt();

  // Added selectedAccount and accounts state
  const [selectedAccount, setSelectedAccount] = React.useState<StellarAccount | null>(null);
  const [accounts, setAccounts] = React.useState<StellarAccount[]>([]);
  // setRequestEventData(null)
  // Initialize accounts from StellarAccountManager
  React.useEffect(() => {
    const initAccounts = async () => {
      
      const accountManagear = StellarAccountManager.createInstance({ session: null, network: 'testnet'});
      const accountList = await accountManagear.getAllAccounts()
      setAccounts(accountList);
      if (accountList.length > 0 && !selectedAccount) {
        setSelectedAccount(accountList[0]);
      }
    };
    initAccounts();
  }, []);

  React.useEffect(() => {
    if (Boolean(wcuri)) {
      pair();
    }
  }, [wcuri]);

  React.useEffect(() => {
    if (initialized) {
      web3wallet?.on("session_proposal", onSessionProposal);
      web3wallet?.on("session_request", onSessionRequest);
    }
  }, [initialized]);

  async function pair() {
    try {
      const pairing = await web3WalletPair({ uri: wcuri });
      console.log('Pairing successful:', pairing);
      setModalVisible(true);
      return pairing;
    } catch (error) {
      console.error('Pairing failed:', error);
    }
  }

  const updateUri = (wcuri: string) => {
    setWCuri(wcuri);
  };

  const getUri = () => {
    return wcuri;
  };

  const onSessionProposal = React.useCallback(
    (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
      setCurrentProposal(proposal);
      if (proposal?.params.proposer.metadata) {
        setAppMetadata(proposal.params.proposer.metadata);
      }
    },
    []
  );

  async function handleAccept() {
    const { id, params } = currentProposal;
    const { requiredNamespaces, relays } = params;

    if (currentProposal && selectedAccount) {
      // console.log('selectedAccount', selectedAccount.publicKey)

      const namespaces: SessionTypes.Namespaces = {};
      console.log('connecting: ', selectedAccount.publicKey)
      Object.keys(requiredNamespaces).forEach((key) => {
        const accounts: string[] = [];
        requiredNamespaces[key].chains.forEach((chain: any) => {
          accounts.push(`${chain}:${selectedAccount.publicKey}`);
        });
        namespaces[key] = {
          accounts,
          methods: requiredNamespaces[key].methods,
          events: requiredNamespaces[key].events,
        };
      });
      await web3wallet.approveSession({
        id,
        relayProtocol: relays[0].protocol,
        namespaces,
      });
      setWCuri("");
      setCurrentProposal(undefined);
      setSuccessfulSession(true);
      setModalVisible(false);
    }
  }

  async function disconnect() {
    const activeSessions = await web3wallet.getActiveSessions();
    const topic = Object.values(activeSessions)[0]?.topic;
    if (activeSessions && topic) {
      await web3wallet.disconnectSession({
        topic,
        reason: getSdkError("USER_DISCONNECTED"),
      });
    }
    setSuccessfulSession(false);
  }

  async function handleReject() {
    const { id } = currentProposal;
    if (currentProposal) {
      await web3wallet.rejectSession({
        id,
        reason: getSdkError("USER_REJECTED_METHODS"),
      });
      setModalVisible(false);
      setWCuri("");
      setCurrentProposal(undefined);
    }
  }

  const onSessionRequest = React.useCallback(
    async (requestEvent: SignClientTypes.EventArguments["session_request"]) => {
      const { topic } = requestEvent;
      const requestSessionData = web3wallet.engine.signClient.session.get(topic);
      setRequestSession(requestSessionData);
      setRequestEventData(requestEvent);
      setModalVisible(true);
    },
    []
  );

  const url = '';

  // Updated signTransaction function
  const signTransaction = async () => {
    if (requestEventData !== null && selectedAccount) {
      const { topic, params, id } = requestEventData;
      const { request } = params;
      const password = await promptPassword();

      try {
        // Create an instance of StellarAccount
        console.log('selectedAccount', selectedAccount.publicKey)
        const stellarAccount = await StellarAccount.createInstance({ publicKey: selectedAccount.publicKey, network: 'testnet'})
        // Sign the transaction using StellarAccount instance
        console.log('request', request)
        console.log('request?.params?.xdr', request?.params?.xdr)
        const signedXDR = await stellarAccount.signAndSubmitTransaction(request?.params?.xdr, password);
        console.log('signedXDR', signedXDR)
        setRequestEventData(null);

        // await web3wallet.respondSessionRequest({
        //   topic,
        //   response: {
        //     id: id,
        //     result: { },
        //     jsonrpc: '2.0',
        //   },
        // });
        setModalVisible(false);
      } catch (error) {
        console.error('Error signing transaction:', error);
        // Optionally, send an error response
        await web3wallet.respondSessionRequest({
          topic,
          response: {
            id: id,
            error: getSdkError('USER_REJECTED_METHODS'),
            jsonrpc: '2.0',
          },
        });
        setModalVisible(false);
      }
    } else {
      console.log('No requestEventData or selectedAccount is null');
    }
  };
  const cancelTransaction = () => {
    setModalVisible(false)
    setRequestEventData(null);
  }
  console.log('requestEventData?.params?.request?.params', requestEventData?.params?.request?.params)
  return (
    <WalletContext.Provider
      value={{
        url,
        signTransaction,
        updateUri,
        getUri,
        pair,
        disconnect,
        appMetadata,
        successfulSession,
        selectedAccount,
        setSelectedAccount,
      }}
    >
      <Header isDev={isDevMode} action={() => router.push('/(app)/scanner')} />
      {children}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 22,
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: 'white',
              borderRadius: 20,
              padding: 35,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            {currentProposal?.params.proposer.metadata && (
              <View>
                {/* Uncomment if you want to display the app icon */}
                {/* <Image
                  style={{ height: 25, width: 25 }}
                  source={{ uri: currentProposal.params.proposer.metadata.icons[0] }}
                /> */}
                <Text style={{ color: colors.primary[2400], ...texts.H4Bold }}>
                  {currentProposal.params.proposer.metadata.name}
                </Text>
                <Text style={{ color: colors.primary[2000], ...texts.P2Medium }}>
                  {currentProposal.params.proposer.metadata.description}
                </Text>
                <Text style={{ color: colors.primary[2700], ...texts.P3Medium }}>
                  {currentProposal.params.proposer.metadata.url}
                </Text>
                <View style={{ marginTop: 24, gap: 8 }}>
                  <Button
                    text="Accept"
                    onPress={() => handleAccept()}
                    buttonStyle={{ full: true, variant: 'primary', size: 'small' }}
                  />
                  <Button
                    text="Reject"
                    onPress={() => handleReject()}
                    buttonStyle={{ full: true, variant: 'secondary', size: 'small' }}
                  />
                </View>
              </View>
            )}
            {requestEventData?.params?.request?.params?.xdr && (
              <View>
                <Text style={{ color: colors.primary[2400], ...texts.H4Bold }}>
                  Sign Transaction
                </Text>
                <Text style={{ color: colors.primary[1700], ...texts.P3Medium }}>
                  {requestEventData.params.request.params.xdr}
                </Text>
                <View style={{ marginTop: 24, gap: 8 }}>
                  <Button
                    text="Sign"
                    onPress={() => signTransaction()}
                    buttonStyle={{ full: true, variant: 'primary', size: 'small' }}
                  />
                  <Button
                    text="Cancel"
                    onPress={() => cancelTransaction()}
                    buttonStyle={{ full: true, variant: 'secondary', size: 'small' }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  return React.useContext(WalletContext);
};