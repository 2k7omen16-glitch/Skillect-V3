import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, ExternalLink, Zap, Loader2, TrendingUp, Sparkles, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { fetchAINews } from '../services/ai';

const TRENDING_TAGS = ['#PySpark', '#LLMFineTuning', '#dbt', '#Snowflake', '#PromptEngineering', '#LangChain', '#RAG', '#MLOps'];

const FALLBACK_NEWS = [
  {
    title: "Google: Gemini in BigQuery needs prompt skills!",
    description: "Analysts who combine SQL with natural language querying are seeing 40% faster shortlisting in data roles, according to data from Naukri.com.",
    url: "https://deepmind.google/discover/blog/",
    source: "Economic Times Tech",
    type: "world",
    relevance: "skill_gap",
    timeAgo: "1 day ago"
  },
  {
    title: "TCS, Infosys hiring up for analytics roles — Python + Tableau still top requirements",
    description: "Both Python and Tableau are on most roadmaps. Estimated readiness: 6 weeks from now based on current pace.",
    url: "#",
    source: "Moneycontrol",
    type: "local",
    relevance: "on_roadmap",
    timeAgo: "3 days ago"
  },
  {
    title: "NASSCOM report: 68% of 2025 analytics graduates lacked working knowledge of cloud data tools",
    description: "AWS and Azure data services are flagged as a differentiator in entry-level hiring.",
    url: "#",
    source: "NASSCOM",
    type: "world",
    relevance: "not_on_roadmap",
    timeAgo: "5 days ago"
  },
  {
    title: "OpenAI releases GPT-4o mini — free model now rivals paid versions",
    description: "Students can now build production-grade AI apps without API costs. Great opportunity for portfolio projects.",
    url: "#",
    source: "TechCrunch",
    type: "world",
    relevance: "skill_gap",
    timeAgo: "2 days ago"
  }
];

function RelevanceBadge({ type }: { type: string }) {
  if (type === 'skill_gap') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-[#E31E24] border border-red-100">
      <Zap size={10} /> Relevant to you
    </span>
  );
  if (type === 'on_roadmap') return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-100">
      <CheckCircle2 size={10} /> On your roadmap
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
      <AlertTriangle size={10} /> Not on roadmap
    </span>
  );
}

export default function NewsFeed() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const fetched = await fetchAINews();
        if (fetched && fetched.length > 0) {
          setNews(fetched.map((item: any, i: number) => ({
            ...item,
            relevance: ['skill_gap', 'on_roadmap', 'not_on_roadmap'][i % 3],
            timeAgo: `${i + 1} day${i > 0 ? 's' : ''} ago`
          })));
        } else {
          setNews(FALLBACK_NEWS);
        }
      } catch {
        setNews(FALLBACK_NEWS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center mb-6">
        <Loader2 className="w-7 h-7 text-[#E31E24] animate-spin mb-3" />
        <p className="text-sm font-medium text-gray-400">Loading Domain Pulse...</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#E31E24] to-[#ff6b6b] rounded-xl flex items-center justify-center shadow-sm">
              <Sparkles size={16} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-[#1e293b] text-base">Domain Pulse</h2>
                <span className="flex items-center gap-1 bg-green-50 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-100">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Curated for your career goal • Updated 2 hrs ago</p>
            </div>
          </div>
          <button className="text-xs text-[#E31E24] font-medium hover:underline flex items-center gap-1">
            View All <ChevronRight size={12} />
          </button>
        </div>

        {/* Trending Tags */}
        <div className="px-5 py-3 border-b border-gray-50 bg-gray-50/50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={13} className="text-[#E31E24]" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Trending now</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {TRENDING_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                  activeTag === tag
                    ? 'bg-[#E31E24] text-white border-[#E31E24] shadow-md shadow-red-100'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#E31E24] hover:text-[#E31E24]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* News Cards */}
        <div className="divide-y divide-gray-50">
          <AnimatePresence>
            {news.slice(0, 4).map((item, i) => (
              <motion.a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                key={i}
                className="flex gap-4 px-5 py-4 hover:bg-red-50/30 transition-all group cursor-pointer"
              >
                {/* Left: Thumbnail placeholder */}
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100 group-hover:border-red-100 transition-colors">
                  {item.type === 'local' ? (
                    <MapPin size={20} className="text-amber-400" />
                  ) : (
                    <Globe size={20} className="text-blue-400" />
                  )}
                </div>

                {/* Right: Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#1e293b] text-sm leading-snug mb-1 group-hover:text-[#E31E24] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <RelevanceBadge type={item.relevance || 'skill_gap'} />
                    <span className="text-[10px] text-gray-400 font-medium">
                      {item.source} • {item.timeAgo || '1 day ago'}
                    </span>
                  </div>
                </div>

                <ExternalLink size={14} className="text-gray-300 group-hover:text-[#E31E24] transition-colors flex-shrink-0 mt-1" />
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
