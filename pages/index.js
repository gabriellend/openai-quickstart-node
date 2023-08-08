import Head from "next/head";
import React, { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [songInput, setSongInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ song: songInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setResult(data.result);
      setSongInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  async function getToken() {
    const apiUrl = "https://accounts.spotify.com/api/token";
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    console.log(clientId);
    console.log(clientSecret);
    // try {
    //   const response = await fetch(apiUrl, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //       Authorization: `Basic ${Buffer.from(
    //         `${clientId}:${clientSecret}`
    //       ).toString("base64")}`,
    //     },
    //     body: "grant_type=client_credentials",
    //   });

    //   const data = await response.json();
    //   // Handle the response data (access token)
    //   console.log(data.access_token);
    // } catch (error) {
    //   // Handle errors
    //   console.error(error);
    // }
  }

  const createPlayer = async (song) => {
    // Spotify's API
    // Request an access token (good for one hour)
    const token = await getToken();
    return "https://open.spotify.com/track/4cxvludVmQxryrnx1m9FqL";
    // Search for the song
  };

  return (
    <div>
      <Head>
        <title>Musical Theater Audition Song Generator</title>
        <link rel="icon" href="/musical-theater-masks.png" />
      </Head>

      <main className={styles.main}>
        <img src="/musical-theater-masks.png" className={styles.icon} />
        <h3>Find me a similar song</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="song"
            placeholder="Enter a musical theatre song"
            value={songInput}
            onChange={(e) => setSongInput(e.target.value)}
          />
          <input type="submit" value="Generate songs" />
        </form>
        <div className={styles.result}>
          {result &&
            result.split(",").map((song, index) => {
              // const playerURL = await createPlayer(song);
              return (
                <React.Fragment key={index}>
                  {song}{" "}
                  {
                    <audio
                      src={
                        "https://open.spotify.com/track/4cxvludVmQxryrnx1m9FqL"
                      }
                      controls
                    />
                  }
                  <br />
                </React.Fragment>
              );
            })}
        </div>
      </main>
    </div>
  );
}
