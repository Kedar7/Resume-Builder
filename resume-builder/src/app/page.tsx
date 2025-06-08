'use client';

import { useState } from 'react';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import type { FormData } from '../components/ResumeForm';
import html2pdf from 'html2pdf.js';

export default function Home() {
  const [resumeData, setResumeData] = useState<FormData>({
    personalInfo: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/johndoe',
      title: 'Senior Software Engineer',
    },
    summary: 'Experienced software engineer with a strong background in full-stack development and cloud architecture. Passionate about creating scalable and efficient solutions.',
    experience: [
      {
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        startDate: '2020-01',
        endDate: '2023-12',
        description: 'Led development of microservices architecture. Implemented CI/CD pipelines. Mentored junior developers.'
      },
      {
        company: 'StartUp Inc',
        position: 'Software Engineer',
        startDate: '2018-06',
        endDate: '2019-12',
        description: 'Developed and maintained web applications. Collaborated with cross-functional teams.'
      }
    ],
    education: [
      {
        startDate: '2014-09',
        endDate: '2018-05',
        institution: 'University of Technology',
        degree: 'Bachelor of Science in Computer Science'
      }
    ],
    skills: [
      { category: 'Programming Languages', list: 'JavaScript, TypeScript, Python, Java' },
      { category: 'Frontend', list: 'React, Vue.js, HTML5, CSS3, Tailwind CSS' },
      { category: 'Backend', list: 'Node.js, Express, Django, Spring Boot' },
      { category: 'Database', list: 'MongoDB, PostgreSQL, MySQL, Redis' },
      { category: 'DevOps', list: 'Docker, Kubernetes, AWS, CI/CD' }
    ],
    awards: [
      { name: 'Best Employee Award 2022' },
      { name: 'Innovation Excellence Award 2021' },
      { name: 'Technical Excellence Award 2020' }
    ],
    projects: [
      {
        name: 'E-commerce Platform',
        role: 'Lead Developer',
        technologies: 'React, Node.js, MongoDB',
        overview: 'Built a scalable e-commerce platform serving 100k+ users',
        responsibilities: [
          'Architected the system using microservices',
          'Implemented real-time inventory management',
          'Optimized database queries for better performance'
        ]
      },
      {
        name: 'Cloud Migration Project',
        role: 'Technical Lead',
        technologies: 'AWS, Docker, Kubernetes',
        overview: 'Led migration of legacy systems to cloud infrastructure',
        responsibilities: [
          'Designed cloud architecture',
          'Implemented containerization strategy',
          'Reduced operational costs by 40%'
        ]
      }
    ]
  });

  const handleDownload = () => {
    const element = document.querySelector('.resume-template') as HTMLElement;
    if (!element) return;

    // Temporarily remove height constraint and overflow
    const originalHeight = element.style.height;
    const originalOverflow = element.style.overflow;
    element.style.height = 'auto';
    element.style.overflow = 'visible';

    // Ensure logo maintains its size for PDF
    const logo = element.querySelector('img') as HTMLImageElement;
    if (logo) {
      logo.style.width = '160px'; // Keep width at 160px
      logo.style.height = '40px'; // Decreased from 48px to 40px
      logo.style.objectFit = 'contain';
    }

    const opt = {
      margin: 10,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
        windowHeight: element.scrollHeight
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait'
      }
    };

    // Clone the element to modify it for PDF
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Add the cloned element to the document temporarily
    document.body.appendChild(clonedElement);

    // Use dynamic import to avoid SSR issues
    import('html2pdf.js').then(({ default: html2pdf }) => {
      html2pdf()
        .set(opt)
        .from(clonedElement)
        .save()
        .then(() => {
          // Remove the cloned element after PDF generation
          document.body.removeChild(clonedElement);
          // Restore original styles
          element.style.height = originalHeight;
          element.style.overflow = originalOverflow;
          if (logo) {
            logo.style.width = '';
            logo.style.height = '';
            logo.style.objectFit = '';
          }
        });
    });
  };

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Resume Builder</h1>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Download PDF
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResumeForm data={resumeData} onChange={setResumeData} />
          <ResumePreview data={resumeData} />
        </div>
      </div>
    </main>
  );
} 