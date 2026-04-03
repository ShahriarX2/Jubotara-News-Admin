"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { api, News, Category, User } from "../../lib/api";
import { useRouter } from "next/navigation";
import { BarChart3, TrendingUp, PieChart, Users, Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [newsData, usersData] = await Promise.all([
          api("/news?limit=100"), // Get more items for better analytics
          api("/users").catch(() => ({ data: [] })) // Optional users fetch
        ]);
        
        setNews(newsData.news || newsData.data || newsData || []);
        setUsers(usersData.users || usersData.data || usersData || []);
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Calculate distributions
  const categoryStats = news.reduce((acc: Record<string, number>, curr) => {
    const catName = typeof curr.category === "object" ? curr.category.name : (curr.category || "Uncategorized");
    acc[catName] = (acc[catName] || 0) + 1;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);
  const maxCategoryCount = Math.max(...Object.values(categoryStats), 1);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const newsByDay = news.reduce((acc: Record<string, number>, curr) => {
    const day = new Date(curr.createdAt).toISOString().split('T')[0];
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const dayStats = last7Days.map(day => ({
    day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }),
    count: newsByDay[day] || 0
  }));
  const maxDayCount = Math.max(...dayStats.map(d => d.count), 1);

  if (loading) {
    return (
      <div className="flex bg-gray-50 min-h-screen text-gray-900">
        <Sidebar />
        <main className="ml-64 p-8 w-full flex justify-center items-center">
          <Loader2 className="animate-spin text-blue-600" size={48} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-900">
      <Sidebar />

      <main className="ml-64 p-8 w-full">
        <div className="flex items-center space-x-3 mb-8">
          <BarChart3 className="text-blue-600" size={32} />
          <h1 className="text-3xl font-bold text-gray-800">Analytics Overview</h1>
        </div>

        {/* Top level stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<TrendingUp size={20}/>} label="Total Posts" value={news.length} color="blue" />
          <StatCard icon={<Users size={20}/>} label="Team Members" value={users.length} color="purple" />
          <StatCard icon={<PieChart size={20}/>} label="Categories" value={sortedCategories.length} color="green" />
          <StatCard icon={<BarChart3 size={20}/>} label="Avg Posts/Day" value={(news.length / 30).toFixed(1)} color="orange" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Posts by Category</h3>
            <div className="space-y-4">
              {sortedCategories.slice(0, 6).map(([name, count]) => (
                <div key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{name}</span>
                    <span className="text-gray-500">{count} posts</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" 
                      style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Activity (Last 7 Days)</h3>
            <div className="flex items-end justify-between h-48 pt-4">
              {dayStats.map((d, i) => (
                <div key={i} className="flex flex-col items-center group flex-1">
                  <div className="relative w-full flex justify-center items-end h-32 px-2">
                    <div 
                      className="bg-blue-500 w-full rounded-t hover:bg-blue-600 transition-all duration-500 cursor-pointer"
                      style={{ height: `${(d.count / maxDayCount) * 100}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        {d.count}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2 font-medium">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600"
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
    </div>
  );
}
