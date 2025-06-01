export const demoCandidates = [
    {
        _id: "1",
        candidate_name: "Sarah Johnson",
        contact_information: {
            email: "yashbuddhadev21@gmail.com",
            phone: "+49 123 456 789",
            linkedin: "https://linkedin.com/in/sarahjohnson",
            github: "https://github.com/sarahjohnson"
        },
        experience: [
            {
                position: "Senior AI Engineer",
                company: "Tech Innovations Inc.",
                location: "Berlin, Germany",
                duration: "2020 - Present",
                description: "Leading AI projects and developing machine learning models",
                technologies_used: ["Python", "TensorFlow", "PyTorch", "LangChain"]
            }
        ],
        skills: {
            technical_skills: {
                programming_languages: ["Python", "JavaScript", "Java"],
                frameworks_libraries: ["TensorFlow", "PyTorch", "React"],
                databases: ["MongoDB", "PostgreSQL"],
                cloud_platforms: ["AWS", "GCP"]
            }
        },
        status: "pending",
        metadata: {
            lastContacted: new Date("2025-05-28"),
            contactCount: 1
        }
    },
    {
        _id: "2",
        candidate_name: "Michael Chen",
        contact_information: {
            email: "sameergupta5687@gmail.com",
            phone: "+1 415 123 456",
            linkedin: "https://linkedin.com/in/michaelchen",
            portfolio: "https://michaelchen.dev"
        },
        experience: [
            {
                position: "Machine Learning Engineer",
                company: "AI Solutions Co.",
                location: "San Francisco, USA",
                duration: "2019 - Present",
                description: "Building and deploying ML models for enterprise clients",
                technologies_used: ["Python", "Scikit-learn", "Docker", "Kubernetes"]
            }
        ],
        skills: {
            technical_skills: {
                programming_languages: ["Python", "R", "C++"],
                frameworks_libraries: ["Scikit-learn", "Keras", "Flask"],
                devops: ["Docker", "Kubernetes", "CI/CD"]
            }
        },
        status: "contacted",
        metadata: {
            lastContacted: new Date("2025-05-25"),
            contactCount: 2
        }
    },
    {
        _id: "3",
        candidate_name: "Emma Rodriguez",
        contact_information: {
            email: "parth.gala1356@gmail.com",
            phone: "+44 20 1234 5678",
            github: "https://github.com/emmarodriguez"
        },
        experience: [
            {
                position: "AI Research Scientist",
                company: "DeepMind Technologies",
                location: "London, UK",
                duration: "2018 - Present",
                description: "Conducting research on neural networks and NLP",
                technologies_used: ["Python", "TensorFlow", "PyTorch", "HuggingFace"]
            }
        ],
        skills: {
            technical_skills: {
                programming_languages: ["Python", "Julia"],
                frameworks_libraries: ["TensorFlow", "PyTorch", "HuggingFace"],
                data_science: ["Pandas", "NumPy", "Matplotlib"]
            }
        },
        status: "pending",
        metadata: {
            lastContacted: new Date("2025-05-20"),
            contactCount: 1
        }
    },
    {
        _id: "4",
        candidate_name: "Sameer Gupta",
        contact_information: {
            email: "sameergupta79711@gmail.com",
            phone: "+91 9082201988",
            linkedin: "https://www.linkedin.com/in/sameergupta24/",
        },
        experience: [
            {
                position: "MLOps Engineer",
                company: "Samsung AI Center",
                location: "Seoul, South Korea",
                duration: "2021 - Present",
                description: "Implementing CI/CD pipelines for ML models",
                technologies_used: ["Python", "Docker", "Kubernetes", "Airflow"]
            }
        ],
        skills: {
            technical_skills: {
                programming_languages: ["Python", "Go", "Bash"],
                frameworks_libraries: ["MLflow", "Kubeflow"],
                devops: ["Docker", "Kubernetes", "Terraform", "AWS"]
            }
        },
        status: "accepted",
        metadata: {
            lastContacted: new Date("2025-05-15"),
            contactCount: 3
        }
    },
    {
        _id: "5",
        candidate_name: "Priya Patel",
        contact_information: {
            email: "priya.patel@example.com",
            phone: "+91 80 1234 5678",
            github: "https://github.com/priyapatel"
        },
        experience: [
            {
                position: "Data Scientist",
                company: "Flipkart",
                location: "Bangalore, India",
                duration: "2020 - Present",
                description: "Building recommendation systems and analytics tools",
                technologies_used: ["Python", "Spark", "SQL", "Tableau"]
            }
        ],
        skills: {
            technical_skills: {
                programming_languages: ["Python", "R", "SQL"],
                frameworks_libraries: ["Pandas", "NumPy", "Scikit-learn"],
                databases: ["PostgreSQL", "MongoDB"]
            }
        },
        status: "rejected",
        metadata: {
            lastContacted: new Date("2025-05-10"),
            contactCount: 2
        }
    },
    {
        _id: "6",
        candidate_name: "James Wilson",
        contact_information: {
            email: "james.wilson@example.com",
            phone: "+1 212 123 4567",
            linkedin: "https://linkedin.com/in/jameswilson"
        },
        experience: [
            {
                position: "AI Product Manager",
                company: "Google AI",
                location: "New York, USA",
                duration: "2019 - Present",
                description: "Managing AI product development and strategy",
                technologies_used: ["Python", "TensorFlow", "Cloud AI"]
            }
        ],
        skills: {
            technical_skills: {
                programming_languages: ["Python", "JavaScript"],
                frameworks_libraries: ["TensorFlow", "React"],
                cloud_platforms: ["GCP", "AWS"]
            },
            soft_skills: ["Product Management", "Team Leadership"]
        },
        status: "pending",
        metadata: {
            lastContacted: new Date("2025-05-05"),
            contactCount: 1
        }
    },
    {
        _id: "7",
        candidate_name: "Lena Müller",
        contact_information: {
            email: "lena.mueller@example.com",
            phone: "+49 30 1234567",
            github: "https://github.com/lenamueller"
        },
        experience: [
            {
                position: "Computer Vision Engineer",
                company: "BMW Autonomous",
                location: "Munich, Germany",
                duration: "2021 - Present",
                description: "Developing computer vision systems for autonomous vehicles",
                technologies_used: ["Python", "OpenCV", "TensorFlow", "C++"]
            }
        ],
        skills: {
            technical_skills: {
                programming_languages: ["Python", "C++", "CUDA"],
                frameworks_libraries: ["OpenCV", "TensorFlow", "PyTorch"],
                tools_software: ["Docker", "ROS"]
            }
        },
        status: "on_hold",
        metadata: {
            lastContacted: new Date("2025-04-28"),
            contactCount: 2
        }
    },
    {
        _id: "8",
        candidate_name: "Carlos Hernandez",
        contact_information: {
            email: "carlos.hernandez@example.com",
            phone: "+34 91 123 45 67",
            linkedin: "https://linkedin.com/in/carloshernandez"
        },
        experience: [
            {
                position: "NLP Engineer",
                company: "Telefónica Research",
                location: "Madrid, Spain",
                duration: "2020 - Present",
                description: "Developing NLP models for multilingual applications",
                technologies_used: ["Python", "HuggingFace", "spaCy", "FastAPI"]
            }
        ],
        skills: {
            technical_skills: {
                programming_languages: ["Python", "Java", "JavaScript"],
                frameworks_libraries: ["HuggingFace", "spaCy", "FastAPI"],
                databases: ["Elasticsearch", "PostgreSQL"]
            }
        },
        status: "responded",
        metadata: {
            lastContacted: new Date("2025-04-25"),
            contactCount: 3
        }
    }
];