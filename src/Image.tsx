import React from "react";

export default function Image({ src }: { src: string }) {
  const [loaded, setLoaded] = React.useState(false);

  function onLoaded() {
    setLoaded(true);
  }

  return (
    <img
      src={src}
      onLoad={onLoaded}
      className={loaded ? "animated-pop-in" : ""}
      height="100%"
    />
  );
}
