'use client';

import React from 'react';

interface ResumePreviewProps {
  data: {
    personalInfo: {
      name: string;
      email: string;
      phone: string;
      location: string;
      linkedin?: string;
      title: string;
    };
    summary: string;
    experience: Array<{
      company: string;
      position: string;
      startDate: string;
      endDate: string;
      description: string;
    }>;
    education: Array<{
      institution: string;
      degree: string;
      startDate: string;
      endDate: string;
    }>;
    skills: Array<{
      category: string;
      list: string;
    }>;
    awards: Array<{
      name: string;
    }>;
    projects: Array<{
      name: string;
      role: string;
      technologies: string;
      overview: string;
      responsibilities: string[];
    }>;
  };
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  return (
    <div className="resume-template h-[800px] w-full border border-gray-300 shadow-lg overflow-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-6 section">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{data.personalInfo.name}</h1>
            <p className="text-gray-600">{data.personalInfo.location}</p>
            <p className="text-blue-600 font-semibold">{data.personalInfo.title}</p>
            <div className="mt-2 text-gray-600">
              <p>{data.personalInfo.email}</p>
              <p>{data.personalInfo.phone}</p>
            </div>
          </div>
          <img
            src="/Indium-logo.svg"
            alt="Company Logo"
            className="w-24 h-24 object-contain"
          />
        </div>

        {/* Summary */}
        <div className="mb-6 section">
          <h2 className="text-xl font-semibold text-blue-600 mb-2 text-center">Profile</h2>
          <p className="text-gray-700">{data.summary}</p>
        </div>

        {/* Experience */}
        <div className="mb-6 section">
          <h2 className="text-xl font-semibold text-blue-600 mb-2 text-center">Experience</h2>
          {data.experience.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800">{exp.position}</h3>
                  <p className="text-gray-600">{exp.company}</p>
                </div>
                <p className="text-gray-600">
                  {exp.startDate} - {exp.endDate}
                </p>
              </div>
              <p className="mt-2 text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="mb-6 section">
          <h2 className="text-xl font-semibold text-blue-600 mb-2 text-center">Education</h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-gray-800">{edu.degree}</h3>
              <p className="text-gray-600">{edu.institution}</p>
              <p className="text-gray-600">
                {edu.startDate} - {edu.endDate}
              </p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="mb-6 section">
          <h2 className="text-xl font-semibold text-blue-600 mb-2 text-center">Skills</h2>
          <div className="space-y-2">
            {data.skills.map((skill, index) => (
              <div key={index}>
                <p className="font-semibold text-gray-800">{skill.category}</p>
                <p className="text-gray-600">{skill.list}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Awards & Certifications */}
        <div className="mb-6 section">
          <h2 className="text-xl font-semibold text-blue-600 mb-2 text-center">Awards & Certifications</h2>
          <ul className="list-disc list-inside text-gray-700">
            {data.awards.map((award, index) => (
              <li key={index}>{award.name}</li>
            ))}
          </ul>
        </div>

        {/* Projects */}
        <div className="section">
          <h2 className="text-xl font-semibold text-blue-600 mb-2 text-center">Projects</h2>
          {data.projects.map((project, index) => (
            <div key={index} className="mb-6">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">Project</p>
                    <p className="text-gray-600">{project.name}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Role</p>
                    <p className="text-gray-600">{project.role}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Technologies Used</p>
                    <p className="text-gray-600">{project.technologies}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="font-semibold text-gray-800">Overview</p>
                  <p className="text-gray-600">{project.overview}</p>
                </div>
                <div className="mt-2">
                  <p className="font-semibold text-gray-800">Responsibilities</p>
                  <ul className="list-disc list-inside text-gray-600">
                    {project.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 