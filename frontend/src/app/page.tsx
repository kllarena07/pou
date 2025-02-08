'use client';  // This tells Next.js to treat the component as a client-side component

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [items, setItems] = useState([
    {
      text: "Example Repos #1",
      completed: false,
    },
    {
      text: "Example Repos #2",
      completed: false,
    },
    {
      text: "Example Repos #3",
      completed: false,
    },
    {
      text: "Example Repos #4",
      completed: false,
    },
    {
      text: "Example Repos #5",
      completed: false,
    },
  ]);

  const toggleCompletion = (index) => {
    const updatedItems = [...items];
    updatedItems[index].completed = !updatedItems[index].completed;
    setItems(updatedItems);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex justify-center items-center w-full">
          {/* Box container with rounded corners */}
          <div className="border border-gray-300 rounded-lg p-6 w-full max-w-md shadow-lg bg-white">
            <ul className="list-inside text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="mb-2 cursor-pointer"
                  onClick={() => toggleCompletion(index)}
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    readOnly
                    className="checkbox"
                  />
                  <span className={item.completed ? 'checked-text' : ''}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
