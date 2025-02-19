import { useState } from 'react';
import { ReactNode } from 'react';
import { User } from './helpers/interfaces';
import { SessionContext } from './helpers/variables';

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