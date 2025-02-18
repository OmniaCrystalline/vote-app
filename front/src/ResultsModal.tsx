export interface Res {
    _id: string, question: string, answer: string,
    votes: { _id: string, label: string, value: number }[]
}

interface ResultsModalProps {
    results: Res[];
    setresult: (results: []) => void;
}

const ResultsModal: React.FC<ResultsModalProps> = (props) => {
    return (
        <div onClick={() => props.setresult([])} className="bg-rose-100 absolute top-0 left-0 right-0 bottom-0 min-h-screen p-5 grid gap-3">
            {props.results.map(e =>
                <div key={e._id}>
                    <span>-{e.question}</span>
                    <span>-{e.answer}</span>
                    <ul className="flex gap-5">votes:{
                        e.votes.map((b) => <li key={b._id}>
                            <b>{b.label}</b>-<i>{b.value}</i>
                        </li>)
                    }</ul>
                </div>
            )}
        </div>
    )
}

export default ResultsModal