import { useContext, useRef, useState } from "react";
import { SessionContext } from "./helpers/variables"
import { login, signup } from "./helpers/func";
import { ModalProps } from "./helpers/interfaces";

const Modal = (props: ModalProps) => {
    const { setuser, user } = useContext(SessionContext);
    const [error, seterror] = useState<string | null>(null)
    const [loading, setloading] = useState<boolean>(false)
    const nameR = useRef<HTMLInputElement>(null)
    const passR = useRef<HTMLInputElement>(null)
    const emailR = useRef<HTMLInputElement>(null)
    const passL = useRef<HTMLInputElement>(null)
    const emailL = useRef<HTMLInputElement>(null)

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        const name = nameR.current?.value;
        const pass = passR.current?.value;
        const email = emailR.current?.value;

        if (name && pass && email) {
            setloading(true)
            const r = await signup({ name, pass, email })
            if (r._id) {
                setuser({
                    ...user,
                    name: r.name,
                    token: r.token,
                    pass: r.pass,
                    email: r.email
                });
                localStorage.setItem('user', r.name)
                setloading(false)
                props.setmodal(!props.modal)
            }
            else if (r.message) {
                setloading(false)
                seterror(r.message)
            }
        }
    }

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        const pass = passL.current?.value;
        const email = emailL.current?.value;
        if (email && pass) {
            setloading(true)
            const r = await login({ email, pass })
            if (r._id) {
                setuser({
                    name: r.name,
                    token: r.token,
                    pass: r.pass,
                    email: r.email
                })
                localStorage.setItem('user', r.name)
                setloading(false)
                props.setmodal(!props.modal)
            }
            if (r?.message) {
                seterror(r.message)
                setloading(false)
            }
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




