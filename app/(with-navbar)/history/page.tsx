"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function HistoryPage() {
  const { getHistoryOfUser } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getHistoryOfUser();
        setHistory(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafdef] pt-20 px-4 sm:px-6 pb-10">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Meeting History
        </h1>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500 text-center">Loading history...</p>
        )}

        {/* EMPTY */}
        {!loading && history.length === 0 && (
          <p className="text-gray-600 text-center">
            No meetings yet 🚀
          </p>
        )}

        {/* HISTORY LIST */}
        <div className="grid gap-4">
          {history.map((item, index) => (
            <Card
              key={index}
              className="shadow-sm hover:shadow-md transition bg-[#1e3b4b]/60"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  Meeting Code:- {item.meeting_code}
                </CardTitle>
                <Badge variant="outline">Meeting</Badge>
              </CardHeader>

              <CardContent className="flex items-center gap-2 text-sm text-white">
                <Calendar size={16} />
                {new Date(item.date).toLocaleString()}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      
    </div>
  );
}
