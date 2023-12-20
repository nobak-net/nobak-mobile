export class AuthStrategy {
    authenticate() {
        throw new Error('Method "authenticate()" must be implemented.');
    }
}

export class PasswordAuthentication extends AuthStrategy {
  authenticate(onSuccess, onFailure) {
    // Implementation for password authentication
  }
}

export class BiometricAuthentication extends AuthStrategy {
  authenticate(onSuccess, onFailure) {
    // Implementation for biometric authentication
  }
}