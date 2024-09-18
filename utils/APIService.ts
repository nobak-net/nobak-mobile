import Constants from 'expo-constants';
import { runFetch } from './runFetch';
export interface ApiResponse<T> {
    data?: T;
    error?: FetchError; // Define a more specific error type
}

// Custom error type to better describe the fetch errors
interface FetchError {
    status?: number;
    message?: string;
    error?: string;
}

interface RegistrationResponse {
    data: {
        data: {
            app_public_key: string
        }
    }
}

interface HealthResponse {
    data: {
        status: string;
    }
}

class APIService {
    private async postData<T>(endpoint: string, data: object): Promise<ApiResponse<T>> {
        try {
            const { API_URL } = Constants.expoConfig?.extra || {};
            const url = `${API_URL}/${endpoint}`;
            const jsonData = await runFetch({url, method: 'POST', body: data});
            return { data: jsonData };
        } catch (error) {
            return { error: error as FetchError };
        }
    }

    private async getData<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const { API_URL } = Constants.expoConfig?.extra || {};
            const url = `${API_URL}/${endpoint}`;
            const jsonData = await runFetch({url, method: 'GET'});
            return { data: jsonData };
        } catch (error) {
            return { error: error as FetchError };
        }
    }

    async health(): Promise<HealthResponse> {
        const response = await this.getData<HealthResponse>('health');
        return response.data ?? { data: { status: 'OFFLINE' } };
    }

    async registerApp(deviceInfo: object) {
        const response = await this.postData<RegistrationResponse>('devices/new', deviceInfo);
        return response.data ?? { data: { app_public_key: '' } };

    }

    async checkInstallation(installationId: string){
        return await this.getData<RegistrationResponse>(`devices/${installationId}`);
    }
}

export default new APIService();
