"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Edit2, Trash2, Plus, X, ExternalLink, Video } from "lucide-react";
import { Icons } from "@/components/ui/Icons";
import { FaGithub } from "react-icons/fa";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  stack: string;
  tool: string;
  year: string;
  github_link?: string;
  live_link?: string;
  video_link?: string;
}

export default function ProjectsForm() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Section Content State
  const [sectionTitle, setSectionTitle] = useState("Discover Projects.");
  const [sectionSubtitle, setSectionSubtitle] = useState("Explore curated builds and applications. Click a project card to view full details.");
  const [contentSaving, setContentSaving] = useState(false);

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stack, setStack] = useState("");
  const [tool, setTool] = useState("");
  const [year, setYear] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [liveLink, setLiveLink] = useState("");
  const [videoLink, setVideoLink] = useState("");

  // Fetch Projects
  const fetchProjects = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setProjects(data);
    if (error) console.error("Error fetching projects:", error);
    setFetching(false);
  };

  const fetchContent = async () => {
    const { data } = await supabase.from("projects_content").select("*").single();
    if (data) {
      if (data.title) setSectionTitle(data.title);
      if (data.subtitle) setSectionSubtitle(data.subtitle);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchContent();
  }, []);

  const resetForm = () => {
    setCurrentId(null);
    setTitle("");
    setDescription("");
    setImageUrl("");
    setImageFile(null);
    setStack("");
    setTool("");
    setYear(new Date().getFullYear().toString());
    setGithubLink("");
    setLiveLink("");
    setVideoLink("");
    setIsEditing(false);
  };

  const handleEditClick = (project: Project) => {
    setCurrentId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setImageUrl(project.image_url);
    setImageFile(null);
    setStack(project.stack);
    setTool(project.tool);
    setYear(project.year);
    setGithubLink(project.github_link || "");
    setLiveLink(project.live_link || "");
    setVideoLink(project.video_link || "");
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      alert("Error deleting project: " + error.message);
    } else {
      fetchProjects();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let finalImageUrl = imageUrl;

    // 1. Upload File if selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `project-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(`projects/${fileName}`, imageFile, { upsert: true });

      if (uploadError) {
        alert("Error uploading file!");
        setLoading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(`projects/${fileName}`);
              
      finalImageUrl = publicUrlData.publicUrl;
    }

    // 2. Save Data to Database
    const payload = {
      title,
      description,
      image_url: finalImageUrl,
      stack,
      tool,
      year,
      github_link: githubLink,
      live_link: liveLink,
      video_link: videoLink,
    };

    let error;
    if (currentId) {
      const { error: updateError } = await supabase.from("projects").update(payload).eq("id", currentId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from("projects").insert([payload]);
      error = insertError;
    }

    if (error) {
      alert("Error saving project: " + error.message);
    } else {
      alert("Project saved successfully!");
      resetForm();
      fetchProjects();
    }
    
    setLoading(false);
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setContentSaving(true);
    const payload = {
      id: 1,
      title: sectionTitle,
      subtitle: sectionSubtitle,
    };
    const { error } = await supabase.from("projects_content").upsert(payload);
    if (error) {
      alert("Error saving section content: " + error.message);
    } else {
      alert("Section headers saved successfully!");
    }
    setContentSaving(false);
  };

  if (fetching) return <div style={{ color: "#888" }}>Loading your projects...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
      
      {/* SECTION HEADERS FORM */}
      <form onSubmit={handleSaveContent} style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <h3 style={{ margin: 0, color: "#E1E0CC", fontSize: "1.2rem" }}>Section Headers</h3>
          <button type="submit" disabled={contentSaving} style={{ background: "#E1E0CC", color: "#050505", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: 600, border: "none", cursor: contentSaving ? "not-allowed" : "pointer" }}>
            {contentSaving ? "Saving..." : "Save Headers"}
          </button>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Section Title</label>
          <input type="text" value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} required style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }} />
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Section Subtitle</label>
          <textarea value={sectionSubtitle} onChange={(e) => setSectionSubtitle(e.target.value)} required rows={2} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px", resize: "vertical" }} />
        </div>
      </form>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* HEADER & ADD BUTTON */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "1.5rem", color: "#fff", margin: 0 }}>Manage Projects</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#E1E0CC", color: "#050505", padding: "0.75rem 1.25rem", borderRadius: "8px", fontWeight: 600, border: "none", cursor: "pointer" }}
          >
            <Plus size={18} /> Add New Project
          </button>
        )}
      </div>

      {/* DASHBOARD CARDS VIEW */}
      {!isEditing && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {projects.length === 0 ? (
            <p style={{ color: "#888" }}>No projects found. Create your first one!</p>
          ) : (
            projects.map((proj) => (
              <div key={proj.id} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ width: "100%", height: "160px", position: "relative", backgroundColor: "#111" }}>
                  <img src={proj.image_url} alt={proj.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ padding: "1.25rem", flexGrow: 1, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <h3 style={{ margin: 0, color: "#fff", fontSize: "1.1rem" }}>{proj.title}</h3>
                  <p style={{ margin: 0, color: "#888", fontSize: "0.85rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{proj.description}</p>
                  
                  <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "#A0A0A0", marginTop: "auto", paddingTop: "1rem" }}>
                    <span><strong>Stack:</strong> {proj.stack}</span>
                    <span><strong>Tool:</strong> {proj.tool}</span>
                    <span><strong>Year:</strong> {proj.year}</span>
                  </div>
                  
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1rem" }}>
                    <button onClick={() => handleEditClick(proj)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "rgba(255,255,255,0.1)", color: "#fff", border: "none", padding: "0.5rem", borderRadius: "6px", cursor: "pointer" }}>
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(proj.id)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", padding: "0.5rem", borderRadius: "6px", cursor: "pointer" }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ADD/EDIT FORM */}
      {isEditing && (
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "2rem", borderRadius: "16px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
            <h3 style={{ color: "#fff", margin: 0 }}>{currentId ? "Edit Project" : "Add New Project"}</h3>
            <button type="button" onClick={resetForm} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer" }}><X size={24} /></button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Project Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }} />
            </div>

            {/* Year */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Year Completed</label>
              <input type="text" value={year} onChange={(e) => setYear(e.target.value)} required style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }} />
            </div>

            {/* Tech Stack */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Primary Stack (e.g., React)</label>
              <input type="text" value={stack} onChange={(e) => setStack(e.target.value)} required style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }} />
            </div>

            {/* Tool */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Main Tool/Feature (e.g., Three.js)</label>
              <input type="text" value={tool} onChange={(e) => setTool(e.target.value)} required style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }} />
            </div>
          </div>

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Project Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px", resize: "vertical" }} />
          </div>

          {/* Links Section */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", padding: "1.5rem", background: "rgba(0,0,0,0.3)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", color: "#A0A0A0", display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: 14, height: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}><FaGithub /></div> GitHub Repo Link
              </label>
              <input type="url" placeholder="https://github.com/..." value={githubLink} onChange={(e) => setGithubLink(e.target.value)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", color: "#A0A0A0", display: "flex", alignItems: "center", gap: "4px" }}><ExternalLink size={14}/> Live Demo Link</label>
              <input type="url" placeholder="https://myproject.com" value={liveLink} onChange={(e) => setLiveLink(e.target.value)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.85rem", color: "#A0A0A0", display: "flex", alignItems: "center", gap: "4px" }}><Video size={14}/> Explanation Video Link</label>
              <input type="url" placeholder="Google Drive / YouTube URL" value={videoLink} onChange={(e) => setVideoLink(e.target.value)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }} />
            </div>
          </div>

          {/* Media Upload */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Project Thumbnail Image</label>
            <div style={{ padding: "1.5rem", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "12px", background: "rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", gap: "1rem" }}>
              {imageUrl && !imageFile && (
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <img src={imageUrl} alt="Preview" style={{ width: "80px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                  <p style={{ fontSize: "0.8rem", color: "#A0A0A0", margin: 0, wordBreak: "break-all" }}>{imageUrl}</p>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setImageFile(e.target.files[0]);
                  }
                }}
                style={{ color: "#fff" }}
              />
              <p style={{ fontSize: "0.8rem", color: "#888", margin: 0 }}>Or paste external URL:</p>
              <input 
                type="text" 
                placeholder="https://images.unsplash.com/..." 
                value={imageFile ? "" : imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                disabled={!!imageFile}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }}
              />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ marginTop: "1rem", background: "#E1E0CC", color: "#050505", padding: "1rem", borderRadius: "8px", fontWeight: 600, border: "none", cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Saving Project..." : (currentId ? "Update Project" : "Create Project")}
          </button>
        </form>
      )}
      </div>
    </div>
  );
}
