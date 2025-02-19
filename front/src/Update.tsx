import { useRef, useState } from "react"
import { IJoke } from "./helpers/interfaces"
import { updateJoke } from "./helpers/func"

const Update = (props: { id: string, setjoke: (joke: IJoke) => void }) => {
    const [err, seterr] = useState(null)
    const [loading, setloading] = useState(false)
    const q = useRef<HTMLTextAreaElement>(null)
    const a = useRef<HTMLTextAreaElement>(null)
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const o: Partial<IJoke> = {}
        console.log(q.current?.value)
        console.log(a.current?.value)
        if (q.current && q.current.value) o.question = q.current.value
        if (a.current && a.current.value) o.answer = a.current.value
        else {
            alert('Fields are empty');
            return;
        }
        setloading(true)
        const data = await updateJoke(props.id,o)
        if (data._id) {
            props.setjoke(data)
            target.reset()
        }
        if(data.message)seterr(data.message)
        setloading(false)
    }
    return (<div className="h-36 w-72 absolute">
        {err && <div className="text-red-600">{err}</div>}
        {loading && <div className="text-blue-500">loading...</div>}
        <form
            id='qa-form'
            onSubmit={handleSubmit}
            className="grid gap-2"
        >
            <textarea  className="px-2 border-amber-300 border-2 rounded h-12" minLength={3} name='question' placeholder='question' ref={q} />
            <textarea className="px-2 border-amber-300 border-2 rounded h-12" minLength={3} name='answer' placeholder='answer' ref={a} />
            <button className="border w-fit px-2 rounded border-cyan-600 justify-self-center">update this joke</button>
        </form>
    </div>
    )
}

export default Update