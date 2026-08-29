export const courses = [
  {
    id: 1,
    title: 'Music Theory Fundamentals',
    description: 'Learn the building blocks of music - notes, scales, chords, and rhythm',
    instructor: 'Bogi',
    category: 'Music Theory',
    level: 'Beginner',
    duration: '8 weeks',
    image: null,
    progress: 65,
    enrolled: true,
    rating: 4.8,
    studentsCount: 1250,
    modules: [
      {
        id: 1,
        title: 'Introduction to Music Theory',
        description: 'Basic concepts and notation',
        order: 1,
        lessons: [
          {
            id: 101,
            title: 'What is Music Theory?',
            type: 'video',
            duration: '15 min',
            completed: true,
            content: 'Introduction to music theory and its importance...'
          },
          {
            id: 102,
            title: 'Reading Music Notation',
            type: 'text',
            duration: '20 min',
            completed: true,
            content: 'Learn to read notes, clefs, and staff...'
          },
          {
            id: 103,
            title: 'Quiz: Basic Notation',
            type: 'quiz',
            duration: '10 min',
            completed: true,
            quiz: {
              id: 103,
              questions: [
                {
                  id: 1,
                  question: 'What does the treble clef indicate?',
                  options: ['Bass notes', 'Higher pitched notes', 'Percussion', 'Rests'],
                  correctAnswer: 1
                },
                {
                  id: 2,
                  question: 'How many lines are in a standard staff?',
                  options: ['3', '4', '5', '6'],
                  correctAnswer: 2
                }
              ]
            }
          }
        ]
      },
      {
        id: 2,
        title: 'Scales and Keys',
        description: 'Understanding scales and key signatures',
        order: 2,
        lessons: [
          {
            id: 201,
            title: 'Major Scales',
            type: 'video',
            duration: '25 min',
            completed: false,
            content: 'Learn the pattern of major scales...'
          },
          {
            id: 202,
            title: 'Minor Scales',
            type: 'video',
            duration: '20 min',
            completed: false,
            content: 'Explore natural, harmonic, and melodic minor scales...'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Music Production Basics',
    description: 'Start producing music with modern digital audio workstations',
    instructor: 'Bogi',
    category: 'Production',
    level: 'Beginner',
    duration: '6 weeks',
    image: null,
    progress: 25,
    enrolled: true,
    rating: 4.6,
    studentsCount: 980,
    modules: [
      {
        id: 3,
        title: 'Getting Started with DAWs',
        description: 'Understanding digital audio workstations',
        order: 1,
        lessons: [
          {
            id: 301,
            title: 'Choosing Your DAW',
            type: 'text',
            duration: '15 min',
            completed: true,
            content: 'Overview of popular DAWs and their features...'
          },
          {
            id: 302,
            title: 'Basic Recording',
            type: 'video',
            duration: '30 min',
            completed: false,
            content: 'Learn to record your first track...'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Composition Techniques',
    description: 'Learn to compose music across different styles and genres',
    instructor: 'Bogi',
    category: 'Composition',
    level: 'Intermediate',
    duration: '10 weeks',
    image: null,
    progress: 0,
    enrolled: false,
    rating: 4.9,
    studentsCount: 750,
    modules: []
  },
  {
    id: 4,
    title: 'Advanced Music Theory',
    description: 'Deep dive into complex harmonic concepts and analysis',
    instructor: 'Bogi',
    category: 'Music Theory',
    level: 'Advanced',
    duration: '12 weeks',
    image: null,
    progress: 0,
    enrolled: false,
    rating: 4.7,
    studentsCount: 450,
    modules: []
  }
]