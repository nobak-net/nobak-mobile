import * as React from 'react';

interface ModalProviderProps extends React.PropsWithChildren<{}> {
}

const ModalContext = React.createContext<{} | null>(null);

export function useModal() {
    return React.useContext(ModalContext);
}

export function ModalProvider({ children }: ModalProviderProps) {


    return (
        <ModalContext.Provider
            value={{

            }}>
            {children}
        </ModalContext.Provider>
    );
}

