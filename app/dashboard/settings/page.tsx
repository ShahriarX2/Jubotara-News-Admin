"use client";
import { useState } from "react";
import { Settings, Globe, Share2, ShieldCheck, Save, Loader2 } from "lucide-react";
import { useFeedback } from "@/components/FeedbackProvider";
import { DashboardPage } from "@/components/DashboardShell";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const { showToast } = useFeedback();

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast({
        title: "Settings saved",
        description: "Simulated save completed successfully.",
        variant: "success",
      });
    }, 1000);
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "social", label: "Social Links", icon: Share2 },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  return (
    <DashboardPage className="text-gray-900">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Site Settings</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-md disabled:bg-blue-300"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span>{saving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row xl:gap-8">
          {/* Tabs Sidebar */}
          <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 xl:w-64 xl:grid-cols-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-gray-500 hover:bg-white hover:text-gray-700"
                }`}
              >
                <tab.icon size={20} />
                <span className="font-semibold">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="max-w-3xl flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            {activeTab === "general" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">General Configuration</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Site Title</label>
                  <input className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="Jubotara News" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Site Tagline</label>
                  <input className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="The Voice of People" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                  <input className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="contact@jubotaranews.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Footer Copyright Text</label>
                  <textarea className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white" rows={3} placeholder="© 2026 Jubotara News. All rights reserved." />
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Social Media Links</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook Page</label>
                  <input className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="https://facebook.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube Channel</label>
                  <input className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="https://youtube.com/..." />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">X (Twitter)</label>
                  <input className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="https://x.com/..." />
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Account Security</h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                  <input type="password" className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <input type="password" className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none bg-white" placeholder="••••••••" />
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800 font-medium">Warning: Changing your password will require you to log in again on all devices.</p>
                </div>
              </div>
            )}
          </div>
        </div>
    </DashboardPage>
  );
}
