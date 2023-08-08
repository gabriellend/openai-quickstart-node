import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const song = req.body.song || "";
  if (song.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid song",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(song),
      temperature: 1.25,
      max_tokens: 150,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(song) {
  const capitalizedSong = song[0].toUpperCase() + song.slice(1).toLowerCase();
  return `Suggest three musical theater songs similiar in tone, character, vocal range, and style to ${capitalizedSong} that I could use in an audition for the character that sings this song. Only include songs that are not in the same musical as the song.

Song: Defying Gravity
Similiar Songs Format: 1) Watch What Happens - Newsies, 2) Astonishing - Little Women, 3) Out Here on My Own - Fame
Song: Breathe
Similiar Songs Format: 1) On My Own - Les Miserables, 2) She Used to Be Mine - Waitress, 3) The Life I Never Led - Sister Act
Song: ${capitalizedSong}
Similiar Songs:`;
}
