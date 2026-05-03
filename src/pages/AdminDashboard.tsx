import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';
import { Loader2, LayoutDashboard, Megaphone, CheckSquare, Upload, FileText, CheckCircle, Search, Users as UsersIcon, BookOpen, GraduationCap, Building2, TrendingUp, Mail, Briefcase, Award, LogOut, ChevronLeft, Menu, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import facultyData from '../data/faculty.json';

// --- FAKE DATA CONSTANTS FOR PRESENTATION MODE ---
const FAKE_ANNOUNCEMENTS = [
  { id: 'fake-1', title: 'Google Campus Drive 2026', content: 'The preliminary assessment test for Google campus placements will be held on May 15th. All eligible students must complete their profiles by May 10th.', audience: 'all', created_at: new Date().toISOString() },
  { id: 'fake-2', title: 'Faculty Grading Portal Update', content: 'Please ensure all mid-term assessments are graded by this Friday. The portal will undergo maintenance over the weekend.', audience: 'faculty', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'fake-3', title: 'Mandatory Resume Building Workshop', content: 'A mandatory resume building workshop is scheduled for 3rd-year students in the main auditorium. Attendance is compulsory.', audience: 'all', created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: 'fake-4', title: 'Microsoft AI Odyssey', content: 'Microsoft is hosting an exclusive AI workshop for NIET students. Register now to get hands-on experience with Azure AI services.', audience: 'all', created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 'fake-5', title: 'Faculty Research Grants 2026', content: 'Applications for the annual research grants are now open for all departments. Submit your proposals by the end of this month.', audience: 'faculty', created_at: new Date(Date.now() - 345600000).toISOString() },
  { id: 'fake-6', title: 'TCS Ninja Hiring Alert', content: 'TCS has announced the dates for the Ninja hiring drive. Batch of 2026 is eligible to apply. Check the portal for details.', audience: 'all', created_at: new Date(Date.now() - 432000000).toISOString() }
];

const FAKE_ALUMNI = [
  { id: 'alumni-1', name: 'Rahul Sharma', email: 'rahul.sharma19@niet.co.in', branch: 'Computer Science', year: '2023', role: 'alumni', is_verified: false },
  { id: 'alumni-2', name: 'Priya Patel', email: 'priya.patel20@niet.co.in', branch: 'Information Technology', year: '2024', role: 'alumni', is_verified: false },
  { id: 'alumni-3', name: 'Ankit Kumar', email: 'ankit.kumar18@niet.co.in', branch: 'Electronics', year: '2022', role: 'alumni', is_verified: false },
  { id: 'alumni-4', name: 'Sneha Gupta', email: 'sneha.gupta21@niet.co.in', branch: 'Mechanical', year: '2021', role: 'alumni', is_verified: false },
  { id: 'alumni-5', name: 'Vikram Singh', email: 'vikram.s@niet.co.in', branch: 'Civil', year: '2020', role: 'alumni', is_verified: false }
];

// --- SUB-COMPONENTS ---

const OverviewTab = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => {
  const [stats, setStats] = useState({ totalStudents: 0, placementReady: 0, totalFaculty: 0, totalAlumni: 0, menteesPerFaculty: 0 });
  const [facultyMentorships, setFacultyMentorships] = useState<{name: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [usersRes, mentorRes] = await Promise.all([
        supabase.from('users').select('id, auth_id, name, role, readiness_score'),
        supabase.from('mentorships').select('*')
      ]);

      if (usersRes.error) {
        console.error("Error fetching stats:", usersRes.error);
      }
      let finalData = usersRes.data || [];
      const students = finalData.filter(u => u.role === 'student');
      const faculties = finalData.filter(u => u.role === 'professor');
      
      let totalStudents = students.length;
      let placementReady = students.filter(u => (u.readiness_score || 0) >= 80).length;
      let totalFaculty = faculties.length;
      let totalAlumni = finalData.filter(u => u.role === 'alumni').length;

      // Calculate mentees per faculty
      let facultyCounts = faculties.map(f => {
        const menteeCount = mentorRes.data ? mentorRes.data.filter(m => m.faculty_id === (f.auth_id || f.id)).length : 0;
        return { name: f.name || 'Unknown Faculty', count: menteeCount };
      }).sort((a, b) => b.count - a.count);

      // ALWAYS SHOW RICH DATA FOR PRESENTATION if real data is insufficient
      if (totalStudents < 5 || totalFaculty < 2) {
        totalStudents = 842;
        placementReady = 312;
        totalFaculty = 24;
        totalAlumni = 156;
        
        // Comprehensive Faculty Mentorship Data
        facultyCounts = [
          { name: 'Dr. Rajesh Sharma', count: 18 },
          { name: 'Dr. Amit Kalra', count: 15 },
          { name: 'Prof. Sunita Williams', count: 12 },
          { name: 'Dr. Neeraj Kumar', count: 11 },
          { name: 'Prof. Megha Gupta', count: 9 },
          { name: 'Dr. Vivek Singh', count: 8 },
          { name: 'Prof. Anjali Roy', count: 7 },
          { name: 'Dr. Pankaj Mishra', count: 6 }
        ];
      }

      setFacultyMentorships(facultyCounts);
      setStats({
        totalStudents,
        placementReady,
        totalFaculty,
        totalAlumni,
        menteesPerFaculty: totalFaculty > 0 ? Math.round(totalStudents / totalFaculty) : 35
      });
      
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          onClick={() => setActiveTab('students')}
          className="bg-card rounded-3xl p-6 border border-border shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2"><GraduationCap size={16}/> Total Students</div>
          <div className="text-5xl font-black text-foreground relative">{stats.totalStudents}</div>
          <div className="mt-4 flex items-center gap-3 text-sm bg-muted p-3 rounded-xl relative">
            <span className="text-emerald-500 font-black px-3 py-1 bg-emerald-100/50 rounded-lg">{stats.placementReady}</span> 
            <span className="text-muted-foreground font-bold text-[10px] uppercase tracking-widest">Ready for Placement</span>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          onClick={() => setActiveTab('supervision')}
          className="bg-[#1e293b] rounded-3xl p-6 border border-slate-700 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><UsersIcon size={16}/> Faculty & Mentors</div>
          <div className="text-5xl font-black text-white relative">{stats.totalFaculty}</div>
          <div className="mt-4 text-sm text-slate-300 bg-white/5 p-3 rounded-xl font-bold relative border border-white/5">
            Avg <span className="font-black text-white text-base">{stats.menteesPerFaculty}</span> mentees per faculty
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          onClick={() => setActiveTab('approvals')}
          className="bg-card rounded-3xl p-6 border border-border shadow-sm hover:shadow-xl hover:shadow-gray-200/50 hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2"><Briefcase size={16}/> Registered Alumni</div>
          <div className="text-5xl font-black text-foreground relative">{stats.totalAlumni}</div>
          <div className="mt-4 text-sm text-muted-foreground bg-muted p-3 rounded-xl font-bold flex items-center gap-2 relative">
            <Building2 size={16} className="text-gray-400" /> Active globally
          </div>
        </motion.div>
      </div>

      <div className="mt-8 bg-card rounded-3xl p-6 border border-border shadow-sm">
        <h3 className="text-lg font-black text-foreground mb-4">Faculty Mentorship Distribution</h3>
        {facultyMentorships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facultyMentorships.map((f, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-muted rounded-2xl border border-gray-100">
                <span className="font-bold text-sm text-foreground truncate mr-2">{f.name}</span>
                <span className="bg-white text-primary text-xs font-black px-3 py-1 rounded-lg shadow-sm border border-gray-200">
                  {f.count} Students
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm py-4">No mentorship data available.</div>
        )}
      </div>
    </div>
  );
};

const AnnouncementsTab = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [audience, setAudience] = useState('all');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      setAnnouncements(data);
    } else {
      setAnnouncements(FAKE_ANNOUNCEMENTS); // Presentation Mode fallback
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      let attachmentUrl = null;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        const { error: uploadError } = await supabase.storage.from('announcements').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('announcements').getPublicUrl(filePath);
        attachmentUrl = data.publicUrl;
      }
      const { error } = await supabase.from('announcements').insert({ title, content, audience, attachment_url: attachmentUrl, created_by: user?.id });
      if (error) throw error;
      setSuccess(true);
      setTitle(''); setContent(''); setFile(null);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      alert("Failed to send announcement. Storage bucket missing?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <h2 className="text-2xl font-black text-foreground tracking-tight">Broadcast Announcements</h2>
      
      <form onSubmit={handleSend} className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm space-y-5">
        {success && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl font-bold text-sm border border-emerald-100">Announcement broadcasted successfully!</div>}
        
        <div>
          <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">Title</label>
          <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-muted border border-transparent focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary font-bold text-foreground transition-all" placeholder="e.g. Upcoming Hackathon" />
        </div>
        
        <div>
          <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">Message</label>
          <textarea required value={content} onChange={e => setContent(e.target.value)} rows={4} className="w-full px-5 py-4 rounded-2xl bg-muted border border-transparent focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary font-medium text-muted-foreground transition-all" placeholder="Write your message here..."></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">Audience</label>
            <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full px-5 py-4 rounded-2xl bg-muted border border-transparent focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary font-bold text-foreground transition-all appearance-none cursor-pointer">
              <option value="all">Everyone (Students + Faculty)</option>
              <option value="faculty">Faculty & Mentors Only</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">Attachment (Optional)</label>
            <div className="relative">
              <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" accept=".pdf,.doc,.docx,.xls,.xlsx" />
              <label htmlFor="file-upload" className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl border-2 border-dashed border-border bg-muted cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all text-sm font-bold text-muted-foreground">
                <Upload size={18} className="text-muted-foreground" />
                <span className="truncate">{file ? file.name : 'Upload PDF or Excel'}</span>
              </label>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-gray-200 hover:-translate-y-1 transition-all disabled:opacity-50">
            {loading ? 'BROADCASTING...' : 'BROADCAST ANNOUNCEMENT'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-sm font-black text-foreground tracking-tight pl-1 border-b border-border pb-2">General Announcements (All)</h3>
          {announcements.filter(a => a.audience === 'all').length === 0 && <p className="text-muted-foreground text-sm italic pl-1">No general announcements.</p>}
          {announcements.filter(a => a.audience === 'all').map(a => (
            <div key={a.id} className="bg-card rounded-3xl p-5 border border-border shadow-sm flex flex-col sm:flex-row items-start gap-5 hover:border-border transition-colors">
              <div className="p-4 rounded-2xl shrink-0 bg-blue-50 text-blue-600">
                <Megaphone size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h4 className="font-black text-lg text-foreground truncate">{a.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-3">{a.content}</p>
                {a.attachment_url && (
                  <a href={a.attachment_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-black bg-red-50 text-primary px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">
                    <FileText size={14} /> Download Attachment
                  </a>
                )}
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-2 shrink-0">
                {new Date(a.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-black text-foreground tracking-tight pl-1 border-b border-border pb-2">Faculty-Only Notices</h3>
          {announcements.filter(a => a.audience === 'faculty').length === 0 && <p className="text-muted-foreground text-sm italic pl-1">No faculty-only notices.</p>}
          {announcements.filter(a => a.audience === 'faculty').map(a => (
            <div key={a.id} className="bg-card rounded-3xl p-5 border border-border shadow-sm flex flex-col sm:flex-row items-start gap-5 hover:border-border transition-colors">
              <div className="p-4 rounded-2xl shrink-0 bg-purple-50 text-purple-600">
                <Megaphone size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h4 className="font-black text-lg text-foreground truncate">{a.title}</h4>
                  <span className="text-[9px] font-black px-3 py-1 rounded-full bg-purple-100 text-purple-700 uppercase tracking-widest">
                    Faculty Only
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-3">{a.content}</p>
                {a.attachment_url && (
                  <a href={a.attachment_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-black bg-red-50 text-primary px-4 py-2 rounded-xl hover:bg-red-100 transition-colors">
                    <FileText size={14} /> Download Attachment
                  </a>
                )}
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest pt-2 shrink-0">
                {new Date(a.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ApprovalsTab = () => {
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    const { data } = await supabase.from('users').select('*').eq('role', 'alumni').eq('is_verified', false);
    if (data && data.length > 0) {
      setAlumni(data);
    } else {
      setAlumni(FAKE_ALUMNI); // Presentation Mode fallback
    }
    setLoading(false);
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    // If it's a fake alumni (presentation mode), just filter it out locally
    if (id.startsWith('alumni-')) {
      setAlumni(alumni.filter(a => a.id !== id));
      return;
    }
    if (action === 'approve') {
      await supabase.from('users').update({ is_verified: true }).eq('id', id);
    } else {
      await supabase.from('users').delete().eq('id', id);
    }
    fetchAlumni();
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-black text-foreground tracking-tight">Pending Alumni Approvals</h2>
      
      {alumni.length === 0 ? (
        <div className="bg-card rounded-3xl p-16 text-center border border-border shadow-sm">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-xl font-black text-foreground mb-2">All Caught Up!</h3>
          <p className="text-muted-foreground font-medium text-sm">There are no pending alumni registrations to review right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alumni.map(user => (
            <div key={user.id} className="bg-card p-6 rounded-3xl border border-border shadow-sm hover:border-border transition-colors">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-black text-muted-foreground shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-foreground text-lg">{user.name}</h4>
                  <p className="text-xs font-bold text-muted-foreground">{user.email}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user.branch && <span className="bg-gray-100 text-muted-foreground text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">{user.branch}</span>}
                    {user.year && <span className="bg-gray-100 text-muted-foreground text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">Class of {user.year}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => handleAction(user.id, 'reject')} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  Reject
                </button>
                <button onClick={() => handleAction(user.id, 'approve')} className="flex-[2] flex justify-center items-center gap-2 py-3 bg-primary text-white hover:bg-primary/90 rounded-xl text-xs font-black uppercase tracking-widest transition-transform hover:-translate-y-0.5 shadow-md shadow-gray-200">
                  <CheckCircle size={14} /> Approve Alumni
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SupervisionTab = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [usersRes, mentorRes] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('mentorships').select('*')
    ]);
    
    if (usersRes.data) {
      let dbFaculty = usersRes.data.filter(u => u.role === 'professor');
      if (dbFaculty.length < 10) {
        const fakeFaculty = facultyData.map((f: any) => ({
          id: f.faculty_id || Math.random().toString(),
          auth_id: f.faculty_id || Math.random().toString(),
          name: f.name,
          email: f.email || `${f.faculty_id}@niet.co.in`,
          role: 'professor',
          branch: f.department
        }));
        setFaculty([...dbFaculty, ...fakeFaculty]);
      } else {
        setFaculty(dbFaculty);
      }
      setStudents(usersRes.data.filter(u => u.role === 'student'));
    }
    if (mentorRes.data) {
      setMentorships(mentorRes.data);
    }
    setLoading(false);
  };

  const handleAssign = async () => {
    if (!selectedFacultyId || !selectedStudentId) return;
    const existing = mentorships.find(m => m.student_id === selectedStudentId);
    if (existing) await supabase.from('mentorships').delete().eq('id', existing.id);
    await supabase.from('mentorships').insert({ student_id: selectedStudentId, faculty_id: selectedFacultyId });
    setSelectedStudentId('');
    fetchData();
  };

  const handleRemove = async (mentorshipId: string) => {
    await supabase.from('mentorships').delete().eq('id', mentorshipId);
    fetchData();
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  const filteredFaculty = faculty.filter(f => f.name?.toLowerCase().includes(searchQuery.toLowerCase()) || f.email?.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedFaculty = faculty.find(f => f.auth_id === selectedFacultyId || f.id === selectedFacultyId);
  const availableStudents = students;
  const assignedStudents = mentorships
    .filter(m => m.faculty_id === selectedFaculty?.auth_id)
    .map(m => ({ ...m, student: students.find(s => s.auth_id === m.student_id) }))
    .filter(m => m.student);

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <h2 className="text-2xl font-black text-foreground tracking-tight">Faculty & Mentorship Directory</h2>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left pane: Search & List Faculty */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search faculty name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/20 font-medium text-sm"
            />
          </div>
          
          <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-border bg-muted/50">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Faculty Roster ({filteredFaculty.length})</h3>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
              {filteredFaculty.map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFacultyId(f.auth_id || f.id)}
                  className={`w-full text-left p-5 transition-all ${selectedFacultyId === (f.auth_id || f.id) ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-muted border-l-4 border-transparent'}`}
                >
                  <div className={`font-black ${selectedFacultyId === (f.auth_id || f.id) ? 'text-primary' : 'text-foreground'}`}>{f.name || 'Unnamed Faculty'}</div>
                  <div className="text-xs text-muted-foreground font-medium mt-1 truncate">{f.email}</div>
                </button>
              ))}
              {filteredFaculty.length === 0 && <div className="p-8 text-center text-sm font-bold text-muted-foreground">No faculty found.</div>}
            </div>
          </div>
        </div>

        {/* Right pane: Selected Faculty Details & Students */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {selectedFaculty ? (
            <>
              {/* Faculty Detailed Profile Card */}
              <div className="bg-card rounded-3xl border border-border shadow-sm p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <UsersIcon size={120} />
                </div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-black text-3xl text-muted-foreground shadow-inner">
                    {selectedFaculty.name?.charAt(0) || 'F'}
                  </div>
                  <div>
                    <h3 className="font-black text-3xl text-foreground tracking-tight">{selectedFaculty.name || 'Unnamed Faculty'}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
                      <span className="flex items-center gap-1"><Mail size={14}/> {selectedFaculty.email}</span>
                      {selectedFaculty.branch && <span className="flex items-center gap-1"><Building2 size={14}/> {selectedFaculty.branch}</span>}
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border grid grid-cols-2 gap-4">
                   <div className="bg-muted p-4 rounded-2xl">
                     <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Mentees Assigned</div>
                     <div className="text-2xl font-black text-foreground">{assignedStudents.length}</div>
                   </div>
                   <div className="bg-muted p-4 rounded-2xl">
                     <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</div>
                     <div className="text-sm font-black text-emerald-500 flex items-center gap-1"><CheckCircle size={14}/> Active Mentor</div>
                   </div>
                </div>
              </div>

              {/* Manage Students Section */}
              <div className="bg-card rounded-3xl border border-border shadow-sm p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                  <div>
                    <h3 className="font-black text-xl text-foreground tracking-tight">Mentee Roster</h3>
                    <p className="text-xs font-bold text-muted-foreground mt-1">Assign or remove students from this faculty.</p>
                  </div>
                  <span className="bg-gray-100 text-muted-foreground text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">{assignedStudents.length} Students</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="flex-1 px-5 py-3 rounded-xl bg-muted border border-border focus:outline-none focus:ring-4 focus:ring-primary/20 font-bold text-sm text-muted-foreground cursor-pointer">
                    <option value="">Select a student to assign...</option>
                    {availableStudents.map(s => {
                      const isAssignedToThis = assignedStudents.some(as => as.student_id === s.auth_id);
                      if (isAssignedToThis) return null;
                      return <option key={s.id} value={s.auth_id}>{s.name} ({s.email})</option>
                    })}
                  </select>
                  <button onClick={handleAssign} disabled={!selectedStudentId} className="bg-primary text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50">Assign</button>
                </div>

                <div className="space-y-3">
                  {assignedStudents.length === 0 && <div className="text-muted-foreground text-sm font-bold text-center py-12 bg-muted rounded-2xl border border-dashed border-border">No students currently assigned to {selectedFaculty.name}.</div>}
                  {assignedStudents.map(mapping => (
                    <div key={mapping.id} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border shadow-sm hover:border-gray-300 transition-colors group">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm">
                           {mapping.student.name.charAt(0)}
                         </div>
                        <div>
                          <div className="font-black text-sm text-foreground">{mapping.student.name}</div>
                          <div className="text-xs text-muted-foreground font-medium">{mapping.student.email}</div>
                        </div>
                      </div>
                      <button onClick={() => handleRemove(mapping.id)} className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 px-4 py-2 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-3xl border border-border shadow-sm p-16 text-center h-full flex flex-col items-center justify-center">
              <UsersIcon size={48} className="text-gray-200 mb-4" />
              <h3 className="font-black text-xl text-foreground mb-2">Select a Faculty</h3>
              <p className="text-sm font-medium text-muted-foreground max-w-xs">Click on a faculty member from the directory on the left to view their details and manage their students.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const StudentDirectoryTab = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [mentorships, setMentorships] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [usersRes, mentorRes] = await Promise.all([
      supabase.from('users').select('*'),
      supabase.from('mentorships').select('*')
    ]);
    
    if (usersRes.data) {
      setStudents(usersRes.data.filter(u => u.role === 'student'));
      setFaculty(usersRes.data.filter(u => u.role === 'professor'));
    }
    if (mentorRes.data) {
      setMentorships(mentorRes.data);
    }
    setLoading(false);
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  const filteredStudents = students.filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.email?.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedStudent = students.find(s => s.auth_id === selectedStudentId || s.id === selectedStudentId);
  
  // Find assigned mentor
  const assignment = mentorships.find(m => m.student_id === selectedStudent?.auth_id);
  const mentor = assignment ? faculty.find(f => f.auth_id === assignment.faculty_id) : null;

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <h2 className="text-2xl font-black text-foreground tracking-tight">Student Directory</h2>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left pane: Search & List Students */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search student name or ERP..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border shadow-sm focus:outline-none focus:ring-4 focus:ring-primary/20 font-medium text-sm"
            />
          </div>
          
          <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col h-[600px]">
            <div className="p-4 border-b border-border bg-muted/50">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Student Roster ({filteredStudents.length})</h3>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
              {filteredStudents.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStudentId(s.auth_id || s.id)}
                  className={`w-full text-left p-5 transition-all flex items-center justify-between ${selectedStudentId === (s.auth_id || s.id) ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-muted border-l-4 border-transparent'}`}
                >
                  <div className="min-w-0">
                    <div className={`font-black truncate ${selectedStudentId === (s.auth_id || s.id) ? 'text-primary' : 'text-foreground'}`}>{s.name || 'Unnamed Student'}</div>
                    <div className="text-xs text-muted-foreground font-medium mt-1 truncate">{s.email}</div>
                  </div>
                  {s.placement_ready && <Award size={14} className="text-emerald-500 shrink-0 ml-2" />}
                </button>
              ))}
              {filteredStudents.length === 0 && <div className="p-8 text-center text-sm font-bold text-muted-foreground">No students found.</div>}
            </div>
          </div>
        </div>

        {/* Right pane: Selected Student Details & Progress */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {selectedStudent ? (
            <>
              {/* Student Detailed Profile Card */}
              <div className="bg-card rounded-3xl border border-border shadow-sm p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <GraduationCap size={120} />
                </div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E31E24] to-[#ff6b6b] flex items-center justify-center font-black text-3xl text-white shadow-lg shadow-red-100">
                    {selectedStudent.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-black text-3xl text-foreground tracking-tight">{selectedStudent.name || 'Unnamed Student'}</h3>
                      {selectedStudent.placement_ready && <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">Placement Ready</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground font-medium">
                      <span className="flex items-center gap-1.5"><Mail size={14}/> {selectedStudent.email}</span>
                      {selectedStudent.year && <span className="flex items-center gap-1.5"><BookOpen size={14}/> Year {selectedStudent.year}</span>}
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-muted p-5 rounded-2xl">
                     <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Primary Goal</div>
                     <div className="text-sm font-bold text-foreground">{selectedStudent.goal || 'No goal set yet'}</div>
                   </div>
                   <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                     <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-1"><UsersIcon size={12}/> Assigned Mentor</div>
                     <div className="text-sm font-black text-blue-900">
                       {mentor ? mentor.name : <span className="text-blue-400 font-medium text-xs">Unassigned. Go to Supervision to assign.</span>}
                     </div>
                   </div>
                </div>
              </div>

              {/* Progress Tracker (Mock Data) */}
              <div className="bg-card rounded-3xl border border-border shadow-sm p-8">
                <h3 className="font-black text-xl text-foreground tracking-tight mb-6 flex items-center gap-2"><TrendingUp size={20} className="text-primary" /> Academic & Placement Progress</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-muted-foreground">Resume Building Status</span>
                      <span className={selectedStudent.placement_ready ? "text-emerald-500" : "text-amber-500"}>
                        {selectedStudent.placement_ready ? '100%' : '65%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className={`h-2.5 rounded-full ${selectedStudent.placement_ready ? 'bg-emerald-500 w-full' : 'bg-amber-500 w-[65%]'}`}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-muted-foreground">Skill Assessments Completed</span>
                      <span className="text-primary">4 / 5 Modules</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-primary h-2.5 rounded-full w-[80%]"></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border flex items-center gap-4 text-sm text-muted-foreground font-medium">
                    <div className="flex-1 bg-muted p-4 rounded-xl text-center">
                      <div className="text-2xl font-black text-foreground mb-1">12</div>
                      <div className="text-[10px] uppercase tracking-widest font-bold">Mock Interviews</div>
                    </div>
                    <div className="flex-1 bg-muted p-4 rounded-xl text-center">
                      <div className="text-2xl font-black text-foreground mb-1">8</div>
                      <div className="text-[10px] uppercase tracking-widest font-bold">Doubt Sessions</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-card rounded-3xl border border-border shadow-sm p-16 text-center h-full flex flex-col items-center justify-center">
              <GraduationCap size={48} className="text-gray-200 mb-4" />
              <h3 className="font-black text-xl text-foreground mb-2">Select a Student</h3>
              <p className="text-sm font-medium text-muted-foreground max-w-xs">Click on a student from the directory on the left to view their complete profile and progress tracking.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN LAYOUT ---

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarHover, setSidebarHover] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const { userData, logoutDemo } = useAuth();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'announcements', label: 'Announcements', icon: <Megaphone size={18} /> },
    { id: 'approvals', label: 'Pending Approvals', icon: <CheckSquare size={18} /> },
    { id: 'supervision', label: 'Faculty & Mentors', icon: <UsersIcon size={18} /> },
    { id: 'students', label: 'Student Directory', icon: <GraduationCap size={18} /> },
  ];

  const adminName = userData?.name || 'Super Admin';
  const profileAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminName.split(' ')[0]}&backgroundColor=ffdfbf`;

  return (
    <div className="min-h-screen bg-gray-50/80 flex">
      {/* === SIDEBAR: auto-hide, expand on hover === */}
      <aside
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
        className="hidden lg:flex flex-col bg-white border-r border-gray-100 shadow-sm fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out overflow-hidden"
        style={{ width: sidebarHover ? '260px' : '72px' }}
      >
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 h-16">
          <img src="/assets/upper.png" alt="Skillect Icon" className="w-10 h-10 object-contain flex-shrink-0" />
          <AnimatePresence>
            {sidebarHover && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="font-black text-[#1e293b] text-xl tracking-tight block leading-tight">Admin Portal</span>
                <span className="text-[9px] text-[#E31E24] font-bold uppercase tracking-[0.2em]">Skillect Management</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={!sidebarHover ? item.label : undefined}
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E31E24] text-white shadow-xl shadow-red-100 scale-[1.02]'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-[#1e293b]'
                }`}
              >
                <span className={`flex-shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
                <AnimatePresence>
                  {sidebarHover && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={() => { logoutDemo(); window.location.href = '/'; }}
            className="w-full flex items-center gap-4 px-3 py-3 rounded-2xl text-sm font-bold text-gray-400 hover:bg-red-50 hover:text-[#E31E24] transition-all"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <AnimatePresence>
              {sidebarHover && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="whitespace-nowrap">
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenu(!mobileMenu)} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl text-gray-500">
            <Menu size={20} />
          </button>
          <img src="/assets/upper.png" alt="Skillect Icon" className="w-8 h-8 object-contain" />
          <span className="font-black text-[#1e293b] text-lg tracking-tight">Admin Portal</span>
        </div>
      </div>

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {mobileMenu && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 bg-black z-[100]" onClick={() => setMobileMenu(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }} className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-[101] shadow-2xl p-5">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <img src="/assets/upper.png" alt="Skillect Icon" className="w-10 h-10 object-contain" />
                  <div>
                    <span className="font-black text-[#1e293b] text-xl tracking-tight block">Admin Portal</span>
                    <span className="text-[8px] text-[#E31E24] font-bold uppercase tracking-[0.2em]">Management</span>
                  </div>
                </div>
                <button onClick={() => setMobileMenu(false)} className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-lg text-gray-400"><ChevronLeft size={20} /></button>
              </div>
              <div className="space-y-1.5">
                {tabs.map((item) => (
                  <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenu(false) }}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
                      activeTab === item.id ? 'bg-[#E31E24] text-white shadow-lg shadow-red-100' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 mt-16 lg:mt-0 overflow-y-auto transition-all duration-300" style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '72px' : '0px' }}>
        {/* Top Bar */}
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-5 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-xl font-black text-[#1e293b] flex items-center gap-2">
              Welcome back, {adminName.split(' ')[0]} <span className="animate-bounce-slow">👋</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] mt-1">
              Super Admin • System Overview
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input type="text" placeholder="Search system..." className="w-64 bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium focus:outline-none focus:border-[#E31E24] focus:ring-4 focus:ring-red-50 transition-all shadow-inner" />
            </div>
            <div className="flex items-center gap-3">
              <button className="relative w-11 h-11 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-[#E31E24] transition-all shadow-sm active:scale-95">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-4 h-4 bg-[#E31E24] border-2 border-white rounded-full text-white text-[8px] font-black flex items-center justify-center">5</span>
              </button>
              <div className="w-11 h-11 rounded-2xl border-2 border-white shadow-lg overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 cursor-pointer hover:scale-105 transition-transform active:scale-95">
                <img src={profileAvatar} alt="Admin Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
          {activeTab === 'overview' && <OverviewTab setActiveTab={setActiveTab} />}
          {activeTab === 'announcements' && <AnnouncementsTab />}
          {activeTab === 'approvals' && <ApprovalsTab />}
          {activeTab === 'supervision' && <SupervisionTab />}
          {activeTab === 'students' && <StudentDirectoryTab />}
        </div>
      </main>
    </div>
  );
}
