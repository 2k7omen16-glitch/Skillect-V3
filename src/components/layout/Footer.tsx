import { Target, Code, Brain } from 'lucide-react'
import Logo from '../Logo'

export default function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="space-y-8">
            <Logo size="large" centered />
            <p className="text-gray-400 text-xs font-bold uppercase leading-loose tracking-[0.1em]">
              NOIDA INSTITUTE OF ENGINEERING AND TECHNOLOGY<br />
              <span className="text-[#1e293b]">GREATER NOIDA, INDIA</span>
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[#1e293b] hover:bg-[#E31E24] hover:text-white transition-colors cursor-pointer"><Target size={16} /></div>
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[#1e293b] hover:bg-[#E31E24] hover:text-white transition-colors cursor-pointer"><Code size={16} /></div>
              <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[#1e293b] hover:bg-[#E31E24] hover:text-white transition-colors cursor-pointer"><Brain size={16} /></div>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-black text-[#1e293b] uppercase tracking-[0.3em] mb-10">Ecosystem</div>
            <ul className="text-xs font-bold text-gray-400 space-y-5 uppercase tracking-[0.15em]">
              <li className="hover:text-[#E31E24] cursor-pointer transition-all hover:translate-x-1">Assessment</li>
              <li className="hover:text-[#E31E24] cursor-pointer transition-all hover:translate-x-1">Mentorship</li>
              <li className="hover:text-[#E31E24] cursor-pointer transition-all hover:translate-x-1">Resume AI</li>
              <li className="hover:text-[#E31E24] cursor-pointer transition-all hover:translate-x-1">Roadmaps</li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-black text-[#1e293b] uppercase tracking-[0.3em] mb-10">Trust Center</div>
            <ul className="text-xs font-bold text-gray-400 space-y-5 uppercase tracking-[0.15em]">
              <li className="hover:text-[#E31E24] cursor-pointer transition-all hover:translate-x-1">Privacy Policy</li>
              <li className="hover:text-[#E31E24] cursor-pointer transition-all hover:translate-x-1">Terms of Service</li>
              <li className="hover:text-[#E31E24] cursor-pointer transition-all hover:translate-x-1">Data Residency</li>
              <li className="hover:text-[#E31E24] cursor-pointer transition-all hover:translate-x-1">OWASP Compliance</li>
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-black text-[#1e293b] uppercase tracking-[0.3em] mb-10">Institutional</div>
            <ul className="text-xs font-bold text-gray-400 space-y-5 uppercase tracking-[0.15em]">
              <li className="hover:text-[#E31E24] cursor-pointer transition-all hover:translate-x-1">admission@niet.co.in</li>
              <li className="hover:text-[#E31E24] cursor-pointer transition-all hover:translate-x-1">+91-8010-500-700</li>
              <li className="hover:text-[#E31E24] cursor-pointer transition-all hover:translate-x-1">NIET Global Campus</li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            &copy; 2026 NIET Greater Noida. <span className="text-[#1e293b]">AI-Verified Platform.</span>
          </p>
          <div className="flex items-center gap-6 text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em]">
            <span>Powered by AWS India</span>
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <span>Groq Intelligence Engine</span>
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <span>v2.1 "Ares"</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
