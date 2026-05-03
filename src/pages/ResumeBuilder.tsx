import { useState, useEffect } from 'react'
import { Download, FileText, CheckCircle, Loader2, Sparkles, User, Mail, Phone, RefreshCw, Zap, Target } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { jsPDF } from 'jspdf'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx'
import { saveAs } from 'file-saver'
import { useAuth } from '../context/AuthContext'

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || ''

async function aiGenerate(prompt: string): Promise<string> {
  if (!GROQ_KEY) return ''
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 1024,
      }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() || ''
  } catch { return '' }
}

export default function ResumeBuilder() {
  const { userData } = useAuth()

  const [formData, setFormData] = useState({
    name: userData?.name || 'Rahul Singh',
    email: userData?.email || 'rahul.s@niet.co.in',
    phone: '+91 98765 43210',
    address: 'Greater Noida, UP',
    education: 'B.Tech CSE | NIET Greater Noida | 8.8 CGPA',
    skills: 'TensorFlow, Python, SQL, Machine Learning, Data Analytics, React, Git, Pandas',
    projects: 'Skillect AI Platform: Built a college-exclusive smart mentoring system for NIET using AI-driven skill mapping.\nStock Predictor: Developed an LSTM neural network model achieving 85% accuracy on historical data.',
    experience: 'ML Research Intern at NIET Center of Excellence (Jun-Aug 2025): Developed predictive models for student success mapping.',
    certifications: 'Google Data Analytics Professional Certificate\nDeepLearning.AI TensorFlow Developer Cert',
    targetRole: userData?.goal || 'SDE Intern',
  })

  const [aiSummary, setAiSummary] = useState('')
  const [aiSkillSuggestions, setAiSkillSuggestions] = useState('')
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')
  const [aiLoading, setAiLoading] = useState<string | null>(null)
  const [downloaded, setDownloaded] = useState(false)

  const generateSummary = async () => {
    setAiLoading('summary')
    const summary = await aiGenerate(
      `Write a 2-3 sentence professional resume summary for ${formData.name}, targeting "${formData.targetRole}" role. Skills: ${formData.skills}. Education: ${formData.education}. Make it ATS-friendly, quantified, action-oriented. Return ONLY the summary text, nothing else.`
    )
    if (summary) setAiSummary(summary)
    else setAiSummary(`Detail-oriented B.Tech CSE student at NIET with a strong foundation in ${formData.skills.split(',').slice(0, 3).join(', ')}. Proven ability to build high-impact AI solutions, including the Skillect platform.`)
    setAiLoading(null)
  }

  const enhanceProjects = async () => {
    setAiLoading('projects')
    const enhanced = await aiGenerate(
      `Rewrite these resume project descriptions to be ATS-friendly with strong action verbs and quantified impact. Keep same projects, just enhance the descriptions. Return ONLY the enhanced text:\n\n${formData.projects}`
    )
    if (enhanced) setFormData({ ...formData, projects: enhanced })
    setAiLoading(null)
  }

  const suggestSkills = async () => {
    setAiLoading('skills')
    const suggestions = await aiGenerate(
      `Given: ${formData.skills}. Target: ${formData.targetRole}. Suggest 5 additional ATS keywords. Return ONLY comma-separated list.`
    )
    if (suggestions) setAiSkillSuggestions(suggestions)
    setAiLoading(null)
  }

  useEffect(() => { generateSummary() }, [])

  const handleDownload = () => {
    const doc = new jsPDF()
    doc.setFont('helvetica', 'bold').setFontSize(20).text(formData.name, 20, 25)
    doc.setFont('helvetica', 'normal').setFontSize(10).text(`${formData.email} | ${formData.phone}`, 20, 33)
    doc.save(`${formData.name}_Resume.pdf`)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  const handleWordDownload = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: formData.name, bold: true, size: 48, font: "Arial" }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 300 },
            children: [
              new TextRun({ text: `${formData.email} | ${formData.phone} | ${formData.address}`, size: 22, font: "Arial", color: "4A5568" }),
            ],
          }),
          new Paragraph({
            text: "PROFESSIONAL SUMMARY",
            heading: HeadingLevel.HEADING_1,
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            children: [new TextRun({ text: aiSummary || "Detail-oriented professional with a strong foundation in " + formData.skills.split(',').slice(0, 3).join(', '), size: 22, font: "Arial" })],
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "TECHNICAL SKILLS",
            heading: HeadingLevel.HEADING_1,
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            children: [new TextRun({ text: formData.skills, size: 22, font: "Arial" })],
            spacing: { after: 200 }
          }),
          new Paragraph({
            text: "EXPERIENCE",
            heading: HeadingLevel.HEADING_1,
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            spacing: { before: 200, after: 100 }
          }),
          ...formData.experience.split('\n').map(p => new Paragraph({
            children: [new TextRun({ text: p, size: 22, font: "Arial" })],
            spacing: { after: 100 }
          })),
          new Paragraph({
            text: "PROJECTS",
            heading: HeadingLevel.HEADING_1,
            border: { bottom: { color: "auto", space: 1, style: BorderStyle.SINGLE, size: 6 } },
            spacing: { before: 200, after: 100 }
          }),
          ...formData.projects.split('\n').map(p => new Paragraph({
            children: [new TextRun({ text: p, size: 22, font: "Arial" })],
            bullet: { level: 0 },
            spacing: { after: 100 }
          })),
        ],
      }],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `${formData.name.replace(/\\s+/g, '_')}_Resume.docx`)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  const [selectedTheme, setSelectedTheme] = useState('classic')

  const generateRenderCVYaml = () => {
    const yaml = `cv:
  name: ${formData.name}
  location: ${formData.address}
  email: ${formData.email}
  phone: ${formData.phone}
  sections:
    summary:
      - ${aiSummary.replace(/\n/g, ' ')}
    skills:
      - ${formData.skills}
    experience:
      - company: NIET
        position: ${formData.targetRole}
        summary: ${formData.experience.replace(/\n/g, ' ')}
    projects:
${formData.projects.split('\n').map(p => `      - ${p.trim()}`).join('\n')}
design:
  theme: ${selectedTheme}
  page_size: a4
  font: latin-modern`
    
    const blob = new Blob([yaml], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.name.replace(/\s+/g, '_')}_Skillect_Elite.yaml`
    a.click()
    toast.success('Elite Configuration Exported!', {
       description: 'Processing via Skillect Signature Engine.'
    })
  }

  const RENDERCV_THEMES = [
    { id: 'classic', name: 'Elite Academic', img: '/rendercv/classic.png' },
    { id: 'engineeringresumes', name: 'Global Tech', img: '/rendercv/engineeringresumes.png' },
    { id: 'sb2nov', name: 'Corporate Pro', img: '/rendercv/sb2nov.png' },
    { id: 'moderncv', name: 'Creative Tech', img: '/rendercv/moderncv.png' },
  ]

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Top Header Banner */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="niet-card niet-header-accent p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-none shadow-none bg-[#F5F6FA]/50 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#0A1628] rounded-2xl flex items-center justify-center text-white shadow-xl">
               <FileText size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-[#0A1628] font-display uppercase tracking-tight">AI RESUME ARCHITECT</h1>
                <span className="px-2 py-0.5 bg-[#00A86B] text-white text-[8px] font-black rounded-md uppercase tracking-widest border border-[#00A86B]/20">Pro Engine Verified</span>
              </div>
              <p className="text-sm text-[#4A5568] max-w-2xl leading-relaxed">
                Generate high-impact placement resumes. Powered by <span className="text-[#E8132A] font-bold">LLaMA 3.3</span> and <span className="text-[#0A1628] font-bold">Skillect Signature Styles</span> for maximum recruitment impact.
              </p>
            </div>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl border border-[#E2E8F0] shadow-sm">
            <button onClick={() => setActiveTab('edit')}
              className={`px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'edit' ? 'bg-[#E8132A] text-white shadow-md' : 'text-[#8B9BB4] hover:text-[#0A1628]'}`}>
              EDITOR
            </button>
            <button onClick={() => setActiveTab('preview')}
              className={`px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${activeTab === 'preview' ? 'bg-[#E8132A] text-white shadow-md' : 'text-[#8B9BB4] hover:text-[#0A1628]'}`}>
              PREVIEW
            </button>
          </div>
        </div>

        <AnimatePresence>
          {downloaded && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-[#00A86B] text-white p-5 rounded-2xl mb-8 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} />
                <span className="text-sm font-bold uppercase tracking-widest">Resume Downloaded Successfully</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'edit' ? (
          <div className="grid lg:grid-cols-5 gap-10">
            {/* Editor Columns */}
            <div className="lg:col-span-3 space-y-8">
              <EditSection title="Personal Branding">
                <div className="grid sm:grid-cols-2 gap-6">
                  <InputField icon={<User size={14} />} label="Full Name" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} />
                  <InputField icon={<Mail size={14} />} label="NIET Email" value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })} />
                  <InputField icon={<Phone size={14} />} label="Contact" value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} />
                  <InputField icon={<Target size={14} />} label="Target Role" value={formData.targetRole} onChange={(v: string) => setFormData({ ...formData, targetRole: v })} />
                </div>
              </EditSection>

              <EditSection title="Technical Arsenal" action={suggestSkills} loading={aiLoading === 'skills'} btnLabel="AI Suggest">
                <textarea value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} rows={2}
                  className="w-full bg-[#F5F6FA] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm font-bold text-[#0A1628] focus:border-[#E8132A] transition-all" />
                {aiSkillSuggestions && (
                  <div className="mt-4 p-4 bg-[#FEF0F1] border border-[#FCCDD0] rounded-2xl">
                     <p className="text-[10px] font-black text-[#E8132A] uppercase tracking-widest mb-2">Recommended keywords:</p>
                     <p className="text-xs font-bold text-[#4A5568] mb-3">{aiSkillSuggestions}</p>
                     <button onClick={() => { setFormData({...formData, skills: formData.skills + ', ' + aiSkillSuggestions}); setAiSkillSuggestions('') }} 
                        className="niet-btn-primary py-2 px-4 text-[10px]">Add All</button>
                  </div>
                )}
              </EditSection>

              <EditSection title="High Impact Projects" action={enhanceProjects} loading={aiLoading === 'projects'} btnLabel="AI Refine">
                <textarea value={formData.projects} onChange={(e) => setFormData({ ...formData, projects: e.target.value })} rows={6}
                  className="w-full bg-[#F5F6FA] border border-[#E2E8F0] rounded-2xl px-5 py-4 text-sm font-bold text-[#0A1628] focus:border-[#E8132A] transition-all resize-none" />
              </EditSection>

              {/* NEW SIGNATURE STYLES SECTION */}
              <div className="niet-card p-8">
                 <div className="flex items-center justify-between mb-8">
                   <h3 className="text-lg font-bold text-[#0A1628] font-display uppercase tracking-tight">Skillect Signature Styles</h3>
                   <span className="px-2 py-0.5 bg-[#0A1628] text-white text-[8px] font-black rounded-md uppercase tracking-widest">Institutional Hub</span>
                 </div>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {RENDERCV_THEMES.map(theme => (
                      <div key={theme.id} onClick={() => setSelectedTheme(theme.id)} className="group cursor-pointer">
                        <div className={`aspect-[3/4] rounded-xl border-2 overflow-hidden transition-all relative ${selectedTheme === theme.id ? 'border-[#E8132A] ring-4 ring-[#FEF0F1]' : 'border-[#F5F6FA] group-hover:border-[#E8132A]'}`}>
                          <img src={theme.img} alt={theme.name} className="w-full h-full object-cover" />
                          <div className={`absolute inset-0 flex items-center justify-center transition-all ${selectedTheme === theme.id ? 'bg-[#E8132A]/10' : 'bg-[#0A1628]/0 group-hover:bg-[#0A1628]/40'}`}>
                             <CheckCircle size={24} className={`text-white transition-opacity ${selectedTheme === theme.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                          </div>
                        </div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-2 text-center transition-colors ${selectedTheme === theme.id ? 'text-[#E8132A]' : 'text-[#8B9BB4] group-hover:text-[#0A1628]'}`}>{theme.name}</p>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* AI Insights Sidebar */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white border border-[#E2E8F0] rounded-[2rem] p-10 text-[#0A1628] relative overflow-hidden group shadow-xl shadow-slate-900/5">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#E8132A]/5 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold tracking-tight flex items-center gap-3 font-display uppercase text-[#0A1628]">
                    <Sparkles size={20} className="text-[#E8132A]" /> Professional Hook
                  </h3>
                  <button onClick={generateSummary} className="w-9 h-9 bg-[#F5F6FA] border border-[#E2E8F0] rounded-xl flex items-center justify-center hover:bg-[#FEF0F1] hover:text-[#E8132A] transition-colors">
                    <RefreshCw size={16} className={aiLoading === 'summary' ? 'animate-spin' : ''} />
                  </button>
                </div>
                <div className="relative">
                   <p className="text-[#4A5568] text-[10px] font-black uppercase tracking-[0.2em] mb-4">Generated Summary:</p>
                   <p className="text-sm font-medium leading-relaxed italic text-[#0A1628]/90">
                    "{aiSummary || 'Click refresh to generate summary.'}"
                   </p>
                </div>
              </div>

              <div className="niet-card p-8">
                <p className="text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest mb-6 border-b border-[#F5F6FA] pb-2">Export Hub</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleDownload} className="niet-btn-outline w-full py-4 flex items-center justify-center gap-2 text-[10px]">
                      <Download size={16} /> PDF
                    </button>
                    <button onClick={handleWordDownload} className="niet-btn-outline w-full py-4 flex items-center justify-center gap-2 text-[10px]">
                      <Download size={16} /> WORD
                    </button>
                  </div>
                  <button onClick={generateRenderCVYaml} className="niet-btn-primary w-full py-5 flex flex-col items-center justify-center gap-1 shadow-xl shadow-red-500/20">
                    <div className="flex items-center gap-3 text-[12px]">
                      <Zap size={18} fill="currentColor" /> DOWNLOAD ELITE CONFIG
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-80">Processing via Signature Engine</span>
                  </button>
                  <div className="p-4 bg-[#F5F6FA] rounded-2xl border border-[#E2E8F0]">
                    <p className="text-[9px] font-black text-[#0A1628] uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Sparkles size={12} className="text-[#E8132A]" /> Smart Instruction:
                    </p>
                    <p className="text-[10px] font-medium text-[#4A5568] leading-relaxed">
                      Download the Elite Config to finalize your resume via the <span className="font-bold">NIET Placement Engine</span> for maximum visual fidelity.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Style Switcher Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="niet-card p-8 sticky top-6">
                <h3 className="text-sm font-black text-[#0A1628] uppercase tracking-widest mb-6 border-b border-[#F5F6FA] pb-2">Style Switcher</h3>
                <div className="space-y-4">
                  {RENDERCV_THEMES.map(theme => (
                    <button 
                      key={theme.id} 
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`w-full p-4 rounded-2xl border-2 transition-all text-left flex items-center justify-between group ${selectedTheme === theme.id ? 'border-[#E8132A] bg-[#FEF0F1]/50' : 'border-[#F5F6FA] hover:border-[#E8132A]'}`}
                    >
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${selectedTheme === theme.id ? 'text-[#E8132A]' : 'text-[#8B9BB4]'}`}>{theme.name}</p>
                        <p className="text-[8px] font-bold text-[#4A5568] uppercase tracking-widest mt-0.5">Professional Grade</p>
                      </div>
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${selectedTheme === theme.id ? 'bg-[#E8132A] text-white' : 'bg-white text-[#CBD5E0] border border-[#E2E8F0]'}`}>
                        <CheckCircle size={14} />
                      </div>
                    </button>
                  ))}
                </div>
                
                <div className="mt-8 space-y-4">
                  <button onClick={handleDownload} className="niet-btn-primary w-full py-4 flex items-center justify-center gap-2">
                    <Download size={16} /> DOWNLOAD PDF
                  </button>
                  <button onClick={handleWordDownload} className="niet-btn-outline w-full py-4 flex items-center justify-center gap-2">
                    <Download size={16} /> DOWNLOAD WORD
                  </button>
                  <button onClick={() => setActiveTab('edit')} className="niet-btn-outline w-full py-3 text-[10px] border-dashed">BACK TO EDITOR</button>
                </div>
              </div>
            </div>

            {/* Dynamic Preview Area */}
            <div className="lg:col-span-8">
              <motion.div 
                key={selectedTheme}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`niet-card p-12 shadow-2xl relative bg-white min-h-[900px] overflow-hidden ${selectedTheme === 'moderncv' ? 'border-l-[16px] border-[#0A1628]' : ''}`}
              >
                {selectedTheme === 'classic' && (
                  <div className="space-y-8">
                    <div className="text-center border-b-[3px] border-[#0A1628] pb-6">
                      <h2 className="text-4xl font-black text-[#0A1628] font-display mb-2">{formData.name}</h2>
                      <p className="text-xs font-black text-[#4A5568] uppercase tracking-[0.3em]">{formData.email} | {formData.phone}</p>
                      <p className="text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest mt-2">{formData.address}</p>
                    </div>
                    <PreviewSection theme="classic" title="PROFESSIONAL SUMMARY" content={aiSummary} />
                    <PreviewSection theme="classic" title="TECHNICAL ARSENAL" content={formData.skills} isTags />
                    <PreviewSection theme="classic" title="PLACEMENT TRACK" content={formData.experience} />
                    <PreviewSection theme="classic" title="CORE PROJECTS" content={formData.projects} isList />
                  </div>
                )}

                {selectedTheme === 'engineeringresumes' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-end border-b-2 border-[#E8132A] pb-4">
                      <div>
                        <h2 className="text-3xl font-black text-[#0A1628] leading-none mb-2">{formData.name}</h2>
                        <p className="text-sm font-bold text-[#E8132A] uppercase tracking-widest">{formData.targetRole}</p>
                      </div>
                      <div className="text-right text-[10px] font-bold text-[#4A5568] space-y-1">
                        <p>{formData.email}</p>
                        <p>{formData.phone}</p>
                        <p>{formData.address}</p>
                      </div>
                    </div>
                    <PreviewSection theme="engineering" title="OBJECTIVE" content={aiSummary} />
                    <PreviewSection theme="engineering" title="SKILLS" content={formData.skills} isTags />
                    <PreviewSection theme="engineering" title="WORK EXPERIENCE" content={formData.experience} />
                    <PreviewSection theme="engineering" title="PROJECTS" content={formData.projects} isList />
                  </div>
                )}

                {selectedTheme === 'sb2nov' && (
                  <div className="space-y-8">
                    <div className="text-center">
                      <h2 className="text-4xl font-bold text-[#0A1628] font-display mb-1">{formData.name}</h2>
                      <p className="text-xs font-medium text-[#4A5568] mb-6">{formData.email} · {formData.phone} · {formData.address}</p>
                    </div>
                    <div className="grid grid-cols-12 gap-8 border-t border-[#F5F6FA] pt-8">
                       <div className="col-span-4 space-y-8 border-r border-[#F5F6FA] pr-8">
                          <PreviewSection theme="sb2nov" title="SKILLS" content={formData.skills} isTags />
                          <div className="p-4 bg-[#F5F6FA] rounded-xl border border-[#E2E8F0]">
                             <p className="text-[10px] font-black text-[#0A1628] uppercase mb-2">Target Role</p>
                             <p className="text-xs font-bold text-[#E8132A]">{formData.targetRole}</p>
                          </div>
                       </div>
                       <div className="col-span-8 space-y-8">
                          <PreviewSection theme="sb2nov" title="SUMMARY" content={aiSummary} />
                          <PreviewSection theme="sb2nov" title="EXPERIENCE" content={formData.experience} />
                          <PreviewSection theme="sb2nov" title="PROJECTS" content={formData.projects} isList />
                       </div>
                    </div>
                  </div>
                )}

                {selectedTheme === 'moderncv' && (
                  <div className="flex gap-10 h-full">
                    <div className="flex-1 space-y-10">
                      <div>
                        <h2 className="text-5xl font-black text-[#0A1628] font-display tracking-tighter mb-2">{formData.name}</h2>
                        <div className="h-1.5 w-24 bg-[#E8132A] mb-4" />
                        <p className="text-sm font-bold text-[#4A5568] italic leading-relaxed">"{aiSummary}"</p>
                      </div>
                      <PreviewSection theme="modern" title="EXPERIENCE" content={formData.experience} />
                      <PreviewSection theme="modern" title="PROJECTS" content={formData.projects} isList />
                    </div>
                    <div className="w-48 space-y-8 pt-20 text-right">
                       <PreviewSection theme="modern" title="CONTACT" content={`${formData.email}\n${formData.phone}`} isList />
                       <PreviewSection theme="modern" title="TECH SKILLS" content={formData.skills} isTags />
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-10 right-10 opacity-10 flex items-center gap-2">
                   <div className="w-8 h-8 bg-[#0A1628] rounded-lg" />
                   <span className="text-[10px] font-black text-[#0A1628] uppercase tracking-[0.2em]">NIET Placement Hub</span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function EditSection({ title, children, action, loading, btnLabel }: any) {
  return (
    <div className="niet-card p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold text-[#0A1628] font-display uppercase tracking-tight">{title}</h3>
        {action && (
          <button onClick={action} disabled={loading} className="niet-btn-outline py-2 px-4 text-[10px] flex items-center gap-2">
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} className="text-[#E8132A]" />} {btnLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

function InputField({ icon, label, value, onChange }: any) {
  return (
    <div>
      <label className="flex items-center gap-2 text-[10px] font-black text-[#8B9BB4] uppercase tracking-widest mb-3 ml-1">
        {icon} {label}
      </label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#F5F6FA] border border-[#E2E8F0] rounded-2xl px-5 py-3.5 text-xs font-bold text-[#0A1628] focus:border-[#E8132A] transition-all" />
    </div>
  )
}

function PreviewSection({ title, content, isTags, isList, theme }: any) {
  const getHeaderStyles = () => {
    switch(theme) {
      case 'engineering': return 'text-[11px] font-black text-[#0A1628] border-l-4 border-[#E8132A] pl-3 mb-4'
      case 'sb2nov': return 'text-[10px] font-bold text-[#8B9BB4] uppercase tracking-widest mb-4 border-b border-[#F5F6FA] pb-1'
      case 'modern': return 'text-[11px] font-black text-[#E8132A] tracking-[0.2em] mb-4'
      default: return 'text-[11px] font-black text-[#E8132A] tracking-[0.2em] mb-4 border-b border-[#E2E8F0] pb-2'
    }
  }

  return (
    <div>
      <h4 className={getHeaderStyles()}>{title}</h4>
      {isTags ? (
        <div className={`flex flex-wrap gap-2 ${theme === 'modern' ? 'justify-end' : ''}`}>
          {content.split(',').map((s: string) => (
            <span key={s} className="text-[11px] font-bold text-[#0A1628] uppercase">{s.trim()} ·</span>
          ))}
        </div>
      ) : isList ? (
        <div className="space-y-3">
          {content.split('\n').map((p: string, i: number) => (
            <div key={i} className={`flex gap-4 ${theme === 'modern' ? 'flex-row-reverse' : ''}`}>
               <div className="text-[#E8132A] font-bold">•</div>
               <p className={`text-sm text-[#4A5568] leading-relaxed ${theme === 'modern' ? 'text-right' : ''}`}>{p.trim()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-sm text-[#4A5568] leading-relaxed italic ${theme === 'modern' ? 'text-right' : ''}`}>{content}</p>
      )}
    </div>
  )
}
