import { Stack } from 'expo-router/stack';
import { Tabs } from 'expo-router/tabs';
// import "@ethersproject/shims";
import React from 'react';
// import { Wallet, StellarConfiguration, PublicKeypair } from '@stellar/typescript-wallet-sdk';
// import { encrypt } from '../utils/crypto';
// import { AuthenticationProvider, AuthenticationContext } from '../context/AuthContext';
import { Slot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
// import Crypto from 'react-native-quick-crypto'

export const unstable_settings = {
  initialRouteName: 'sign_in',
};


const sign = async () => {

  // let wallet = new Wallet({
  //   stellarConfiguration: StellarConfiguration.TestNet(),
  // });

  // console.log('wallet', wallet)

  // console.log('stellar', wallet.stellar())
  // const stellar = wallet.stellar();
  // const sponsorKeyPair = PublicKeypair.fromPublicKey('GCVU4AU62R2N6ENOO5ST4T3B2MMANFP47AAN4Z2SP3JRW54BWXID5HIV');


  // const txBuilder = await stellar.transaction({ sourceAddress: sponsorKeyPair });

  // const tx = stellar.decodeTransaction('AAAAAgAAAACskUcNxWrr+ALjM+yExoWwr25Sp/qfsX43tdJ1T+tjDAAAAGQAK8RBAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQAAAACrTgKe1HTfEa53ZT5PYdMYBpX8+ADeZ1J+0xt3gbXQPgAAAAAAAAAAO5rKAAAAAAAAAAABT+tjDAAAAECdn13L1Y374LOvUsMd7LqdQr77yi3pZwss/I5D6Oe3Sxbu5cz2aCmE3y7bJfwaLKJ4TtNr1RULPGVq1qLwGusO')
  // const str = String(tx)
  // console.log('tx', typeof tx, typeof str)



  // const hashed = Crypto.createHash('sha256')
  // .update('Damn, Margelo writes hella good software!')
  // .digest('hex')

  // console.log('hashed', hashed)

  // await wallet.stellar().submitTransaction(tx);
  // const transaction = txBuilder
  //   .sponsoring(sponsorKeyPair, (bldr) => bldr.createAccount(newKeyPair))
  //   .build();
  // const xdrString = newKeyPair.sign(transaction).toXDR();
  // const signedTransaction = stellar.decodeTransaction('AAAAAgAAAACrTgKe1HTfEa53ZT5PYdMYBpX8+ADeZ1J+0xt3gbXQPgAAAGQAK3KAAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAABQAAAAAAAAAAAAAAAAAAAAEAAAAFAAAAAQAAAAUAAAABAAAABQAAAAEAAAAFAAAAAAAAAAAAAAAAAAAAAYG10D4AAABAdJPRnPaZDAQPhx8eR6TXHQ356uaxz7Q6cxri9oDLOoSSzpuKTZmFKkZG3AxLxIvotIJg8pmbHLSmYql2G0HsAg==');

  // console.log("signedTransaction", signedTransaction)
  // return await wallet.stellar().submitTransaction(signedTransaction);
}

export default function Root() {
  // let wallet = Wallet.TestNet();

  // console.log('wallet', wallet)
  // const tx = new Transaction('AAAAAgAAAACrTgKe1HTfEa53ZT5PYdMYBpX8+ADeZ1J+0xt3gbXQPgAAAGQAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAABllXq3AAAAAAAAAAEAAAABAAAAAHoKJ9BDYX3nkKDTqBtdngj5tCHF0Uy6rNgMkPNPA/ahAAAACgAAABpodHRwOi8vbG9jYWxob3N0Ojg3ODggYXV0aAAAAAAAAQAAAAY0ODk0NDQAAAAAAAAAAAABTwP2oQAAAEBxMdki+ePamVgGMY6ZYAo6yC8cHrO3cK3xKZda1D3mCD/0Mzv6X5QAoxD7usdIgebP3DWuUQhs7L46V9cE/noL', 'Test SDF Network ; September 2015')

  // console.log('tx', tx)

  // const keypair = stellar.Keypair.fromSecret('SDTCCKBFOL2IQKNTNTKI2DO4VGCKNVMFFO742OEOLC7T3TRBWETCNS6I')

  // tx.sign(keypair)

  // console.log('tx2', tx)

  // console.log('xdr', tx.toXDR())
  // Set up the auth context and render our layout inside of it.
  React.useEffect(() => {
    sign()
      .then((res) => {
        console.log('res', res)
      })
      .catch((err) => {
        console.log('err', err)
      })

  }, [])

  // const data = encrypt('test', 'test')
  // console.log('data', data) 
  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}

// export default function Layout() {
//     return <>
//         <AuthenticationProvider>
//             <Stack
//                 // https://reactnavigation.org/docs/headers#sharing-common-options-across-screens
//                 screenOptions={{
//                     headerStyle: {
//                         backgroundColor: '#f4511e',
//                     },
//                     headerTintColor: '#fff',
//                     headerTitleStyle: {
//                         fontWeight: 'bold',
//                     },
//                 }}>
//                 {/* Optionally configure static options outside the route. */}
//                 <Stack.Screen name="home" options={{}} />
//             </Stack>
//         </AuthenticationProvider>
//     </>
// }

// export default function AppLayout() {
//     return (
//       <Tabs>
//         <Tabs.Screen
//           // Name of the route to hide.
//           name="index"
//           options={{
//             // This tab will no longer show up in the tab bar.
//             href: null,
//           }}
//         />
//       </Tabs>
//     );
//   }