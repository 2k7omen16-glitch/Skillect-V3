import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Briefcase, Filter, ChevronRight, Sparkles, TrendingUp, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import NewsFeed from '../components/NewsFeed'

const opportunities = [
  {
    id: 1,
    company: 'XYZ TECH',
    role: 'ML INTERN',
    type: 'INTERNSHIP',
    location: 'REMOTE',
    stipend: '₹20,000/MO',
    skills: ['PYTHON', 'TENSORFLOW', 'SQL'],
    match: 85,
    posted: '2D AGO'
  },
  {
    id: 2,
    company: 'DATACORP',
    role: 'DATA SCIENCE INTERN',
    type: 'INTERNSHIP',
    location: 'NOIDA (HYBRID)',
    stipend: '₹25,000/MO',
    skills: ['PYTHON', 'PANDAS', 'MACHINE LEARNING'],
    match: 72,
    posted: '1D AGO'
  },
  {
    id: 3,
    company: 'WEBSOLUTIONS',
    role: 'FRONTEND DEVELOPER',
    type: 'JOB',
    location: 'GURGAON',
    stipend: '₹6 LPA',
    skills: ['REACT', 'JAVASCRIPT', 'TAILWIND CSS'],
    match: 45,
    posted: '5H AGO'
  },
  {
    id: 4,
    company: 'CYBERSHIELD',
    role: 'SECURITY ANALYST',
    type: 'INTERNSHIP',
    location: 'REMOTE',
    stipend: '₹15,000/MO',
    skills: ['NETWORKING', 'LINUX', 'PYTHON'],
    match: 60,
    posted: '3D AGO'
  },
  {
    id: 5,
    company: 'CLOUDNATIVE',
    role: 'DEVOPS INTERN',
    type: 'INTERNSHIP',
    location: 'NOIDA',
    stipend: '₹18,000/MO',
    skills: ['DOCKER', 'KUBERNETES', 'AWS'],
    match: 55,
    posted: '12H AGO'
  },
  {
    id: 6,
    company: 'ANALYTICSPRO',
    role: 'DATA ANALYST INTERN',
    type: 'INTERNSHIP',
    location: 'REMOTE',
    stipend: '₹22,000/MO',
    skills: ['SQL', 'EXCEL', 'PYTHON'],
    match: 78,
    posted: '4D AGO'
  },
  {
    id: 7,
    company: 'TECHNIET SOLUTIONS',
    role: 'FULL STACK DEVELOPER',
    type: 'JOB',
    location: 'GREATER NOIDA',
    stipend: '₹8 LPA',
    skills: ['NODE.JS', 'NEXT.JS', 'MONGODB'],
    match: 92,
    posted: '1H AGO'
  },
  {
    id: 8,
    company: 'INNOVATE AI',
    role: 'AI RESEARCH INTERN',
    type: 'INTERNSHIP',
    location: 'NOIDA',
    stipend: '₹30,000/MO',
    skills: ['PYTORCH', 'NLP', 'COMPUTER VISION'],
    match: 88,
    posted: '6H AGO'
  }
]

export default function Opportunities() {
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const filtered = opportunities.filter((o) => {
    const matchesFilter = filter === 'ALL' || o.location.toUpperCase().includes(filter) || (filter === 'REMOTE' && o.location === 'REMOTE')
    const matchesSearch = o.role.toUpperCase().includes(search.toUpperCase()) || o.company.toUpperCase().includes(search.toUpperCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-[1400px] mx-auto px-8 py-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl text-[#E8132A] text-[10px] font-black uppercase tracking-[0.2em] border border-red-100">
              <Sparkles size={14} /> Career Catalyst
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-[#0A1628] uppercase leading-[0.9] tracking-tighter">Discover <br/> Opportunities.</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Curated internships & roles matching your Skillect profile</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#E8132A] transition-colors" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles or companies..."
                className="bg-white border-2 border-slate-100 rounded-[1.5rem] py-4 pl-14 pr-8 text-xs font-black uppercase tracking-wider focus:outline-none focus:border-[#E8132A] w-full sm:w-[400px] transition-all shadow-sm"
              />
            </div>
            <button className="flex items-center justify-center gap-3 bg-[#0A1628] text-white rounded-[1.5rem] px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-[#E8132A] transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none">
              <Filter size={16} /> Advanced Filters
            </button>
          </div>
        </div>

        {/* QUICK FILTERS */}
        <div className="flex gap-3 mb-16 overflow-x-auto pb-4 scrollbar-hide">
          {['ALL', 'REMOTE', 'NOIDA', 'GURGAON', 'BANGALORE', 'HYDERABAD'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                filter === f
                  ? 'bg-[#E8132A] text-white border-[#0A1628] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* OPPORTUNITY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((opp, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={opp.id}
              className="bg-white rounded-[2rem] border-2 border-slate-100 p-7 flex flex-col hover:border-[#0A1628] transition-all group relative shadow-sm hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-black text-[#0A1628] text-lg tracking-tighter leading-tight group-hover:text-[#E8132A] transition-colors line-clamp-1">{opp.role}</h3>
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">{opp.company}</p>
                </div>
                <div className="bg-slate-50 text-slate-500 px-2.5 py-1 rounded-lg text-[8px] font-black border-2 border-slate-100 uppercase tracking-widest">
                  {opp.type}
                </div>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                <div className="flex items-center gap-3 text-slate-600 font-black text-[10px] uppercase tracking-wide">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center border-2 border-slate-100"><MapPin size={14} className="text-[#0A1628]" /></div>
                  {opp.location}
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-black text-[10px] uppercase tracking-wide">
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center border-2 border-red-100"><DollarSign size={14} className="text-[#E8132A]" /></div>
                  {opp.stipend}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <span className="w-4 h-[2px] bg-slate-100" /> Essential Arsenal
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {opp.skills.map((skill) => (
                    <span key={skill} className="bg-slate-50 px-3 py-1 rounded-lg text-[9px] font-black text-slate-500 border-2 border-slate-100 uppercase tracking-wider">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-5 border-t-2 border-slate-50 space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Profile Match</span>
                  <span className="text-sm font-black text-[#E8132A]">{opp.match}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-100">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${opp.match}%` }} 
                    transition={{ duration: 1, delay: 0.2 }}
                    className="h-full bg-[#E8132A] rounded-full" 
                  />
                </div>
                <Link
                  to={`/student/assessment/${opp.id}`}
                  state={{ role: opp.role }}
                  className="w-full bg-white hover:bg-[#0A1628] text-[#0A1628] hover:text-white py-3 rounded-xl flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] border-2 border-[#0A1628] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Analyze Eligibility <ChevronRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-slate-100 mt-12">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-slate-100">
              <Briefcase size={40} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-[#0A1628] uppercase tracking-tighter mb-2">No opportunities found</h3>
            <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Try adjusting your filters for a wider search</p>
          </div>
        )}

        {/* DOMAIN PULSE SECTION */}
        <div className="mt-32">
           <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 bg-[#0A1628] rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl rotate-3 border-2 border-[#E8132A]">
                <TrendingUp size={32} className="text-[#E8132A]" />
              </div>
              <div>
                <h2 className="text-4xl font-black text-[#0A1628] uppercase tracking-tighter">Domain Pulse</h2>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Global Tech Trends & Internship Alerts</p>
              </div>
           </div>
           <NewsFeed />
        </div>
      </div>
    </div>
  )
}
