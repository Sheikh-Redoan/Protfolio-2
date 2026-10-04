"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "@/app/dashboard/dashboard.module.css";

export default function AboutForm() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Form State
  const [imageUrl, setImageUrl] = useState("https://azadrhqkhtmeqfyndjak.supabase.co/storage/v1/object/public/portfolio-images/MyImage.jpg");
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [title, setTitle] = useState("Behind the \n code.");
  const [paragraph1, setParagraph1] = useState("I am a Frontend Developer turning complex designs into fast, interactive experiences with clean, maintainable code. My work lives at the intersection of aesthetic design and robust technical architecture.");
  const [paragraph2, setParagraph2] = useState("With a strong background in leading cross-functional teams at Softvence Agency, I specialize in building scalable React/Next.js apps, real-time dashboards, and converting Figma designs into pixel-perfect interfaces that boost user retention and brand consistency.");
  const [skills, setSkills] = useState("React.js, Next.js, TypeScript, Tailwind CSS, GSAP / Three.js");
  const [showSkills, setShowSkills] = useState(true);

  // Fetch initial data
  useEffect(() => {
    const fetchAboutData = async () => {
      const { data, error } = await supabase
        .from("about_content")
        .select("*")
        .single();

      if (data) {
        setImageUrl(data.image_url || "");
        setTitle(data.title || "");
        setParagraph1(data.paragraph_1 || "");
        setParagraph2(data.paragraph_2 || "");
        setSkills(data.skills || "");
        setShowSkills(data.show_skills !== false);
      }
      setFetching(false);
    };

    fetchAboutData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalImageUrl = imageUrl;

    // 1. Upload File if selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `about-image-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(`about/${fileName}`, imageFile, { upsert: true });

      if (uploadError) {
        alert("Error uploading file!");
        setLoading(false);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(`about/${fileName}`);
        
      finalImageUrl = publicUrlData.publicUrl;
      setImageUrl(finalImageUrl);
    }

    // 2. Save Data to Database
    const payload = {
      id: 1, 
      image_url: finalImageUrl,
      title,
      paragraph_1: paragraph1,
      paragraph_2: paragraph2,
      skills,
      show_skills: showSkills
    };

    const { error } = await supabase
      .from("about_content")
      .upsert(payload);

    if (error) {
      alert("Error saving data: " + error.message);
    } else {
      alert("Successfully saved! Your website will now show the updated About content.");
    }

    setLoading(false);
  };

  if (fetching) return <div style={{ color: "#888" }}>Loading your content...</div>;

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* MEDIA UPLOAD */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Portrait Image</label>
        <div style={{ padding: "1rem", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "12px", background: "rgba(0,0,0,0.2)" }}>
          {imageUrl && <p style={{ fontSize: "0.8rem", color: "#E1E0CC", marginBottom: "1rem", wordBreak: "break-all" }}>Current: {imageUrl}</p>}
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
          <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.5rem" }}>
            Leave blank if you don't want to change the current image. OR, paste a direct link below:
          </p>
          <input 
            type="text" 
            placeholder="Paste external URL (Optional)" 
            value={imageFile ? "" : imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={!!imageFile}
            style={{ width: "100%", marginTop: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }}
          />
        </div>
      </div>

      {/* TEXT FIELDS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Section Title</label>
        <p style={{ fontSize: "0.75rem", color: "#666" }}>Use \n where you want the text to break into a new line (e.g., "Behind the \n code.")</p>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "1rem", borderRadius: "8px" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Paragraph 1</label>
        <textarea 
          value={paragraph1}
          onChange={(e) => setParagraph1(e.target.value)}
          required
          rows={3}
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "1rem", borderRadius: "8px", resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Paragraph 2</label>
        <textarea 
          value={paragraph2}
          onChange={(e) => setParagraph2(e.target.value)}
          required
          rows={3}
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "1rem", borderRadius: "8px", resize: "vertical" }}
        />
      </div>

      {/* SKILLS SECTION */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1rem", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Skills Tags</label>
        <p style={{ fontSize: "0.75rem", color: "#666" }}>Separate skills with a comma (e.g., React, Next.js, CSS)</p>
        <input 
          type="text" 
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}
        />
        
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "#E1E0CC" }}>
          <input 
            type="checkbox" 
            checked={showSkills}
            onChange={(e) => setShowSkills(e.target.checked)}
            style={{ width: "18px", height: "18px", accentColor: "#E1E0CC" }}
          />
          Show Skills Section on Website?
        </label>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        style={{ marginTop: "1rem", background: "#E1E0CC", color: "#050505", padding: "1rem", borderRadius: "8px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Saving Changes..." : "Save About Section"}
      </button>
    </form>
  );
}
