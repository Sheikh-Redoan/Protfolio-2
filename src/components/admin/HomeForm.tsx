"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "@/app/dashboard/dashboard.module.css";

export default function HomeForm() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Form State
  const [title, setTitle] = useState("Sheikh Redoan");
  const [designation, setDesignation] = useState("Frontend Developer");
  const [description, setDescription] = useState("Frontend Developer (React/Next.js) turning complex designs into fast, interactive experiences with clean, maintainable code.");
  const [ctaText, setCtaText] = useState("View my work");
  const [ctaLink, setCtaLink] = useState("#projects");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchHeroData = async () => {
      const { data, error } = await supabase
        .from("hero_content")
        .select("*")
        .single();

      if (data) {
        setTitle(data.title || "");
        setDesignation(data.designation || "");
        setDescription(data.description || "");
        setCtaText(data.cta_text || "");
        setCtaLink(data.cta_link || "");
        setMediaUrl(data.media_url || "");
      }
      setFetching(false);
    };

    fetchHeroData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalMediaUrl = mediaUrl;

    // 1. Upload File if selected
    if (mediaFile) {
      const fileExt = mediaFile.name.split('.').pop();
      const fileName = `hero-media-${Date.now()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(`hero/${fileName}`, mediaFile, { upsert: true });

      if (uploadError) {
        alert("Error uploading file!");
        setLoading(false);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(`hero/${fileName}`);
        
      finalMediaUrl = publicUrlData.publicUrl;
      setMediaUrl(finalMediaUrl);
    }

    // 2. Save Data to Database
    const payload = {
      id: 1, // We only ever need 1 row for the hero section
      title,
      designation,
      description,
      cta_text: ctaText,
      cta_link: ctaLink,
      media_url: finalMediaUrl
    };

    const { error } = await supabase
      .from("hero_content")
      .upsert(payload);

    if (error) {
      alert("Error saving data: " + error.message);
    } else {
      alert("Successfully saved! Your website will now show the updated content.");
    }

    setLoading(false);
  };

  if (fetching) return <div style={{ color: "#888" }}>Loading your content...</div>;

  return (
    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      
      {/* MEDIA UPLOAD */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Banner Media (Image/Video)</label>
        <div style={{ padding: "1rem", border: "1px dashed rgba(255,255,255,0.2)", borderRadius: "12px", background: "rgba(0,0,0,0.2)" }}>
          {mediaUrl && <p style={{ fontSize: "0.8rem", color: "#E1E0CC", marginBottom: "1rem", wordBreak: "break-all" }}>Current: {mediaUrl}</p>}
          <input 
            type="file" 
            accept="image/*,video/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setMediaFile(e.target.files[0]);
              }
            }}
            style={{ color: "#fff" }}
          />
          <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "0.5rem" }}>
            Leave blank if you don't want to change the current media. OR, you can paste a direct link below:
          </p>
          <input 
            type="text" 
            placeholder="Paste external URL (Optional)" 
            value={mediaFile ? "" : mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            disabled={!!mediaFile}
            className={styles.input}
            style={{ width: "100%", marginTop: "0.5rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "0.8rem", borderRadius: "8px" }}
          />
        </div>
      </div>

      {/* TEXT FIELDS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Main Name / Title</label>
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "1rem", borderRadius: "8px" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Designation (e.g. Frontend Developer)</label>
        <input 
          type="text" 
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          required
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "1rem", borderRadius: "8px" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Description</label>
        <textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "1rem", borderRadius: "8px", resize: "vertical" }}
        />
      </div>

      {/* CTA BUTTON */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Button Text</label>
          <input 
            type="text" 
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            required
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "1rem", borderRadius: "8px" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label style={{ fontSize: "0.9rem", color: "#A0A0A0" }}>Button Link (e.g. #projects)</label>
          <input 
            type="text" 
            value={ctaLink}
            onChange={(e) => setCtaLink(e.target.value)}
            required
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", padding: "1rem", borderRadius: "8px" }}
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        style={{ marginTop: "1rem", background: "#E1E0CC", color: "#050505", padding: "1rem", borderRadius: "8px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}
      >
        {loading ? "Saving Changes..." : "Save Home Section"}
      </button>
    </form>
  );
}
