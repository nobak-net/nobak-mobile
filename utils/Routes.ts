
// Routes.ts
export enum Routes {
    ImportAccount = '/(app)/account/import',
    AddAccount = '/(app)/account/add',
    NewAccount = '/(app)/account/new',
    AccountDetails = '/(app)/account/:publicKey',
    AccountRecoveryChallenge = '/(app)/account/recovery/:methodType',
    // Add other routes
}

export interface RouteParams {
    [Routes.AddAccount]: undefined;
    [Routes.ImportAccount]: undefined;
    [Routes.NewAccount]: undefined;
    [Routes.AccountDetails]: { publicKey: string };
    [Routes.AccountRecoveryChallenge]: { methodType: 'phone_number' | 'email' };
    // Define parameters for other routes
}
