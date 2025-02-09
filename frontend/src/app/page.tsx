'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import GradientCanvas from "@/components/GradientCanvas";
import MainDash from "@/components/MainDash";
import RepositoryPage from "@/components/RepositoryPage";
import { Animation } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { Repository, exampleRepository } from "@/models/Repository";

interface Item {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  status: string;
}

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [criticalAlerts, setCriticalAlerts] = useState<Item[]>([]);
  const [tasks, setTasks] = useState<Item[]>([]);
  const [stats, setStats] = useState({
    activeUsers: 0,
    totalRepositories: 0,
    subscriptionRate: 0
  });
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Add more diverse sample repositories data
  const [repositories, setRepositories] = useState<Repository[]>([
    exampleRepository,
    {
      ...exampleRepository,
      id: '2',
      name: 'Next.js Project',
      description: 'Company website built with Next.js',
      lastUpdated: '2024-03-21',
      status: 'inactive',
      alerts: { critical: 4, moderate: 3, low: 2 },
      testCoverage: 68,
      stars: 156,
      forks: 23
    },
    {
      ...exampleRepository,
      id: '3',
      name: 'TypeScript Utils',
      description: 'Common TypeScript utility functions',
      lastUpdated: '2024-03-19',
      status: 'active',
      alerts: { critical: 0, moderate: 1, low: 5 },
      testCoverage: 98,
      stars: 892,
      forks: 124
    },
    {
      ...exampleRepository,
      id: '4',
      name: 'Legacy API Service',
      description: 'Deprecated API service pending migration',
      lastUpdated: '2023-12-15',
      status: 'archived',
      alerts: { critical: 12, moderate: 8, low: 15 },
      testCoverage: 45,
      stars: 12,
      forks: 3
    },
    {
      ...exampleRepository,
      id: '5',
      name: 'Authentication Module',
      description: 'Core authentication and authorization service',
      lastUpdated: '2024-03-22',
      status: 'inactive',
      alerts: { critical: 7, moderate: 4, low: 2 },
      testCoverage: 72,
      language: 'Python',
      stars: 234,
      forks: 45
    },
    {
      ...exampleRepository,
      id: '6',
      name: 'Mobile App',
      description: 'React Native mobile application',
      lastUpdated: '2024-03-18',
      status: 'active',
      alerts: { critical: 2, moderate: 5, low: 8 },
      testCoverage: 85,
      language: 'JavaScript',
      stars: 445,
      forks: 67
    },
    {
      ...exampleRepository,
      id: '7',
      name: 'Data Pipeline',
      description: 'ETL pipeline for analytics',
      lastUpdated: '2024-02-28',
      status: 'inactive',
      alerts: { critical: 5, moderate: 9, low: 3 },
      testCoverage: 63,
      language: 'Python',
      stars: 178,
      forks: 34
    },
    {
      ...exampleRepository,
      id: '8',
      name: 'UI Component Library',
      description: 'Shared React component library',
      lastUpdated: '2024-03-15',
      status: 'active',
      alerts: { critical: 1, moderate: 3, low: 7 },
      testCoverage: 89,
      stars: 567,
      forks: 89
    }
  ]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Simulate fetching data from an API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real application, these would be API calls
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate critical alerts data
        setCriticalAlerts([
          { id: '1', text: 'Security Update Required', completed: false, date: new Date().toISOString().split('T')[0], status: 'Critical' },
          { id: '2', text: 'Database Performance Issue', completed: false, date: new Date().toISOString().split('T')[0], status: 'Critical' },
          { id: '3', text: 'Memory Leak Detected', completed: false, date: new Date().toISOString().split('T')[0], status: 'Critical' },
        ]);

        // Simulate tasks data
        setTasks([
          { id: '4', text: 'Update Dependencies', completed: false, date: new Date().toISOString().split('T')[0], status: 'In Progress' },
          { id: '5', text: 'Code Review', completed: false, date: new Date().toISOString().split('T')[0], status: 'In Progress' },
          { id: '6', text: 'Deploy Updates', completed: false, date: new Date().toISOString().split('T')[0], status: 'Pending' },
        ]);

        // Simulate stats data
        setStats({
          activeUsers: Math.floor(Math.random() * 100),
          totalRepositories: Math.floor(Math.random() * 50),
          subscriptionRate: Math.floor(Math.random() * 100)
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleComplete = (itemId: string, type: 'alert' | 'task') => {
    if (type === 'alert') {
      setCriticalAlerts(prev => prev.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ));
    } else {
      setTasks(prev => prev.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ));
    }
  };

  const handleDelete = (itemId: string, type: 'alert' | 'task') => {
    if (type === 'alert') {
      setCriticalAlerts(prev => prev.filter(item => item.id !== itemId));
    } else {
      setTasks(prev => prev.filter(item => item.id !== itemId));
    }
  };

  // Add a simple theme object
  const theme = {
    gradientColor1: '#023601', // Deep forest green
    gradientColor2: '#1b4332', // Dark forest green
    gradientColor3: '#000000', // Black
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <MainDash 
            sidebarOpen={sidebarOpen}
            repositories={repositories}
            tasks={tasks}
          />
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <GradientCanvas 
        gradientColor1={theme.gradientColor1}
        gradientColor2={theme.gradientColor2}
        gradientColor3={theme.gradientColor3}
      />
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-full bg-[rgba(30,30,30,0.8)] backdrop-blur-[50px] text-white p-4 transform transition-transform duration-300 border border-gray-700/50 rounded-r-[20px] ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:w-40`}
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif' }}
        >
          <h2 className="text-xl font-bold mb-4">Depobot</h2>
          <ul>
            {[
              { text: "Profile", icon: "/user-round.svg", page: 'profile' },
              { text: "Dashboard", icon: "/layout-dashboard.svg", page: 'dashboard' },
              { text: "Settings", icon: "/settings.svg", page: 'settings' }
            ].map((item, index) => (
              <li key={index} className="mb-2">
                <button
                  onClick={() => setCurrentPage(item.page)}
                  className={`flex items-center p-2 rounded-lg transition duration-200 hover:bg-gray-800 w-full ${
                    currentPage === item.page ? 'bg-gray-800' : ''
                  }`}
                >
                  <img src={item.icon} className="w-6 h-6 mr-2 invert" alt={`${item.text} Icon`} />
                  {item.text}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Single Animation.Slide wrapper */}
        <Animation.Slide 
          in={true} 
          placement={currentPage === 'dashboard' ? 'left' : 'right'} 
          unmountOnExit
        >
          {renderContent()}
        </Animation.Slide>

        {/* Toggle Button */}
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
