'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, FieldArrayPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const formSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(1, 'Phone is required'),
    location: z.string().min(1, 'Location is required'),
    linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')), // Allow empty string for optional URL
    title: z.string().min(1, 'Title is required'),
  }),
  summary: z.string().min(1, 'Summary is required'),
  experience: z.array(z.object({
    company: z.string().min(1, 'Company name is required'),
    position: z.string().min(1, 'Position is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    description: z.string().min(1, 'Description is required'),
  })),
  education: z.array(z.object({
    institution: z.string().min(1, 'Institution name is required'),
    degree: z.string().min(1, 'Degree is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
  })),
  skills: z.array(z.object({
    category: z.string().min(1, 'Category is required'),
    list: z.string().min(1, 'List of skills is required'),
  })),
  projects: z.array(z.object({
    name: z.string().min(1, 'Project name is required'),
    role: z.string().min(1, 'Role is required'),
    technologies: z.string().min(1, 'Technologies are required'),
    overview: z.string().min(1, 'Overview is required'),
    responsibilities: z.array(z.string().min(1, 'Responsibility cannot be empty')),
  })),
  awards: z.array(z.object({ name: z.string().min(1, 'Award cannot be empty') })),
});

export type FormData = z.infer<typeof formSchema>;

interface ResumeFormProps {
  data: FormData;
  onChange: (data: FormData) => void;
}

export default function ResumeForm({ data, onChange }: ResumeFormProps) {
  const { register, control, formState: { errors }, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: data,
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personalInfo: true,
    summary: false,
    experience: false,
    education: false,
    skills: false,
    awards: false,
    projects: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const subscription = watch((value) => {
      onChange(value as FormData);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control,
    name: 'experience',
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education',
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills',
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control,
    name: 'projects',
  });

  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({
    control,
    name: 'awards',
  });

  const appendResponsibility = (projectIndex: number) => {
    const currentResponsibilities = watch(`projects.${projectIndex}.responsibilities`) || [];
    setValue(`projects.${projectIndex}.responsibilities`, [...currentResponsibilities, '']);
  };

  const removeResponsibility = (projectIndex: number, responsibilityIndex: number) => {
    const currentResponsibilities = watch(`projects.${projectIndex}.responsibilities`) || [];
    const newResponsibilities = currentResponsibilities.filter((_ : string, i: number) => i !== responsibilityIndex);
    setValue(`projects.${projectIndex}.responsibilities`, newResponsibilities);
  };

  const renderSection = (section: string, title: string, content: React.ReactNode) => (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => toggleSection(section)}
        className="w-full flex justify-between items-center py-4 px-2 text-left text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{title}</span>
        <div className={`transform transition-transform duration-200 ${expandedSections[section] ? 'rotate-180' : ''}`}>
          <FiChevronDown />
        </div>
      </button>
      <div 
        className={`grid transition-all duration-200 ease-in-out ${
          expandedSections[section] ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="py-4 px-2">
            {content}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <form className="space-y-6">
      {renderSection('personalInfo', 'Personal Information', (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                {...register('personalInfo.name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.personalInfo?.name && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                {...register('personalInfo.email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.personalInfo?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.personalInfo.email.message}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              {...register('personalInfo.phone')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.personalInfo?.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.personalInfo.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              {...register('personalInfo.location')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.personalInfo?.location && (
              <p className="mt-1 text-sm text-red-600">{errors.personalInfo.location.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">LinkedIn Profile URL</label>
            <input
              type="url"
              {...register('personalInfo.linkedin')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.personalInfo?.linkedin && (
              <p className="mt-1 text-sm text-red-600">{errors.personalInfo.linkedin.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              {...register('personalInfo.title')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.personalInfo?.title && (
              <p className="mt-1 text-sm text-red-600">{errors.personalInfo.title.message}</p>
            )}
          </div>
        </div>
      ))}

      {renderSection('summary', 'Professional Summary', (
        <div className="space-y-4">
          <textarea
            {...register('summary')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.summary && (
            <p className="mt-1 text-sm text-red-600">{errors.summary.message}</p>
          )}
        </div>
      ))}

      {renderSection('experience', 'Experience', (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => appendExperience({ company: '', position: '', startDate: '', endDate: '', description: '' })}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" /> Add Experience
            </button>
          </div>
          {experienceFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Experience {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-white hover:text-gray-300"
                >
                  <FiTrash2 />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    {...register(`experience.${index}.company`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    {...register(`experience.${index}.position`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    {...register(`experience.${index}.startDate`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    {...register(`experience.${index}.endDate`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register(`experience.${index}.description`)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      ))}

      {renderSection('education', 'Education', (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => appendEducation({ institution: '', degree: '', startDate: '', endDate: '' })}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" /> Add Education
            </button>
          </div>
          {educationFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Education {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeEducation(index)}
                  className="text-white hover:text-gray-300"
                >
                  <FiTrash2 />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Institution</label>
                  <input
                    type="text"
                    {...register(`education.${index}.institution`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Degree</label>
                  <input
                    type="text"
                    {...register(`education.${index}.degree`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    {...register(`education.${index}.startDate`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    {...register(`education.${index}.endDate`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {renderSection('skills', 'Skills', (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => appendSkill({ category: '', list: '' })}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" /> Add Skill Category
            </button>
          </div>
          {skillFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Skill Category {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="text-white hover:text-gray-300"
                >
                  <FiTrash2 />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  {...register(`skills.${index}.category`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                <input
                  type="text"
                  {...register(`skills.${index}.list`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      ))}

      {renderSection('awards', 'Awards & Certifications', (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => appendAward({ name: '' })}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" /> Add Award
            </button>
          </div>
          {awardFields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Award {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeAward(index)}
                  className="text-white hover:text-gray-300"
                >
                  <FiTrash2 />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Award Name</label>
                <input
                  type="text"
                  {...register(`awards.${index}.name`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      ))}

      {renderSection('projects', 'Projects', (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => appendProject({ name: '', role: '', technologies: '', overview: '', responsibilities: [''] })}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2" /> Add Project
            </button>
          </div>
          {projectFields.map((field, projectIndex) => (
            <div key={field.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Project {projectIndex + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeProject(projectIndex)}
                  className="text-white hover:text-gray-300"
                >
                  <FiTrash2 />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    type="text"
                    {...register(`projects.${projectIndex}.name`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    {...register(`projects.${projectIndex}.role`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Technologies Used</label>
                <input
                  type="text"
                  {...register(`projects.${projectIndex}.technologies`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Overview</label>
                <textarea
                  {...register(`projects.${projectIndex}.overview`)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Responsibilities</label>
                {watch(`projects.${projectIndex}.responsibilities`)?.map((_, responsibilityIndex) => (
                  <div key={responsibilityIndex} className="flex items-center space-x-2 mt-2">
                    <input
                      type="text"
                      {...register(`projects.${projectIndex}.responsibilities.${responsibilityIndex}`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeResponsibility(projectIndex, responsibilityIndex)}
                      className="text-white hover:text-gray-300"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => appendResponsibility(projectIndex)}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiPlus className="mr-2" /> Add Responsibility
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </form>
  );
} 