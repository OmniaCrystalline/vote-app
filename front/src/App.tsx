import { useContext, useEffect, useState } from 'react'
import Update from './Update'
import Loader from './Loader'
import Modal from './Modal'
import ResultsModal from './ResultsModal'
import { Res } from './ResultsModal'
import { newJoke, deleteJoke, getResult, setVotes } from './helpers/func'
import { IJoke } from './helpers/interfaces'
import { SessionContext } from './helpers/variables'


function App() {
  const { user, setuser } = useContext(SessionContext)
  const [joke, setjoke] = useState<IJoke | null>()
  const [err, seterr] = useState(null)
  const [loading, setloading] = useState(false)
  const [voted, setvoted] = useState<string[]>([])
  const [update, setupdate] = useState<boolean>(false)
  const [modal, setmodal] = useState(false)
  const [result, setresult] = useState<Res[]>([])

  const handleResults = async () => {
    setloading(true)
    const data = await getResult()
    setresult(data)
    if (data.message) seterr(data.message)
    setloading(false)
  }
  //logout user
  const logout = () => {
    setuser({
      name: '',
      pass: '',
      token: '',
      email: ''
    })
    localStorage.removeItem("user");
  }
  //delete joke from db on click
  const handleDeleteJoke = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (joke) {
      const target = e.target as HTMLButtonElement;
      setloading(true)
      const r = await deleteJoke(target.value)
      await getJoke()
      alert(r.message)
      setloading(false)
    }
  }
  //add reaction to db
  const handleReaction = async (e: React.MouseEvent<HTMLDivElement>) => {
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
      const data = await setVotes(joke._id, joke.votes)
      if (data.message) seterr(data.message)
      setloading(false)
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
      fetch(`${URL}/joke/${joke._id}`, {
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
  const getJoke = async () => {
    setloading(true)
    const data = await newJoke()
    if (data) setjoke(data)
    if (!data) seterr(data.message)
    setloading(false)
    //reset voted reactions for new joke
    setvoted([])
  }

  //new joke on mount
  useEffect(() => {
    getJoke()
  }, [])



  return (

    <div className='ml-auto mr-auto bg-amber-100 grid place-items-center min-h-screen pb-36'>
      <div className='flex w-screen justify-between'>
        {user.name !== '' ? <span className='ml-5'>Hello, {user && user.name && <span className='text-indigo-400'>{user.name}</span>}!</span> : <span></span>}
        {user.name !== '' && <button
          onClick={handleResults}
          className='text-amber-700 rounded-2xl underline'>results
        </button>}
        <button
          onClick={user.name !== '' ? () => logout() : () => setmodal(!modal)}
          className='bg-indigo-400 px-5 text-amber-50 rounded-2xl mr-5'>{user.name === '' ? 'login' : 'logout'}
        </button>

      </div>
      <div className='min-h-36 min-w-72'>
        <h1 className='text-center text-xl'>Joke of the day:</h1>
        {loading ? <Loader /> : <p className='h-7'></p>}
        {joke && <>
          <div className='min-h-36 w-72 grid gap-5 place-content-center py-5 px-7 bg-amber-600 rounded-4xl text-white'>
            <p><span className="p-2 ">😺</span>: {joke.question}</p>
            <p><span className="p-2 ">😸</span>: {joke.answer}</p>
          </div>
          <div className='flex gap-5 mt-5 justify-evenly'
            onClick={handleReaction}>
            {joke.availableVotes.map((e, index) => <button
              key={e as string}
              value={e as string}
              type='button'>{e}
              {joke.votes[index].value}
            </button>)}
          </div></>}
        <div className='flex mt-5 mb-5 gap-5 justify-between'>
          <button className='border px-2 border-blue-800 w-24' onClick={getJoke} type='button'>new joke</button>
          <button
            className='border px-2 border-red-800'
            onClick={handleDeleteJoke}
            value={joke?._id}
            type='button'>❌
          </button>
          <button className='border px-2 border-green-800 w-24' onClick={() => setupdate(!update)} type='button'>{!update ? 'update' : 'close'}</button>
        </div>
        {joke && update && <Update setjoke={setjoke} id={joke._id} />}
        {err ? <p className='h-12'>{err}</p> : <p className='h-12'></p>}
        {modal && <Modal modal={modal} setmodal={setmodal} />}
        {result.length > 0 && <ResultsModal setresult={setresult} results={result} />}
      </div>
    </div>

  )
}

export default App
