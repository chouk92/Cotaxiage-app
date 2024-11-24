import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { checkSystemHealth } from '../../utils/health-check';

export default function SystemStatus() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const status = await checkSystemHealth();
        setHealth(status);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 300000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">System Status</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(health).map(([system, data]: [string, any]) => (
          <div key={system} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium capitalize">{system}</h3>
              {getStatusIcon(data.status)}
            </div>
            <p className="text-gray-600 mb-2">{data.message}</p>
            <p className="text-sm text-gray-500">
              Last checked: {new Date(data.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}