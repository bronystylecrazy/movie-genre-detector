import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { Toaster, toast } from "react-hot-toast";
import Image from "./Image";
import "./index.scss";
import movie_genre_generator from "/movie_genre_generator.png";

export type TResult = {
  plot: string;
  genre: string;
};

function App() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TResult | null>(null);
  async function back() {
    setResult(null);
    setLoading(false);
    setText("");
  }

  async function detectNow() {
    if (text.trim() === "") return toast.error("Please provide me some text!");
    setLoading(true);
    await axios
      .post(
        `/api`,
        {},
        {
          params: {
            text,
          },
        }
      )
      .then(({ data }) => {
        setResult(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        background: "#4608ad",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
      }}
    >
      <Toaster />
      {result === null && (
        <Box
          sx={{
            width: "100%",
            maxWidth: "720px",
            padding: 3,
            borderRadius: 3,
            background: "white",
            boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }} justifyContent="center">
            <Box
              sx={{
                width: "150px",
                height: "150px",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <Image src={movie_genre_generator} />
            </Box>
            <Stack display="flex" alignItems="center" justifyContent="center">
              <Typography
                fontSize="48px"
                lineHeight={1.1}
                fontWeight="600"
                color="black"
              >
                Movie Genre
              </Typography>
              <Typography fontSize="48px" lineHeight={1.1} className="fancy">
                Generator
              </Typography>
            </Stack>
          </Box>
          <TextField
            fullWidth
            label="Your any plot!"
            multiline
            rows={15}
            variant="filled"
            sx={{ borderRadius: 3 }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />

          <LoadingButton
            sx={{ padding: 2, background: "#4608ad" }}
            variant="contained"
            onClick={detectNow}
            loading={loading}
          >
            Detect Now!
          </LoadingButton>
        </Box>
      )}

      {result !== null && (
        <Box
          sx={{
            width: "100%",
            maxWidth: "720px",
            padding: 3,
            borderRadius: 3,
            background: "white",
            boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.1)`,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", gap: 3 }} justifyContent="center">
            <Box
              sx={{
                width: "150px",
                height: "150px",
                borderRadius: 3,
                overflow: "hidden",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Image
                key={result.genre}
                src={`https://source.unsplash.com/random/300×300/?${result.genre.replaceAll(
                  " ",
                  "-"
                )}`}
              />
            </Box>
            <Stack display="flex" alignItems="center" justifyContent="center">
              <Typography
                fontSize="48px"
                lineHeight={1.1}
                fontWeight="600"
                color="black"
              >
                Movie Genre is
              </Typography>
              <Typography
                fontSize="48px"
                lineHeight={1.1}
                className="fancy"
                textTransform="capitalize"
              >
                "{result.genre}"
              </Typography>
              <ConfettiExplosion
                {...{
                  force: 0.6,
                  duration: 2500,
                  particleCount: 80,
                  width: 1000,
                }}
              />
            </Stack>
          </Box>
          <TextField
            fullWidth
            label="Plot"
            multiline
            rows={15}
            variant="filled"
            sx={{ borderRadius: 3 }}
            value={result.plot}
          />
          <LoadingButton
            sx={{ padding: 2, background: "#4608ad" }}
            variant="contained"
            onClick={back}
            loading={loading}
          >
            Back
          </LoadingButton>
        </Box>
      )}
    </Box>
  );
}

export default App;
