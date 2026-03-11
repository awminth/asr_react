import React, { useState, useEffect } from 'react';
import './App.css';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = SpeechRecognition ? new SpeechRecognition() : null;

function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    if (!mic) return;
    
    mic.continuous = true;
    mic.interimResults = true;
    mic.lang = 'my-MM'; 

    mic.onstart = () => console.log('Mic is on');
    mic.onresult = event => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setTranscript(currentTranscript);
    };
    mic.onerror = event => console.error("Speech Recognition Error:", event.error);
    mic.onend = () => {
      if (isListening) mic.start();
    };

    if (isListening) mic.start();
    else mic.stop();

    return () => mic.stop();
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
      <div className="header">
        <h1>Speech to Text Workspace</h1>
        <p>Professional ASR Tool · Custom Built for Ko Ko 🙈</p>
      </div>

      {!mic && (
        <p style={{color: '#dc2626', textAlign: 'center', background: '#fee2e2', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '20px'}}>
          Web Speech API is not supported in this browser. Please use Google Chrome.
        </p>
      )}

      <div className="controls">
        <button 
          onClick={() => setIsListening(prev => !prev)}
          className={isListening ? "btn-stop" : "btn-start"}
        >
          {isListening ? (
            <><span style={{fontSize: '18px'}}>⏹</span> Stop Recording</>
          ) : (
            <><span style={{fontSize: '18px'}}>⏺</span> Start Recording</>
          )}
        </button>
        <button onClick={handleSaveNote} disabled={!transcript} className="btn-save">
          💾 Save Note
        </button>
        <button onClick={clearNotes} className="btn-clear">
          🗑️ Clear All
        </button>
      </div>

      <div className="main-content">
        <div className="box">
          <h2>
            Live Transcript
            <span className={`status-badge ${isListening ? 'status-listening' : 'status-stopped'}`}>
              {isListening ? "● Listening..." : "Idle"}
            </span>
          </h2>
          <p className="transcript">{transcript || "Waiting for audio input..."}</p>
        </div>

        {savedNotes.length > 0 && (
          <div className="box">
            <h2>Saved Notes</h2>
            <ul className="notes-list">
              {savedNotes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;