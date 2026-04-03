"use client";
import { useEffect, useState } from "react";
import { api, User } from "../../lib/api";
import { Trash2, Edit, Plus, Loader2, X, UserCog } from "lucide-react";
import { useFeedback } from "@/components/FeedbackProvider";
import { EmptyState, ErrorState, LoadingState } from "@/components/DashboardState";
import { DashboardPage } from "@/components/DashboardShell";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("reporter");
  const { confirm, showToast } = useFeedback();

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    setError(null);
    try {
      const data = await api("/users", "GET", undefined, token || "");
      const usersArray = data.users || data.data || data;
      setUsers(Array.isArray(usersArray) ? usersArray : []);
    } catch (error: unknown) {
      console.error("Failed to fetch users", error);
      const message = getErrorMessage(error, "");
      if (message.includes("401") || message.includes("403")) {
        setError("You do not have permission to view users.");
      } else {
        setError("Unable to load users right now.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      if (editingUser) {
        await api(`/users/${editingUser._id}`, "PATCH", { name, email, role }, token || "");
      } else {
        await api("/auth/register", "POST", { name, email, password, role }, token || "");
      }
      setShowModal(false);
      resetForm();
      fetchUsers();
      showToast({
        title: editingUser ? "User updated" : "User created",
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
    setEmail("");
    setPassword("");
    setRole("reporter");
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete this user?",
      description: "This will permanently remove the account.",
      confirmText: "Delete",
      variant: "danger",
    });

    if (!confirmed) return;
    const token = localStorage.getItem("token");
    try {
      await api(`/users/${id}`, "DELETE", undefined, token || "");
      fetchUsers();
      showToast({ title: "User deleted", variant: "success" });
    } catch {
      showToast({ title: "Failed to delete user", variant: "error" });
    }
  };

  return (
    <>
      <DashboardPage className="text-gray-900">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
          >
            <Plus size={20} />
            <span className="font-semibold">Add User</span>
          </button>
        </div>

        {loading ? (
          <LoadingState label="Loading users..." />
        ) : error ? (
          <ErrorState
            title="Could not load users"
            description={error}
            onRetry={fetchUsers}
          />
        ) : users.length === 0 ? (
          <EmptyState
            title="No users found"
            description="Create user accounts to manage access for your newsroom team."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[720px] w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">User</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Role</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Joined</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <UserCog size={20} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                        user.role === 'editor' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>
        )}
      </DashboardPage>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingUser ? "Edit User" : "Add New User"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-gray-900">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  required
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              {!editingUser && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                  <input
                    required
                    type="password"
                    className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="editor">Editor</option>
                  <option value="reporter">Reporter</option>
                </select>
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all disabled:bg-blue-300"
                >
                  {submitting && <Loader2 className="animate-spin" size={18} />}
                  <span>{editingUser ? "Update User" : "Create User"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
