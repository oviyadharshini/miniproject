import { useEffect, useState } from 'react';
import { History, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { DiagnosisHistory as DiagnosisHistoryType } from '../types/diagnosis';

function getSessionId(): string {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

export function DiagnosisHistory() {
  const [history, setHistory] = useState<DiagnosisHistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const sessionId = getSessionId();
      const { data, error } = await supabase
        .from('diagnosis_history')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Recent Diagnoses</h3>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900">{item.disease}</h4>
              <span className="text-sm font-medium text-blue-600">
                {item.confidence}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {item.symptoms}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(item.created_at)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { getSessionId };
