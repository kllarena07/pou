'use client';


import 'rsuite/dist/rsuite.min.css';

interface Item {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  status: string;
}

interface RepositoryPageProps {
  sidebarOpen: boolean;
  criticalAlerts: Item[];
  tasks: Item[];
}

export default function RepositoryPage({ sidebarOpen, criticalAlerts, tasks }: RepositoryPageProps) {
  return (
    <div className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-40' : 'ml-0'}`}>
      <h1 className="text-3xl font-bold text-white mb-6">Repository Overview</h1>
      
      {/* First Table Container */}
      <div className="bg-[rgba(30,30,30,0.8)] backdrop-blur-[50px] rounded-[20px] p-6 mb-8 border border-gray-700/50">
        <div className="w-full overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <h2 className="text-xl text-white">Active Issues</h2>
            </div>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="px-4 py-3 text-left font-medium">SELECT</th>
                <th className="px-4 py-3 text-left font-medium">TITLE</th>
                <th className="px-4 py-3 text-left font-medium">DATE</th>
                <th className="px-4 py-3 text-left font-medium">STATUS</th>
                <th className="px-4 py-3 text-left font-medium">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {criticalAlerts.map((item, i) => (
                <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="rounded bg-gray-700/50 border-gray-600" />
                  </td>
                  <td className="px-4 py-4 text-white">{item.text}</td>
                  <td className="px-4 py-4 text-white">{item.date}</td>
                  <td className="px-4 py-4 text-white">{item.status}</td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      <button className="px-4 py-1.5 bg-gray-800/80 hover:bg-gray-700/80 rounded text-sm">Edit</button>
                      <button className="px-4 py-1.5 bg-gray-800/80 hover:bg-gray-700/80 rounded text-sm">Delete</button>
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
              <h2 className="text-xl text-white">Pull Requests</h2>
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
                <tr key={i} className="border-t border-gray-700 hover:bg-gray-700/50">
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded bg-gray-700" />
                  </td>
                  <td className="px-4 py-3 text-white">{item.text}</td>
                  <td className="px-4 py-3 text-white">{item.date}</td>
                  <td className="px-4 py-3 text-white">{item.status}</td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-gray-700 rounded text-sm">Edit</button>
                      <button className="px-3 py-1 bg-gray-700 rounded text-sm">Delete</button>
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
          <div className="text-6xl font-bold text-white mb-2">24</div>
          <div className="text-gray-400">Open Issues</div>
        </div>
        <div className="bg-[rgba(30,30,30,0.8)] backdrop-blur-[50px] rounded-[20px] p-6 border border-gray-700/50">
          <div className="text-6xl font-bold text-white mb-2">8</div>
          <div className="text-gray-400">Pull Requests</div>
        </div>
        <div className="bg-[rgba(30,30,30,0.8)] backdrop-blur-[50px] rounded-[20px] p-6 border border-gray-700/50">
          <div className="text-6xl font-bold text-white mb-2">92%</div>
          <div className="text-gray-400">Test Coverage</div>
        </div>
      </div>
    </div>
  );
} 