import { createContext, useState } from 'react';
import { ReactNode } from 'react';

interface User {
    name: string;
    pass: string;
    token: string;
    email: string;
}


export const SessionContext = createContext<{ user: User; setuser: React.Dispatch<React.SetStateAction<User>> }>({
    user: {
        name: '',
        pass: '',
        token: '',
        email: ''
    },
    setuser: () => {}
});

export default function SessionProvider({ children }: { children: ReactNode }) {
    const [user, setuser] = useState<User>({
        name: localStorage.getItem('user') || '',
        pass: '',
        token: '',
        email: '',
    })
    return (
        <SessionContext.Provider value={{ user, setuser }}>
            {children}
        </SessionContext.Provider>
    )
}