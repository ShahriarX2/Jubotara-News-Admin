"use client";
import { useEffect, useState } from "react";
import { api, ContactMessage } from "../../lib/api";
import { MessageSquare, Trash2, Eye, X } from "lucide-react";
import { useFeedback } from "@/components/FeedbackProvider";
import { ErrorState, LoadingState } from "@/components/DashboardState";
import { DashboardPage } from "@/components/DashboardShell";

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const { showToast, confirm } = useFeedback();

  const fetchMessages = async () => {
    setError(null);
    try {
      const data = await api("/communication/contact/messages");
      const msgArray = data.messages || data.data || data;
      setMessages(Array.isArray(msgArray) ? msgArray : []);
    } catch (error: unknown) {
      console.error("Failed to fetch messages", error);
      setError("Unable to load messages right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete Message?",
      description: "Are you sure you want to remove this message?",
      confirmText: "Delete",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api(`/communication/contact/messages/${id}`, "DELETE");
      setMessages((prev) => prev.filter((m) => m._id !== id));
      showToast({ title: "Message deleted", variant: "success" });
    } catch {
      showToast({ title: "Failed to delete message", variant: "error" });
    }
  };

  if (loading) return <LoadingState />;
  if (error)
    return (
      <ErrorState title="Error" description={error} onRetry={fetchMessages} />
    );
  if (messages.length === 0)
    return (
      <DashboardPage>
        <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
          <MessageSquare size={48} className="text-gray-300" />
          <p className="text-xl font-medium text-gray-500">No messages yet</p>
        </div>
      </DashboardPage>
    );

  return (
    <DashboardPage>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Sender</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Subject</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">{msg.name}</span>
                      <span className="text-gray-500 text-xs">{msg.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {msg.subject || "No Subject"}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedMessage(msg)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                        title="Delete"
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

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-6 flex items-center justify-between border-b pb-4">
              <h2 className="text-2xl font-bold text-gray-800">Message Details</h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase">From</p>
                  <p className="text-gray-800 font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500 uppercase">Email</p>
                  <p className="text-gray-800 font-medium">{selectedMessage.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase">Subject</p>
                <p className="text-gray-800 font-medium">{selectedMessage.subject || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase mb-2">Message</p>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed border border-gray-100">
                  {selectedMessage.message}
                </div>
              </div>
              <div className="pt-4 text-xs text-gray-400 italic">
                Received on: {new Date(selectedMessage.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardPage>
  );
}
