export interface Account {
    id: string;
    organizations_id: string;
    stellar_address: string;
  }
  
  export interface Method {
    id: string;
    accounts_id: string;
    type: 'stellar_address' | 'phone_number' | 'email'; // Extend as needed
    value: string;
    status: 'VERIFIED' | 'PENDING' | 'REJECTED'; // Extend as needed
  }
  
  export interface Server {
    id: string;
    accounts_id: string;
    servers_id: string;
    account_auth_methods_id: string;
    status: 'AUTHORIZED' | 'UNAUTHORIZED'; // Extend as needed
    is_signer: boolean | null;
  }
  
  export interface Profile {
    account: Account;
    methods: Method[];
    servers: Server[];
  }