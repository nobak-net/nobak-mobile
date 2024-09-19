
import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import { useWallet } from '@/src/context/WalletContext';
// import { SignClientTypes, SessionTypes } from "@walletconnect/types";
// import {
//     useInitialization,
//     web3wallet,
//     web3WalletPair,
// } from "@/src/utils/WalletConnect";
// import { getSdkError } from '@walletconnect/utils'

export default function ResultPage() {
    const { getUri, pair, disconnect, successfulSession } = useWallet()
    console.log('URI IS', getUri())


    // const initialized = useInitialization(); // This will now correctly be a boolean
    // const [stellarAddress, setStellarAddress] = React.useState('');

    // React.useEffect(() => {
    //     (async () => {
    //         const storedAddress = await SecureStore.getItemAsync('stellarAddress');
    //         if (storedAddress) {
    //             setStellarAddress(storedAddress);
    //         }
    //     })();
    // }, []);

    // const { data } = useGlobalSearchParams();
    // const [wcuri, setWCuri] = React.useState("")
    // const [currentProposal, setCurrentProposal] = React.useState();
    // const [actionRequired, setActionRequired] = React.useState(false);
    // const [requestSession, setRequestSession] = React.useState<any>(null);
    // const [requestEventData, setRequestEventData] = React.useState<any>(null);
    // const [successfulSession, setSuccessfulSession] = React.useState(false);

    // React.useEffect(() => {
    //     if (typeof data === 'string') setWCuri(data)
    // }, [data])

    // async function pair() {
    //     try {
    //         const pairing = await web3WalletPair({ uri: wcuri });
    //         console.log('Pairing successful:', pairing);
    //         return pairing;
    //     } catch (error) {
    //         console.error('Pairing failed:', error);
    //     }
    // }


    // const onSessionProposal = React.useCallback(
    //     (proposal: SignClientTypes.EventArguments["session_proposal"]) => {
    //         setActionRequired(true);
    //         console.log('action true', proposal)
    //         setCurrentProposal(proposal);
    //     },
    //     []
    // );

    // async function handleAccept() {
    //     const { id, params } = currentProposal;
    //     const { requiredNamespaces, relays } = params;

    //     if (currentProposal) {
    //         const namespaces: SessionTypes.Namespaces = {};
    //         Object.keys(requiredNamespaces).forEach((key) => {
    //             const accounts: string[] = [];
    //             requiredNamespaces[key].chains.map((chain: any) => {
    //                 accounts.push(`${chain}:GDSNEEB3GWCNNNRTOKPXNGGRHTSCBDZRCWUFX4EYIJK2JJVPT2PHH57H`)
    //                 // [stellarAddress].map((acc) => accounts.push(`${chain}:${acc}`));
    //             });

    //             namespaces[key] = {
    //                 accounts,
    //                 methods: requiredNamespaces[key].methods,
    //                 events: requiredNamespaces[key].events,
    //             };
    //         });

    //         await web3wallet.approveSession({
    //             id,
    //             relayProtocol: relays[0].protocol,
    //             namespaces,
    //         });

    //         setActionRequired(false);
    //         setWCuri("");
    //         setCurrentProposal(undefined);
    //         setSuccessfulSession(true);
    //     }
    // }

    // async function disconnect() {
    //     const activeSessions = await web3wallet.getActiveSessions();
    //     const topic = Object.values(activeSessions)[0].topic;

    //     if (activeSessions) {
    //         await web3wallet.disconnectSession({
    //             topic,
    //             reason: getSdkError("USER_DISCONNECTED"),
    //         });
    //     }
    //     setSuccessfulSession(false);
    // }

    // async function handleReject() {
    //     const { id } = currentProposal;

    //     if (currentProposal) {
    //         await web3wallet.rejectSession({
    //             id,
    //             reason: getSdkError("USER_REJECTED_METHODS"),
    //         });

    //         //   setModalVisible(false);
    //         setWCuri("");
    //         setCurrentProposal(undefined);
    //     }
    // }

    // const onSessionRequest = React.useCallback(
    //     async (requestEvent: SignClientTypes.EventArguments["session_request"]) => {
    //         const { topic, params } = requestEvent;
    //         const { request } = params;

    //         const requestSessionData =
    //             web3wallet.engine.signClient.session.get(topic);
    //         setRequestSession(requestSessionData);
    //         setRequestEventData(requestEvent);
    //         setActionRequired(true)
    //         //   switch (request.method) {
    //         //     case EIP155_SIGNING_METHODS.ETH_SIGN:
    //         //     case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    //         //       setRequestSession(requestSessionData);
    //         //       setRequestEventData(requestEvent);
    //         //       setSignModalVisible(true);
    //         //       return;
    //         //   }
    //     },
    //     []
    // );

    // React.useEffect(() => {
    //     if (initialized) {
    //         web3wallet?.on("session_proposal", onSessionProposal);
    //         web3wallet?.on("session_request", onSessionRequest);
    //     }
    // }, [initialized]);
    // console.log("requestSession.peer", requestSession?.peer)
    // console.log("requestSession.metadata", requestSession?.peer?.metadata)
    // console.log("requestSession.name", requestSession?.peer?.name)

    return (
        <View style={styles.container}>
            {/* <Text style={styles.label}>Scanned QR Code:</Text>
            <Text style={styles.data}>{wcuri}</Text>
            {!!requestSession && <>
                <Text>{requestSession?.peer.metadata.name}</Text>
                <Text>{requestSession?.peer.metadata.description}</Text>
                <Text>{requestSession?.peer.metadata.icons[0]}</Text>
                <Text>{requestSession?.peer.metadata.url}</Text>
            </>} */}
            {Boolean(getUri()) && <Button onPress={() => pair()} title="Pair Session" />}
            {successfulSession && <Button onPress={() => disconnect()} title='Disconnect' />}
            {/* {actionRequired && <Button onPress={() => handleAccept()} title="Accept" />} */}
            {/* {!!requestSession && <Button onPress={()=> disconnect()} title="Disconnect" />} */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 20,
    },
    data: {
        fontSize: 16,
        textAlign: 'center',
    },
});

