"use client";


import 'rsuite/dist/rsuite.min.css';
import { Repository } from '../models/Repository';
import { BiSearch } from 'react-icons/bi';
import { BsCheckCircleFill } from 'react-icons/bs';
import { IoEnterOutline } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import { AiOutlineEnter } from "react-icons/ai";
import "rsuite/dist/rsuite.min.css";
import Image from "next/image";
import { supabase } from '../app/lib/supabaseClient';
import LiveCodeCard from './LiveCodeCard';


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


enum ProcessState {
  Reading = 'Reading',
  Writing = 'Writing',
  Pushing = 'Pushing'
}
enum LogsState {
  Log1 = 'Initializing repository scan...',
  Log2 = 'Reading file structure and dependencies...',
  Log3 = 'Analyzing code patterns and architecture...',
  Log4 = 'Generating documentation from codebase...',
  Log5 = 'Writing analysis results to database...',
  Log6 = 'Pushing updates to cloud storage...',
}

interface ProcessStateConfig {
  name: ProcessState;
  emoji: string;
}

const ProcessStateDetails: Record<ProcessState, ProcessStateConfig> = {
  [ProcessState.Reading]: {
    name: ProcessState.Reading,
    emoji: '🤓'
  },
  [ProcessState.Writing]: {
    name: ProcessState.Writing,
    emoji: '✍️'
  },
  [ProcessState.Pushing]: {
    name: ProcessState.Pushing,
    emoji: '🏃‍♂️'
  }
};

const getStateColor = (state: string): string => {
  switch (state) {
    case 'READING':
      return 'text-red-500';
    case 'WRITING':
      return 'text-orange-500';
    case 'LOADING':
      return 'text-yellow-500';
    default:
      return 'text-white';
  }
};

const getStateEmoji = (state: string): any => {
  switch (state) {
    case 'READING':
      return '🤓';
    case 'WRITING':
      return '✍️';
    case 'LOADING':
      return '🏃‍♂️';
    default:
      return '🤓';
  }
};

enum CodeExample {
  Swift = 'Swift',
  TypeScript = 'TypeScript',
  Python = 'Python',
  Rust = 'Rust'
}

interface CodeExampleConfig {
  fileName: string;
  code: string;
}

const CodeExampleDetails: Record<CodeExample, CodeExampleConfig> = {
  [CodeExample.Swift]: {
    fileName: 'ContentView.swift',
    code: `import SwiftUI

struct ProgressiveBlurView: View {
    var body: some View {
        VStack {
            Image("Room")
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: 250, height: 300)
                .progressiveBlur(radius: 25, maxSampleCount: Int(21)) { geometryProxy, context in
                    context.fill(
                        Path(geometryProxy.frame(in: .local)),
                        with: .linearGradient(
                            .init(colors: [.white, .clear]),
                            startPoint: .init(x: 0, y: geometryProxy.size.height * 0.0),
                            endPoint: .init(x: 0, y: geometryProxy.size.height * 1.0)
                        )
                    )
                }
        }
    }
}`
  },
  [CodeExample.TypeScript]: {
    fileName: 'blur.ts',
    code: `export class BlurEffect {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(width: number, height: number) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d')!;
  }

  applyProgressiveBlur(radius: number): ImageData {
    const pixels = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    let result = pixels;
    
    for (let i = 1; i <= radius; i++) {
      result = this.boxBlur(result, i);
    }
    
    return result;
  }
}`
  },
  [CodeExample.Python]: {
    fileName: 'image_processor.py',
    code: `import numpy as np
from PIL import Image

class ProgressiveBlur:
    def __init__(self, image_path: str):
        self.image = Image.open(image_path)
        self.array = np.array(self.image)
    
    def apply_blur(self, radius: int = 5) -> Image:
        """Apply progressive Gaussian blur to the image."""
        result = self.array.copy()
        
        for i in range(1, radius + 1):
            kernel = self.gaussian_kernel(i)
            result = self.convolve(result, kernel)
            
        return Image.fromarray(result)
    
    @staticmethod
    def gaussian_kernel(sigma: float) -> np.ndarray:
        size = int(6 * sigma + 1)
        x = np.linspace(-3 * sigma, 3 * sigma, size)
        kernel = np.exp(-x**2 / (2 * sigma**2))
        return kernel / kernel.sum()`
  },
  [CodeExample.Rust]: {
    fileName: 'blur.rs',
    code: `use image::{ImageBuffer, Rgb};

pub struct ProgressiveBlur {
    width: u32,
    height: u32,
    buffer: ImageBuffer<Rgb<u8>, Vec<u8>>,
}

impl ProgressiveBlur {
    pub fn new(width: u32, height: u32) -> Self {
        Self {
            width,
            height,
            buffer: ImageBuffer::new(width, height),
        }
    }

    pub fn apply_blur(&mut self, radius: f32) -> &ImageBuffer<Rgb<u8>, Vec<u8>> {
        let sigma = radius / 3.0;
        let kernel = self.create_gaussian_kernel(sigma);
        
        self.horizontal_pass(&kernel);
        self.vertical_pass(&kernel);
        
        &self.buffer
    }
}`
  }
};

// Actual code

interface Update {
  id: number;
  created_at: string;
  status: string;
  message: string;
  code: string | null;
}


export default function MainDash({ sidebarOpen, repositories, tasks }: MainDashProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentState, setCurrentState] = useState<ProcessState>(ProcessState.Reading);
  const [currentLog, setCurrentLog] = useState<LogsState>(LogsState.Log1);
  const [currentCodeExample, setCurrentCodeExample] = useState<CodeExample>(CodeExample.Swift);

  const [updates, setUpdates] = useState<Update[]>([
    {
      id: 1,
      created_at: '2024-01-01',
      status: 'READING',
      message: 'Initializing repository scan...',
      code: null
    }
  ]);
  const [currentUpdate, setCurrentUpdate] = useState<Update>();



  // useEffect(() => {
  //   if (!isLoading) return;

  //   let updateIndex = 0;
  //   const updatesInterval = setInterval(() => {
  //     if (updateIndex < updates.length) {
  //       setCurrentUpdate(updates[updateIndex]);
  //       updateIndex++;
  //     } else {
  //       clearInterval(updatesInterval);
  //       setCurrentUpdate(updates[updates.length - 1]);
  //     }
  //   }, 2000);
  // })

  useEffect(() => {
    // 1. Create a channel with a unique name or let Supabase handle it
    const channel = supabase
      .channel('table_db_changes') // any unique string
      .on(
        'postgres_changes',
        {
          event: '*',         // listen for INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'repo-updates',
        },
        (payload) => {


          const newUpdate = payload.new as Update;
          // console.log(newUpdate);
          setUpdates((current) => [...(current || []), newUpdate]);

        }
      )
      .subscribe();

    // 2. Cleanup: remove channel subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // console.log(updates);


  const isGithubUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === 'github.com';
    } catch {
      return false;
    }
  };

  const handleEnterClick = () => {
    setIsLoading(true);
    console.log(inputValue.split('/')[3])
    fetch('http://127.0.0.1:5000/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({

        repository: inputValue,
        repository_owner: inputValue.split('/')[3],
        repository_name: inputValue.split('/')[4].replace('.git', '') 
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    console.log();

  };

  return (
    <div className={`flex-1 p-8 transition-all duration-300 ${sidebarOpen ? 'ml-40' : 'ml-0'}`}>
      <h1 className="text-3xl font-bold text-white mb-20">Dashboard</h1>
      
      {/* Search Bar */}
      <div className={`relative max-w-xl mx-auto transition-all duration-300 ${isGithubUrl(inputValue) ? 'h-20' : 'h-12'} ${isLoading ? 'mb-0' : 'mb-10'}`}>
        
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isGithubUrl(inputValue)) {
              handleEnterClick();
            }
          }}
          disabled={isLoading}
          className="w-full bg-[rgba(30,30,30,0.8)] backdrop-blur-[50px] text-white rounded-full py-5 pl-12 pr-12 border border-gray-700/50 focus:outline-none focus:border-gray-600 placeholder-gray-400 disabled:opacity-75 disabled:cursor-not-allowed"
          placeholder="Insert a Github repository URL"
        />
        {isGithubUrl(inputValue) && !isLoading && (
          <>
            <div className="absolute inset-y-0 right-5 top-5 flex items-start pointer-events-none">
              <BsCheckCircleFill className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex justify-end px-4 mt-4">
              <button 
                onClick={handleEnterClick}
                className="flex items-center gap-2 text-white bg-[rgba(60,60,60,0.8)] px-4 py-1.5 rounded-md hover:bg-[rgba(75,75,75,0.8)]"
              >
                <span>Enter</span>
                <AiOutlineEnter className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Loading Component */}
      {isLoading && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-[rgba(30,30,30,0.8)] backdrop-blur-[50px] rounded-[20px] p-16 mb-8 border border-gray-700/50">
            <div className="flex items-start gap-8">
            <LiveCodeCard
              filename={updates[updates.length - 1].message.split(' ')[1].replace("...", "")}
              language="javascript"
              finalCode={updates[updates.length - 1].code || ""}
              typingSpeed={2}
              message={updates[updates.length - 1].message}
            />
            </div>
          </div>
        </div>

        // <div className="max-w-4xl mx-auto">
        //   <div className="bg-[rgba(30,30,30,0.8)] backdrop-blur-[50px] rounded-[20px] p-16 mb-8 border border-gray-700/50">
        //     <div className="flex items-start gap-8">

        //       <div className="flex flex-col items-center justify-center space-y-2 w-[100px] min-w-[230px]">
        //         <span className="text-4xl">
        //           {getStateEmoji(updates[updates.length - 1].status)}
        //         </span>
        //         <div className="animate-blur-in">
        //           <span className="text-white relative z-10">
        //             {updates[updates.length - 1].message}
        //           </span>
        //           <div 
        //             className={`absolute inset-7 -m-12 opacity-30 blur-2xl rounded-full ${getStateColor(updates[updates.length - 1].status)}`}
        //             style={{
        //               background: `radial-gradient(ellipse, currentColor 10%, transparent 85%)`
        //             }}
        //           />
        //         </div>
        //         <div className="relative h-8 overflow-hidden">
        //           <p 
        //             key={currentLog} 
        //             className="text-gray-400 text-sm mt-2 animate-fade-in"
        //           >
        //             {currentLog}
        //           </p>
        //         </div>
        //       </div>


        //       <div className="w-px bg-gray-700/50 self-stretch"></div>


        //       <div className="flex-1">

        //         <div className="flex gap-2 mb-4">
        //           <button
        //             onClick={() => setCurrentCodeExample(CodeExample.Swift)}
        //             className={`text-gray-400 text-sm px-3 py-1.5 rounded-[8px] border border-gray-500/10 transition-colors
        //               ${currentCodeExample === CodeExample.Swift 
        //                 ? 'bg-[rgba(30,30,30,0.8)] text-white' 
        //                 : 'bg-[rgba(30,30,30,0.4)] hover:bg-[rgba(30,30,30,0.6)]'
        //               }`}
        //           >
        //             {updates[updates.length - 1].message.split(' ')[1].replace("...", "")}
        //           </button>
        //           <button
        //             onClick={() => setCurrentCodeExample(CodeExample.TypeScript)}
        //             className={`text-gray-400 text-sm px-3 py-1.5 rounded-[8px] border border-gray-500/10 transition-colors
        //               ${currentCodeExample === CodeExample.TypeScript 
        //                 ? 'bg-[rgba(30,30,30,0.8)] text-white' 
        //                 : 'bg-[rgba(30,30,30,0.4)] hover:bg-[rgba(30,30,30,0.6)]'
        //               }`}
        //           >
        //             {CodeExampleDetails[CodeExample.TypeScript].fileName}
        //           </button>
        //           <button
        //             onClick={() => setCurrentCodeExample(CodeExample.Python)}
        //             className={`text-gray-400 text-sm px-3 py-1.5 rounded-[8px] border border-gray-500/10 transition-colors
        //               ${currentCodeExample === CodeExample.Python 
        //                 ? 'bg-[rgba(30,30,30,0.8)] text-white' 
        //                 : 'bg-[rgba(30,30,30,0.4)] hover:bg-[rgba(30,30,30,0.6)]'
        //               }`}
        //           >
        //             {CodeExampleDetails[CodeExample.Python].fileName}
        //           </button>
        //           <button
        //             onClick={() => setCurrentCodeExample(CodeExample.Rust)}
        //             className={`text-gray-400 text-sm px-3 py-1.5 rounded-[8px] border border-gray-500/10 transition-colors
        //               ${currentCodeExample === CodeExample.Rust 
        //                 ? 'bg-[rgba(30,30,30,0.8)] text-white' 
        //                 : 'bg-[rgba(30,30,30,0.4)] hover:bg-[rgba(30,30,30,0.6)]'
        //               }`}
        //           >
        //             {CodeExampleDetails[CodeExample.Rust].fileName}
        //           </button>
        //         </div>

                  
        //         <div className="text-gray-400 text-sm mb-2 w-fit bg-[rgba(30,30,30,0.4)] backdrop-blur-[20px] rounded-[8px] px-3 py-1.5 border border-gray-500/10">
        //           {CodeExampleDetails[currentCodeExample].fileName}
        //         </div>
        //         <p className="text-gray-400 text-sm leading-relaxed bg-[rgba(30,30,30,0.4)] backdrop-blur-[20px] rounded-[12px] p-4">
        //           {CodeExampleDetails[currentCodeExample].code}
        //         </p>
        //       </div>
        //     </div>
        //   </div>
        // </div>
      )}

      {/* Repository Table Container */}
      <div className="relative bg-[rgba(30,30,30,0.8)] backdrop-blur-[50px] rounded-[20px] p-6 mb-8 border border-gray-700/50">
        <div className="top-[-110px] right-[20px] absolute h-[110px] transition-all pt-12 duration-500 hover:pt-8 opacity-75 hover:filter-none overflow-hidden filter">
          <Image
            src="/pou-transparent-cropped.png"
            width="110"
            height="600"
            alt="Pou is sad."
          />
        </div>
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
