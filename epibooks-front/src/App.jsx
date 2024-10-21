import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  const [ formData, setFormData] = useState({})

  const handlerInput = (event)=>{
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const onSubmit = async (event)=>{
    event.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/login`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      return await response.json();

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input onChange={handlerInput} name="email" type="email"/>
        <input onChange={handlerInput} name="password" type="password"/>
        <button type="submit">Send</button>
      </form>
    </>
  )
}

export default App
