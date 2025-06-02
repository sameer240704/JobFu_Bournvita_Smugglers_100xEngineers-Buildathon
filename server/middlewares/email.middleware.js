import dotenv from "dotenv";
dotenv.config();

import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';

const requiredEnvVars = ['CLIENT_ID', 'CLIENT_SECRET', 'REFRESH_TOKEN'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI || 'https://developers.google.com/oauthplayground'
);

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

async function createTransporter() {
    try {
        const { token } = await oAuth2Client.getAccessToken();

        if (!token) {
            throw new Error('Failed to obtain access token');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.PASSWORD_OAUTH
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        await transporter.verify();
        console.log('Gmail transporter verified successfully');

        return transporter;
    } catch (error) {
        console.error('Error creating transporter:', error);
        throw new Error(`Failed to create email transporter: ${error.message}`);
    }
}

async function sendOfferEmail(userId, candidate, emailTemplate, templateVariables) {
    if (!candidate?.contact_information?.email) {
        throw new Error('Candidate email is required');
    }

    const offerId = uuidv4();
    let emailBody = emailTemplate.body || '';
    let emailSubject = emailTemplate.subject || 'Job Opportunity';

    const variables = {
        ...templateVariables,
        candidateName: candidate.candidate_name || 'Candidate',
        skills: candidate.skills?.technical_skills?.programming_languages?.join(', ') || 'Various skills',
        offerLink: `${process.env.NEXT_PUBLIC_BASE_URL}/offer/${offerId}`,
    };

    for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(`\\{${key}\\}`, 'g');
        emailBody = emailBody.replace(regex, value || '');
        emailSubject = emailSubject.replace(regex, value || '');
    }

    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: `"HireAI Recruiter" <${process.env.EMAIL_USER}>`,
            to: candidate.contact_information.email,
            subject: emailSubject,
            text: emailBody,
            html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                ${emailBody.replace(/\n/g, '<br>')}
            </div>`,
            headers: {
                'X-Offer-ID': offerId,
                'X-Candidate-ID': candidate._id?.toString() || 'unknown'
            }
        };

        const result = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully:', {
            messageId: result.messageId,
            to: candidate.contact_information.email,
            subject: emailSubject
        });

        return {
            success: true,
            offerId,
            messageId: result.messageId,
            sentTo: candidate.contact_information.email
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error: error.message,
            details: error.stack
        };
    }
}

export { sendOfferEmail, createTransporter };