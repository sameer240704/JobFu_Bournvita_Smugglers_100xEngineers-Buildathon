import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Candidate from "../models/candidate.model.js"

const transformCandidateData = (data) => {
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

    return {
        ...data,
        linkedin_data: null,
        github_data: null,
        ai_summary_data: null
    };
};

const processCandidateFile = async (filePath, retries = 3) => {
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

        const transformedData = transformCandidateData(candidateData);
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
            return processCandidateFile(filePath, retries - 1);
        }

        console.error(`Error processing file ${filePath}:`, err.message);
        return { success: false, file: filePath, error: err.message };
    }
};

const processCandidateDirectory = async (directoryPath, concurrency = 5) => {
    try {
        const files = fs.readdirSync(directoryPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));

        if (jsonFiles.length === 0) {
            console.log('No JSON files found in the directory');
            return { success: false, message: 'No JSON files found' };
        }

        console.log(`Found ${jsonFiles.length} JSON files to process`);

        const results = [];
        const processQueue = [];

        for (let i = 0; i < jsonFiles.length; i += concurrency) {
            const batch = jsonFiles.slice(i, i + concurrency);
            const batchPromises = batch.map(file => {
                const filePath = path.join(directoryPath, file);
                return processCandidateFile(filePath)
                    .then(result => results.push(result));
            });

            await Promise.all(batchPromises);
            console.log(`Processed ${i + batch.length} of ${jsonFiles.length} files`);
        }

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        console.log(`Processing complete. Successful: ${successful}, Failed: ${failed}`);

        return {
            success: true,
            totalFiles: jsonFiles.length,
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