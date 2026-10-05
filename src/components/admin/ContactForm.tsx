"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ContactForm() {
  const [settings, setSettings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const [settingsRes, messagesRes] = await Promise.all([
      supabase.from("contact_settings").select("*").order("platform"),
      supabase.from("messages").select("*").order("created_at", { ascending: false }),
    ]);

    if (settingsRes.data) setSettings(settingsRes.data);
    if (messagesRes.data) setMessages(messagesRes.data);
    setIsLoading(false);
  };

  const handleSettingChange = (id: string, field: string, value: any) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const saveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setSaveStatus("saving");

    const promises = settings.map(setting => 
      supabase.from("contact_settings")
        .update({ value: setting.value, is_active: setting.is_active })
        .eq("id", setting.id)
    );

    await Promise.all(promises);
    setSaveStatus("success");
    setTimeout(() => setSaveStatus("idle"), 3000);
  };

  const markMessageAsRead = async (id: string) => {
    await supabase.from("messages").update({ status: 'read' }).eq("id", id);
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' } : m));
  };

  if (isLoading) return <div style={{ color: "white" }}>Loading...</div>;

  return (
    <div style={{ color: "white" }}>
      <section style={{ marginBottom: "3rem" }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Contact Information & Social Links</h3>
        <form onSubmit={saveSettings} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {settings.map(setting => (
            <div key={setting.id} style={{ display: "flex", gap: "1rem", alignItems: "center", background: "#111", padding: "1rem", borderRadius: "8px" }}>
              <div style={{ width: "100px", fontWeight: "bold", textTransform: "capitalize" }}>{setting.platform}</div>
              <input 
                type="text" 
                value={setting.value} 
                onChange={(e) => handleSettingChange(setting.id, "value", e.target.value)}
                style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", background: "#222", border: "1px solid #333", color: "white" }}
              />
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={setting.is_active} 
                  onChange={(e) => handleSettingChange(setting.id, "is_active", e.target.checked)}
                />
                Active
              </label>
            </div>
          ))}
          <button 
            type="submit" 
            style={{ padding: "0.75rem", background: "#4f46e5", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", marginTop: "1rem" }}
          >
            {saveStatus === "saving" ? "Saving..." : "Save Settings"}
          </button>
          {saveStatus === "success" && <span style={{ color: "#22c55e" }}>Settings saved successfully!</span>}
        </form>
      </section>

      <section>
        <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>Messages from Contact Form</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {messages.length === 0 ? (
            <p style={{ color: "#888" }}>No messages yet.</p>
          ) : messages.map(msg => (
            <div key={msg.id} style={{ background: "#111", padding: "1rem", borderRadius: "8px", borderLeft: msg.status === 'unread' ? "4px solid #4f46e5" : "4px solid #333" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <div>
                  <strong>{msg.name}</strong> <span style={{ color: "#888" }}>({msg.email})</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#888" }}>
                  {new Date(msg.created_at).toLocaleString()}
                </div>
              </div>
              {msg.subject && <div style={{ fontSize: "0.9rem", color: "#ccc", marginBottom: "0.5rem" }}><strong>Subject:</strong> {msg.subject}</div>}
              <div style={{ background: "#000", padding: "1rem", borderRadius: "4px", fontSize: "0.95rem", lineHeight: "1.5" }}>
                {msg.message}
              </div>
              {msg.status === 'unread' && (
                <button 
                  onClick={() => markMessageAsRead(msg.id)}
                  style={{ marginTop: "1rem", padding: "0.5rem 1rem", background: "#222", color: "white", border: "1px solid #333", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem" }}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
