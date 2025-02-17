import { useRef, useState } from "react"
interface IVote {
    label: String,
    value: number
}

interface IJoke {
    _id: string,
    question: string,
    answer: string,
    votes: IVote[]
    availableVotes: [String]
}

const Update = (props: { id: string, setjoke: (joke: IJoke) => void }) => {
    const [err, seterr] = useState(null)
    const [loading, setloading] = useState(false)
    const q = useRef<HTMLTextAreaElement>(null)
    const a = useRef<HTMLTextAreaElement>(null)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        let o: Partial<IJoke> = {}
        console.log(q.current?.value)
        console.log(a.current?.value)
        if (q.current && q.current.value) o.question = q.current.value
        if (a.current && a.current.value) o.answer = a.current.value
        else {
            alert('Fields are empty');
            return;
        }
        setloading(true)
        fetch(`http://localhost:5000/api/joke/${props.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(o)
        })
            .then(r => r.json())
            .then(r => props.setjoke(r))
            .then(() => target.reset())
            .catch(e => seterr(e.message))
            .finally(() => setloading(false))
    }
    return (<div className="h-36 w-72 absolute">
        {err && <div className="text-red-600">{err}</div>}
        {loading && <div className="text-blue-500">loading...</div>}
        <form
            id='qa-form'
            onSubmit={handleSubmit}
            className="grid gap-2"
        >
            <textarea className="px-2 border-amber-300 border-2 rounded h-12" minLength={3} name='question' placeholder='question' ref={q} />
            <textarea className="px-2 border-amber-300 border-2 rounded h-12" minLength={3} name='answer' placeholder='answer' ref={a} />
            <button className="border w-fit px-2 rounded border-cyan-600 justify-self-center">update this joke</button>
        </form>
    </div>
    )
}

export default Update