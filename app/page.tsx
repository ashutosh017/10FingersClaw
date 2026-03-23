"use client";
import { useEffect, useRef, useState } from "react";
import { words } from "./words";
import { RefreshCcw } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  const wordsArr = words.split(" ", words.length);
  const [base, setBase] = useState(0);
  const currLine = wordsArr.slice(base, base + 10);
  const secondLine = wordsArr.slice(base + 10, base + 20);
  const [mark, setMark] = useState<number[]>([]);
  const [currWord, setCurrWord] = useState<{ word: string; index: number }>({
    word: wordsArr[0],
    index: 0,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [typedWord, setTypedWord] = useState<string>("");
  const [time, setTime] = useState(60);
  const [start, setStart] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);
  const [wrongWords, setWrongWords] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [correctKeyStrokes, setCorrectKeyStrokes] = useState(0);
  const [wrongKeyStrokes, setWrongKeyStrokes] = useState(0);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (start) {
      const id = setTimeout(() => {
        if (time > 0) {
          setTime((prev) => prev - 1);
        } else {
          const total = mark.length;
          const correct = mark.reduce((p, m) => (m === 1 ? p + 1 : p), 0);
          const wrong = total - correct;
          setCorrectWords(correct);
          setWrongWords(wrong);
          setAccuracy(parseFloat(((correct / total) * 100).toFixed(2)));
          setStart(false);
        }
      }, 1000);
      return () => clearTimeout(id);
    }
  }, [start, time, mark]);

  return (
    <div className="container mx-auto">
      <div className="flex justify-end mx-32 items-center mt-8">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={"https://github.com/ashutosh017/10FingersClaw"}
          className="bg-white rounded-full px-4 py-2 text-black w-fit flex items-center cursor-pointer"
        >
          Give it a star
          <FaGithub className="ml-2" />
        </Link>
      </div>
      <div className="border border-white/50 mx-32 mt-8 mb-16  overflow-hidden p-4 text-3xl">
        <div className="flex justify-center">
          {currLine.map((w, i) => {
            return (
              <span
                key={i}
                className={`${
                  currWord.index === i
                    ? `text-black ${currWord.word.startsWith(typedWord) ? "bg-white" : "bg-red-500"}`
                    : ""
                } font-bold ${mark[base + i] === 0 ? "text-red-600" : mark[base + i] ? "text-green-600" : ""} mr-2`}
              >
                {w}
              </span>
            );
          })}
        </div>
        <div className="flex justify-center">
          {secondLine.map((w, i) => {
            return (
              <span key={i} className={`font-bold mr-2`}>
                {w}
              </span>
            );
          })}
        </div>
      </div>
      <div className=" bg-gray-700 py-2 flex justify-center mx-32">
        <input
          onKeyUp={(e) => {
            console.log("key pressed: ", e.key);
            if (e.key === " " || e.key === "Enter") {
              if (typedWord && currWord.word === typedWord) {
                console.log("marked: ", currWord.index);
                setMark((prev) => {
                  prev[base + currWord.index] = 1;
                  return prev;
                });
              } else {
                setMark((prev) => {
                  prev[base + currWord.index] = 0;
                  return prev;
                });
              }
              if ((currWord.index + 1) % 10 === 0) {
                setBase((prev) => prev + 10);
                // setMark([]);
                console.log("base changed");
              }
              setCurrWord((prev) => ({
                word: wordsArr[base + prev.index + 1],
                index: (prev.index + 1) % 10,
              }));
              setTypedWord("");
              if (inputRef.current) {
                inputRef.current.value = "";
              }
            }
          }}
          onChange={(e) => {
            if (time !== 0) {
              if (!start) setStart(true);
              const word = e.target.value.trim();
              setTypedWord(word);
              let len = word.length - 1;
              len = len < 0 ? 0 : len;
              if (currWord.word.at(len) === word.at(len))
                setCorrectKeyStrokes((prev) => prev + 1);
              else setWrongKeyStrokes((prev) => prev + 1);
              console.log(currWord.word);
            }
          }}
          ref={inputRef}
          type="text"
          className="bg-white text-black px-2 py-2 text-2xl w-1/2 "
        />
        <span className="px-4 font-extrabold text-4xl py-2 bg-blue-700 ml-2">
          {time}
        </span>
        <button
          onClick={() => window.location.reload()}
          className="px-4 font-extrabold text-4xl py-2 bg-blue-700 ml-2 cursor-pointer"
        >
          <RefreshCcw />
        </button>
      </div>
      {time === 0 && start === false && (
        <div className="border w-1/5 p-2  mx-32 my-16">
          <h2 className="font-extrabold text-3xl p-4">
            {correctWords + wrongWords}
          </h2>
          <div className="grid grid-cols-2 px-4 pb-4">
            <span>Keystrokes</span>
            <span className=" text-end">
              (<span className="text-green-500">{correctKeyStrokes}</span> |{" "}
              <span className="text-red-500">{wrongKeyStrokes}</span>){" "}
              {correctKeyStrokes + wrongKeyStrokes}
            </span>
            <span>Accuracy</span>
            <span className=" text-end">{accuracy}%</span>
            <span>Correct Words</span>
            <span className="text-green-500 font-bold text-end">
              {correctWords}
            </span>
            <span>Wrong Words</span>
            <span className="text-red-500 font-bold text-end">
              {wrongWords}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
