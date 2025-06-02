import { processCandidateDirectory } from "../controllers/candidate-data.controller.js";

const dataDirectoryPath = '/home/sameer42/Desktop/Hackathons/100xEngineers-Buildathon/ai-server/models/candidate_data';
const summariesDirectoryPath = '/home/sameer42/Desktop/Hackathons/100xEngineers-Buildathon/ai-server/models/candidate_summaries';
const linkedinDirectoryPath = '/home/sameer42/Desktop/Hackathons/100xEngineers-Buildathon/ai-server/models/candidate_linkedin';
const githubDirectoryPath = '/home/sameer42/Desktop/Hackathons/100xEngineers-Buildathon/ai-server/models/candidate_github';

processCandidateDirectory(dataDirectoryPath, summariesDirectoryPath, linkedinDirectoryPath, githubDirectoryPath)
    .then(result => {
        if (result.success) {
            console.log('Successfully processed all files');
        } else {
            console.error('Processing completed with errors');
        }
    })
    .catch(err => {
        console.error('Fatal error:', err);
    });