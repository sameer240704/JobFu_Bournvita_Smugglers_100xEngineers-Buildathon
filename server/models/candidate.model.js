import mongoose from 'mongoose';

const contactInformationSchema = new mongoose.Schema({
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    linkedin: { type: String },
    github: { type: mongoose.Schema.Types.Mixed },
    portfolio: { type: String },
    other_links: [{ type: String }]
}, { _id: false });

const educationSchema = new mongoose.Schema({
    degree: { type: String },
    institution: { type: String },
    location: { type: String },
    duration: { type: String },
    gpa_cgpa: { type: String },
    additional_info: { type: String },
    coursework: [{ type: String }]
}, { _id: false });

const experienceSchema = new mongoose.Schema({
    position: { type: String },
    company: { type: String },
    location: { type: String },
    duration: { type: String },
    description: { type: String },
    type: { type: String },
    key_achievements: [{ type: String }],
    technologies_used: [{ type: String }]
}, { _id: false });

const projectLinksSchema = new mongoose.Schema({
    demo: { type: String },
    github: { type: String },
    other: { type: String }
}, { _id: false });

const projectSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    technologies: [{ type: String }],
    links: { type: projectLinksSchema },
    achievements: { type: String },
    duration: { type: String }
}, { _id: false });

const technicalSkillsSchema = new mongoose.Schema({
    programming_languages: [{ type: String }],
    frameworks_libraries: [{ type: String }],
    databases: [{ type: String }],
    tools_software: [{ type: String }],
    cloud_platforms: [{ type: String }],
    devops: [{ type: String }],
    data_science: [{ type: String }],
    other_technical: [{ type: String }]
}, { _id: false });

const skillsSchema = new mongoose.Schema({
    technical_skills: { type: technicalSkillsSchema },
    soft_skills: [{ type: String }],
    industry_knowledge: [{ type: String }]
}, { _id: false });

const achievementSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
    date: { type: String },
    organization: { type: String },
    prize_amount: { type: String }
}, { _id: false });

const certificationSchema = new mongoose.Schema({
    name: { type: String },
    issuing_organization: { type: String },
    date: { type: String },
    expiry_date: { type: String },
    credential_id: { type: String }
}, { _id: false });

const publicationSchema = new mongoose.Schema({
    title: { type: String },
    journal_conference: { type: String },
    date: { type: String },
    authors: [{ type: String }],
    description: { type: String }
}, { _id: false });

const additionalInfoSchema = new mongoose.Schema({
    volunteering: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    hobbies: [{ type: String }],
    awards: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    other: [{ type: String }]
}, { _id: false });

const linkedinDataSchema = new mongoose.Schema({
    profile_data: { type: Object },
    last_updated: { type: Date, default: Date.now }
}, { _id: false });

const githubDataSchema = new mongoose.Schema({
    profile_data: { type: Object },
    repositories: [{ type: Object }],
    last_updated: { type: Date, default: Date.now }
}, { _id: false });

const aiSummaryDataSchema = new mongoose.Schema({
    summary: { type: String },
    raw_summary: { type: Object },
    last_updated: { type: Date, default: Date.now }
}, { _id: false });

const extractionMetadataSchema = new mongoose.Schema({
    extraction_date: { type: Date },
    model_used: { type: String },
    source_file: { type: String },
    pages_processed: { type: Number },
    pages_with_errors: { type: Number },
    ocr_used: { type: Boolean },
    extraction_method: { type: String },
    links_extracted: { type: Number },
    file_size_mb: { type: Number }
}, { _id: false });

const candidateSchema = new mongoose.Schema({
    candidate_name: { type: String, required: true },
    contact_information: { type: contactInformationSchema, required: true },
    candidate_description: { type: String },
    education: [{ type: educationSchema }],
    experience: [{ type: experienceSchema }],
    projects: [{ type: projectSchema }],
    skills: { type: skillsSchema },
    achievements: [{ type: achievementSchema }],
    certifications: [{ type: certificationSchema }],
    publications: [{ type: publicationSchema }],
    additional_information: { type: additionalInfoSchema },
    extraction_metadata: { type: extractionMetadataSchema },
    linkedin_data: { type: linkedinDataSchema, default: null },
    github_data: { type: githubDataSchema, default: null },
    ai_summary_data: { type: aiSummaryDataSchema, default: null },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

candidateSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});

const Candidate = mongoose.model('Candidate', candidateSchema);

export default Candidate;