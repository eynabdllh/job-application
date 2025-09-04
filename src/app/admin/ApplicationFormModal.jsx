"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { UploadCloud, File as FileIcon, X, Loader2 } from 'lucide-react'

// --- Data ---
const projects = [
  "AI Data Extraction", "Machine Learning Enablement", "Genealogy",
  "Natural Language Processing", "AI-Enabled Customer Service",
  "Computer Vision", "Autonomous Driving Technology"
];
const degreeOptions = ["High School / GED", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "Doctorate (PhD)", "Other"];
const courseOptions = ["Computer Science", "Data Science", "Artificial Intelligence", "Machine Learning", "Software Engineering", "Other"];
const statusOptions = ['pending', 'reviewing', 'approved', 'rejected'];

export default function ApplicationFormModal({ open, onClose, initialData, onSaved }) {
  const isEdit = Boolean(initialData?.id);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  const defaultFormState = {
    first_name: '', last_name: '', email: '', age: '',
    degree: '', degree_other: '', course: '', course_other: '',
    experience_years: '', experience_details: '', project: '', status: 'pending', 
    resume: null, resume_filename: ''
  };

  const [form, setForm] = useState(defaultFormState);
  
  useEffect(() => {
    if (open) {
      if (initialData) {
        setForm({
          first_name: initialData.first_name || '',
          last_name: initialData.last_name || '',
          email: initialData.email || '',
          age: initialData.age ?? '',
          degree: initialData.degree || '',
          degree_other: initialData.degree_other || '',
          course: initialData.course || '',
          course_other: initialData.course_other || '',
          experience_years: initialData.experience_years ?? '',
          experience_details: initialData.experience_details || '',
          project: initialData.project || '',
          status: initialData.status || 'pending',
          resume: null,
          resume_filename: initialData.resume_filename || '',
        });
      } else {
        setForm(defaultFormState);
      }
      setErrors({}); 
    }
  }, [open, initialData]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'file' ? (files ? files[0] : null) : value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!form.first_name.trim()) newErrors.first_name = "First name is required.";
    if (!form.last_name.trim()) newErrors.last_name = "Last name is required.";
    if (!form.email) newErrors.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Email address is invalid.";
    if (!form.age) newErrors.age = "Age is required.";
    else if (isNaN(form.age) || Number(form.age) < 18) newErrors.age = "Applicant must be at least 18.";
    if (!form.degree) newErrors.degree = "Degree is required.";
    if (form.degree === 'Other' && !form.degree_other.trim()) newErrors.degree_other = "Please specify the degree.";
    if (!form.course) newErrors.course = "Course is required.";
    if (form.course === 'Other' && !form.course_other.trim()) newErrors.course_other = "Please specify the course.";
    if (form.experience_years === '') newErrors.experience_years = "Years of experience is required.";
    else if (isNaN(form.experience_years) || Number(form.experience_years) < 0) newErrors.experience_years = "Experience cannot be negative.";
    if (!form.project.trim()) newErrors.project = "Project is required.";
    if (!isEdit && !form.resume) newErrors.resume = "A resume file is required for new applications.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before saving.");
      return;
    }
    setSaving(true);
    let resumePath = form.resume_filename;

    try {
      // 1. Handle file upload if a new file is present
      if (form.resume) {
        const file = form.resume;
        const filePath = `${form.email}/${Date.now()}_${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        resumePath = filePath;
      }

      // 2. Prepare database payload
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        age: Number(form.age) || null,
        degree: form.degree,
        degree_other: form.degree === 'Other' ? form.degree_other.trim() : '',
        course: form.course,
        course_other: form.course === 'Other' ? form.course_other.trim() : '',
        experience_years: Number(form.experience_years) || 0,
        experience_details: form.experience_details.trim(),
        project: form.project.trim(),
        status: form.status,
        resume_filename: resumePath,
        updated_at: new Date().toISOString(),
      };

      // 3. Perform Upsert (Update or Insert)
      if (isEdit) {
        const { error } = await supabase.from('applications').update(payload).eq('id', initialData.id);
        if (error) throw error;
        toast.success('Application updated successfully!');
      } else {
        const { error } = await supabase.from('applications').insert([payload]);
        if (error) throw error;
        toast.success('Application added successfully!');
      }

      onSaved(); 
      onClose();

    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* ... Header ... */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-bold text-[#133020]">{isEdit ? 'Edit Application' : 'Add New Application'}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField label="First Name" name="first_name" value={form.first_name} onChange={handleChange} required error={errors.first_name} />
            <InputField label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} required error={errors.last_name} />
            <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} required className="sm:col-span-2" error={errors.email} />
            <InputField label="Age" type="number" name="age" value={form.age} onChange={handleChange} required error={errors.age} />
            
            <SelectField label="Highest Degree" name="degree" value={form.degree} onChange={handleChange} required error={errors.degree}>
              <option value="">Select degree...</option>
              {degreeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </SelectField>
            {form.degree === 'Other' && <InputField label="Specify Degree" name="degree_other" value={form.degree_other} onChange={handleChange} required error={errors.degree_other} />}

            <SelectField label="Course/Major" name="course" value={form.course} onChange={handleChange} required error={errors.course}>
              <option value="">Select course...</option>
              {courseOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </SelectField>
            {form.course === 'Other' && <InputField label="Specify Course" name="course_other" value={form.course_other} onChange={handleChange} required error={errors.course_other} />}

            <InputField label="Experience (years)" type="number" name="experience_years" value={form.experience_years} onChange={handleChange} required error={errors.experience_years} />
            
            <TextareaField 
              label="Experience Details" 
              name="experience_details" 
              value={form.experience_details} 
              onChange={handleChange}
              className="sm:col-span-2"
              error={errors.experience_details}
            />

            <SelectField label="Project Applied For" name="project" value={form.project} onChange={handleChange} required className="sm:col-span-2" error={errors.project}>
              <option value="">Select a project...</option>
              {projects.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </SelectField>
            
            <SelectField label="Status" name="status" value={form.status} onChange={handleChange} required className="sm:col-span-2" error={errors.status}>
              {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </SelectField>

            <FileUpload
              isEdit={isEdit}
              resumeUrl={form.resume_filename}
              currentFile={form.resume}
              onChange={handleChange}
              error={errors.resume}
            />
          </div>
        </form>
        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg bg-gray-100 text-[#133020] font-semibold hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving} className="px-5 py-2.5 rounded-lg bg-[#046241] text-white font-semibold hover:bg-[#133020] disabled:opacity-50 flex items-center gap-2 transition-colors">
            {saving && <Loader2 className="animate-spin" size={18} />}
            {saving ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create Application')}
          </button>
        </div>
      </div>
    </div>
  )
}

const InputField = ({ label, className = '', error, ...props }) => (
  <div className={className}>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input {...props} className={`w-full rounded-md border p-2.5 shadow-sm focus:border-[#046241] focus:ring focus:ring-[#046241] focus:ring-opacity-50 ${error ? 'border-red-500' : 'border-gray-300'}`} />
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, className = '', children, error, ...props }) => (
  <div className={className}>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <select {...props} className={`w-full rounded-md border p-2.5 shadow-sm focus:border-[#046241] focus:ring focus:ring-[#046241] focus:ring-opacity-50 ${error ? 'border-red-500' : 'border-gray-300'}`}>
      {children}
    </select>
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

const TextareaField = ({ label, className = '', error, ...props }) => (
    <div className={className}>
        <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
        <textarea {...props} rows="4" className={`w-full rounded-md border p-2.5 shadow-sm focus:border-[#046241] focus:ring focus:ring-[#046241] focus:ring-opacity-50 ${error ? 'border-red-500' : 'border-gray-300'}`} />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
);


const FileUpload = ({ isEdit, resumeUrl, currentFile, onChange, error }) => {
  const path = typeof resumeUrl === 'string' ? resumeUrl : '';
  const { data } = supabase.storage.from('resumes').getPublicUrl(path);
  const fullResumeUrl = data?.publicUrl || '';

  return (
    <div className="sm:col-span-2">
      <label className="block text-sm font-semibold text-gray-700 mb-2">Resume</label>
      {isEdit && path && !currentFile && (
        <div className="flex items-center justify-between p-3 bg-gray-50 border rounded-lg">
          <div className="flex items-center gap-3">
            <FileIcon className="text-gray-500" />
            {fullResumeUrl ? (
              <a href={fullResumeUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#046241] hover:underline">
                View Current Resume
              </a>
            ) : (
              <span className="text-gray-500">Resume not publicly accessible</span>
            )}
          </div>
          <label htmlFor="resume-upload" className="font-semibold text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
            Replace
            <input id="resume-upload" name="resume" type="file" onChange={onChange} className="sr-only" />
          </label>
        </div>
      )}
      
      {currentFile && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3">
            <FileIcon className="text-green-600" />
            <span className="font-medium text-green-800">{currentFile.name}</span>
          </div>
          <button type="button" onClick={() => onChange({ target: { name: 'resume', type: 'file', files: null } })} className="p-1 text-gray-500 hover:text-red-600">
            <X size={20} />
          </button>
        </div>
      )}

      {!currentFile && (!isEdit || !path) && (
        <label htmlFor="resume-upload" className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors border-gray-300 hover:border-[#046241]">
          <UploadCloud className="w-12 h-12 mb-2 text-gray-400" />
          <p className="font-semibold text-[#133020]">Click to upload resume</p>
          <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
          <input id="resume-upload" name="resume" type="file" onChange={onChange} className="sr-only" />
        </label>
      )}

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};