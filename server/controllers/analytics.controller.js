import Candidate from '../models/candidate.model.js';
import ChatHistory from '../models/chathistory.model.js';
import Shortlisting from '../models/shortlisting.model.js';

const processTimeSeries = (data, timeField, valueField) => {
    const grouped = data.reduce((acc, item) => {
        const date = new Date(item[timeField]);
        const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
        acc[monthYear] = (acc[monthYear] || 0) + (valueField ? item[valueField] : 1);
        return acc;
    }, {});

    return Object.entries(grouped).map(([key, value]) => ({
        date: key,
        value
    }));
};

export const getAnalyticsData = async (req, res) => {
    try {
        const [candidates, chatHistory, shortlistings] = await Promise.all([
            Candidate.find().lean(),
            ChatHistory.find().lean(),
            Shortlisting.find().lean()
        ]);

        const totalCandidates = candidates.length;
        const activeChats = chatHistory.length;
        const totalShortlistings = shortlistings.length;

        const offerStatusStats = shortlistings.reduce((acc, curr) => {
            acc[curr.status] = (acc[curr.status] || 0) + 1;
            return acc;
        }, {});

        const locationCounts = candidates.reduce((acc, candidate) => {
            const location = candidate?.contact_information?.location;
            if (location) {
                const city = location.split(",")[0].trim();
                acc[city] = (acc[city] || 0) + 1;
            }
            return acc;
        }, {});

        const topLocations = Object.entries(locationCounts)
            .map(([city, count]) => ({
                city,
                count,
                percentage: ((count / totalCandidates) * 100).toFixed(1)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Skill distribution
        const skillCounts = candidates.reduce((acc, candidate) => {
            const skills = candidate?.skills?.technical_skills?.programming_languages || [];
            skills.forEach(skill => {
                acc[skill] = (acc[skill] || 0) + 1;
            });
            return acc;
        }, {});

        const topSkills = Object.entries(skillCounts)
            .map(([skill, count]) => ({
                skill,
                count,
                percentage: ((count / totalCandidates) * 100).toFixed(1)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Recent activity
        const recentActivity = [
            ...shortlistings.map(s => ({
                type: 'offer',
                status: s.status,
                candidateId: s.candidateId,
                time: s.updatedAt,
                data: s
            })),
            ...chatHistory.map(c => ({
                type: 'chat',
                query: c.query,
                time: c.updatedAt,
                data: c
            }))
        ]
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .slice(0, 5);

        // Time series data
        const candidateTimeline = processTimeSeries(candidates, 'created_at');
        const shortlistingTimeline = processTimeSeries(shortlistings, 'createdAt');

        // Response data
        const analyticsData = {
            summary: {
                totalCandidates,
                activeChats,
                totalShortlistings,
                offerStatusStats
            },
            locations: topLocations,
            skills: topSkills,
            recentActivity,
            timelines: {
                candidates: candidateTimeline,
                shortlistings: shortlistingTimeline
            },
            lastUpdated: new Date()
        };

        res.json(analyticsData);
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        res.status(500).json({ error: 'Failed to fetch analytics data' });
    }
};

export const getCandidates = async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ created_at: -1 }).limit(50).lean();
        res.json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ error: 'Failed to fetch candidates' });
    }
};

export const getChatHistory = async (req, res) => {
    try {
        const chatHistory = await ChatHistory.find()
            .sort({ updatedAt: -1 })
            .limit(20)
            .populate('user', 'name email')
            .populate('response.candidate', 'candidate_name')
            .lean();
        res.json(chatHistory);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
};

export const getShortlistings = async (req, res) => {
    try {
        const shortlistings = await Shortlisting.find()
            .sort({ updatedAt: -1 })
            .limit(20)
            .populate('userId', 'name email')
            .populate('candidateId', 'candidate_name')
            .populate('chatHistoryId', 'query')
            .lean();
        res.json(shortlistings);
    } catch (error) {
        console.error('Error fetching shortlistings:', error);
        res.status(500).json({ error: 'Failed to fetch shortlistings' });
    }
};