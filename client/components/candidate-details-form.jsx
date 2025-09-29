"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Plus,
  X,
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Target,
  ChevronLeft,
  ChevronRight,
  Check,
  Mail,
  Phone,
  MapPinIcon,
  Award,
  Code,
  Languages,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const SECTIONS = [
  { id: "personal", title: "Personal Information", icon: User },
  { id: "education", title: "Educational Background", icon: GraduationCap },
  { id: "skills", title: "Skills & Expertise", icon: Briefcase },
  { id: "location", title: "Location & Availability", icon: MapPin },
  { id: "career", title: "Career Interests", icon: Target },
];

export default function CandidateDetailsForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    gender: "",
    dateOfBirth: null,

    // Educational Background
    education: [
      {
        degree: "",
        institution: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
        achievements: "",
      },
    ],
    certifications: [""],

    // Skills and Expertise
    technicalSkills: [""],
    softSkills: [""],
    languages: [{ language: "", proficiency: "" }],
    tools: [""],

    // Location and Availability
    preferredCities: [""],
    remoteWork: false,
    internshipDuration: "",
    availability: "",

    // Sector and Career Interests
    desiredDomains: [""],
    targetIndustries: [""],
    preferredRoles: [""],
    careerGoals: "",
    growthAspirations: "",
  });
  const router = useRouter();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field, defaultValue = "") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          degree: "",
          institution: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          grade: "",
          achievements: "",
        },
      ],
    }));
  };

  const handleLanguageChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang, i) =>
        i === index ? { ...lang, [field]: value } : lang
      ),
    }));
  };

  const handleNext = () => {
    if (currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    setIsSubmitted(true);
  };

  const CandidateCard = () => (
    <div className="bg-transparent py-8 flex items-center justify-center tracking-tight">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Created Successfully!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your candidate profile has been saved.
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8 -mt-16 relative tracking-tight">
            <div className="flex flex-col lg:flex-row gap-8 pt-10">
              <div className="lg:w-1/3">
                <div className="w-32 h-32 bg-white dark:bg-gray-700 rounded-full border-4 border-white dark:border-gray-600 shadow-xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
                  <User className="w-16 h-16 text-gray-400" />
                </div>

                <div className="text-center lg:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {formData.firstName} {formData.lastName}
                  </h2>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {formData.email && (
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <Mail className="w-auto h-10" />
                        <span className="font-semibold">{formData.email}</span>
                      </div>
                    )}

                    {formData.phone && (
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <Phone className="w-4 h-4" />
                        <span className="font-semibold">{formData.phone}</span>
                      </div>
                    )}

                    {(formData.city || formData.state) && (
                      <div className="flex items-center justify-center lg:justify-start gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span className="font-semibold">
                          {[formData.city, formData.state]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="h-full w-px bg-gray-300"></div>

              <div className="lg:w-2/3 space-y-6">
                {formData.education[0]?.degree && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap className="w-5 h-5 text-black" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Education
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {formData.education.map(
                        (edu, index) =>
                          edu.degree && (
                            <div
                              key={index}
                              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3"
                            >
                              <div className="font-medium text-gray-900 dark:text-white">
                                {edu.degree}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {edu.institution}
                              </div>
                              {edu.fieldOfStudy && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {edu.fieldOfStudy}
                                </div>
                              )}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                )}

                {/* Skills */}
                {formData.technicalSkills.filter(Boolean).length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Code className="w-5 h-5 text-black" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Technical Skills
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.technicalSkills
                        .filter(Boolean)
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {formData.languages.filter((lang) => lang.language).length >
                  0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Languages className="w-5 h-5 text-black" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Languages
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.languages
                        .filter((lang) => lang.language)
                        .map((lang, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full"
                          >
                            {lang.language} ({lang.proficiency})
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.availability && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-black" />
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Availability
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formData.availability}
                      </p>
                    </div>
                  )}

                  {formData.internshipDuration && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Duration Preference
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {formData.internshipDuration}
                      </p>
                    </div>
                  )}
                </div>

                {/* Career Goals */}
                {formData.careerGoals && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="w-5 h-5 text-black" />
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Career Goals
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {formData.careerGoals}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentSection(0);
            }}
            variant="outline"
            className="mr-4"
          >
            Edit Profile
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r text-white font-semibold from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Continue to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );

  if (isSubmitted) {
    return <CandidateCard />;
  }

  const renderPersonalInfo = () => (
    <Card className="border-0 bg-transparent dark:bg-gray-800/80 backdrop-blur-sm shadow-none p-0 w-full">
      <CardContent className="space-y-6 p-0 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              First Name<span className="text-red-600">*</span>
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter your first name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Last Name<span className="text-red-600">*</span>
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address<span className="text-red-600">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
              placeholder="your.email@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Phone Number<span className="text-red-600">*</span>
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
              placeholder="+1 (555) 123-4567"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="address"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Address
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
            placeholder="Street address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="city"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              City
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="state"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              State
            </Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
              placeholder="State"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="zipCode"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ZIP Code
            </Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              className="border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500"
              placeholder="12345"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Gender
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleInputChange("gender", value)}
            >
              <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer-not-to-say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Date of Birth
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal border-gray-200 dark:border-gray-700 focus:border-purple-500 focus:ring-purple-500",
                    !formData.dateOfBirth && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateOfBirth ? (
                    format(formData.dateOfBirth, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar
                  mode="single"
                  selected={formData.dateOfBirth}
                  onSelect={(date) => handleInputChange("dateOfBirth", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEducation = () => (
    <Card className="border-0 bg-transparent dark:bg-gray-800/80 shadow-none p-0 w-full">
      <CardContent className="space-y-6 p-0 py-2">
        {formData.education.map((edu, index) => (
          <div
            key={index}
            className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/50 dark:bg-gray-700/50"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                Education {index + 1}
              </h4>
              {formData.education.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("education", index)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Degree/Qualification *
                </Label>
                <Input
                  value={edu.degree}
                  onChange={(e) =>
                    handleEducationChange(index, "degree", e.target.value)
                  }
                  placeholder="Bachelor's in Computer Science"
                  className="border-gray-200 dark:border-gray-600"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Institution *
                </Label>
                <Input
                  value={edu.institution}
                  onChange={(e) =>
                    handleEducationChange(index, "institution", e.target.value)
                  }
                  placeholder="University/College name"
                  className="border-gray-200 dark:border-gray-600"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Field of Study
                </Label>
                <Input
                  value={edu.fieldOfStudy}
                  onChange={(e) =>
                    handleEducationChange(index, "fieldOfStudy", e.target.value)
                  }
                  placeholder="Computer Science, Engineering, etc."
                  className="border-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grade/GPA
                </Label>
                <Input
                  value={edu.grade}
                  onChange={(e) =>
                    handleEducationChange(index, "grade", e.target.value)
                  }
                  placeholder="3.8 GPA, First Class, etc."
                  className="border-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Start Date
                </Label>
                <Input
                  type="date"
                  value={edu.startDate}
                  onChange={(e) =>
                    handleEducationChange(index, "startDate", e.target.value)
                  }
                  className="border-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  End Date
                </Label>
                <Input
                  type="date"
                  value={edu.endDate}
                  onChange={(e) =>
                    handleEducationChange(index, "endDate", e.target.value)
                  }
                  className="border-gray-200 dark:border-gray-600"
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Achievements & Awards
              </Label>
              <Textarea
                value={edu.achievements}
                onChange={(e) =>
                  handleEducationChange(index, "achievements", e.target.value)
                }
                placeholder="Dean's List, scholarships, academic honors, etc."
                className="border-gray-200 dark:border-gray-600"
                rows={3}
              />
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addEducation}
          className="w-full border-dashed border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Education
        </Button>

        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-900 dark:text-white">
            Certifications
          </Label>
          {formData.certifications.map((cert, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={cert}
                onChange={(e) =>
                  handleArrayChange("certifications", index, e.target.value)
                }
                placeholder="AWS Cloud Practitioner, Google Analytics, etc."
                className="border-gray-200 dark:border-gray-700"
              />
              {formData.certifications.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("certifications", index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() => addArrayItem("certifications")}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSkills = () => (
    <Card className="border-0 bg-transparent dark:bg-gray-800/80 backdrop-blur-sm shadow-none p-0 w-full">
      <CardContent className="space-y-6 p-0 py-2">
        {/* Technical Skills */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-900 dark:text-white">
            Technical Skills
          </Label>
          {formData.technicalSkills.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={skill}
                onChange={(e) =>
                  handleArrayChange("technicalSkills", index, e.target.value)
                }
                placeholder="JavaScript, Python, React, Node.js, etc."
                className="border-gray-200 dark:border-gray-700"
              />
              {formData.technicalSkills.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("technicalSkills", index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() => addArrayItem("technicalSkills")}
            className="text-green-600 hover:text-green-800 hover:bg-green-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Technical Skill
          </Button>
        </div>

        {/* Soft Skills */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-900 dark:text-white">
            Soft Skills
          </Label>
          {formData.softSkills.map((skill, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={skill}
                onChange={(e) =>
                  handleArrayChange("softSkills", index, e.target.value)
                }
                placeholder="Leadership, Communication, Problem Solving, etc."
                className="border-gray-200 dark:border-gray-700"
              />
              {formData.softSkills.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("softSkills", index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() => addArrayItem("softSkills")}
            className="text-green-600 hover:text-green-800 hover:bg-green-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Soft Skill
          </Button>
        </div>

        {/* Languages */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-900 dark:text-white">
            Languages
          </Label>
          {formData.languages.map((lang, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={lang.language}
                onChange={(e) =>
                  handleLanguageChange(index, "language", e.target.value)
                }
                placeholder="English, Spanish, French, etc."
                className="border-gray-200 dark:border-gray-700 flex-1"
              />
              <Select
                value={lang.proficiency}
                onValueChange={(value) =>
                  handleLanguageChange(index, "proficiency", value)
                }
              >
                <SelectTrigger className="w-40 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Proficiency" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="native">Native</SelectItem>
                  <SelectItem value="fluent">Fluent</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                </SelectContent>
              </Select>
              {formData.languages.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("languages", index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              addArrayItem("languages", { language: "", proficiency: "" })
            }
            className="text-green-600 hover:text-green-800 hover:bg-green-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </div>

        {/* Tools */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-900 dark:text-white">
            Tools & Technologies
          </Label>
          {formData.tools.map((tool, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={tool}
                onChange={(e) =>
                  handleArrayChange("tools", index, e.target.value)
                }
                placeholder="Git, Docker, AWS, Figma, etc."
                className="border-gray-200 dark:border-gray-700"
              />
              {formData.tools.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("tools", index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() => addArrayItem("tools")}
            className="text-green-600 hover:text-green-800 hover:bg-green-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tool
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderLocation = () => (
    <Card className="border-0 bg-transparent dark:bg-gray-800/80 backdrop-blur-sm shadow-none p-0 w-full">
      <CardContent className="space-y-6 p-0 py-2">
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-900 dark:text-white">
            Preferred Internship Cities
          </Label>
          {formData.preferredCities.map((city, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={city}
                onChange={(e) =>
                  handleArrayChange("preferredCities", index, e.target.value)
                }
                placeholder="New York, San Francisco, London, etc."
                className="border-gray-200 dark:border-gray-700"
              />
              {formData.preferredCities.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("preferredCities", index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() => addArrayItem("preferredCities")}
            className="text-orange-600 hover:text-orange-800 hover:bg-orange-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add City
          </Button>
        </div>

        {/* Remote Work */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remoteWork"
            checked={formData.remoteWork}
            onCheckedChange={(checked) =>
              handleInputChange("remoteWork", checked)
            }
            className="border-gray-300 dark:border-gray-600"
          />
          <Label
            htmlFor="remoteWork"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Open to remote work opportunities
          </Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preferred Internship Duration
            </Label>
            <Select
              value={formData.internshipDuration}
              onValueChange={(value) =>
                handleInputChange("internshipDuration", value)
              }
            >
              <SelectTrigger className="border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="1-3-months">1-3 months</SelectItem>
                <SelectItem value="3-6-months">3-6 months</SelectItem>
                <SelectItem value="6-12-months">6-12 months</SelectItem>
                <SelectItem value="12-months-plus">12+ months</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Availability
            </Label>
            <Select
              value={formData.availability}
              onValueChange={(value) =>
                handleInputChange("availability", value)
              }
            >
              <SelectTrigger className="border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="When can you start?" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="immediately">Immediately</SelectItem>
                <SelectItem value="within-2-weeks">Within 2 weeks</SelectItem>
                <SelectItem value="within-1-month">Within 1 month</SelectItem>
                <SelectItem value="within-3-months">Within 3 months</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCareer = () => (
    <Card className="border-0 bg-transparent dark:bg-gray-800/80 backdrop-blur-sm shadow-none p-0 w-full">
      <CardContent className="space-y-6 p-0 py-2">
        {/* Desired Domains */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-900 dark:text-white">
            Desired Domains
          </Label>
          {formData.desiredDomains.map((domain, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={domain}
                onChange={(e) =>
                  handleArrayChange("desiredDomains", index, e.target.value)
                }
                placeholder="Software Development, Data Science, Marketing, etc."
                className="border-gray-200 dark:border-gray-700"
              />
              {formData.desiredDomains.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("desiredDomains", index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() => addArrayItem("desiredDomains")}
            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Domain
          </Button>
        </div>

        {/* Target Industries */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-900 dark:text-white">
            Target Industries
          </Label>
          {formData.targetIndustries.map((industry, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={industry}
                onChange={(e) =>
                  handleArrayChange("targetIndustries", index, e.target.value)
                }
                placeholder="Tech, Healthcare, Finance, E-commerce, etc."
                className="border-gray-200 dark:border-gray-700"
              />
              {formData.targetIndustries.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("targetIndustries", index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() => addArrayItem("targetIndustries")}
            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Industry
          </Button>
        </div>

        {/* Preferred Roles */}
        <div className="space-y-4">
          <Label className="text-base font-medium text-gray-900 dark:text-white">
            Preferred Roles
          </Label>
          {formData.preferredRoles.map((role, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={role}
                onChange={(e) =>
                  handleArrayChange("preferredRoles", index, e.target.value)
                }
                placeholder="Frontend Developer, Data Analyst, Product Manager, etc."
                className="border-gray-200 dark:border-gray-700"
              />
              {formData.preferredRoles.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeArrayItem("preferredRoles", index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="ghost"
            onClick={() => addArrayItem("preferredRoles")}
            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
        </div>

        {/* Career Goals */}
        <div className="space-y-2">
          <Label
            htmlFor="careerGoals"
            className="text-base font-medium text-gray-900 dark:text-white"
          >
            Career Goals
          </Label>
          <Textarea
            id="careerGoals"
            value={formData.careerGoals}
            onChange={(e) => handleInputChange("careerGoals", e.target.value)}
            placeholder="Describe your short-term and long-term career objectives..."
            className="border-gray-200 dark:border-gray-700"
            rows={4}
          />
        </div>

        {/* Growth Aspirations */}
        <div className="space-y-2">
          <Label
            htmlFor="growthAspirations"
            className="text-base font-medium text-gray-900 dark:text-white"
          >
            Growth Aspirations
          </Label>
          <Textarea
            id="growthAspirations"
            value={formData.growthAspirations}
            onChange={(e) =>
              handleInputChange("growthAspirations", e.target.value)
            }
            placeholder="What skills do you want to develop? What impact do you want to make?"
            className="border-gray-200 dark:border-gray-700"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderEducation();
      case 2:
        return renderSkills();
      case 3:
        return renderLocation();
      case 4:
        return renderCareer();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <div className="tracking-tight bg-transparent py-2">
      <div className="container mx-auto px-4 w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Candidate Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Tell us about yourself to find the perfect opportunities
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {SECTIONS.map((section, index) => {
              const IconComponent = section.icon;
              const isActive = index === currentSection;
              const isCompleted = index < currentSection;

              return (
                <div
                  key={section.id}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2",
                      isActive
                        ? "border-purple-600 bg-purple-600 text-white"
                        : isCompleted
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-gray-300 bg-gray-100 text-gray-400"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs text-center hidden sm:block",
                      isActive
                        ? "text-purple-600 font-semibold"
                        : "text-gray-500"
                    )}
                  >
                    {section.title}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentSection + 1) / SECTIONS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit}>
          {renderCurrentSection()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentSection === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <span className="text-sm text-gray-500">
              {currentSection + 1} of {SECTIONS.length}
            </span>

            {currentSection === SECTIONS.length - 1 ? (
              <Button
                type="submit"
                className="flex items-center font-semibold gap-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Complete Profile
                <Check className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNext}
                className="flex items-center text-white font-semibold gap-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
