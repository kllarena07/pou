'use client';

import { useState } from "react";
import GradientCanvas from "@/components/GradientCanvas";

interface Item {
  text: string;
  completed: boolean;
  date: string;
  status: string;
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const [items1, setItems1] = useState<Item[]>([
    { text: 'Alert #1', completed: false, date: '2025-02-08', status: 'Critical' },
    { text: 'Alert #2', completed: false, date: '2025-02-07', status: 'Critical' },
    { text: 'Alert #3', completed: false, date: '2025-02-06', status: 'Critical' },
  ]);

  const [items2, setItems2] = useState<Item[]>([
    { text: 'Refactor Code', completed: false, date: '2025-02-05', status: 'In Progress' },
    { text: 'Write Documentation', completed: false, date: '2025-02-04', status: 'In Progress' },
    { text: 'Test Application', completed: false, date: '2025-02-03', status: 'Pending' },
  ]);

  return (
    <>
      <GradientCanvas />
      <div className="min-h-screen flex flex-col items-center justify-center text-white space-y-4 overflow-auto">
        {/* Box Container */}
        <div
          className={`p-4 w-full max-w-4xl rounded-lg flex-shrink transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'ml-[160px]' : 'ml-0' // Match sidebar width for shrinking behavior
          }`}
        >
          {/* Box 1 */}
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg mb-4"> {/* Added margin-bottom for spacing */}
            <h3 className="text-xl font-semibold mb-2">Repository: Learn React</h3>
            <table className="w-full table-auto text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2">Alerts</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {items1.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-700 cursor-pointer">
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

          {/* Box 2 */}
          <div className="p-4 bg-gray-800 rounded-lg shadow-lg mb-4"> {/* Added margin-bottom for spacing */}
            <h3 className="text-xl font-semibold mb-2">Outdated Repositories</h3>
            <table className="w-full table-auto text-left">
              <thead>
                <tr>
                  <th className="px-4 py-2">Repository</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {items2.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-700 cursor-pointer">
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
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-full bg-black text-white p-4 transform transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:w-40`}
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
