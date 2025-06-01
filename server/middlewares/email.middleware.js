import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_EMAIL,
        pass: process.env.BREVO_SMTP_KEY,
    },
});

async function sendOfferEmail(candidate, emailTemplate, templateVariables) {
    const offerId = uuidv4();

    let emailBody = emailTemplate.body;
    let emailSubject = emailTemplate.subject;

    const variables = {
        ...templateVariables,
        candidateName: candidate.name,
        skills: candidate.skills.join(', '),
        offerLink: `${process.env.NEXT_PUBLIC_BASE_URL}/offer/${offerId}`,
    };

    for (const [key, value] of Object.entries(variables)) {
        emailBody = emailBody.replace(new RegExp(`{${key}}`, 'g'), value);
        emailSubject = emailSubject.replace(new RegExp(`{${key}}`, 'g'), value);
    }

    candidate.offerDetails = {
        jobTitle: templateVariables.jobTitle,
        offerId: offerId,
    };
    candidate.status = 'contacted';
    candidate.lastContacted = new Date();
    await candidate.save();

    const mailOptions = {
        from: `"HireAI Recruiter" <${process.env.BREVO_EMAIL}>`,
        to: candidate.email,
        subject: emailSubject,
        text: emailBody,
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${emailBody.replace(/\n/g, '<br>')}</div>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, offerId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
}

module.exports = {
    sendOfferEmail,
};