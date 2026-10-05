"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import styles from "./dashboard.module.css";
import { motion, AnimatePresence } from "framer-motion";
import HomeForm from "@/components/admin/HomeForm";
import AboutForm from "@/components/admin/AboutForm";
import SkillsForm from "@/components/admin/SkillsForm";
import ProjectsForm from "@/components/admin/ProjectsForm";

type Tab = "Home" | "About" | "Skills" | "Projects" | "Contact";
const TABS: Tab[] = ["Home", "About", "Skills", "Projects", "Contact"];


export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("Home");
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#050505", color: "#E1E0CC" }}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.adminContainer}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Admin Panel</h2>
        </div>
        
        <nav className={styles.nav}>
          {TABS.map((tab) => (
            <div 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? styles.navItemActive : styles.navItem}
            >
              {tab} Section
            </div>
          ))}
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.mainContent}>
        <div className={styles.contentHeader}>
          <h1>{activeTab} Management</h1>
          <p>Edit the content displayed in the {activeTab} section of your portfolio.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={styles.formCard}
          >
            {activeTab === "Home" ? (
              <HomeForm />
            ) : activeTab === "About" ? (
              <AboutForm />
            ) : activeTab === "Skills" ? (
              <SkillsForm />
            ) : activeTab === "Projects" ? (
              <ProjectsForm />
            ) : (
              <>
                <h3 style={{ marginBottom: "1rem", color: "#fff" }}>{activeTab} Data Fields</h3>
                <p style={{ color: "#888", fontSize: "0.9rem" }}>
                  Forms to edit this data will appear here. For now, we need to create the corresponding Supabase tables to store this information!
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
