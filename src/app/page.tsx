"use client";
import { createMachine } from "xstate";
import { useMachine } from "@xstate/react";
import { useEffect, useState } from "react";

const semaphoreMachine = createMachine({
  id: "semaphore",
  initial: "red",
  states: {
    red: {
      on: { NEXT: "green" },
    },
    green: {
      on: { NEXT: "yellow" },
    },
    yellow: {
      on: { NEXT: "red" },
    },
  },
});

export default function Home() {
  const [current, send] = useMachine(semaphoreMachine);

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;

    if (isRunning) {
      interval = setInterval(() => {
        send({ type: "NEXT" });
      }, 1000);
    }

    // Cleanup interval on component unmount or when stopping the automatic transition
    return () => clearInterval(interval);
  }, [isRunning, send]);

  const toggleRunning = () => {
    setIsRunning((prev) => !prev);
  };

  return (
    <div className="text-center mt-5">
      <div className={`w-24 h-24 rounded-full mx-auto mb-2 ${current.matches("red") ? "bg-red-500" : "bg-gray-300"}`} />
      <div
        className={`w-24 h-24 rounded-full mx-auto mb-2 ${current.matches("yellow") ? "bg-yellow-500" : "bg-gray-300"}`}
      />
      <div
        className={`w-24 h-24 rounded-full mx-auto mb-2 ${current.matches("green") ? "bg-green-500" : "bg-gray-300"}`}
      />
      <button
        onClick={() => send({ type: "NEXT" })}
        className="mt-5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Next
      </button>

      <button
        onClick={toggleRunning}
        className={`mt-5 px-4 py-2 ml-2 ${isRunning ? "bg-red-500" : "bg-green-500"} text-white rounded hover:${
          isRunning ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {isRunning ? "Stop Automatic" : "Start Automatic"}
      </button>
    </div>
  );
}
