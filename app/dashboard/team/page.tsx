"use client";
import { useEffect, useState } from "react";
import { api, TeamMember } from "../../lib/api";
import Image from "next/image";
import { Trash2, Edit, Plus, Loader2, X, Upload, Award } from "lucide-react";
import { useFeedback } from "@/components/FeedbackProvider";
import { EmptyState, ErrorState, LoadingState } from "@/components/DashboardState";
import { DashboardPage } from "@/components/DashboardShell";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [section, setSection] = useState("সম্পাদনা বিভাগ");
  const [isHead, setIsHead] = useState(false);
  const [order, setOrder] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { confirm, showToast } = useFeedback();

  const fetchMembers = async () => {
    setError(null);
    try {
      const data = await api("/team");
      const membersArray = data.members || data.data || data;
      setMembers(Array.isArray(membersArray) ? membersArray : []);
    } catch (err) {
      console.error("Failed to fetch team members", err);
      setError("Unable to load team members right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("designation", designation);
    formData.append("section", section);
    formData.append("isHead", String(isHead));
    formData.append("order", String(order));
    if (image) {
      formData.append("image", image);
    }

    try {
      if (editingMember) {
        await api(`/team/${editingMember._id}`, "PATCH", formData);
      } else {
        await api("/team", "POST", formData);
      }
      setShowModal(false);
      resetForm();
      fetchMembers();
      showToast({
        title: editingMember ? "Team member updated" : "Team member added",
        variant: "success",
      });
    } catch (error: unknown) {
      showToast({
        title: "Operation failed",
        description: getErrorMessage(error, "Operation failed"),
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDesignation("");
    setSection("সম্পাদনা বিভাগ");
    setIsHead(false);
    setOrder(0);
    setImage(null);
    setPreview(null);
    setEditingMember(null);
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setDesignation(member.designation);
    setSection(member.section);
    setIsHead(member.isHead);
    setOrder(member.order);
    setPreview(member.image);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete this team member?",
      description: "This member will be removed from the team listing.",
      confirmText: "Delete",
      variant: "danger",
    });

    if (!confirmed) return;
    try {
      await api(`/team/${id}`, "DELETE");
      fetchMembers();
      showToast({ title: "Team member deleted", variant: "success" });
    } catch {
      showToast({ title: "Failed to delete member", variant: "error" });
    }
  };

  return (
    <>
      <DashboardPage className="text-gray-900">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Team Management</h1>
            <p className="text-gray-500 mt-1">Manage your newsroom staff and hierarchy.</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
          >
            <Plus size={20} />
            <span className="font-semibold">Add Member</span>
          </button>
        </div>

        {loading ? (
          <LoadingState label="Loading team members..." />
        ) : error ? (
          <ErrorState
            title="Could not load team members"
            description={error}
            onRetry={fetchMembers}
          />
        ) : members.length === 0 ? (
          <EmptyState
            title="No team members found"
            description="Add your newsroom staff to start building the public team page."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {members.sort((a,b) => a.order - b.order).map((member) => (
              <div key={member._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
                        {member.image ? (
                          <Image src={member.image} alt={member.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Plus size={24} />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-gray-900 line-clamp-1">{member.name}</h3>
                          {member.isHead && <Award size={16} className="text-amber-500" />}
                        </div>
                        <p className="text-sm text-blue-600 font-medium break-words">{member.designation}</p>
                        <p className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{member.section}</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button onClick={() => handleEdit(member)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(member._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Display Order: {member.order}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardPage>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-800">
                {editingMember ? "Edit Team Member" : "Add New Member"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              {/* Image Upload */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                    {preview ? (
                      <Image src={preview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <Upload className="text-gray-400" size={24} />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 shadow-lg">
                    <Upload size={14} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name (Bangla/English)</label>
                  <input required className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., মোঃ আব্দুল করিম" />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
                  <input required className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="e.g., সম্পাদক" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Section</label>
                  <select className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" value={section} onChange={(e) => setSection(e.target.value)}>
                    <option value="সম্পাদনা বিভাগ">সম্পাদনা বিভাগ</option>
                    <option value="প্রতিবেদক">প্রতিবেদক</option>
                    <option value="পৃষ্ঠপোষক">পৃষ্ঠপোষক</option>
                    <option value="আইটি বিভাগ">আইটি বিভাগ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Display Order</label>
                  <input type="number" className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" value={order} onChange={(e) => setOrder(parseInt(e.target.value))} />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300" checked={isHead} onChange={(e) => setIsHead(e.target.checked)} />
                    <span className="ml-2 text-sm font-semibold text-gray-700">Section Head?</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t flex-shrink-0">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all disabled:bg-blue-300 shadow-lg shadow-blue-100"
                >
                  {submitting && <Loader2 className="animate-spin" size={20} />}
                  <span>{editingMember ? "Update Member Info" : "Add to Team"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
