import React, { useState, useEffect } from 'react';
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = SpeechRecognition ? new SpeechRecognition() : null;

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    if (!mic) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    // You can set language to my-MM for Myanmar, or en-US for English
    mic.continuous = true;
    mic.interimResults = true;
    mic.lang = 'my-MM'; 

    mic.onstart = () => {
      console.log('Mic is on');
    };

    mic.onresult = event => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setTranscript(currentTranscript);
    };

    mic.onerror = event => {
      console.error("Speech Recognition Error:", event.error);
    };

    mic.onend = () => {
      if (isListening) {
        mic.start();
      } else {
        console.log('Mic is off');
      }
    };

    if (isListening) {
      mic.start();
    } else {
      mic.stop();
    }

    return () => {
      mic.stop();
    };
  }, [isListening]);

  const handleSaveNote = () => {
    if (transcript.trim() !== "") {
      setSavedNotes([...savedNotes, transcript]);
      setTranscript('');
    }
  };

  const clearNotes = () => {
    setSavedNotes([]);
    setTranscript('');
  }

  return (
    <div className="App">
      <h1>🎙️ ASR Template (React) 🙈</h1>
      <p>ကိုကို့အတွက် တုန်လေးရေးပေးထားတဲ့ အသံဖမ်း Template လေးပါ</p>

      {!mic && (
        <p style={{color: 'red'}}>
          Sorry Ko Ko, your browser doesn't support the Web Speech API. 😢
        </p>
      )}

      <div className="controls">
        <button 
          onClick={() => setIsListening(prev => !prev)}
          className={isListening ? "btn-stop" : "btn-start"}
        >
          {isListening ? '🛑 Stop Listening' : '🔴 Start Listening'}
        </button>
        <button onClick={handleSaveNote} disabled={!transcript} className="btn-save">
          💾 Save Note
        </button>
        <button onClick={clearNotes} className="btn-clear">
          🗑️ Clear
        </button>
      </div>

      <div className="main-content">
        <div className="box">
          <h2>Current Note: {isListening ? "Listening..." : "Stopped"}</h2>
          <p className="transcript">{transcript || "Speak something..."}</p>
        </div>

        <div className="box">
          <h2>Saved Notes</h2>
          <ul style={{textAlign: 'left'}}>
            {savedNotes.map((note, index) => (
              <li key={index}>{note}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
