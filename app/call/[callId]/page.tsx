'use client';
 
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage(){
    const [username, setUsername] = useState('abishek');
    const [callId, setCallId] = useState('test-room');
    const router = useRouter();
    
    

    const joinCall = () => {
        if(!username || !callId) return;
        router.push(`/call/${callId}?user=${username}`)
    }

    return(
        <main className="p-40">
            <h1>Join Video Call</h1>
            <input
            placeholder="Your name"
            value= {username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <br />

             <input
        placeholder="Call ID (room name)"
        value={callId}
        onChange={(e) => setCallId(e.target.value)}
      />
      <br />

      <button  onClick={joinCall}>Join</button>
        </main>
    )
}