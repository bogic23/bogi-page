export const portfolioData = {
  profile: {
    name: 'Bogi',
    title: 'Full Stack Developer & Music Educator',
    tagline: 'Building elegant solutions and sharing musical knowledge',
    bio: 'Passionate developer with a focus on creating intuitive user experiences and educational technology. Combining technical expertise with a deep love for music to build innovative learning platforms.',
    avatar: null, // Would be a URL to image
    location: 'Remote',
    email: 'bogi@example.com',
    socialLinks: {
      github: 'https://github.com/bogi',
      linkedin: 'https://linkedin.com/in/bogi',
      twitter: 'https://twitter.com/bogi'
    }
  },
  
  skills: [
    { name: 'Vue.js', level: 90, category: 'Frontend' },
    { name: 'JavaScript', level: 85, category: 'Frontend' },
    { name: 'HTML/CSS', level: 95, category: 'Frontend' },
    { name: 'Node.js', level: 80, category: 'Backend' },
    { name: 'Python', level: 75, category: 'Backend' },
    { name: 'SQL', level: 70, category: 'Database' },
    { name: 'Git', level: 85, category: 'Tools' },
    { name: 'Music Theory', level: 90, category: 'Music' }
  ],
  
  projects: [
    {
      id: 1,
      title: 'Bogi Page',
      description: 'Personal dashboard and learning management system',
      technologies: ['Vue.js', 'Vite', 'Pinia', 'Bootstrap'],
      github: 'https://github.com/bogi/bogi-page',
      demo: null,
      image: null
    },
    {
      id: 2,
      title: 'Music Learning Platform',
      description: 'Interactive platform for learning music theory and production',
      technologies: ['Vue.js', 'Node.js', 'MongoDB'],
      github: 'https://github.com/bogi/music-platform',
      demo: 'https://music-platform.example.com',
      image: null
    },
    {
      id: 3,
      title: 'Task Management App',
      description: 'Productivity app with calendar integration',
      technologies: ['React', 'Express', 'PostgreSQL'],
      github: 'https://github.com/bogi/task-app',
      demo: 'https://task-app.example.com',
      image: null
    }
  ],
  
  experience: [
    {
      id: 1,
      role: 'Senior Developer',
      company: 'Tech Corp',
      period: '2022 - Present',
      description: 'Leading development of educational technology products',
      achievements: [
        'Developed LMS platform serving 10k+ students',
        'Improved performance by 40%',
        'Led team of 5 developers'
      ]
    },
    {
      id: 2,
      role: 'Full Stack Developer',
      company: 'Startup Inc',
      period: '2020 - 2022',
      description: 'Built web applications for music education',
      achievements: [
        'Created interactive music theory tools',
        'Implemented real-time collaboration features',
        'Reduced loading time by 60%'
      ]
    }
  ],
  
  education: [
    {
      id: 1,
      degree: 'B.S. in Computer Science',
      school: 'University of Technology',
      period: '2016 - 2020',
      description: 'Focus on web development and user experience'
    },
    {
      id: 2,
      degree: 'Music Theory Certificate',
      school: 'Conservatory of Music',
      period: '2018 - 2020',
      description: 'Advanced studies in music theory and composition'
    }
  ],
  
  musicInterests: [
    {
      name: 'Guitar',
      level: 'Advanced',
      yearsOfExperience: 12
    },
    {
      name: 'Piano',
      level: 'Intermediate',
      yearsOfExperience: 8
    },
    {
      name: 'Music Production',
      level: 'Advanced',
      yearsOfExperience: 6
    },
    {
      name: 'Composition',
      level: 'Intermediate',
      yearsOfExperience: 5
    }
  ]
}