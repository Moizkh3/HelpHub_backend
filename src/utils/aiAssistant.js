const CATEGORIES = [
    { name: 'Web Development', keywords: ['javascript', 'react', 'node', 'html', 'css', 'frontend', 'backend', 'api', 'fullstack', 'vite', 'tailwind'] },
    { name: 'Design', keywords: ['figma', 'ui', 'ux', 'adobe', 'logo', 'design', 'layout', 'spacing', 'color', 'typography'] },
    { name: 'Data Science', keywords: ['python', 'data', 'analysis', 'ml', 'machine learning', 'sql', 'pandas', 'numpy'] },
    { name: 'Career', keywords: ['interview', 'mock', 'internship', 'resume', 'cv', 'job', 'application', 'hiring'] },
    { name: 'Marketing', keywords: ['seo', 'content', 'ads', 'google', 'facebook', 'social media', 'strategy'] }
];

const TAG_DATABASE = [
    'Frontend', 'Backend', 'Figma', 'React', 'JavaScript', 'Node.js', 
    'Interview Prep', 'Career', 'Responsive', 'UI/UX', 'Database', 
    'Python', 'Machine Learning', 'API Integration'
];

export const getSmartSuggestions = (title = '', description = '') => {
    const text = (title + ' ' + description).toLowerCase();
    
    // Suggest Category
    let suggestedCategory = 'Community'; // Default
    let maxMatches = 0;

    CATEGORIES.forEach(cat => {
        const matches = cat.keywords.filter(keyword => text.includes(keyword)).length;
        if (matches > maxMatches) {
            maxMatches = matches;
            suggestedCategory = cat.name;
        }
    });

    // Detect Urgency
    let detectedUrgency = 'Low';
    const highUrgencyKeywords = ['urgent', 'emergency', 'asap', 'help now', 'stuck', 'blocking', 'deadline', 'tomorrow'];
    const mediumUrgencyKeywords = ['soon', 'this week', 'next couple of days', 'review'];

    if (highUrgencyKeywords.some(k => text.includes(k))) {
        detectedUrgency = 'High';
    } else if (mediumUrgencyKeywords.some(k => text.includes(k))) {
        detectedUrgency = 'Medium';
    }

    // Suggest Tags
    const suggestedTags = TAG_DATABASE.filter(tag => text.includes(tag.toLowerCase())).slice(0, 5);
    if (suggestedTags.length === 0) {
        suggestedTags.push('Help Needed');
    }

    // Rewrite Suggestion (Very basic placeholder)
    const rewriteSuggestion = title.length < 20 
        ? `Consider adding more detail to your title: "${title} for [Project Name]"`
        : 'Title looks good and clear.';

    return {
        suggestedCategory,
        detectedUrgency,
        suggestedTags,
        rewriteSuggestion
    };
};

export const generateAiSummary = (description) => {
    // Mock summary generation
    if (!description) return '';
    return `AI Summary: This request involves a ${description.length > 100 ? 'complex' : 'straightforward'} challenge related to the mentioned skills. The requester is seeking collaborative support to solve specific issues outlined in the description.`;
};
