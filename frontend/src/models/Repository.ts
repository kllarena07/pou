interface Repository {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  status: 'active' | 'inactive' | 'archived';
  url: string;
  issues: {
    open: number;
    closed: number;
  };
  pullRequests: {
    open: number;
    merged: number;
    closed: number;
  };
  alerts: {
    critical: number;
    moderate: number;
    low: number;
  };
  testCoverage: number;
  language: string;
  contributors: number;
  stars: number;
  forks: number;
}

// Example repository data
const exampleRepository: Repository = {
  id: '1',
  name: 'Learn React',
  description: 'A comprehensive React learning repository',
  lastUpdated: '2024-03-20',
  status: 'active',
  url: 'https://github.com/username/learn-react',
  issues: {
    open: 24,
    closed: 156
  },
  pullRequests: {
    open: 8,
    merged: 245,
    closed: 12
  },
  alerts: {
    critical: 3,
    moderate: 7,
    low: 4
  },
  testCoverage: 92,
  language: 'TypeScript',
  contributors: 15,
  stars: 342,
  forks: 87
};

export type { Repository };
export { exampleRepository }; 