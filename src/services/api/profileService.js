export const getUserProfiles = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    business: {
      name: 'TechCorp Solutions',
      services: ['Web Development', 'Digital Marketing', 'Consulting'],
      mission: 'To help businesses grow through innovative technology solutions.',
      brandVoice: 'Professional, approachable, and solution-focused.',
      category: 'Technology',
      competitors: ['Competitor A', 'Competitor B'],
      contentGoals: ['Brand awareness', 'Lead generation', 'Thought leadership'],
      callToActions: ['Contact us', 'Learn more', 'Get started'],
      website: 'https://techcorp.com'
    },
    personal: {
      name: 'John Doe',
      hobbies: ['Technology', 'Writing', 'Entrepreneurship'],
      values: ['Innovation', 'Integrity', 'Excellence'],
      stories: 'I started my career in tech 10 years ago and have been passionate about helping businesses leverage technology for growth.',
      preferredTone: 'Professional yet friendly',
      affiliations: ['Tech Association', 'Business Network'],
      goals: ['Build thought leadership', 'Grow network', 'Share knowledge']
    }
  };
};

export const updateUserProfiles = async (profiles) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
};

export const analyzeWebsite = async (url) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock AI analysis results
  return {
    name: 'AI-Detected Company Name',
    mission: 'Detected mission statement from website analysis.',
    services: ['Service 1', 'Service 2', 'Service 3'],
    category: 'Technology',
    brandVoice: 'Professional and innovative tone detected from content analysis.'
  };
};