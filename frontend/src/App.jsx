import { useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'


function App() {
  const [links, setLinks] = useState({
    miniurl: "",
    url: ""
  })

  const changeUrl = (event) => {
    setLinks({...links, url: event.target.value})
  }
  const changeMiniurl = (event) => {
    setLinks({...links, miniurl: event.target.value})
  }

  const minifyHandler = async (event) => {
    event.preventDefault()
    if (!links.miniurl || !links.url) {
      alert('Please fill in both fields!')
      return
    }

    try {
      const res = await axios.post('/minify', links)
      alert('Successfully added miniurl!', res)
    } catch {
      console.error(res)
      alert('Error creating miniurl!')
    }

    setLinks({
      miniurl: "",
      url: ""
    })
  }

  return (
    <>
      <div className='flex flex-col w-screen justify-center items-center'>
        <div className='flex flex-col items-center bg-gray-200 p-5 space-y-10 rounded-lg shadow text-gray-900'>
          <h1 className='text-gray-900'>MiniURL</h1>
          <p>Enter the URL you want to minify and the mini phrase for the URL</p>
          <form className='flex flex-col space-y-5' onSubmit={minifyHandler}>
            <input className='w-sm text-center bg-gray-100 rounded-lg' type='text' 
            value={links.url} onChange={changeUrl} placeholder="Enter original URL"/>
            <input className='w-sm text-center bg-gray-100 rounded-lg' type='text' 
            value={links.miniurl} onChange={changeMiniurl} placeholder="Enter phrase for miniURL"/>
            <button type="submit" className="bg-emerald-600 w-auto self-center cursor-pointer text-white p-3
            rounded-lg hover:bg-emerald-900 transition-colors duration-300 ease-in-out">Minify!</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default App
