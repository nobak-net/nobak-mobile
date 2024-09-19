import { router } from 'expo-router';
import * as React from 'react';
import AppConfig from '@/src/utils/AppConfig';
import Device from '@/src/utils/Device';
import APIService from '@/src/utils/APIService';
import * as Localization from 'expo-localization';

interface AppProviderProps extends React.PropsWithChildren<{}> {
}

const AppContext = React.createContext<{} | null>(null);

// This hook can be used to access the user info.
export function useApp() {
    return React.useContext(AppContext);
}

export function AppProvider({ children }: AppProviderProps) {
    const { useLocales } = Localization;
    const [localization] = React.useState(useLocales())


    React.useEffect(() => {
        (async () => {
            const settings = await AppConfig.initialize();
            const { data } = await APIService.health()

            if (data.status === 'ONLINE') {
                const { currencyCode, languageCode, regionCode } = localization[0];
                await Device.init({ currencyCode, languageCode, regionCode })
                // if (!settings.tour) {
                //     router.push('/onboard/greetings')
                // }
            } else if (data.status === 'OFFLINE') {
                router.push('/offline')
            }
        })();
    }, []);

    return (
        <AppContext.Provider
            value={{

            }}>
            {children}
        </AppContext.Provider>
    );
}

