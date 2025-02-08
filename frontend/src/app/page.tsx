'use client';

import { useState } from "react";
import Image from "next/image";
import GradientCanvas from "@/components/GradientCanvas";

interface Item {
  text: string;
  completed: boolean;
  date: string; // Date when the task was created
  status: string; // Status of the task (e.g., "In Progress", "Completed")
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [items, setItems] = useState<Item[]>([
    { text: 'Learn React', completed: false, date: '2025-02-08', status: 'Critical' },
    { text: 'Build a To-Do List', completed: false, date: '2025-02-07', status: 'Critical' },
    { text: 'Deploy App', completed: false, date: '2025-02-06', status: 'Critical' },
  ]);

  return (
    <>
      <GradientCanvas />
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="p-4 w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg">
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">Repository</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-700 cursor-pointer"
                >
                  <td className={`px-4 py-2 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                    {item.text}
                  </td>
                  <td className="px-4 py-2">{item.date}</td>
                  <td className="px-4 py-2">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-full w-40 bg-black text-white p-4 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
        >
          <h2 className="text-xl font-bold mb-4">Depobot</h2>
          <ul>
            {[
              { text: "Profile", icon: "/user-round.svg" },
              { text: "Dashboard", icon: "/layout-dashboard.svg" },
              { text: "Settings", icon: "/settings.svg" }
            ].map((item, index) => (
              <li key={index} className="mb-2">
                <a
                  href="#"
                  className="flex items-center p-2 rounded-lg transition duration-200 hover:bg-gray-800"
                >
                  <img src={item.icon} className="w-6 h-6 mr-2 invert" alt={`${item.text} Icon`} />
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Toggle Button (Bottom Left) */}
        <button
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 bg-gray-800 text-white px-3 py-2 rounded-md shadow-lg transition-transform duration-300"
        >
          {sidebarOpen ? (
            <img src="/arrow-left-from-line.svg" className="w-6 h-6 invert" alt="Close Sidebar" />
          ) : (
            <img src="/arrow-right-from-line.svg" className="w-6 h-6 invert" alt="Open Sidebar" />
          )}
        </button>
      </div>
    </>
  );
}
