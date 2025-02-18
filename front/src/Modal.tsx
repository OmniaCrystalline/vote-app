import { useContext, useRef, useState } from "react";
import { SessionContext } from "./SessionContext";
const URL = 'https://vote-app-gq2h.onrender.com'

interface ModalProps {
    setmodal: (modalState: boolean) => void;
    modal: boolean;
}

const Modal = (props: ModalProps) => {
    const { setuser, user } = useContext(SessionContext);
    const [error, seterror] = useState<string | null>(null)
    const [loading, setloading] = useState<boolean>(false)
    const nameR = useRef<HTMLInputElement>(null)
    const passR = useRef<HTMLInputElement>(null)
    const emailR = useRef<HTMLInputElement>(null)
    const passL = useRef<HTMLInputElement>(null)
    const emailL = useRef<HTMLInputElement>(null)

    const handleRegister = (event: React.FormEvent) => {
        event.preventDefault();
        const n = nameR.current?.value;
        const p = passR.current?.value;
        const e = emailR.current?.value;


        if (n && p && e) {
            setloading(true)
            fetch(`${URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({ name: n, pass: p, email: e })
            }).then(r => r.json()).then(r => {
                if (setuser) {
                    setuser({
                        ...user,
                        name: r.name,
                        token: r.token,
                        pass: r.pass,
                        email: r.email
                    });
                    localStorage.setItem('user', r.name)
                    props.setmodal(!props.modal)
                }
            }).catch(e => seterror(e.message)).finally(() => setloading(false))
        }
    }

    const handleLogin = (event: React.FormEvent) => {
        event.preventDefault();
        const p = passL.current?.value;
        const e = emailL.current?.value;
        if (e && p) {
            setloading(true)
            fetch(`${URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ pass: p, email: e })
            }).then(r => r.json()).then(r => {
                if (setuser && r.name) {
                    setuser({
                        ...user,
                        name: r.name,
                        token: r.token,
                        pass: r.pass,
                        email: r.email
                    });
                    localStorage.setItem('user', r.name)
                    props.setmodal(!props.modal)
                } else seterror(r.message)
            }).catch(e => seterror(e.message))
                .finally(() => setloading(false))
        }
    }

    return (
        <div className='bg-white/90 absolute top-0 bottom-0 left-0 right-0 grid place-content-center'>
            <button className="absolute top-5 right-5 rounded-2xl border bg-white px-5 border-neutral-500 text-neutral-500" onClick={(modalState) => props.setmodal(!modalState)}>close</button>
            {loading && <div className="text-blue-500 text-center text-sm">loading...</div>}
            {error && <div className="text-red-500 text-center text-sm">{error}</div>}
            <form className="px-7 py-10 grid gap-3 rounded-2xl bg-white" onSubmit={handleRegister}>
                <h2>Register</h2>
                <input ref={nameR} minLength={3} className="px-2 border rounded border-neutral-500" type="text" placeholder="nickname" required />
                <input ref={emailR} minLength={6} className="px-2 border rounded border-neutral-500" type="text" placeholder="email" required />
                <input ref={passR} minLength={6} className="px-2 border rounded border-neutral-500" type="password" placeholder="password" required />
                <button className="bg-amber-600 rounded text-white">submit</button>
            </form>
            <span className=" place-self-center">or</span>
            <form className="px-7 py-10 grid gap-3 rounded-2xl bg-white" onSubmit={handleLogin}>
                <h2>Login</h2>
                <input ref={emailL} minLength={3} className="px-2 border rounded " type="text" placeholder="email" required />
                <input ref={passL} minLength={6} className="px-2 border rounded " type="password" placeholder="password" required />
                <button className="bg-amber-600 rounded text-white">submit</button>
            </form>
        </div>
    )
}

export default Modal




