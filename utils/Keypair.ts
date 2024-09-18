import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

interface KeyPair {
    publicKey: string;
    privateKey: string;
}

function generateKeyPair(): KeyPair {
    const keyPair = nacl.box.keyPair();
    return {
        publicKey: naclUtil.encodeBase64(keyPair.publicKey),
        privateKey: naclUtil.encodeBase64(keyPair.secretKey)
    };
}

function computeSharedSecret(ownPrivateKey: string, otherPublicKey: string): string {
    const ownSecretKey = naclUtil.decodeBase64(ownPrivateKey);
    const othersPublicKey = naclUtil.decodeBase64(otherPublicKey);
    const sharedSecret = nacl.scalarMult(ownSecretKey, othersPublicKey);

    return naclUtil.encodeBase64(sharedSecret);
}

export { generateKeyPair, computeSharedSecret };
