"use client";
import { useEffect, useState } from "react";
import { api, Subscriber } from "../../lib/api";
import { Mail, Trash2 } from "lucide-react";
import { useFeedback } from "@/components/FeedbackProvider";
import { ErrorState, LoadingState } from "@/components/DashboardState";
import { DashboardPage } from "@/components/DashboardShell";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast, confirm } = useFeedback();

  const fetchSubscribers = async () => {
    setError(null);
    try {
      const data = await api("/communication/newsletter/subscribers");
      const subArray = data.subscribers || data.data || data;
      setSubscribers(Array.isArray(subArray) ? subArray : []);
    } catch (error: unknown) {
      console.error("Failed to fetch subscribers", error);
      setError("Unable to load subscribers right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "Delete Subscriber?",
      description: "Are you sure you want to remove this subscriber?",
      confirmText: "Delete",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api(`/communication/newsletter/subscribers/${id}`, "DELETE");
      setSubscribers((prev) => prev.filter((s) => s._id !== id));
      showToast({ title: "Subscriber removed", variant: "success" });
    } catch {
      showToast({ title: "Failed to delete subscriber", variant: "error" });
    }
  };

  if (loading) return <LoadingState />;
  if (error)
    return (
      <ErrorState title="Error" description={error} onRetry={fetchSubscribers} />
    );
  if (subscribers.length === 0)
    return (
      <DashboardPage>
        <div className="flex flex-col h-[60vh] items-center justify-center space-y-4">
          <Mail size={48} className="text-gray-300" />
          <p className="text-xl font-medium text-gray-500">No subscribers yet</p>
        </div>
      </DashboardPage>
    );

  return (
    <DashboardPage>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Newsletter Subscribers</h1>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Joined</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((subscriber) => (
                <tr key={subscriber._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                    {subscriber.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(subscriber.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(subscriber._id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardPage>
  );
}
