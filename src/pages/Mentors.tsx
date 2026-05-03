import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Search, Building, Filter, SortAsc, Star, ExternalLink, ChevronDown, Users, Clock, MapPin, Zap } from 'lucide-react'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import facultyData from '../data/faculty.json'

const GOAL_KEYWORD_MAP: Record<string, string[]> = {
  'SDE Intern': ['Computer Science', 'Software', 'JAVA', 'Web', 'IoT', 'Data Science', 'CSE', 'CSBS', 'Information Technology', 'Software Engineering'],
  'ML Engineer': ['Machine Learning', 'AI', 'Artificial Intelligence', 'Data Science', 'Deep Learning', 'CSE', 'AIML'],
  'Data Analyst': ['Data', 'Analytics', 'Statistics', 'Python', 'SQL', 'Data Science', 'CSE'],
  'Internship': ['Computer Science', 'Software', 'Web', 'CSE', 'Information Technology', 'CSBS', 'Data Science'],
  'Cyber Security': ['Cyber', 'Security', 'Ethical Hacking', 'Network', 'Information Security'],
  'Web Developer': ['Web', 'JAVA', 'Full Stack', 'React', 'JavaScript', 'CSE', 'Information Technology'],
  'default': ['Computer Science', 'CSE', 'Information Technology', 'AI', 'Data']
}

type SortOption = 'relevance' | 'experience' | 'name'

export default function Mentors() {
  const navigate = useNavigate()
  const location = useLocation()
  const { userData } = useAuth()
  const [searchTerm, setSearchTerm] = useState((location.state as any)?.searchTerm || '')
  const [deptFilter, setDeptFilter] = useState('All')
  const [sortBy, setSortBy] = useState<SortOption>('relevance')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'matched' | 'all'>('matched')

  const userGoal = userData?.goal || 'SDE Intern'
  const keywords = GOAL_KEYWORD_MAP[userGoal] || GOAL_KEYWORD_MAP['default']

  const departments = useMemo(() => {
    return ['All', ...Array.from(new Set((facultyData as any[]).map((f: any) => f.department).filter(Boolean)))].sort()
  }, [])

  const scoredFaculty = useMemo(() => {
    return (facultyData as any[]).map((f: any) => {
      let relevance = 0
      const deptLower = (f.department || '').toLowerCase()
      const bioLower = (f.biography || '').toLowerCase()
      const researchLower = (f.research_areas || []).join(' ').toLowerCase()
      const desigLower = (f.designation || '').toLowerCase()

      keywords.forEach(kw => {
        const kwl = kw.toLowerCase()
        if (deptLower.includes(kwl)) relevance += 3
        if (researchLower.includes(kwl)) relevance += 4
        if (bioLower.includes(kwl)) relevance += 1
      })

      if (desigLower.includes('head')) relevance += 2
      if (desigLower.includes('professor')) relevance += 1

      // Mock Cabin Data for NIET (PRD requirement)
      const buildings = ['Building 2', 'Building 3', 'Building 5']
      const building = buildings[Math.floor(Math.random() * buildings.length)]
      const cabin = Math.floor(Math.random() * 400) + 100
      
      return { 
        ...f, 
        relevance, 
        location: `${building}, Cabin ${cabin}`,
        availability: ['Mon, Wed', 'Tue, Thu', 'Mon, Wed, Fri'][Math.floor(Math.random() * 3)]
      }
    })
  }, [keywords])

  const filtered = useMemo(() => {
    let list = scoredFaculty.filter((f: any) => {
      const safeName = (f.name || '').toLowerCase()
      const safeDept = (f.department || '').toLowerCase()
      const safeResearch = (f.research_areas || []).join(' ').toLowerCase()
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = safeName.includes(searchLower) || safeDept.includes(searchLower) || safeResearch.includes(searchLower)
      const matchesDept = deptFilter === 'All' || f.department === deptFilter
      return matchesSearch && matchesDept
    })

    if (viewMode === 'matched') {
      list = list.filter((f: any) => f.relevance >= 3)
    }

    if (sortBy === 'relevance') list.sort((a: any, b: any) => b.relevance - a.relevance)
    else if (sortBy === 'experience') list.sort((a: any, b: any) => (b.experience_years || 0) - (a.experience_years || 0))
    else if (sortBy === 'name') list.sort((a: any, b: any) => (a.name || '').localeCompare(b.name || ''))

    return list
  }, [scoredFaculty, searchTerm, deptFilter, sortBy, viewMode])

  const getPhoto = (mentor: any) => {
    if (mentor.photo_url) return mentor.photo_url
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=FEF0F1&color=E8132A&bold=true`
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar - Pure White */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] px-8 py-5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/student/dashboard')} className="w-10 h-10 flex items-center justify-center bg-[#F5F6FA] rounded-xl text-[#8B9BB4] hover:text-[#E8132A] hover:bg-[#FEF0F1] transition-all active:scale-95 border border-[#E2E8F0]">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-[#FEF0F1] border border-[#FCCDD0] rounded-2xl flex items-center justify-center">
              <Users size={22} className="text-[#E8132A]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#0A1628] font-display leading-tight">Mentor Connect</h1>
              <p className="text-[10px] text-[#4A5568] font-bold uppercase tracking-[0.15em] mt-0.5">
                 NIET FACULTY & ALUMNI HUB • {scoredFaculty.length} EXPERTS
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Match Context Banner */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#FEF0F1] border border-[#FCCDD0] border-l-4 border-l-[#E8132A] p-6 mb-10 rounded-r-2xl flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#E8132A] shadow-sm border border-[#FCCDD0]">
            <Star size={24} fill="currentColor" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#0A1628]">Showing mentors matched for: <span className="text-[#E8132A]">{userGoal}</span></p>
            <p className="text-[11px] text-[#4A5568] font-bold uppercase tracking-wider mt-1 italic">Based on your skill gaps (Statistics, TensorFlow, SQL) and NIET academic profile.</p>
          </div>
        </motion.div>

        {/* Filter Bar - Premium Dashboard Style */}
        <div className="flex flex-col lg:flex-row gap-5 mb-12 items-center justify-between">
          <div className="flex bg-[#F5F6FA] rounded-2xl p-1.5 border border-[#E2E8F0] shadow-sm">
            <button onClick={() => setViewMode('matched')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'matched' ? 'bg-white text-[#E8132A] shadow-md' : 'text-[#8B9BB4] hover:text-[#0A1628]'}`}>
              <div className="flex items-center gap-2">
                <Star size={12} className={viewMode === 'matched' ? 'fill-[#E8132A]' : ''} />
                Matched for You
              </div>
            </button>
            <button onClick={() => setViewMode('all')}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'all' ? 'bg-white text-[#E8132A] shadow-md' : 'text-[#8B9BB4] hover:text-[#0A1628]'}`}>
              All Mentors
            </button>
          </div>

          <div className="flex flex-1 items-center gap-4 w-full">
            <div className="relative flex-1 group">
              <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#CBD5E0] group-focus-within:text-[#E8132A] transition-colors" />
              <input type="text" placeholder="Search by name, department, or skill..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-[#E2E8F0] rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-[#0A1628] focus:outline-none focus:border-[#E8132A] focus:ring-4 focus:ring-[#E8132A]/5 transition-all shadow-sm placeholder:text-[#CBD5E0]" />
            </div>

            <div className="relative">
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-3 bg-white border border-[#E2E8F0] px-6 py-4 rounded-2xl text-[10px] font-black text-[#0A1628] hover:border-[#E8132A] transition-all hover:shadow-lg uppercase tracking-widest ${showFilters ? 'border-[#E8132A] bg-[#FEF0F1]' : ''}`}>
                <Filter size={16} className={showFilters ? 'text-[#E8132A]' : 'text-[#8B9BB4]'} />
                Filter
                <ChevronDown size={14} className={`text-[#8B9BB4] transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <button 
              onClick={() => setSortBy(sortBy === 'relevance' ? 'experience' : sortBy === 'experience' ? 'name' : 'relevance')}
              className="flex items-center gap-3 bg-white border border-[#E8132A] px-6 py-4 rounded-2xl text-[10px] font-black text-[#0A1628] shadow-lg shadow-red-500/5 transition-all uppercase tracking-widest min-w-[180px] hover:scale-[1.02] active:scale-95 group"
            >
              <Zap size={16} className="text-[#E8132A] group-hover:animate-pulse" />
              {sortBy === 'relevance' ? 'Most Relevant' : sortBy === 'experience' ? 'Most Experienced' : 'Name (A-Z)'}
              <SortAsc size={16} className="text-[#8B9BB4] ml-auto" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-10">
              <div className="niet-card p-8">
                <div className="flex flex-wrap gap-2">
                  {departments.map((d) => (
                    <button key={String(d)} onClick={() => setDeptFilter(String(d))}
                      className={`px-4 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                        deptFilter === d ? 'bg-[#E8132A] text-white border-[#E8132A]' : 'bg-[#F5F6FA] text-[#8B9BB4] border-[#E2E8F0] hover:border-[#E8132A]'
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mentor Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.slice(0, 48).map((mentor, idx) => (
            <motion.div key={mentor.faculty_id || idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (idx % 4) * 0.1 }}
              className="niet-card group flex flex-col hover:border-[#E8132A] relative"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-5">
                  <div className="w-24 h-24 rounded-full p-1 border-2 border-dashed border-[#E2E8F0] group-hover:border-[#E8132A] group-hover:border-solid transition-all duration-500">
                    <img src={getPhoto(mentor)} alt={mentor.name} className="w-full h-full rounded-full bg-[#F5F6FA] object-cover" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#E8132A] border-2 border-white rounded-full flex items-center justify-center text-white">
                    <Star size={10} fill="currentColor" />
                  </div>
                </div>
                <h3 className="font-bold text-[#0A1628] text-base group-hover:text-[#E8132A] transition-colors line-clamp-1 font-display">{mentor.name}</h3>
                <p className="text-[10px] text-[#4A5568] font-black uppercase tracking-[0.15em] mt-1">{mentor.designation}</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-start gap-3 text-[11px] text-[#4A5568] font-bold">
                  <Building size={14} className="text-[#E8132A] flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{mentor.department}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[#4A5568] font-bold">
                  <Clock size={14} className="text-[#00A86B] flex-shrink-0" />
                  <span>{mentor.experience_years} Years Exp.</span>
                </div>
                <div className="p-3 bg-[#F5F6FA] rounded-xl border border-[#E2E8F0] group-hover:border-[#E8132A]/20 transition-all">
                  <div className="flex items-center gap-2 text-[10px] text-[#4A5568] font-bold">
                    <MapPin size={12} className="text-[#E8132A]" /> {mentor.location}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => navigate('/student/mentor-match', { state: { mentor } })} className="niet-btn-primary flex-1 py-3 text-[11px] shadow-lg shadow-red-500/10">Connect →</button>
                <button className="w-11 h-11 flex items-center justify-center bg-[#F5F6FA] rounded-xl text-[#8B9BB4] hover:text-[#E8132A] border border-[#E2E8F0] transition-all"><ExternalLink size={16} /></button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
