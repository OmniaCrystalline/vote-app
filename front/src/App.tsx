import { useEffect, useState } from 'react'
import './App.css'
import Update from './Update'
import Loader from './Loader'

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


function App() {
  const [joke, setjoke] = useState<IJoke | null>(null)
  const [err, seterr] = useState(null)
  const [loading, setloading] = useState(false)
  const [voted, setvoted] = useState<string[]>([])
  const [update, setupdate] = useState<boolean>(false)

  const deleteJoke = () => {
    if (joke) {
      setloading(true)
      fetch(`http://localhost:5000/api/joke/${joke._id}`, {
        method: 'DELETE'
      }).then(() => newJoke())
        .catch(e => seterr(e.message))
        .finally(() => setloading(false))
    }
  }

  const handleReaction = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLButtonElement;
    //did not voted yet with this reaction
    if (joke && !voted.includes(target.value)) {
      //update reactions (add 1 vote)
      setjoke((prevJoke) => {
        if (!prevJoke) return prevJoke;
        return {
          ...prevJoke,
          votes: prevJoke.votes.map((vote) =>
            vote.label === target.value ? { ...vote, value: vote.value + 1 } : vote
          ),
        };
      });

      //add reaction to array with voted reactions
      setvoted(voted.includes(target.value) ? voted.filter(e => e !== target.value) : [...voted, target.value])
      setloading(true)
      fetch(`http://localhost:5000/api/joke/${joke._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(joke?.votes)
      }).catch(e => seterr(e.message))
        .finally(() => setloading(false))
    }

    //alredy voted with this reaction 
    else if (joke && voted.includes(target.value)) {

      //update reactions (remove prev reaction on front)
      setjoke((prevJoke) => {
        if (!prevJoke) return prevJoke;
        return {
          ...prevJoke,
          votes: prevJoke.votes.map((vote) =>
            vote.label === target.value ? { ...vote, value: vote.value - 1 } : vote
          ),
        };
      })
      //remove reaction from db
      setloading(true)
      fetch(`http://localhost:5000/api/joke/${joke._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(joke?.votes)
      }).catch(e => seterr(e.message))
        .finally(() => setloading(false))

      // remove reaction from array with voted reactions
      setvoted(voted.includes(target.value) ? voted.filter(e => e !== target.value) : [...voted, target.value])
    }
  }


  //new joke on click
  const newJoke = () => {
    setloading(true)
    fetch('http://localhost:5000/api/joke')
      .then(res => res.json())
      .then(res => setjoke(res))
      .catch(err => seterr(err.message))
      .finally(() => setloading(false))
  }

  //new joke on mount
  useEffect(() => {
    newJoke()
  }, [])

  return (
    <div className='max-w-2xl ml-auto mr-auto bg-amber-100 grid place-items-center min-h-screen'>
      <div className='min-h-36 min-w-72'>
        <h1 className='text-center text-xl'>Joke of the day:</h1>
        {loading ? <Loader /> : <p className='h-7'></p>}
        {joke && <>
          <div className='min-h-36 w-72 grid gap-5 place-content-center py-5 px-7 bg-amber-600 rounded-4xl text-white'>
            <p>- {joke.question}</p>
            <p>- {joke.answer}</p>
          </div>
          <div className='flex gap-5 mt-5 justify-evenly' onClick={handleReaction}>
            {joke.availableVotes.map((e, index) => <button key={e as string} value={e as string} type='button'>{e}({joke.votes[index].value})</button>)}
          </div></>}
        <div className='flex mt-5 mb-5 gap-5 justify-between'>
          <button className='border px-2 border-blue-800 w-24' onClick={newJoke} type='button'>new joke</button>
          <button className='border px-2 border-red-800' onClick={deleteJoke} type='button'>❌</button>
          <button className='border px-2 border-green-800 w-24' onClick={() => setupdate(!update)} type='button'>{!update ? 'update' : 'close'}</button>
        </div>
        {joke && update && <Update setjoke={setjoke} id={joke._id} />}
        {err ? <p className='h-12'>{err}</p> : <p className='h-12'></p>}
      </div>
    </div>
  )
}

export default App
