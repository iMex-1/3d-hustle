import { useState, useEffect, useRef } from "react";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

function ScrambleText({ text, isActive, delay = 0, cycleSpeed = 20, pauseSpeed = 40 }) {
  const [displayText, setDisplayText] = useState(text);
  const animationRef = useRef(null);
  const isCancelledRef = useRef(false);

  useEffect(() => {
    // Cancel any ongoing animation
    isCancelledRef.current = true;
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }

    if (!isActive) {
      setDisplayText(text);
      return;
    }

    // Reset and start new animation
    isCancelledRef.current = false;
    setDisplayText("");

    animationRef.current = setTimeout(() => {
      animateText();
    }, delay);

    return () => {
      isCancelledRef.current = true;
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isActive, text, delay]);

  const animateText = async () => {
    const targetText = text.toLowerCase();
    let result = "";

    for (let i = 0; i < targetText.length; i++) {
      if (isCancelledRef.current) return;
      
      const targetChar = targetText[i];
      
      // If it's a space or special char, just add it immediately
      if (!ALPHABET.includes(targetChar)) {
        result += text[i];
        setDisplayText(result);
        await sleep(30);
        continue;
      }

      // Find index of target letter in alphabet
      const targetIndex = ALPHABET.indexOf(targetChar);
      
      // Cycle through letters a to target
      for (let j = 0; j <= targetIndex; j++) {
        if (isCancelledRef.current) return;
        
        const currentChar = text[i] === text[i].toUpperCase() 
          ? ALPHABET[j].toUpperCase() 
          : ALPHABET[j];
        setDisplayText(result + currentChar);
        await sleep(cycleSpeed);
      }
      
      // Add the final correct letter
      result += text[i];
      setDisplayText(result);
      await sleep(pauseSpeed);
    }
  };

  const sleep = (ms) => new Promise((resolve) => {
    animationRef.current = setTimeout(resolve, ms);
  });

  return <span className="scramble-text">{displayText}</span>;
}

export default ScrambleText;
