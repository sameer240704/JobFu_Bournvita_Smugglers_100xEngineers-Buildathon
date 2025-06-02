import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Candidate from "../models/candidate.model.js"

const transformCandidateData = (data, aiSummary = null, linkedinData = null, githubData = null) => {
    // Ensure we have a valid data object
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid candidate data provided');
    }

    // Deep clone the data to avoid mutations
    const transformedData = JSON.parse(JSON.stringify(data));

    // Handle volunteering data
    if (transformedData.additional_information?.volunteering) {
        if (typeof transformedData.additional_information.volunteering === 'string') {
            if (transformedData.additional_information.volunteering.trim().startsWith('[') ||
                transformedData.additional_information.volunteering.trim().startsWith('{')) {
                try {
                    transformedData.additional_information.volunteering = JSON.parse(
                        transformedData.additional_information.volunteering.replace(/'/g, '"')
                    );
                } catch (e) {
                    // Keep as string if parsing fails
                    console.warn('Failed to parse volunteering data, keeping as string');
                }
            } else {
                transformedData.additional_information.volunteering = {
                    description: transformedData.additional_information.volunteering
                };
            }
        }
    }

    // Handle awards data
    if (transformedData.additional_information?.awards) {
        if (typeof transformedData.additional_information.awards === 'string') {
            if (transformedData.additional_information.awards.trim().startsWith('[') ||
                transformedData.additional_information.awards.trim().startsWith('{')) {
                try {
                    transformedData.additional_information.awards = JSON.parse(
                        transformedData.additional_information.awards.replace(/'/g, '"')
                    );
                } catch (e) {
                    console.warn('Failed to parse awards data, keeping as string');
                }
            } else {
                transformedData.additional_information.awards = {
                    title: transformedData.additional_information.awards
                };
            }
        }
    }

    // Ensure email exists
    if (!transformedData.contact_information?.email) {
        transformedData.contact_information = transformedData.contact_information || {};
        transformedData.contact_information.email = `no-email-${Math.random().toString(36).substring(2)}@placeholder.com`;
    }

    // Process AI Summary
    let aiSummaryData = null;
    if (aiSummary && typeof aiSummary === 'object') {
        const summaryPoints = [];
        for (const [key, value] of Object.entries(aiSummary)) {
            if (key.startsWith('point') && value && typeof value === 'string') {
                summaryPoints.push(`• ${value}`);
            }
        }

        if (summaryPoints.length > 0) {
            aiSummaryData = {
                summary: summaryPoints.join('\n\n'),
                raw_summary: aiSummary,
                last_updated: new Date()
            };
        }
    }

    // Process LinkedIn Data
    let linkedinDataTransformed = null;
    if (linkedinData && typeof linkedinData === 'object' && !Array.isArray(linkedinData)) {
        // Validate LinkedIn data has meaningful content
        if (linkedinData.fullName || linkedinData.first_name || linkedinData.public_identifier || linkedinData.headline) {
            linkedinDataTransformed = {
                profile_data: linkedinData,
                last_updated: new Date()
            };
        }
    }

    // Process GitHub Data
    let githubDataTransformed = null;
    if (githubData && typeof githubData === 'object') {
        // Handle different GitHub data structures
        const profileData = githubData.user_profile || githubData.profile || githubData;
        let repos = [];

        // Extract repositories from different possible structures
        if (githubData.projects && Array.isArray(githubData.projects)) {
            repos = githubData.projects;
        } else if (githubData.repositories && Array.isArray(githubData.repositories)) {
            repos = githubData.repositories;
        } else if (githubData.repos && Array.isArray(githubData.repos)) {
            repos = githubData.repos;
        }

        // More flexible validation - check for any meaningful GitHub profile data
        const hasValidProfile = profileData && (
            profileData.username ||
            profileData.login ||
            profileData.name ||
            profileData.public_repos !== undefined ||
            profileData.followers !== undefined
        );

        // Validate GitHub data has meaningful content
        if (hasValidProfile || repos.length > 0) {
            githubDataTransformed = {
                profile_data: profileData,
                repositories: repos,
                last_updated: new Date()
            };

            // Include additional analysis data if present
            if (githubData.repositories_analysis) {
                githubDataTransformed.repositories_analysis = githubData.repositories_analysis;
            }
            if (githubData.top_10_projects_summary) {
                githubDataTransformed.top_projects_summary = githubData.top_10_projects_summary;
            }
        }
    }

    return {
        ...transformedData,
        linkedin_data: linkedinDataTransformed,
        github_data: githubDataTransformed,
        ai_summary_data: aiSummaryData
    };
};

const processCandidateFile = async (filePath, summaryData = null, linkedinData = null, githubData = null, retries = 0) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        let candidateData;

        try {
            candidateData = JSON.parse(data);
        } catch (parseError) {
            console.warn(`Initial JSON parse failed for ${filePath}, attempting to fix...`);
            const fixedData = data
                .replace(/'/g, '"') // Replace single quotes with double quotes
                .replace(/(\w+):/g, '"$1":') // Add quotes around keys
                .replace(/,\s*}/g, '}') // Remove trailing commas
                .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays

            try {
                candidateData = JSON.parse(fixedData);
            } catch (secondParseError) {
                throw new Error(`Failed to parse JSON even after fixes: ${secondParseError.message}`);
            }
        }

        const transformedData = transformCandidateData(candidateData, summaryData, linkedinData, githubData);
        if (!transformedData) {
            return { success: false, file: filePath, error: 'Data transformation failed' };
        }

        // Check for existing candidate to avoid duplicates
        const existingCandidate = await Candidate.findOne({
            'contact_information.email': transformedData.contact_information.email
        });

        if (existingCandidate) {
            console.log(`Candidate with email ${transformedData.contact_information.email} already exists, updating...`);
            await Candidate.findByIdAndUpdate(existingCandidate._id, transformedData, { new: true });
        } else {
            const candidate = new Candidate(transformedData);
            await candidate.save();
        }

        console.log(`Successfully processed ${filePath}`);
        return { success: true, file: filePath };
    } catch (err) {
        if (retries > 0) {
            console.log(`Retrying ${filePath} (${retries} retries left) - Error: ${err.message}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return processCandidateFile(filePath, summaryData, linkedinData, githubData, retries - 1);
        }

        console.error(`Error processing file ${filePath}:`, err.message);
        return { success: false, file: filePath, error: err.message };
    }
};

const processCandidateDirectory = async (dataDirectoryPath, summariesDirectoryPath = null, linkedinDirectoryPath = null, githubDirectoryPath = null, concurrency = 3) => {
    try {
        // Verify directories exist
        if (!fs.existsSync(dataDirectoryPath)) {
            throw new Error(`Data directory does not exist: ${dataDirectoryPath}`);
        }

        const dataFiles = fs.readdirSync(dataDirectoryPath);
        const jsonDataFiles = dataFiles.filter(file => file.endsWith('.json')).sort();

        if (jsonDataFiles.length === 0) {
            console.log('No JSON files found in the data directory');
            return { success: false, message: 'No JSON files found in data directory' };
        }

        console.log(`Found ${jsonDataFiles.length} candidate data files to process`);

        // Load Summary Files
        let summaryFilesMap = new Map();
        if (summariesDirectoryPath && fs.existsSync(summariesDirectoryPath)) {
            const summaryFiles = fs.readdirSync(summariesDirectoryPath);
            const jsonSummaryFiles = summaryFiles.filter(file => file.endsWith('.json'));

            console.log(`Found ${jsonSummaryFiles.length} summary files to process`);

            for (const file of jsonSummaryFiles) {
                try {
                    // More flexible pattern matching for summary files
                    const candidateNumberMatch = file.match(/(?:clean_summary_)?candidate[_-]?(\d+)\.json/i);
                    if (candidateNumberMatch && candidateNumberMatch[1]) {
                        const candidateNumber = candidateNumberMatch[1];
                        const filePath = path.join(summariesDirectoryPath, file);
                        const summaryData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                        summaryFilesMap.set(candidateNumber, summaryData);
                        console.log(`Loaded summary for candidate ${candidateNumber}`);
                    }
                } catch (err) {
                    console.error(`Error reading summary file ${file}:`, err.message);
                }
            }
        }

        // Load LinkedIn Files
        let linkedinFilesMap = new Map();
        if (linkedinDirectoryPath && fs.existsSync(linkedinDirectoryPath)) {
            const linkedinFiles = fs.readdirSync(linkedinDirectoryPath);
            const jsonLinkedinFiles = linkedinFiles.filter(file => file.endsWith('.json'));

            console.log(`Found ${jsonLinkedinFiles.length} LinkedIn files to process`);

            for (const file of jsonLinkedinFiles) {
                try {
                    // More flexible pattern matching
                    let candidateNumberMatch = file.match(/(?:linkedin[_-]?)?candidate[_-]?(\d+)\.json/i) ||
                        file.match(/linkeldn[_-]?candidate[_-]?(\d+)\.json/i) || // Handle typo in filename
                        file.match(/(\d+)[_-]?linkedin\.json/i);

                    if (candidateNumberMatch && candidateNumberMatch[1]) {
                        const candidateNumber = candidateNumberMatch[1];
                        const filePath = path.join(linkedinDirectoryPath, file);
                        const fileContent = fs.readFileSync(filePath, 'utf8').trim();

                        if (!fileContent) {
                            console.warn(`LinkedIn file ${file} is empty`);
                            continue;
                        }

                        let linkedinData;
                        try {
                            linkedinData = JSON.parse(fileContent);
                        } catch (parseError) {
                            console.error(`JSON parsing error for LinkedIn file ${file}:`, parseError.message);
                            continue;
                        }

                        // Handle array responses
                        const finalLinkedinData = Array.isArray(linkedinData) ? linkedinData[0] : linkedinData;

                        // Validate LinkedIn data structure
                        if (finalLinkedinData && typeof finalLinkedinData === 'object' &&
                            (finalLinkedinData.fullName || finalLinkedinData.first_name ||
                                finalLinkedinData.public_identifier || finalLinkedinData.headline)) {
                            linkedinFilesMap.set(candidateNumber, finalLinkedinData);
                            console.log(`Successfully loaded LinkedIn data for candidate ${candidateNumber} from file: ${file}`);
                        } else {
                            console.warn(`LinkedIn file ${file} doesn't contain valid LinkedIn data structure`);
                        }
                    } else {
                        console.warn(`Could not extract candidate number from LinkedIn filename: ${file}`);
                    }
                } catch (err) {
                    console.error(`Error reading LinkedIn file ${file}:`, err.message);
                }
            }
        }

        // Load GitHub Files
        let githubFilesMap = new Map();
        if (githubDirectoryPath && fs.existsSync(githubDirectoryPath)) {
            const githubFiles = fs.readdirSync(githubDirectoryPath);
            const jsonGithubFiles = githubFiles.filter(file => file.endsWith('.json'));

            console.log(`Found ${jsonGithubFiles.length} GitHub files to process`);

            for (const file of jsonGithubFiles) {
                try {
                    const candidateNumberMatch = file.match(/(?:github[_-]?)?candidate[_-]?(\d+)\.json/i);
                    if (candidateNumberMatch && candidateNumberMatch[1]) {
                        const candidateNumber = candidateNumberMatch[1];
                        const filePath = path.join(githubDirectoryPath, file);
                        const fileContent = fs.readFileSync(filePath, 'utf8').trim();

                        if (!fileContent) {
                            console.warn(`GitHub file ${file} is empty`);
                            continue;
                        }

                        let githubData;
                        try {
                            githubData = JSON.parse(fileContent);
                        } catch (parseError) {
                            console.error(`Error reading GitHub file ${file}:`, parseError);
                            continue;
                        }

                        // Validate GitHub data structure
                        if (githubData && typeof githubData === 'object' &&
                            (githubData.login || githubData.name || githubData.repositories || githubData.repos ||
                                (githubData.profile && (githubData.profile.login || githubData.profile.name)))) {
                            githubFilesMap.set(candidateNumber, githubData);
                            console.log(`Successfully loaded GitHub data for candidate ${candidateNumber}`);
                        } else {
                            console.warn(`GitHub file ${file} doesn't contain valid GitHub data structure`);
                        }
                    }
                } catch (err) {
                    console.error(`Error reading GitHub file ${file}:`, err.message);
                }
            }
        }

        console.log(`\n=== SUMMARY ===`);
        console.log(`GitHub files loaded: ${githubFilesMap.size}`);
        console.log(`LinkedIn files loaded: ${linkedinFilesMap.size}`);
        console.log(`Summary files loaded: ${summaryFilesMap.size}`);
        console.log(`Candidate data files to process: ${jsonDataFiles.length}`);
        console.log(`==================\n`);

        const results = [];

        // Process files sequentially to avoid race conditions and better error tracking
        for (let i = 0; i < jsonDataFiles.length; i += concurrency) {
            const batch = jsonDataFiles.slice(i, i + concurrency);
            const batchPromises = batch.map(async (file) => {
                const filePath = path.join(dataDirectoryPath, file);
                const candidateNumberMatch = file.match(/candidate[_-]?(\d+)\.json/i);
                const candidateNumber = candidateNumberMatch && candidateNumberMatch[1];

                if (!candidateNumber) {
                    console.error(`Could not extract candidate number from file: ${file}`);
                    return { success: false, file, error: 'Could not extract candidate number' };
                }

                const summaryData = summaryFilesMap.get(candidateNumber) || null;
                const linkedinData = linkedinFilesMap.get(candidateNumber) || null;
                const githubData = githubFilesMap.get(candidateNumber) || null;  // Get the data here

                console.log(`\nProcessing ${file}:`);
                console.log(`  - Candidate number: ${candidateNumber}`);
                console.log(`  - Has summary data: ${!!summaryData}`);
                console.log(`  - Has LinkedIn data: ${!!linkedinData}`);
                console.log(`  - Has GitHub data: ${!!githubData}`);

                if (githubData) {
                    const profile = githubData.user_profile || githubData.profile || githubData;
                    const repos = githubData.projects || githubData.repositories || githubData.repos || [];
                    console.log(`  - GitHub username: ${profile.username || profile.login || profile.name || 'Unknown'}`);
                    console.log(`  - Repositories: ${Array.isArray(repos) ? repos.length : 0}`);
                }

                try {
                    // Pass the githubData directly instead of trying to access the map
                    const result = await processCandidateFile(filePath, summaryData, linkedinData, githubData);
                    return result;
                } catch (error) {
                    console.error(`Failed to process ${file}:`, error.message);
                    return { success: false, file, error: error.message };
                }
            });

            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults);
            console.log(`\nProcessed ${Math.min(i + concurrency, jsonDataFiles.length)} of ${jsonDataFiles.length} files`);
        }

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        console.log(`\n=== FINAL RESULTS ===`);
        console.log(`Processing complete. Successful: ${successful}, Failed: ${failed}`);

        if (failed > 0) {
            console.log('\nFailed files:');
            results.filter(r => !r.success).forEach(r => {
                console.log(`  - ${r.file}: ${r.error}`);
            });
        }

        return {
            success: failed === 0,
            totalFiles: jsonDataFiles.length,
            successful,
            failed,
            results
        };
    } catch (err) {
        console.error('Error processing directory:', err);
        return { success: false, error: err.message };
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('MongoDB connection closed');
        }
    }
};

export {
    processCandidateFile,
    processCandidateDirectory
};