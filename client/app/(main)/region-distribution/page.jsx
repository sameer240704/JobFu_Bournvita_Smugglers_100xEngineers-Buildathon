"use client";

import { useState, useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  DollarSign,
  Clock,
  Award,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
  Star,
  ExternalLink,
} from "lucide-react";

mapboxgl.accessToken =
  "pk.eyJ1Ijoic2FtejI0MDciLCJhIjoiY202d2J1ZGxrMGVodzJxczZtN3FweDBrOSJ9.tTHirquUSgweNqnOlCoeRA";

const INDIA_STATES_GEOJSON_URL =
  "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";
const DELHI_DISTRICTS_GEOJSON_URL =
  "https://raw.githubusercontent.com/geohacker/india/master/district/delhi.geojson";

const jobDataByState = {
  "Andaman & Nicobar Island": 50,
  "Andhra Pradesh": 2800,
  "Arunanchal Pradesh": 100,
  Assam: 1400,
  Bihar: 2300,
  Chandigarh: 1250,
  Chhattisgarh: 1350,
  "Dadara & Nagar Havelli": 150,
  "Daman & Diu": 120,
  "NCT of Delhi": 12500,
  Goa: 1600,
  Gujarat: 4200,
  Haryana: 3500,
  "Himachal Pradesh": 800,
  "Jammu & Kashmir": 900,
  Jharkhand: 1450,
  Karnataka: 11200,
  Kerala: 3700,
  Lakshadweep: 20,
  "Madhya Pradesh": 2900,
  Maharashtra: 15800,
  Manipur: 290,
  Meghalaya: 180,
  Mizoram: 170,
  Nagaland: 160,
  Orissa: 2500,
  Puducherry: 1220,
  Punjab: 2850,
  Rajasthan: 3950,
  Sikkim: 150,
  "Tamil Nadu": 9800,
  Telangana: 8600,
  Tripura: 310,
  "Uttar Pradesh": 6800,
  Uttarakhand: 1280,
  "West Bengal": 5300,
};

const companyData = [
  {
    id: 1,
    name: "Microsoft India",
    lng: 77.0965,
    lat: 28.6892,
    industry: "Technology",
    jobs: 250,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png",
    description:
      "Leading technology company empowering every person and organization to achieve more",
    rating: 4.8,
    employees: "2000+",
  },
  {
    id: 2,
    name: "Google India",
    lng: 77.1025,
    lat: 28.7041,
    industry: "Technology",
    jobs: 180,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png",
    description:
      "Global technology leader in search, cloud computing, and software",
    rating: 4.9,
    employees: "5000+",
  },
  {
    id: 3,
    name: "Infosys",
    lng: 77.5946,
    lat: 12.9716,
    industry: "IT Services",
    jobs: 500,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/1200px-Infosys_logo.svg.png",
    description:
      "Global leader in next-generation digital services and consulting",
    rating: 4.3,
    employees: "300000+",
  },
  {
    id: 4,
    name: "Tata Consultancy Services",
    lng: 72.8777,
    lat: 19.076,
    industry: "IT Services",
    jobs: 800,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/1200px-Tata_Consultancy_Services_Logo.svg.png",
    description: "IT services, consulting and business solutions organization",
    rating: 4.2,
    employees: "600000+",
  },
  {
    id: 5,
    name: "Amazon India",
    lng: 77.209,
    lat: 28.6139,
    industry: "E-commerce",
    jobs: 350,
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1200px-Amazon_logo.svg.png",
    description: "World's leading e-commerce and cloud computing company",
    rating: 4.1,
    employees: "15000+",
  },
];

const detailedJobData = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Microsoft India",
    location: "Delhi NCR",
    type: "Full-time",
    salary: "₹25,00,000/year",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png",
    description:
      "Join Microsoft's mission to empower every person and organization on the planet to achieve more. Work on cutting-edge cloud technologies and AI solutions.",
    requirements: [
      "Bachelor's in Computer Science or related field",
      "5+ years of software development experience",
      "Strong knowledge of C# and .NET framework",
      "Experience with Azure cloud services",
      "Knowledge of microservices architecture",
    ],
    benefits: [
      "Stock options and bonuses",
      "Comprehensive health insurance",
      "Flexible work arrangements",
      "Continuous learning resources",
      "Generous parental leave",
      "Wellness programs",
    ],
    applicationDeadline: "Rolling basis",
    postedDate: "January 20, 2025",
    applicants: 543,
    matchScore: 89,
    easyApply: false,
    companyInfo: {
      name: "Microsoft India",
      industry: "Technology",
      employees: "2000+",
      headquarters: "Hyderabad & Bengaluru",
      founded: "1990",
      website: "microsoft.com/india",
      description:
        "Microsoft's India operations focus on driving digital transformation across the country through cloud computing, AI, and enterprise solutions.",
      culture: [
        "Innovation",
        "Diversity",
        "Growth Mindset",
        "Customer Obsession",
      ],
      techStack: [
        "C#",
        ".NET",
        "Azure",
        "TypeScript",
        "Python",
        "React",
        "AI/ML",
      ],
    },
    lng: 77.0965,
    lat: 28.6892,
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "Google India",
    location: "Hyderabad",
    type: "Internship",
    salary: "₹80,000/month",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png",
    description:
      "Exciting internship opportunity to work with Google's data science team on real-world machine learning projects and data analysis.",
    requirements: [
      "Currently pursuing Master's in Data Science/CS",
      "Strong Python programming skills",
      "Knowledge of ML frameworks (TensorFlow/PyTorch)",
      "Experience with data visualization",
      "Good statistical knowledge",
    ],
    benefits: [
      "Mentorship from industry experts",
      "Stipend and accommodation",
      "Networking opportunities",
      "Potential full-time offer",
      "Google certification",
    ],
    applicationDeadline: "February 15, 2025",
    postedDate: "January 18, 2025",
    applicants: 892,
    matchScore: 92,
    easyApply: true,
    companyInfo: {
      name: "Google India",
      industry: "Technology",
      employees: "5000+",
      headquarters: "Hyderabad & Bengaluru",
      founded: "2004",
      website: "google.co.in",
      description:
        "Google's India offices work on global products while solving unique challenges for the Indian market.",
      culture: ["Innovation", "Fast-paced", "Collaborative", "User-focused"],
      techStack: [
        "Python",
        "TensorFlow",
        "Google Cloud",
        "Java",
        "Go",
        "Kubernetes",
      ],
    },
    lng: 77.1025,
    lat: 28.7041,
  },
];

export default function JobMap() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [view, setView] = useState("india");
  const [selectedState, setSelectedState] = useState(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [82, 23],
      zoom: 3.5,
    });

    map.current.on("load", () => {
      loadIndiaData();
    });
  }, []);

  useEffect(() => {
    if (!map.current) return;

    if (view === "india") {
      flyToIndia();
      loadIndiaData();
    } else if (view === "delhi") {
      flyToDelhi();
      loadDelhiData();
    }
  }, [view]);

  const flyToIndia = () => {
    map.current.flyTo({
      center: [82, 23],
      zoom: 3.5,
      essential: true,
    });
  };

  const flyToDelhi = () => {
    map.current.flyTo({
      center: [77.1025, 28.7041],
      zoom: 9,
      essential: true,
    });
  };

  const removeLayersAndSources = () => {
    const layers = [
      "india-states-fill",
      "india-states-outline",
      "company-markers",
      "delhi-districts-fill",
      "delhi-districts-outline",
      "delhi-job-markers",
    ];
    const sources = [
      "india-states",
      "companies",
      "delhi-districts",
      "delhi-jobs",
    ];

    layers.forEach((layer) => {
      if (map.current.getLayer(layer)) {
        map.current.removeLayer(layer);
      }
    });

    sources.forEach((source) => {
      if (map.current.getSource(source)) {
        map.current.removeSource(source);
      }
    });
  };

  const loadIndiaData = () => {
    if (!map.current.loaded()) return;
    removeLayersAndSources();

    fetch(INDIA_STATES_GEOJSON_URL)
      .then((resp) => resp.json())
      .then((geojson) => {
        geojson.features.forEach((feature) => {
          const stateName = feature.properties.NAME_1;
          feature.properties.jobCount = jobDataByState[stateName] || 0;
        });

        map.current.addSource("india-states", {
          type: "geojson",
          data: geojson,
        });

        map.current.addLayer({
          id: "india-states-fill",
          type: "fill",
          source: "india-states",
          paint: {
            "fill-color": [
              "interpolate",
              ["linear"],
              ["get", "jobCount"],
              0,
              "#f7fbff",
              1000,
              "#deebf7",
              2500,
              "#c6dbef",
              5000,
              "#9ecae1",
              7500,
              "#6baed6",
              10000,
              "#4292c6",
              12500,
              "#2171b5",
              15000,
              "#08519c",
            ],
            "fill-opacity": 0.8,
          },
        });

        map.current.addLayer({
          id: "india-states-outline",
          type: "line",
          source: "india-states",
          layout: {},
          paint: {
            "line-color": "#ffffff",
            "line-width": 1.5,
          },
        });

        // Add company markers
        companyData.forEach((company) => {
          const el = document.createElement("div");
          el.className = "company-marker";
          el.innerHTML = `
    <div class="company-pin">
      <img 
        src="${company.logo}" 
        alt="${company.name}" 
        class="company-logo-img"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
      />
      <div class="company-logo-fallback">${company.name.charAt(0)}</div>
      <div class="pulse-ring"></div>
    </div>
  `;

          const marker = new mapboxgl.Marker(el)
            .setLngLat([company.lng, company.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25, className: "company-popup" })
                .setHTML(`
          <div class="p-4 min-w-[280px]">
            <div class="flex items-center gap-3 mb-3">
              <img 
                src="${company.logo}" 
                alt="${company.name}" 
                class="w-10 h-10 rounded-lg object-cover border"
                onerror="this.style.display='none'"
              />
              <div>
                <h3 class="font-bold text-lg">${company.name}</h3>
                <p class="text-sm text-gray-600">${company.industry}</p>
              </div>
            </div>
            <div class="space-y-2">
              <div class="flex items-center gap-2">
                <Users class="w-4 h-4 text-blue-600" />
                <span class="text-sm">${company.employees} employees</span>
              </div>
              <div class="flex items-center gap-2">
                <Award class="w-4 h-4 text-yellow-600" />
                <span class="text-sm">${company.jobs} open positions</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mt-3">${company.description}</p>
            <div class="flex items-center gap-2 mt-3">
              ${Array.from(
                { length: 5 },
                (_, i) =>
                  `<Star class="w-4 h-4 ${
                    i < Math.floor(company.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }" />`
              ).join("")}
              <span class="text-sm text-gray-600">${company.rating}</span>
            </div>
          </div>
        `)
            )
            .addTo(map.current);
        });

        map.current.on("click", "india-states-fill", (e) => {
          const stateName = e.features[0].properties.NAME_1;
          if (stateName === "NCT of Delhi") {
            setView("delhi");
          } else {
            setSelectedState({
              name: stateName,
              jobCount: e.features[0].properties.jobCount,
            });
          }
        });

        map.current.on("mousemove", "india-states-fill", (e) => {
          map.current.getCanvas().style.cursor = "pointer";
          setHoveredState({
            name: e.features[0].properties.NAME_1,
            jobCount: e.features[0].properties.jobCount,
            x: e.point.x,
            y: e.point.y,
          });
        });

        map.current.on("mouseleave", "india-states-fill", () => {
          map.current.getCanvas().style.cursor = "";
          setHoveredState(null);
        });
      });
  };

  const loadDelhiData = () => {
    if (!map.current.loaded()) return;
    removeLayersAndSources();

    fetch(DELHI_DISTRICTS_GEOJSON_URL)
      .then((resp) => resp.json())
      .then((geojson) => {
        map.current.addSource("delhi-districts", {
          type: "geojson",
          data: geojson,
        });

        map.current.addLayer({
          id: "delhi-districts-fill",
          type: "fill",
          source: "delhi-districts",
          paint: {
            "fill-color": "#3b82f6",
            "fill-opacity": 0.3,
          },
        });

        map.current.addLayer({
          id: "delhi-districts-outline",
          type: "line",
          source: "delhi-districts",
          paint: {
            "line-color": "#1d4ed8",
            "line-width": 2,
          },
        });

        // Add job markers for Delhi
        detailedJobData.forEach((job) => {
          const el = document.createElement("div");
          el.className =
            job.type === "Internship" ? "internship-marker" : "job-marker";
          el.innerHTML = `
    <div class="marker-content">
      <div class="marker-icon">
        <img 
          src="${job.logo}" 
          alt="${job.company}" 
          class="marker-logo-img"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
        />
        <div class="marker-logo-fallback">${job.company.charAt(0)}</div>
      </div>
      <div class="pulse-ring"></div>
    </div>
  `;

          const marker = new mapboxgl.Marker(el)
            .setLngLat([job.lng, job.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25, className: "job-popup" })
                .setHTML(`
          <div class="p-4 min-w-[300px]">
            <div class="flex items-center gap-3 mb-3">
              <img 
                src="${job.logo}" 
                alt="${job.company}" 
                class="w-12 h-12 rounded-lg object-cover border"
                onerror="this.style.display='none'"
              />
              <div>
                <h3 class="font-bold text-lg">${job.title}</h3>
                <p class="text-sm text-gray-600">${job.company} • ${
                job.location
              }</p>
              </div>
            </div>
            <div class="flex items-center gap-4 mb-3">
              <Badge variant="secondary">${job.type}</Badge>
              <div class="flex items-center gap-1">
                <DollarSign class="w-4 h-4 text-green-600" />
                <span class="text-sm font-medium">${job.salary}</span>
              </div>
            </div>
            <p class="text-sm text-gray-600 mb-3">${job.description.substring(
              0,
              120
            )}...</p>
            <Button class="w-full">View Details</Button>
          </div>
        `)
            )
            .addTo(map.current);

          el.addEventListener("click", () => {
            setSelectedJob(job);
          });
        });
      });
  };

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <div
        ref={mapContainer}
        className="absolute top-0 bottom-0 w-full h-full"
      />

      <div className="absolute top-4 left-4 space-y-4">
        <div className="w-72 bg-white/95 backdrop-blur-sm border-2 shadow-xl p-3 rounded-xl tracking-tight">
          <div className="pb-3 font-bold">
            <div className="text-lg">Top States by Opportunities</div>
          </div>
          <div className="">
            {Object.entries(jobDataByState)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([state, count]) => (
                <div
                  key={state}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="font-medium">{state}</span>
                  <Badge variant="outline">{count.toLocaleString()}</Badge>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* View Control */}
      {view === "delhi" && (
        <div className="absolute top-4 right-4">
          <Button
            onClick={() => setView("india")}
            className="bg-white/95 backdrop-blur-sm border-2 shadow-lg hover:bg-white"
          >
            ← Back to India Map
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4">
        <Card className="w-80 bg-white/95 backdrop-blur-sm border-2 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Job Density Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { color: "#f7fbff", label: "0-1K Jobs" },
              { color: "#deebf7", label: "1K-2.5K Jobs" },
              { color: "#c6dbef", label: "2.5K-5K Jobs" },
              { color: "#9ecae1", label: "5K-7.5K Jobs" },
              { color: "#6baed6", label: "7.5K-10K Jobs" },
              { color: "#4292c6", label: "10K-12.5K Jobs" },
              { color: "#2171b5", label: "12.5K-15K Jobs" },
              { color: "#08519c", label: "15K+ Jobs" },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-6 h-4 rounded border border-gray-300"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}

            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="company-marker-preview"></div>
                <span className="text-sm">Company Headquarters</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="job-marker-preview"></div>
                <span className="text-sm">Job Opportunities</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hover Tooltip */}
      {hoveredState && (
        <div
          className="absolute bg-white/95 backdrop-blur-sm p-3 rounded-lg border-2 shadow-lg pointer-events-none z-50 transition-all duration-200"
          style={{
            left: hoveredState.x + 10,
            top: hoveredState.y - 10,
            transform: "translateY(-100%)",
          }}
        >
          <h3 className="font-bold text-lg text-gray-900">
            {hoveredState.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Users className="w-4 h-4 text-blue-600" />
            <p className="text-gray-700 font-semibold">
              {hoveredState.jobCount.toLocaleString()} jobs
            </p>
          </div>
          <div className="w-3 h-3 bg-white border-r-2 border-b-2 absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45"></div>
        </div>
      )}

      {/* Selected State Modal */}
      {selectedState && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Card className="w-96 bg-white/95 backdrop-blur-sm border-2 shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle>{selectedState.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setSelectedState(null)}
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {selectedState.jobCount.toLocaleString()}
                </div>
                <div className="text-sm text-blue-800">Total Job Openings</div>
              </div>
              <Button className="w-full" onClick={() => setView("delhi")}>
                Explore Opportunities <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Job Detail Sidebar */}
      {selectedJob && (
        <div className="absolute top-4 right-4 bottom-4 w-96 bg-white/95 backdrop-blur-sm border-2 shadow-2xl rounded-lg z-40 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedJob.logo}
                    alt={selectedJob.company}
                    className="w-12 h-12 rounded-lg object-cover border"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div>
                    <h2 className="text-xl font-bold">{selectedJob.title}</h2>
                    <p className="text-gray-600">{selectedJob.company}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedJob(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{selectedJob.type}</Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <DollarSign className="w-3 h-3 mr-1" />
                  {selectedJob.salary}
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  <MapPin className="w-3 h-3 mr-1" />
                  {selectedJob.location}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Posted {selectedJob.postedDate}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {selectedJob.applicants} applicants
                </div>
              </div>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="p-6"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="company">Company</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Job Description</h3>
                  <p className="text-gray-700">{selectedJob.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Requirements</h3>
                  <ul className="space-y-2">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="company" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Industry:</span>
                    <span>{selectedJob.companyInfo.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Employees:</span>
                    <span>{selectedJob.companyInfo.employees}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Headquarters:</span>
                    <span>{selectedJob.companyInfo.headquarters}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Founded:</span>
                    <span>{selectedJob.companyInfo.founded}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Company Culture</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.companyInfo.culture.map((value, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-gray-50"
                      >
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.companyInfo.techStack.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-blue-50 text-blue-700"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Benefits & Perks</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedJob.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-green-50 rounded"
                      >
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Application Deadline:</span>
                    <span>{selectedJob.applicationDeadline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Match Score:</span>
                    <Badge className="bg-green-600">
                      {selectedJob.matchScore}%
                    </Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Apply Now
                </Button>
                <Button variant="outline" size="icon">
                  <Bookmark className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .company-marker {
          background: none;
          border: none;
          cursor: pointer;
        }

        .company-pin {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .company-logo-img {
          width: 44px;
          height: 44px;
          background: white;
          border: 3px solid #3b82f6;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          z-index: 2;
          position: relative;
        }

        .company-logo-fallback {
          width: 44px;
          height: 44px;
          background: #3b82f6;
          border: 3px solid #3b82f6;
          border-radius: 50%;
          display: none;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
          z-index: 2;
          position: relative;
        }

        .pulse-ring {
          position: absolute;
          width: 64px;
          height: 64px;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          animation: pulse 2s infinite;
          opacity: 0.4;
        }

        .job-marker,
        .internship-marker {
          background: none;
          border: none;
          cursor: pointer;
        }

        .marker-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marker-icon {
          position: relative;
          width: 36px;
          height: 36px;
          background: white;
          border: 2px solid #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
          z-index: 2;
        }

        .marker-logo-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .marker-logo-fallback {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: none;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
          background: #10b981;
        }

        .internship-marker .marker-icon {
          border-color: #f59e0b;
        }

        .internship-marker .marker-logo-fallback {
          background: #f59e0b;
        }

        .company-popup .mapboxgl-popup-content,
        .job-popup .mapboxgl-popup-content {
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.95);
        }

        .company-popup .mapboxgl-popup-content img,
        .job-popup .mapboxgl-popup-content img {
          border-radius: 8px;
          border: 2px solid #f3f4f6;
        }

        .company-marker-preview {
          width: 16px;
          height: 16px;
          background: white;
          border: 2px solid #3b82f6;
          border-radius: 50%;
        }

        .job-marker-preview {
          width: 12px;
          height: 12px;
          background: white;
          border: 2px solid #10b981;
          border-radius: 50%;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.8);
            opacity: 0.6;
          }
          70% {
            transform: scale(1.4);
            opacity: 0;
          }
          100% {
            transform: scale(0.8);
            opacity: 0;
          }
        }

        .mapboxgl-popup-tip {
          border-top-color: rgba(255, 255, 255, 0.95) !important;
          border-bottom-color: rgba(255, 255, 255, 0.95) !important;
        }

        .mapboxgl-popup-close-button {
          padding: 4px 8px;
          font-size: 16px;
          color: #6b7280;
        }

        .mapboxgl-popup-close-button:hover {
          background-color: #f3f4f6;
          color: #374151;
        }
      `}</style>
    </div>
  );
}
