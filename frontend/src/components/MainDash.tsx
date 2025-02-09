"use client";

import "rsuite/dist/rsuite.min.css";
import { Repository } from "../models/Repository";
import Image from "next/image";

interface Item {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  status: string;
}

interface MainDashProps {
  sidebarOpen: boolean;
  repositories: Repository[];
  tasks: Item[];
}

export default function MainDash({
  sidebarOpen,
  repositories,
  tasks,
}: MainDashProps) {
  return (
    <div
      className={`flex-1 p-8 transition-all duration-300 ${
        sidebarOpen ? "ml-40" : "ml-0"
      }`}
    >
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>

      {/* Repository Table Container */}
      <div className="bg-[rgba(30,30,30,0.8)] backdrop-blur-[50px] rounded-[20px] p-6 mb-8 border border-gray-700/50">
        <div className="w-full overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <h2 className="text-xl text-white">Repositories</h2>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="px-4 py-3 text-left font-medium">SELECT</th>
                <th className="px-4 py-3 text-left font-medium">NAME</th>
                <th className="px-4 py-3 text-left font-medium">
                  LAST UPDATED
                </th>
                <th className="px-4 py-3 text-left font-medium">STATUS</th>
                <th className="px-4 py-3 text-left font-medium">ALERTS</th>
                <th className="px-4 py-3 text-left font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {repositories.length == 0 ? (
                <div>
                  <p className="text-right mt-5 text-gray-400">
                    It looks like you haven&apos;t linked any repositories. Go
                    ahead and link one!
                  </p>
                  <div className="h-[420px] transition-all pt-12 duration-500 hover:pt-[0px] hover:opacity-100 hover:filter-none overflow-hidden filter grayscale brightness-[0.35] opacity-50">
                    <Image
                      src="/pou-transparent.png"
                      width="1000"
                      height="600"
                      alt="Pou is sad."
                    />
                  </div>
                </div>
              ) : undefined}
              {repositories.map((repo) => (
                <tr
                  key={repo.id}
                  className="border-b border-gray-700/50 hover:bg-gray-800/50"
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="rounded bg-gray-700/50 border-gray-600"
                    />
                  </td>
                  <td className="px-4 py-4 text-white">{repo.name}</td>
                  <td className="px-4 py-4 text-white">{repo.lastUpdated}</td>
                  <td className="px-4 py-4 text-white">{repo.status}</td>
                  <td className="px-4 py-4 text-white">
                    {repo.alerts.critical}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      <button className="px-4 py-1.5 bg-gray-800/80 hover:bg-gray-700/80 rounded text-sm">
                        Edit
                      </button>
                      <button className="px-4 py-1.5 bg-gray-800/80 hover:bg-gray-700/80 rounded text-sm">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Second Table Container */}
      <div className="bg-[rgba(30,30,30,0.8)] backdrop-blur-[50px] rounded-[20px] p-6 mb-8 border border-gray-700/50">
        <div className="w-full overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <h2 className="text-xl text-white">Outdated Repositories</h2>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-gray-400">
                <th className="px-4 py-2 text-left">SELECT</th>
                <th className="px-4 py-2 text-left">TITLE</th>
                <th className="px-4 py-2 text-left">DATE</th>
                <th className="px-4 py-2 text-left">STATUS</th>
                <th className="px-4 py-2 text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((item, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded bg-gray-700" />
                  </td>
                  <td className="px-4 py-3 text-white">{item.text}</td>
                  <td className="px-4 py-3 text-white">{item.date}</td>
                  <td className="px-4 py-3 text-white">{item.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-gray-700 rounded text-sm">
                        Edit
                      </button>
                      <button className="px-3 py-1 bg-gray-700 rounded text-sm">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[rgba(30,30,30,0.8)] backdrop-blur-[50px] rounded-[20px] p-6 border border-gray-700/50">
          <div className="text-6xl font-bold text-white mb-2">13</div>
          <div className="text-gray-400">Views today</div>
        </div>
        <div className="bg-[rgba(30,30,30,0.8)] backdrop-blur-[50px] rounded-[20px] p-6 border border-gray-700/50 relative">
          <div className="flex items-center gap-3">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="text-red-500"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <div className="text-6xl font-bold text-white mb-2">
              {repositories.reduce(
                (total, repo) => total + repo.alerts.critical,
                0
              )}
            </div>
          </div>
          <div className="text-gray-400">Critical Alerts</div>
        </div>
        <div className="bg-[rgba(30,30,30,0.8)] backdrop-blur-[50px] rounded-[20px] p-6 border border-gray-700/50">
          <div className="text-6xl font-bold text-white mb-2">56%</div>
          <div className="text-gray-400">Of readers aren&apos;t subscribed</div>
        </div>
      </div>
    </div>
  );
}
