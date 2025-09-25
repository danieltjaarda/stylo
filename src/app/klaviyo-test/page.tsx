'use client';

import { useState } from 'react';

interface KlaviyoList {
  id: string;
  name: string;
  created: string;
  updated: string;
}

export default function KlaviyoTestPage() {
  const [lists, setLists] = useState<KlaviyoList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [selectedListId, setSelectedListId] = useState('');
  const [signupResult, setSignupResult] = useState<any>(null);
  const [debugResult, setDebugResult] = useState<any>(null);

  const fetchLists = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/klaviyo/lists');
      const data = await response.json();
      
      if (data.success) {
        setLists(data.lists);
        if (data.lists.length > 0) {
          setSelectedListId(data.lists[0].id);
        }
      } else {
        setError(data.error || 'Failed to fetch lists');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    if (!testEmail) {
      setError('Please enter a test email');
      return;
    }

    setLoading(true);
    setError(null);
    setSignupResult(null);

    try {
      const response = await fetch('/api/klaviyo/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          newsletterListId: selectedListId,
          properties: {
            test_signup: true,
            source: 'klaviyo_test_page'
          }
        }),
      });

      const data = await response.json();
      setSignupResult(data);
      
      if (!data.success) {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const runDebug = async () => {
    setLoading(true);
    setError(null);
    setDebugResult(null);

    try {
      const response = await fetch('/api/klaviyo/debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail
        }),
      });

      const data = await response.json();
      setDebugResult(data);
      
      if (!data.success) {
        setError(data.error || 'Debug failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🔧 Klaviyo API Test
          </h1>

          {/* API Key Status */}
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              API Key Status
            </h2>
            <p className="text-blue-700">
              API Key: <code className="bg-blue-100 px-2 py-1 rounded">pk_0b21...3428</code> ✅
            </p>
          </div>

          {/* Fetch Lists */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. Test API Connection & Fetch Lists
            </h2>
            <button
              onClick={fetchLists}
              disabled={loading}
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch Klaviyo Lists'}
            </button>

            {lists.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">
                  Found {lists.length} list(s):
                </h3>
                <div className="space-y-2">
                  {lists.map((list) => (
                    <div key={list.id} className="p-3 bg-white border rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <strong className="text-gray-900">{list.name}</strong>
                          <div className="text-sm text-gray-600 mt-1">
                            ID: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{list.id}</code>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedListId(list.id)}
                          className={`px-3 py-1 text-xs rounded ${
                            selectedListId === list.id 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {selectedListId === list.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Debug Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🐛 Debug API Issues
            </h2>
            <button
              onClick={runDebug}
              disabled={loading}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Running Debug...' : 'Run Debug Tests'}
            </button>

            {debugResult && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Debug Results:</h3>
                <pre className="text-xs overflow-auto max-h-96">
                  {JSON.stringify(debugResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Test Signup */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. Test Newsletter Signup
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Email:
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="test@example.com"
                />
              </div>
              
              {selectedListId && (
                <div className="text-sm text-gray-600">
                  Will subscribe to list: <code className="bg-gray-100 px-1 py-0.5 rounded">{selectedListId}</code>
                </div>
              )}

              <button
                onClick={testSignup}
                disabled={loading || !selectedListId}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Test Signup'}
              </button>
            </div>

            {signupResult && (
              <div className={`mt-4 p-4 border rounded-lg ${
                signupResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <h3 className={`font-semibold mb-2 ${
                  signupResult.success ? 'text-green-900' : 'text-red-900'
                }`}>
                  Signup Result:
                </h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(signupResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="font-semibold text-red-900 mb-2">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">
              📋 Next Steps:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-yellow-800">
              <li>Click "Fetch Klaviyo Lists" to see your available lists</li>
              <li>Select the list you want to use for newsletter signups</li>
              <li>Copy the List ID and add it to your .env.local file</li>
              <li>Test the signup to make sure everything works</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
