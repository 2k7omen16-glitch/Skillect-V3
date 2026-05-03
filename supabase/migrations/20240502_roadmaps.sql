-- ROADMAPS TABLE
CREATE TABLE IF NOT EXISTS public.roadmaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT DEFAULT 'technical',
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROADMAP NODES TABLE
CREATE TABLE IF NOT EXISTS public.roadmap_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id TEXT NOT NULL, -- Local ID used for graph connections (e.g., 'frontend-1')
    roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    type TEXT DEFAULT 'topic', -- 'topic' or 'subtopic'
    pos_x FLOAT NOT NULL,
    pos_y FLOAT NOT NULL,
    width INTEGER DEFAULT 150,
    height INTEGER DEFAULT 45,
    content_title TEXT,
    content_description TEXT,
    UNIQUE(roadmap_id, node_id)
);

-- ROADMAP EDGES (CONNECTIONS)
CREATE TABLE IF NOT EXISTS public.roadmap_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,
    source_node_id TEXT NOT NULL,
    target_node_id TEXT NOT NULL,
    style TEXT DEFAULT 'solid', -- 'solid' or 'dotted'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ROADMAP RESOURCES (LINKS/VIDEOS)
CREATE TABLE IF NOT EXISTS public.roadmap_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT DEFAULT 'article', -- 'video', 'article', 'docs'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- USER PROGRESS TRACKING
CREATE TABLE IF NOT EXISTS public.user_roadmap_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, roadmap_id, node_id)
);

-- ENABLE RLS
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roadmap_progress ENABLE ROW LEVEL SECURITY;

-- POLICIES (Read for all, Write for authenticated progress)
CREATE POLICY "Roadmaps are viewable by everyone" ON public.roadmaps FOR SELECT USING (true);
CREATE POLICY "Nodes are viewable by everyone" ON public.roadmap_nodes FOR SELECT USING (true);
CREATE POLICY "Edges are viewable by everyone" ON public.roadmap_edges FOR SELECT USING (true);
CREATE POLICY "Resources are viewable by everyone" ON public.roadmap_resources FOR SELECT USING (true);
CREATE POLICY "Users can view their own progress" ON public.user_roadmap_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.user_roadmap_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can edit their own progress" ON public.user_roadmap_progress FOR UPDATE USING (auth.uid() = user_id);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_roadmap_nodes_roadmap_id ON public.roadmap_nodes(roadmap_id);
CREATE INDEX idx_roadmap_edges_roadmap_id ON public.roadmap_edges(roadmap_id);
CREATE INDEX idx_roadmap_resources_node_id ON public.roadmap_resources(node_id);
CREATE INDEX idx_user_progress_user_id ON public.user_roadmap_progress(user_id);
