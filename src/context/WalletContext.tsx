
import React, { type ReactElement, type FunctionComponent } from "react";
import { Modal, StyleSheet, Text, Pressable, View, Button, Image } from 'react-native';
import { SignClientTypes, SessionTypes } from "@walletconnect/types";
import {
    useInitialization,
    web3wallet,
    web3WalletPair,
} from '../utils/WalletConnect';
import { getSdkError } from '@walletconnect/utils'
// import { router } from 'expo-router';
import { getPublicKey, signTransaction as signTX } from "../utils/StellarAccount";
import { parseXDR } from "../services/parseXDR";
import { Header } from 'nobak-native-design-system'
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
    const [requestSession, setRequestSession] = React.useState<any>(null);
    const [requestEventData, setRequestEventData] = React.useState<any>(null);
    const [successfulSession, setSuccessfulSession] = React.useState(false);

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

    const onSessionProposal = React.useCallback(
        (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
            setCurrentProposal(proposal);
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


            // const response = await web3wallet.respondSessionRequest({ topic, response: { id: requestEvent.id, result: { signedXDR: "AAAAAPewD+/6X8o0bx3bp49Wf+mUhG3o+TUrcjcst717DWJVAAAAyAFvzscADTkNAAAAAAAAAAAAAAACAAAAAAAAAAYAAAACWE1BVEsAAAAAAAAAAAAAAAPvNOuztX4IjvV8pztsEc1/ZnTz0G3p5Cx4vcf04+xUAAONfqTGgAAAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAD2NyeXB0b21hcmluZS5ldQAAAAAAAAAAAAAAAAF7DWJVAAAAQK3vfUCZ8mbjW3ssMd0n1tJTF9Fv6EbuJ6cWKkYXBqG5itqanPbFzIQoZEHbPS8nr2vo4dROvKI0uQzNcfExKwM=" }, jsonrpc: '2.0' } })
            // console.log('response', response)

            // return;



            //   switch (request.method) {
            //     case EIP155_SIGNING_METHODS.ETH_SIGN:
            //     case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
            //       setRequestSession(requestSessionData);
            //       setRequestEventData(requestEvent);
            //       setSignModalVisible(true);
            //       return;
            //   }
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
            // console.timeLog('signTX', topic, id, request)
            // sign the message
            // const signedMessage = await wallet.signMessage(xdr)
            // const response = { id, result: 'XDR_HAS_BEEN_SIGNED', jsonrpc: '2.0' }
            const signedXDR = await signTX(request?.params?.xdr)
            console.log('signedXDR', signedXDR)
            
            setRequestEventData(null)
            await web3wallet.respondSessionRequest({ topic, response: { id: id, result: { signedXDR }, jsonrpc: '2.0' } })
        } else {
            console.log('no requestEventData')
        }
    }

    // console.log('requestSessionData', requestSession)
    // console.log('requestEventData', requestEventData)
    // console.log('requestEventData params', requestEventData?.params)
    // console.log('requestEventData request', requestEventData?.params?.request?.method)
    // console.log('requestEventData prp', parseXDR(requestEventData?.params?.request?.params?.xdr))
    return (
        <WalletContext.Provider
            value={{
                url,
                signTransaction,
                updateUri,
                getUri,
                pair,
                disconnect,
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
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textStyle}>Close</Text>
                        </Pressable>
                        {/* {currentProposal?.params.proposer && */}
                        <View>
                            <Image
                                style={{ height: 25, width: 25 }}
                                source={{ uri: `${currentProposal?.params.proposer.metadata.icons[0]}` }}
                            />
                            <Text>{currentProposal?.params.proposer.metadata.name}</Text>
                            <Text>{currentProposal?.params.proposer.metadata.description}</Text>
                            <Text>{currentProposal?.params.proposer.metadata.url}</Text>

                            <Button title="Accept" onPress={() => handleAccept()} />
                            <Button title="Cancel" onPress={() => handleReject()} />
                        </View>
                        {/* } */}

                        {requestEventData?.params?.request?.params?.xdr &&
                            <View>
                                <Text>Challenge</Text>
                                {/* <Text>{requestEventData?.params?.request?.params?.xdr}</Text> */}
                                <Button title="Sign" onPress={() => signTransaction()} />
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

