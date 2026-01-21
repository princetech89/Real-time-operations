import React, { useEffect, useState } from 'react';
import { useApp } from '../store/AppContext';
import { IncidentStatus, IncidentComment } from '../types';
import { getIncidentResolutionSuggestion } from '../services/geminiService';
import { api } from '../services/api';

import {
  ShieldAlert,
  MessageSquare,
  History,
  CheckCircle2,
  Play,
  Send,
  Loader2,
  Sparkles,
  Zap,
  ArrowLeft
} from 'lucide-react';

export const IncidentDetail: React.FC<{ id: string }> = ({ id }) => {
  const {
    incidents,
    updateIncidentStatus,
    addComment,
    currentUser
  } = useApp();

  const incident = incidents.find((i) => i.id === id);

  const [newComment, setNewComment] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [comments, setComments] = useState<IncidentComment[]>([]);

  /* ---------------- LOAD COMMENTS FROM DB ---------------- */
  useEffect(() => {
    if (!incident) return;

    setLoadingComments(true);
    api
      .getCommentsByIncident(incident.id)
      .then((rows) => {
        setComments(
          rows.map((c: any) => ({
            id: c.id,
            userId: c.user_id,
            userName: c.user_name,
            content: c.content,
            createdAt: c.created_at
          }))
        );
      })
      .finally(() => setLoadingComments(false));
  }, [incident]);

  /* ---------------- NOT FOUND ---------------- */
  if (!incident) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
        <h2 className="text-2xl font-bold">Tactical Data Unavailable</h2>
        <p className="text-slate-400 mb-8">
          The requested incident ID does not exist in the active records.
        </p>
        <a
          href="#/incidents"
          className="flex items-center px-6 py-3 bg-slate-800 rounded-xl font-bold text-sm"
        >
          <ArrowLeft size={18} className="mr-2" />
          Return to Feed
        </a>
      </div>
    );
  }

  /* ---------------- HANDLERS ---------------- */
  const handleStatusChange = async (status: IncidentStatus) => {
    await updateIncidentStatus(incident.id, status);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUser) return;

    await addComment(incident.id, newComment);

    setComments((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        content: newComment,
        createdAt: new Date().toISOString()
      }
    ]);

    setNewComment('');
  };

  const generateAiHelp = async () => {
    setLoadingAi(true);
    try {
      const suggestion = await getIncidentResolutionSuggestion(incident);
      setAiSuggestion(suggestion);
    } finally {
      setLoadingAi(false);
    }
  };

  /* ---------------- STATUS UI ---------------- */
  const STATUS_CONFIG: Record<
    IncidentStatus,
    { color: string; bg: string }
  > = {
    OPEN: { color: 'text-red-500', bg: 'bg-red-500/10' },
    INVESTIGATING: { color: 'text-orange-500', bg: 'bg-orange-500/10' },
    RESOLVED: { color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    CLOSED: { color: 'text-slate-500', bg: 'bg-slate-500/10' }
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <div className="flex items-center mb-4">
        <a href="#/incidents" className="p-2 -ml-2 text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </a>
        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-2">
          Back to Incident Feed
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          {/* DETAILS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl">
            <div
              className={`px-6 py-2 ${STATUS_CONFIG[incident.status].bg} border-b border-slate-800/50 flex justify-between`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-widest ${STATUS_CONFIG[incident.status].color}`}>
                Mission Status: {incident.status}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Incident #{incident.id}
              </span>
            </div>

            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4">{incident.title}</h1>
              <p className="text-slate-300 whitespace-pre-wrap">
                {incident.description}
              </p>
            </div>
          </div>

          {/* AI */}
          <div className="bg-slate-900 border border-blue-500/20 rounded-2xl p-6">
            <div className="flex justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="text-blue-400" size={20} />
                <h3 className="font-bold">Sentinel AI Advisor</h3>
              </div>
              {!aiSuggestion && (
                <button
                  onClick={generateAiHelp}
                  disabled={loadingAi}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center"
                >
                  {loadingAi ? (
                    <Loader2 size={16} className="animate-spin mr-2" />
                  ) : (
                    <Zap size={16} className="mr-2" />
                  )}
                  Run Diagnostics
                </button>
              )}
            </div>

            {aiSuggestion && (
              <div className="bg-slate-950 p-4 rounded-xl text-sm text-slate-300">
                {aiSuggestion}
              </div>
            )}
          </div>

          {/* COMMENTS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <MessageSquare size={18} className="mr-2" />
              Tactical Comm Channel
            </h3>

            {loadingComments ? (
              <p className="text-slate-500 text-sm">Loading comments…</p>
            ) : comments.length === 0 ? (
              <p className="text-slate-500 text-sm italic">
                No comms reported yet.
              </p>
            ) : (
              <div className="space-y-3 mb-4">
                {comments.map((c) => (
                  <div key={c.id} className="text-sm text-slate-300">
                    <b>{c.userName}</b>: {c.content}
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddComment} className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Broadcast a tactical update..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="absolute right-3 bottom-3 bg-blue-600 text-white px-3 py-2 rounded-lg"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-6">
          <h3 className="font-bold mb-4 flex items-center">
            <History size={18} className="mr-2" />
            Tactical Actions
          </h3>

          {[
            { status: IncidentStatus.INVESTIGATING, label: 'Start Investigating', icon: Play },
            { status: IncidentStatus.RESOLVED, label: 'Mark Resolved', icon: CheckCircle2 },
            { status: IncidentStatus.CLOSED, label: 'Close Incident', icon: History }
          ].map((a) => (
            <button
              key={a.status}
              disabled={incident.status === a.status}
              onClick={() => handleStatusChange(a.status)}
              className="w-full mb-2 px-4 py-3 bg-slate-800 rounded-xl text-left"
            >
              <a.icon size={16} className="inline mr-2" />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
