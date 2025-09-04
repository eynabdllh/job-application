"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Check, UploadCloud, ArrowLeft, RotateCw, File, X as XIcon } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

const projects = [
  "AI Data Extraction", "Machine Learning Enablement", "Genealogy",
  "Natural Language Processing", "AI-Enabled Customer Service",
  "Computer Vision", "Autonomous Driving Technology"
];
const degreeOptions = [
  "High School / GED", "Associate's Degree", "Bachelor's Degree",
  "Master's Degree", "Doctorate (PhD)", "Other"
];
const courseOptions = [
  "Computer Science", "Data Science", "Artificial Intelligence", "Machine Learning",
  "Software Engineering", "Information Technology", "Mathematics", "Statistics",
  "Physics", "Engineering", "Business Administration", "Economics", "Other"
];
const steps = [
  { id: 1, name: 'Personal' },
  { id: 2, name: 'Background' },
  { id: 3, name: 'Details' },
  { id: 4, name: 'Review & Submit' },
];

export default function ApplyClient() {
  const fileInputRef = useRef(null);
  const searchParams = useSearchParams();
  const projectFromURL = searchParams.get('project');
  const [backLink, setBackLink] = useState('/');

  const initialFormData = {
    first_name: "", last_name: "", age: "", degree: "",
    experience_years: "", experience_details: "",
    email: "", project: projectFromURL || "", resume: null,
    course: "", degree_other: "", course_other: "",
  };

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (projectFromURL) {
      setFormData(prev => ({ ...prev, project: projectFromURL }));
      setBackLink('/projects');
    } else {
      const referrer = document.referrer;
      if (referrer && referrer.includes('/projects')) {
        setBackLink('/projects');
      } else {
        setBackLink('/');
      }
    }
  }, [projectFromURL]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? (files ? files[0] : null) : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.first_name.trim()) newErrors.first_name = "First name is required.";
      if (!formData.last_name.trim()) newErrors.last_name = "Last name is required.";
      if (!formData.email) newErrors.email = "Email is required.";
      else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email address is invalid.";
      if (!formData.age) newErrors.age = "Age is required.";
      else if (isNaN(formData.age) || Number(formData.age) < 18) newErrors.age = "You must be at least 18.";
    } else if (step === 2) {
      if (!formData.degree.trim()) newErrors.degree = "Degree is required.";
      if (formData.degree === "Other" && !formData.degree_other.trim()) newErrors.degree_other = "Please specify your degree.";
      if (!formData.course.trim()) newErrors.course = "Course is required.";
      if (formData.course === "Other" && !formData.course_other.trim()) newErrors.course_other = "Please specify your course.";
      if (formData.experience_years === '') newErrors.experience_years = "Years of experience is required.";
      else if (isNaN(formData.experience_years) || Number(formData.experience_years) < 0) newErrors.experience_years = "Experience cannot be negative.";
      if (!formData.experience_details.trim()) newErrors.experience_details = "Please describe your relevant experience.";
    } else if (step === 3) {
      if (!formData.project) newErrors.project = "Please select a project.";
      if (!formData.resume) newErrors.resume = "A resume file is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep()) {
      if (step < 4) setStep(step + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    if (step > 1) setStep(step - 1);
  };

  const handleResetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setStep(1);
    setIsSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep() && step !== 4) {
      toast.error("Please ensure all fields are filled correctly before submitting.");
      return;
    }
    const toastId = toast.loading('Submitting application...');
    try {
      let resumePath = null;
      if(formData.resume) {
        const file = formData.resume;
        const filePath = `${formData.email}/${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from('resumes').upload(filePath, file);
        if (uploadError) throw new Error(`Resume Upload Failed: ${uploadError.message}`);
        resumePath = filePath;
      }
      const submissionData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        age: parseInt(formData.age),
        degree: formData.degree,
        degree_other: formData.degree === "Other" ? formData.degree_other : null,
        course: formData.course,
        course_other: formData.course === "Other" ? formData.course_other : null,
        experience_years: parseInt(formData.experience_years),
        experience_details: formData.experience_details,
        project: formData.project,
        resume_filename: resumePath,
        status: 'pending',
      };
      const resp = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to submit application');
      }
      toast.success('Application submitted successfully!', { id: toastId });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error.message || 'An error occurred. Please try again.', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-center" toastOptions={{ duration: 5000, style: { background: '#133020', color: '#ffffff' } }} />
      <Header />
      <main className="flex-grow flex flex-col ">
        <div className="flex-grow h-full w-full max-w-5xl mx-auto bg-white p-8 sm:p-12 shadow-lg">
          <Link href={backLink} className="flex items-center gap-2 text-sm text-[#046241] font-semibold hover:underline mb-6">
            <ArrowLeft size={16} />
            {backLink === '/projects' ? 'Back to Projects' : 'Back to Home'}
          </Link>

          <h1 className="text-3xl font-bold text-[#133020]">
            {formData.project ? `Apply for ${formData.project}` : "Apply for a Position"}
          </h1>

          <div className="my-10">
            <div className="flex items-center">
              {steps.map((s, index) => (
                <div key={s.id} className="flex items-center w-full">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300 relative ${step > s.id ? 'bg-[#046241]' : step === s.id ? 'bg-white border-2 border-[#046241]' : 'bg-gray-200'}`}>
                      {step > s.id ? <Check size={16} className="text-white" /> : step === s.id && <div className="w-3 h-3 bg-[#046241] rounded-full"></div>}
                    </div>
                    <p className={`mt-2 text-xs text-center font-semibold transition-colors ${step >= s.id ? 'text-[#046241]' : 'text-gray-400'}`}>{s.name}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-grow h-0.5 transition-all duration-300 -mx-1 ${step > s.id ? 'bg-[#046241]' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {step === 1 && <Step1 formData={formData} handleChange={handleChange} errors={errors} />}
            {step === 2 && <Step2 formData={formData} handleChange={handleChange} errors={errors} />}
            {step === 3 && <Step3 formData={formData} handleChange={handleChange} errors={errors} fileInputRef={fileInputRef} projectFromURL={projectFromURL} />}
            {step === 4 && <Step4 formData={formData} handleResetForm={handleResetForm} isSubmitted={isSubmitted} />}

            <div className="mt-12 pt-6 flex justify-between items-center">
              <button type="button" onClick={handleBack} disabled={step === 1 || isSubmitted} className="text-lg font-semibold text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Back
              </button>
              {step < 4 ? (
                <button type="button" onClick={handleNext} className="text-lg h-12 px-8 rounded-lg text-white font-semibold bg-[#046241] hover:bg-[#133020] transition-all shadow-md hover:shadow-lg">
                  Next
                </button>
              ) : (
                <button type="submit" disabled={isSubmitted} className="text-lg h-12 px-8 rounded-lg text-white font-semibold bg-[#046241] hover:bg-[#133020] transition-all shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {isSubmitted ? "Submitted" : "Submit Application"}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
      <GetInTouchFooter />
    </div>
  );
}

const GetInTouchFooter = () => (
  <footer className="bg-[#133020] text-white">
    <div className="max-w-7xl mx-auto py-12 px-4 text-center">
      <h2 className="text-2xl font-semibold">Get in Touch</h2>
      <p className="mt-2 text-white/70">Have questions about your application? Contact our HR team.</p>
      <a href="mailto:careers@lifewood.com" className="mt-4 inline-block text-lg font-semibold text-[#FFC370] hover:underline">
        careers@lifewood.com
      </a>
    </div>
  </footer>
);

const InputField = ({ label, name, error, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input id={name} name={name} {...props} value={props.value || ''} className={`block w-full rounded-md shadow-sm p-3 focus:border-[#046241] focus:ring-[#046241] ${error ? 'border-red-500 border-2' : 'border-gray-300'}`} />
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

const SelectField = ({ label, name, children, error, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select id={name} name={name} {...props} value={props.value || ''} className={`block w-full rounded-md shadow-sm p-3 focus:border-[#046241] focus:ring-[#046241] ${error ? 'border-red-500 border-2' : 'border-gray-300'}`}>
      {children}
    </select>
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

const TextareaField = ({ label, name, error, ...props }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea id={name} name={name} {...props} value={props.value || ''} rows="4" className={`block w-full rounded-md shadow-sm p-3 focus:border-[#046241] focus:ring-[#046241] ${error ? 'border-red-500 border-2' : 'border-gray-300'}`} />
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

const Step1 = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-800">Your Information</h3>
    <div className="grid md:grid-cols-2 gap-6">
      <InputField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name} type="text" />
      <InputField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name} type="text" />
      <InputField label="Email Address" name="email" value={formData.email} onChange={handleChange} error={errors.email} type="email" />
      <InputField label="Age" name="age" value={formData.age} onChange={handleChange} error={errors.age} type="number" />
    </div>
  </div>
);

const Step2 = ({ formData, handleChange, errors }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-800">Your Background</h3>
    <div className="grid md:grid-cols-2 gap-6">
      <SelectField label="Highest Degree Attained" name="degree" value={formData.degree} onChange={handleChange} error={errors.degree}>
        <option value="">Select your degree...</option>
        {degreeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </SelectField>
      {formData.degree === "Other" && <InputField label="Specify Your Degree" name="degree_other" value={formData.degree_other} onChange={handleChange} error={errors.degree_other} type="text" />}

      <SelectField label="Course/Major" name="course" value={formData.course} onChange={handleChange} error={errors.course}>
        <option value="">Select your course...</option>
        {courseOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </SelectField>
      {formData.course === "Other" && <InputField label="Specify Your Course/Major" name="course_other" value={formData.course_other} onChange={handleChange} error={errors.course_other} type="text" />}
    </div>

    <InputField label="Relevant Experience (Years)" name="experience_years" value={formData.experience_years} onChange={handleChange} error={errors.experience_years} type="number" />

    <TextareaField
      label="Describe Your Relevant Experience"
      name="experience_details"
      value={formData.experience_details}
      onChange={handleChange}
      error={errors.experience_details}
      placeholder="Describe your roles, projects, or skills that align with the position..."
    />
    <p className="text-xs text-gray-500 -mt-4">This helps us understand how your skills fit the role. Be specific but concise. Put "N/A" if you don't have relevant experience.</p>
  </div>
);

const Step3 = ({ formData, handleChange, errors, fileInputRef, projectFromURL }) => (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-gray-800">Application Details</h3>
    <SelectField label="Project Applied For" name="project" value={formData.project} onChange={handleChange} error={errors.project} disabled={!!projectFromURL}>
      <option value="">Select a project...</option>
      {projects.map(p => <option key={p} value={p}>{p}</option>)}
    </SelectField>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume</label>
      <input type="file" name="resume" ref={fileInputRef} onChange={handleChange} className="sr-only" accept=".pdf,.doc,.docx" />
      {formData.resume ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-3"><File className="text-green-600" /> <span className="font-medium text-green-800">{formData.resume.name}</span></div>
          <button type="button" onClick={() => handleChange({ target: { name: 'resume', type: 'file', files: null } })} className="p-1 text-gray-500 hover:text-red-600"><XIcon size={20} /></button>
        </div>
      ) : (
        <div onClick={() => fileInputRef.current.click()} className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${errors.resume ? 'border-red-500 hover:border-red-600' : 'border-gray-300 hover:border-[#046241]'}`}>
          <UploadCloud className={`w-12 h-12 mb-2 ${errors.resume ? 'text-red-400' : 'text-gray-400'}`} />
          <p className="font-semibold text-[#133020]">Click to upload resume</p>
          <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
        </div>
      )}
      {errors.resume && <p className="text-red-600 text-sm mt-1">{errors.resume}</p>}
    </div>
  </div>
);

const Step4 = ({ formData, handleResetForm, isSubmitted }) => (
  <div className="space-y-6">
    <div className="text-center">
      <h3 className="text-xl font-semibold text-gray-800">Review Your Application</h3>
      <p className="text-gray-600">Please confirm your details are correct before submitting.</p>
    </div>
    <div className="space-y-4 bg-gray-50 p-6 rounded-lg border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
        <div><strong className="text-gray-500 text-sm">Full Name</strong><p className="text-lg">{formData.first_name} {formData.last_name}</p></div>
        <div><strong className="text-gray-500 text-sm">Email</strong><p className="text-lg break-words">{formData.email}</p></div>
        <div><strong className="text-gray-500 text-sm">Age</strong><p className="text-lg">{formData.age}</p></div>
        <div>
          <strong className="text-gray-500 text-sm">Experience</strong>
          <p className="text-lg">
            {formData.experience_years == 0 ? 'No experience' : `${formData.experience_years} ${formData.experience_years == 1 ? 'year' : 'years'}`}
          </p>
        </div>
        <div><strong className="text-gray-500 text-sm">Highest Degree</strong><p className="text-lg">{formData.degree === "Other" ? formData.degree_other : formData.degree}</p></div>
        <div><strong className="text-gray-500 text-sm">Course/Major</strong><p className="text-lg">{formData.course === "Other" ? formData.course_other : formData.course}</p></div>
        <div className="sm:col-span-2"><strong className="text-gray-500 text-sm">Applying for Project</strong><p className="text-lg">{formData.project}</p></div>
        <div className="sm:col-span-2"><strong className="text-gray-500 text-sm">Relevant Experience</strong><p className="text-lg whitespace-pre-wrap">{formData.experience_details}</p></div>
        <div className="sm:col-span-2"><strong className="text-gray-500 text-sm">Resume</strong><p className="flex items-center gap-2 text-lg"><File size={16} />{formData.resume?.name}</p></div>
      </div>
    </div>
    {isSubmitted && (
      <div className="text-center pt-4">
        <button type="button" onClick={handleResetForm} className="flex items-center gap-2 mx-auto text-lg font-semibold text-[#046241] hover:text-[#133020]">
          <RotateCw size={18} />
          Submit another application
        </button>
      </div>
    )}
  </div>
);