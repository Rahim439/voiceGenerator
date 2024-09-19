import React, { useState } from "react";

const PlayHTTextToSpeech = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const synthesizeSpeech = (text) => {
    const url = "/api/v2/tts";
    const body = {
      text: text,
      voice:
        "s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json",
      output_format: "mp3",
      voice_engine: "PlayHT2.0",
    };

    setIsLoading(true);

    fetch(url, {
      method: "POST",
      headers: {
        accept: "text/event-stream",
        "content-type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_PLAYHT_API_KEY}`,
        "X-USER-ID": import.meta.env.VITE_PLAYHT_USER_ID,
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((data) => {
        const audio = new Audio(data.audio_url);
        audio.play();
      })
      .catch((err) => {
        console.error("Text-to-speech error:", err);
        alert("Error synthesizing speech. Check console for details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    synthesizeSpeech(text);
  };

  return (
    <div className="max-w-md p-6 mx-auto mt-10 bg-white rounded-lg shadow-xl">
      <h1 className="mb-4 text-2xl font-bold text-center">
        Text to Speech with PlayHT
      </h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none"
          placeholder="Enter text to convert to speech..."
          required
        />
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-semibold mt-4 ${
            isLoading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Convert to Speech"}
        </button>
      </form>
    </div>
  );
};

export default PlayHTTextToSpeech;
