import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { Buffer } from '@craftzdog/react-native-buffer';
import crypto from 'react-native-quick-crypto';
import process from 'process/browser';

// Polyfill Buffer globally
global.Buffer = Buffer;

// Polyfill crypto globally
global.crypto = crypto;

// Polyfill process globally
global.process = process;