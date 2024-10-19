import './App.css'
import {useEffect, useState} from "react";
import axios from "axios"
import ReactMarkdown from 'react-markdown';

function App() {
  const [image, setImage] = useState(null)
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false);
  const [markdownContent, setMarkdownContent] = useState('');

 

  const uploadImage=async()=>{
    try{
      
        const formData = new FormData()
        formData.append('file', image)
    
        const response = await axios.post("http://localhost:8000/upload", formData)
      // const data = await response.json();
      alert(response?.data?.message)
      
  }catch(err){
    console.error(err);
    setError("something went wrong")
  }
  }

  useEffect(()=>{
    if(!image){
      console.log("No image selected")
    }else{
      uploadImage()
    }
   },[image])

  const analyzeImage=async()=>{
    
    try{
      setLoading(true)
      if(!image){
        const response = await axios.post('http://localhost:8000/gemini/text', JSON.stringify({message: value}), {headers: {"Content-Type": "application/json"}})
        const data = await response?.data;
        setMarkdownContent(data);
        // console.log(response)
        setResponse(data)
        setLoading(false)
      }else{
      const response = await axios.post('http://localhost:8000/gemini', JSON.stringify({message: value}), {headers: {"Content-Type": "application/json"}})
      const data = await response?.data;
      setMarkdownContent(data);
      // console.log(response)
      setResponse(data)
      setLoading(false)
      }
    }catch(err){
      console.error(err);
      setError("Something Went wrong");
      setLoading(false)
    }
  }

  const clear =()=>{
    setError("")
    setResponse("");
    setValue("")
    setImage(null)
  }

  return (
    <div className='theApp'>
      <header className='theHead'>
        <h1>Cold AI</h1>
      </header>
      <main className="theMain">
      <div className='theContents'>
      {image && <img src={URL.createObjectURL(image)} style={{width: 200, height: 200}} />}
      
      <input onChange={(e)=> setImage(e.target.files[0])} id="files" accept="image/*" type="file" hidden/>
      <div>
        {/* <p>What do you want to know about the image</p> */}
        {error && <p>{error}</p>}
        {/* {response && <p>{response}</p>} */}
        {response && <ReactMarkdown>{markdownContent}</ReactMarkdown>}
        
        <div className='theActions'>
        <textarea value={value} onChange={(e)=> setValue(e.target.value)} placeholder="ask a question..." className='theInput' />
        {(!response && !error) && <button onClick={analyzeImage}>{loading? "Loading...": "Ask"}</button>}
        <button onClick={clear}>Clear</button>
        <label htmlFor="files" className='theLabel'>Upload</label>
        </div>
      </div>
      </div>
      </main>
    </div>
  )
}

export default App
