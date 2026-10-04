"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const DEFAULT_LEFT = [
  { label: "React.js", icon: "React", color: "rgba(97, 218, 251, 0.5)", beamColor: "#61dafb" },
  { label: "JavaScript", icon: "JavaScript", color: "rgba(247, 223, 30, 0.5)", beamColor: "#f7df1e" },
  { label: "TypeScript", icon: "TypeScript", color: "rgba(49, 120, 198, 0.5)", beamColor: "#3178C6" },
  { label: "GSAP", icon: "GSAP", color: "rgba(136, 206, 2, 0.5)", beamColor: "#88ce02" },
  { label: "Three.js", icon: "ThreeJS", color: "rgba(255, 255, 255, 0.5)", beamColor: "#ffffff" }
];

const DEFAULT_RIGHT = [
  { label: "Next.js", icon: "NextJS", color: "rgba(255, 255, 255, 0.5)", beamColor: "#ffffff" },
  { label: "HTML", icon: "HTML", color: "rgba(227, 79, 38, 0.5)", beamColor: "#e34f26" },
  { label: "Tailwind", icon: "Tailwind", color: "rgba(56, 189, 248, 0.5)", beamColor: "#38BDF8" },
  { label: "Git", icon: "Git", color: "rgba(241, 80, 47, 0.5)", beamColor: "#F1502F" },
  { label: "GitHub", icon: "GitHub", color: "rgba(255, 255, 255, 0.5)", beamColor: "#ffffff" }
];

export default function SkillsForm() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Basic Text
  const [title, setTitle] = useState("Core Expertise");
  const [subtitle, setSubtitle] = useState("My technical foundation powering interactive experiences.");
  
  // Center Image
  const [centerImage, setCenterImage] = useState("");
  const [centerImageFile, setCenterImageFile] = useState<File | null>(null);

  // Skills Lists
  const [leftSkills, setLeftSkills] = useState(DEFAULT_LEFT);
  const [rightSkills, setRightSkills] = useState(DEFAULT_RIGHT);

  useEffect(() => {
    const fetchSkillsData = async () => {
      const { data, error } = await supabase
        .from("skills_content")
        .select("*")
        .single();

      if (data) {
        setTitle(data.title || "");
        setSubtitle(data.subtitle || "");
        setCenterImage(data.center_image || "");
        if (data.left_skills) setLeftSkills(data.left_skills);
        if (data.right_skills) setRightSkills(data.right_skills);
      }
      setFetching(false);
    };

    fetchSkillsData();
  }, []);

  const handleSkillChange = (side: "left" | "right", index: number, field: string, value: string) => {
    if (side === "left") {
      const newSkills = [...leftSkills];
      newSkills[index] = { ...newSkills[index], [field]: value };
      setLeftSkills(newSkills);
    } else {
      const newSkills = [...rightSkills];
      newSkills[index] = { ...newSkills[index], [field]: value };
      setRightSkills(newSkills);
    }
  };

  const handleSkillImageUpload = async (side: "left" | "right", index: number, file: File) => {
    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `skill-icon-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(`skills/${fileName}`, file, { upsert: true });

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(`skills/${fileName}`);
      
      handleSkillChange(side, index, "icon", publicUrlData.publicUrl);
    } else {
      alert("Error uploading image");
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalImageUrl = centerImage;

    // Upload Center Image if selected
    if (centerImageFile) {
      const fileExt = centerImageFile.name.split('.').pop();
      const fileName = `skills-center-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(`skills/${fileName}`, centerImageFile, { upsert: true });

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(`skills/${fileName}`);
        finalImageUrl = publicUrlData.publicUrl;
        setCenterImage(finalImageUrl);
      }
    }

    const payload = {
      id: 1, 
      title,
      subtitle,
      center_image: finalImageUrl,
      left_skills: leftSkills,
      right_skills: rightSkills
    };

    const { error } = await supabase.from("skills_content").upsert(payload);

    if (error) {
      alert("Error saving data: " + error.message);
    } else {
      alert("Successfully saved! Your website will now show the updated Skills content.");
    }
    setLoading(false);
  };

  if (fetching) return <div style={{ color: "#888" }}>Loading your content...</div>;

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h3 style={{ margin: 0, color: "#E1E0CC" }}>Section Headers</h3>
        <input 
          type="text" 
          value={title} onChange={(e) => setTitle(e.target.value)} 
          placeholder="Section Title"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "1rem", borderRadius: "8px" }}
        />
        <input 
          type="text" 
          value={subtitle} onChange={(e) => setSubtitle(e.target.value)} 
          placeholder="Section Subtitle"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "1rem", borderRadius: "8px" }}
        />
      </div>

      {/* CENTER IMAGE */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h3 style={{ margin: 0, color: "#E1E0CC" }}>Center Hub Image</h3>
        <div style={{ padding: "1rem", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "12px", background: "rgba(0,0,0,0.2)" }}>
          {centerImage && <p style={{ fontSize: "0.8rem", color: "#E1E0CC", marginBottom: "1rem", wordBreak: "break-all" }}>Current: {centerImage}</p>}
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => { if (e.target.files && e.target.files[0]) setCenterImageFile(e.target.files[0]); }}
            style={{ color: "#fff" }}
          />
          <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.5rem" }}>
            Paste external URL instead:
          </p>
          <input 
            type="text" 
            placeholder="URL" 
            value={centerImageFile ? "" : centerImage}
            onChange={(e) => setCenterImage(e.target.value)}
            disabled={!!centerImageFile}
            style={{ width: "100%", marginTop: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }}
          />
        </div>
      </div>

      {/* LEFT SKILLS */}
      <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h3 style={{ margin: 0, color: "#E1E0CC", marginBottom: "1rem" }}>Left Side Skills</h3>
        {leftSkills.map((skill, index) => (
          <div key={index} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input 
                type="text" value={skill.label} onChange={(e) => handleSkillChange("left", index, "label", e.target.value)} 
                placeholder="Label (e.g. React.js)" style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }}
              />
              <input 
                type="text" value={skill.icon} onChange={(e) => handleSkillChange("left", index, "icon", e.target.value)} 
                placeholder="Icon Name OR Image URL" style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }}
              />
              <input 
                type="text" value={skill.beamColor} onChange={(e) => handleSkillChange("left", index, "beamColor", e.target.value)} 
                placeholder="Beam Color (e.g. #61dafb)" style={{ width: "150px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <label style={{ fontSize: "0.8rem", color: "#888" }}>Or upload an icon image:</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => { if (e.target.files && e.target.files[0]) handleSkillImageUpload("left", index, e.target.files[0]) }}
                style={{ color: "#fff", fontSize: "0.8rem" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT SKILLS */}
      <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <h3 style={{ margin: 0, color: "#E1E0CC", marginBottom: "1rem" }}>Right Side Skills</h3>
        {rightSkills.map((skill, index) => (
          <div key={index} style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input 
                type="text" value={skill.label} onChange={(e) => handleSkillChange("right", index, "label", e.target.value)} 
                placeholder="Label" style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }}
              />
              <input 
                type="text" value={skill.icon} onChange={(e) => handleSkillChange("right", index, "icon", e.target.value)} 
                placeholder="Icon Name OR Image URL" style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }}
              />
              <input 
                type="text" value={skill.beamColor} onChange={(e) => handleSkillChange("right", index, "beamColor", e.target.value)} 
                placeholder="Beam Color" style={{ width: "150px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <label style={{ fontSize: "0.8rem", color: "#888" }}>Or upload an icon image:</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => { if (e.target.files && e.target.files[0]) handleSkillImageUpload("right", index, e.target.files[0]) }}
                style={{ color: "#fff", fontSize: "0.8rem" }}
              />
            </div>
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading} style={{ background: "#E1E0CC", color: "#050505", padding: "1rem", borderRadius: "8px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
        {loading ? "Saving..." : "Save Skills Section"}
      </button>
    </form>
  );
}
