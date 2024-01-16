
import React, { type ReactElement, type FunctionComponent } from "react";
import { Modal, StyleSheet, Text, Pressable, View, Image } from 'react-native';
import { SignClientTypes, SessionTypes } from "@walletconnect/types";
import {
    useInitialization,
    web3wallet,
    web3WalletPair,
} from '../utils/WalletConnect';
import { getSdkError } from '@walletconnect/utils'
import { getPublicKey, signTransaction as signTX } from "../utils/StellarAccount";
import { parseXDR } from "../services/parseXDR";
import { Header, colors, texts, Button } from 'nobak-native-design-system'


type WalletProviderProps = {
    children: ReactElement;
};

type WalletContextType = {
    url: string | null;
    newSession: (url: string) => void;
    signTransaction: (xdr: string) => void;
    updateUri: (wcuri: string) => void;
    getUri: () => string;
    openModal: () => void;
    pair: () => void;
    disconnect: () => void;
    appMetadata: any;
    successfulSession: boolean;
};

export const WalletContext = React.createContext<WalletContextType>(
    {} as WalletContextType
);

export const WalletProvider: FunctionComponent<WalletProviderProps> = ({
    children,
}) => {
    const initialized = useInitialization(); // This will now correctly be a boolean
    const [modalVisible, setModalVisible] = React.useState(false);
    const [wcuri, setWCuri] = React.useState("")
    const [currentProposal, setCurrentProposal] = React.useState(undefined);
    const [appMetadata, setAppMetadata] = React.useState<any>(undefined);
    const [requestSession, setRequestSession] = React.useState<any>(null);
    const [requestEventData, setRequestEventData] = React.useState<any>(null);
    const [successfulSession, setSuccessfulSession] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            if (Boolean(wcuri)) {
                await pair();
            }
        })();
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
            setModalVisible(true)
            return pairing;
        } catch (error) {
            console.error('Pairing failed:', error);
        }
    }

    const updateUri = (wcuri: string) => {
        setWCuri(wcuri)
    }

    const getUri = () => {
        return wcuri
    }

    // const getAppMetadata = () => {
    //     return appMetadata
    // }

    const onSessionProposal = React.useCallback(
        (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
            setCurrentProposal(proposal);
            if (Boolean(proposal?.params.proposer.metadata)) {
                setAppMetadata(proposal?.params.proposer.metadata)
            }
        },
        []
    );

    async function handleAccept() {
        const { id, params } = currentProposal;
        const { requiredNamespaces, relays } = params;
        console.log('methods', requiredNamespaces)
        const account = await getPublicKey()
        if (currentProposal) {
            const namespaces: SessionTypes.Namespaces = {};
            Object.keys(requiredNamespaces).forEach((key) => {
                console.log('account', account)
                const accounts: string[] = [];
                requiredNamespaces[key].chains.map((chain: any) => {
                    accounts.push(`${chain}:${account}`)
                    // [stellarAddress].map((acc) => accounts.push(`${chain}:${acc}`));
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
            setModalVisible(false)
        }
    }

    async function disconnect() {
        const activeSessions = await web3wallet.getActiveSessions();
        const topic = Object.values(activeSessions)[0].topic;

        if (activeSessions) {
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
            const { topic, params } = requestEvent;
            const { request } = params;

            // get the request method to determine what to do
            const requestSessionData =
                web3wallet.engine.signClient.session.get(topic);
            setRequestSession(requestSessionData);
            setRequestEventData(requestEvent);
            setModalVisible(true)
        },
        []
    );



    const url = ''


    const signTransaction = async () => {
        if (requestEventData !== null) {
            console.log('signing Transaction')

            const { topic, params, id } = requestEventData
            const { request } = params
            console.log('request', request)
            console.log('topic', topic)
            console.log('id', id)
            const signedXDR = await signTX(request?.params?.xdr)
            console.log('signedXDR', signedXDR)
            setRequestEventData(null)
            await web3wallet.respondSessionRequest({ topic, response: { id: id, result: { signedXDR }, jsonrpc: '2.0' } })
            setModalVisible(!modalVisible);
        } else {
            console.log('no requestEventData')
        }
    }

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
                successfulSession
            }}
        >
            <Header />
            {children}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>

                        {currentProposal?.params.proposer.metadata.name &&
                            <View>
                                {/* <Image
                            style={{ height: 25, width: 25 }}
                            source={{ uri: `${currentProposal?.params.proposer.metadata.icons[0]}` }}
                        /> */}
                                <Text style={{ color: colors.primary[2400], ...texts.H4Bold }}>{currentProposal?.params.proposer.metadata.name}</Text>
                                <Text style={{ color: colors.primary[2000], ...texts.P2Medium }}>{currentProposal?.params.proposer.metadata.description}</Text>
                                <Text style={{ color: colors.primary[2700], ...texts.P3Medium }}>{currentProposal?.params.proposer.metadata.url}</Text>
                                <View style={{ marginTop: 24, gap: 8 }}>
                                    <Button text="Accept" onPress={() => handleAccept()} buttonStyle={{ full: true }} />
                                    <Button text="Cancel" onPress={() => handleReject()} buttonStyle={{ full: true }} />
                                </View>
                            </View>
                        }


                        {requestEventData?.params?.request?.params?.xdr &&
                            <View>
                                <Text style={{ color: colors.primary[2400], ...texts.H4Bold }}>Challenge</Text>
                                <Text style={{ color: colors.primary[1700], ...texts.P3Medium }}>{requestEventData?.params?.request?.params?.xdr}</Text>
                                <View style={{ marginTop: 24, gap: 8 }}>
                                    <Button text="Sign" onPress={() => signTransaction()} buttonStyle={{ full: true }} />
                                    <Button text="Cancel" onPress={() => setModalVisible(!modalVisible)} buttonStyle={{ full: true }} />
                                </View>
                            </View>
                        }
                    </View>
                </View>
            </Modal>
        </WalletContext.Provider>
    );
};

export const useWallet = (): WalletContextType => {
    return React.useContext(WalletContext);
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    tinyLogo: {
        height: 50,
        width: 50
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        textAlign: 'center',
    },
});

