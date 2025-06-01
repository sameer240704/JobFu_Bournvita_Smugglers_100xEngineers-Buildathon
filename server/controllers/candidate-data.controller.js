import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Candidate from "../models/candidate.model.js"

const transformCandidateData = (data, aiSummary = null) => {
    if (data.additional_information?.volunteering) {
        if (typeof data.additional_information.volunteering === 'string') {
            if (data.additional_information.volunteering.trim().startsWith('[') ||
                data.additional_information.volunteering.trim().startsWith('{')) {
                try {
                    data.additional_information.volunteering = JSON.parse(
                        data.additional_information.volunteering.replace(/'/g, '"')
                    );
                } catch (e) {
                }
            } else {
                data.additional_information.volunteering = {
                    description: data.additional_information.volunteering
                };
            }
        }
    }

    if (data.additional_information?.awards) {
        if (typeof data.additional_information.awards === 'string') {
            if (data.additional_information.awards.trim().startsWith('[') ||
                data.additional_information.awards.trim().startsWith('{')) {
                try {
                    data.additional_information.awards = JSON.parse(
                        data.additional_information.awards.replace(/'/g, '"')
                    );
                } catch (e) {
                    // Keep as string if parsing fails
                }
            } else {
                data.additional_information.awards = {
                    title: data.additional_information.awards
                };
            }
        }
    }

    if (!data.contact_information?.email) {
        data.contact_information = data.contact_information || {};
        data.contact_information.email = `no-email-${Math.random().toString(36).substring(2)}@placeholder.com`;
    }

    let aiSummaryData = null;
    if (aiSummary) {
        const summaryPoints = [];
        for (const [key, value] of Object.entries(aiSummary)) {
            if (key.startsWith('point') && value) {
                summaryPoints.push(`• ${value}`);
            }
        }

        aiSummaryData = {
            summary: summaryPoints.join('\n\n'),
            raw_summary: aiSummary,
            last_updated: new Date()
        };
    }

    let linkedinDataTransformed = null;
    if (linkedinData && Array.isArray(linkedinData) && linkedinData.length > 0) {
        linkedinDataTransformed = {
            profile_data: linkedinData[0],
            last_updated: new Date()
        };
    }

    return {
        ...data,
        linkedin_data: linkedinDataTransformed,
        github_data: null,
        ai_summary_data: aiSummaryData
    };
};

const processCandidateFile = async (filePath, summaryData = null, linkedinData = null, retries = 0) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        let candidateData;

        try {
            candidateData = JSON.parse(data);
        } catch (parseError) {
            const fixedData = data
                .replace(/'/g, '"') // Replace single quotes with double quotes
                .replace(/(\w+):/g, '"$1":') // Add quotes around keys
                .replace(/,\s*}/g, '}') // Remove trailing commas
                .replace(/,\s*]/g, ']'); // Remove trailing commas in arrays

            candidateData = JSON.parse(fixedData);
        }

        const transformedData = transformCandidateData(candidateData, summaryData, linkedinData);
        if (!transformedData) {
            return { success: false, file: filePath, error: 'Data transformation failed' };
        }

        const candidate = new Candidate(transformedData);

        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Database operation timed out'));
            }, 20000);

            candidate.save()
                .then(() => {
                    clearTimeout(timeout);
                    resolve();
                })
                .catch(err => {
                    clearTimeout(timeout);
                    reject(err);
                });
        });

        console.log(`Successfully processed ${filePath}`);
        return { success: true, file: filePath };
    } catch (err) {
        if (retries > 0) {
            console.log(`Retrying ${filePath} (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            return processCandidateFile(filePath, summaryData, retries - 1);
        }

        console.error(`Error processing file ${filePath}:`, err.message);
        return { success: false, file: filePath, error: err.message };
    }
};

const processCandidateDirectory = async (dataDirectoryPath, summariesDirectoryPath = null, linkedinDirectoryPath = null, concurrency = 5) => {
    try {
        // Process candidate data files
        const dataFiles = fs.readdirSync(dataDirectoryPath);
        const jsonDataFiles = dataFiles.filter(file => file.endsWith('.json'));

        if (jsonDataFiles.length === 0) {
            console.log('No JSON files found in the data directory');
            return { success: false, message: 'No JSON files found in data directory' };
        }

        console.log(`Found ${jsonDataFiles.length} candidate data files to process`);

        // Process summary files if directory provided
        let summaryFilesMap = new Map();
        if (summariesDirectoryPath && fs.existsSync(summariesDirectoryPath)) {
            const summaryFiles = fs.readdirSync(summariesDirectoryPath);
            const jsonSummaryFiles = summaryFiles.filter(file => file.endsWith('.json'));

            console.log(`Found ${jsonSummaryFiles.length} summary files to process`);

            // Create a map of summary files by candidate number for easy lookup
            for (const file of jsonSummaryFiles) {
                try {
                    // Extract candidate number from filename (clean_summary_candidate_1.json -> 1)
                    const candidateNumberMatch = file.match(/clean_summary_candidate_(\d+)\.json/);
                    if (candidateNumberMatch && candidateNumberMatch[1]) {
                        const candidateNumber = candidateNumberMatch[1];
                        const filePath = path.join(summariesDirectoryPath, file);
                        const summaryData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                        summaryFilesMap.set(candidateNumber, summaryData);
                    }
                } catch (err) {
                    console.error(`Error reading summary file ${file}:`, err);
                }
            }
        }

        let linkedinFilesMap = new Map();
        if (linkedinDirectoryPath && fs.existsSync(linkedinDirectoryPath)) {
            const linkedinFiles = fs.readdirSync(linkedinDirectoryPath);
            const jsonLinkedinFiles = linkedinFiles.filter(file => file.endsWith('.json'));

            console.log(`Found ${jsonLinkedinFiles.length} LinkedIn files to process`);

            // Create a map of LinkedIn files by candidate number for easy lookup
            for (const file of jsonLinkedinFiles) {
                try {
                    // Extract candidate number from filename (linkedin_candidate_1.json -> 1)
                    const candidateNumberMatch = file.match(/linkedin_candidate_(\d+)\.json/);
                    if (candidateNumberMatch && candidateNumberMatch[1]) {
                        const candidateNumber = candidateNumberMatch[1];
                        const filePath = path.join(linkedinDirectoryPath, file);
                        const linkedinData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                        linkedinFilesMap.set(candidateNumber, linkedinData);
                    }
                } catch (err) {
                    console.error(`Error reading LinkedIn file ${file}:`, err);
                }
            }
        }

        const results = [];
        const processQueue = [];

        for (let i = 0; i < jsonDataFiles.length; i += concurrency) {
            const batch = jsonDataFiles.slice(i, i + concurrency);
            const batchPromises = batch.map(file => {
                const filePath = path.join(dataDirectoryPath, file);

                const candidateNumberMatch = file.match(/candidate_(\d+)\.json/);
                const candidateNumber = candidateNumberMatch && candidateNumberMatch[1];
                const summaryData = candidateNumber ? summaryFilesMap.get(candidateNumber) : null;
                const linkedinData = candidateNumber ? linkedinFilesMap.get(candidateNumber) : null;

                return processCandidateFile(filePath, summaryData, linkedinData)
                    .then(result => results.push(result));
            });

            await Promise.all(batchPromises);
            console.log(`Processed ${i + batch.length} of ${jsonDataFiles.length} files`);
        }

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        console.log(`Processing complete. Successful: ${successful}, Failed: ${failed}`);

        return {
            success: true,
            totalFiles: jsonDataFiles.length,
            successful,
            failed,
            results
        };
    } catch (err) {
        console.error('Error processing directory:', err);
        return { success: false, error: err.message };
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB connection closed');
    }
};

export {
    processCandidateFile,
    processCandidateDirectory
};