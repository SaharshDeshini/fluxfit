import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <div className="dark min-h-screen bg-[#0a0a0a] flex justify-center w-full font-sans">
            <div className="w-full max-w-md bg-black min-h-screen relative overflow-x-hidden shadow-2xl border-x border-zinc-900/50">
                <App />
            </div>
        </div>
    </React.StrictMode>,
)
