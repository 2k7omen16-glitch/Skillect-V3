import { useState } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts'
import { 
  Filter, Download, Share2, Maximize2, 
  ChevronDown, LayoutGrid, Database, TrendingUp,
  Users, Award, BookOpen
} from 'lucide-react'

const performanceData = [
  { branch: 'CSE', score: 84, growth: 12 },
  { branch: 'IT', score: 78, growth: 8 },
  { branch: 'ECE', score: 72, growth: -2 },
  { branch: 'ME', score: 65, growth: 5 },
  { branch: 'EN', score: 68, growth: 3 },
]

const statusData = [
  { name: 'Placement Ready', value: 45, color: '#00A86B' },
  { name: 'Developing', value: 35, color: '#F5A623' },
  { name: 'Foundational', value: 20, color: '#E8132A' },
]

const weeklyTrend = [
  { week: 'W1', users: 120 },
  { week: 'W2', users: 250 },
  { week: 'W3', users: 480 },
  { week: 'W4', users: 890 },
]

export default function Analytics() {
  const [selectedYear, setSelectedYear] = useState('2026')
  
  return (
    <div className="min-h-screen bg-[#F3F5F7] p-6 -m-6">
      {/* Power BI Top Ribbon */}
      <div className="bg-white border-b border-gray-200 mb-6 -mt-6 -mx-6 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-[#F2C811] p-2 rounded-lg">
            <LayoutGrid size={20} className="text-[#0A1628]" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#0A1628]">Skillect Intelligence Report</h1>
            <p className="text-[10px] text-gray-500 font-medium">Published: {new Date().toLocaleDateString()} · NIET Institutional Data</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded border border-gray-200 text-[11px] font-bold text-[#4A5568]">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded border border-gray-200 text-[11px] font-bold text-[#4A5568]">
            <Share2 size={14} /> Share
          </button>
          <button className="bg-[#0A1628] text-white px-4 py-1.5 rounded text-[11px] font-bold flex items-center gap-2 shadow-sm">
            <Maximize2 size={14} /> Full Screen
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Power BI Filter Sidebar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Filter size={14} /> Filters
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-bold text-gray-600 mb-2 block">Academic Year</label>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs font-bold text-[#0A1628] outline-none focus:border-[#F2C811]"
                >
                  <option>2026</option>
                  <option>2025</option>
                  <option>2024</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-600 mb-2 block">Department</label>
                <div className="space-y-2">
                  {['CSE', 'IT', 'ECE', 'ME'].map(b => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-[#F2C811] focus:ring-[#F2C811]" />
                      <span className="text-[11px] font-medium text-gray-600 group-hover:text-[#0A1628]">{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button className="w-full py-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 rounded transition-all">
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Canvas */}
        <div className="lg:col-span-10 space-y-6">
          {/* KPI Tiles */}
          <div className="grid sm:grid-cols-4 gap-4">
            <KpiTile icon={<Users className="text-blue-500" />} label="Total Active Students" value="4,820" trend="+12.5%" />
            <KpiTile icon={<Award className="text-emerald-500" />} label="Placement Ready" value="1,240" trend="+4.2%" />
            <KpiTile icon={<TrendingUp className="text-[#E8132A]" />} label="Avg. Gap Score" value="64.8" trend="+2.1%" />
            <KpiTile icon={<BookOpen className="text-purple-500" />} label="Resources Mastered" value="18,400" trend="+22%" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Branch Performance Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-bold text-[#0A1628]">Branch Performance Index</h3>
                  <p className="text-[10px] text-gray-400 font-medium italic">Average gap score across departments</p>
                </div>
                <Database size={16} className="text-gray-300" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#8B9BB4' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#8B9BB4' }} />
                    <Tooltip cursor={{ fill: '#F8F9FB' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="score" fill="#F2C811" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Placement Readiness Pie */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-bold text-[#0A1628]">Readiness Distribution</h3>
                  <p className="text-[10px] text-gray-400 font-medium italic">Current batch placement eligibility</p>
                </div>
                <TrendingUp size={16} className="text-gray-300" />
              </div>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-[#0A1628]">2026</span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Batch</span>
                </div>
              </div>
            </div>

            {/* User Growth Line */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-bold text-[#0A1628]">Platform Engagement Trend</h3>
                  <p className="text-[10px] text-gray-400 font-medium italic">Active users per week (Monthly View)</p>
                </div>
                <ChevronDown size={16} className="text-gray-300" />
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#8B9BB4' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#8B9BB4' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="users" stroke="#00C2FF" strokeWidth={3} dot={{ r: 6, fill: '#00C2FF' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiTile({ icon, label, value, trend }: any) {
  return (
    <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:border-[#F2C811] transition-all group">
      <div className="flex justify-between items-start mb-3">
        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-[#FFF9E6] transition-colors">
          {icon}
        </div>
        <span className="text-[10px] font-black text-emerald-500">{trend}</span>
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-xl font-black text-[#0A1628]">{value}</h3>
    </div>
  )
}
