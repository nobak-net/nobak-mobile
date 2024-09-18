import CryptoJS from "crypto-js";

const encrypt = (payload: string | object, secret: any) => {
  let data;
  if (typeof payload === 'object') {
    data = JSON.stringify(payload);
  } else {
    data = payload;
  }

  const key = CryptoJS.SHA256(secret);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv });

  const output = {
    iv: iv.toString(CryptoJS.enc.Hex),
    content: encrypted.toString()
  };
  return btoa(JSON.stringify(output));
};

const decrypt = (encryptedPayload: any, secret: string) => {
  const key = CryptoJS.SHA256(secret);
  const iv = CryptoJS.enc.Hex.parse(encryptedPayload.iv);
  const decrypted = CryptoJS.AES.decrypt(encryptedPayload.content, key, { iv: iv });

  return decrypted.toString(CryptoJS.enc.Utf8);
};

export { decrypt, encrypt };