import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import {
  User,
  Incident,
  AuditLog,
  UserRole,
  IncidentStatus,
  IncidentPriority,
  SystemStats,
  IncidentComment
} from '../types';

import { api } from '@/services/api';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  incidents: Incident[];
  addIncident: (
    incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>
  ) => Promise<void>;
  updateIncidentStatus: (id: string, status: IncidentStatus) => Promise<void>;
  addComment: (incidentId: string, content: string) => Promise<void>;

  auditLogs: AuditLog[];

  users: User[];
  updateUserRole: (id: string, role: UserRole) => void;
  toggleUserStatus: (id: string) => void;

  stats: SystemStats;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  /* ---------------- AUTH ---------------- */
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sentinel_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Failed to parse user from local storage", e);
      localStorage.removeItem('sentinel_user');
      return null;
    }
  });

  /* ---------------- DATA ---------------- */
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  /* ---------------- PERSIST LOGIN ---------------- */
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sentinel_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('sentinel_user');
    }
  }, [currentUser]);

  /* ---------------- LOAD INCIDENTS FROM DB ---------------- */
  useEffect(() => {
    api.getIncidents().then((rows) => {
      setIncidents(
        rows.map((i: any) => ({
          ...i,
          createdAt: i.created_at,
          updatedAt: i.updated_at,
          comments: []
        }))
      );
    }).catch(e => console.error("Failed to load incidents", e));
  }, []);

  /* ---------------- LOAD AUDIT LOGS FROM DB ---------------- */
  useEffect(() => {
    api.getAuditLogs().then((rows) => {
      setAuditLogs(
        rows.map((l: any) => ({
          id: l.id,
          userId: l.user_id,
          userName: l.user_name,
          action: l.action,
          entityId: l.entity_id,
          entityType: l.entity_type,
          details: l.details,
          timestamp: l.created_at
        }))
      );
    }).catch(e => console.error("Failed to load audit logs", e));
  }, []);

  /* ---------------- LOAD USERS (ADMIN ONLY) ---------------- */
  useEffect(() => {
    if (currentUser?.role === UserRole.ADMIN) {
      api.getUsers().then(setUsers).catch(console.error);
    }
  }, [currentUser]);

  /* ---------------- AUDIT LOG (PERSISTED) ---------------- */
  const addLog = useCallback(
    async (
      action: string,
      entityId: string,
      entityType: 'INCIDENT' | 'USER' | 'AUTH',
      details: string
    ) => {
      if (!currentUser) return;

      await api.createAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        action,
        entityId,
        entityType,
        details
      });

      // optimistic UI update
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          userId: currentUser.id,
          userName: currentUser.name,
          action,
          entityId,
          entityType,
          details,
          timestamp: new Date().toISOString()
        },
        ...prev
      ]);
    },
    [currentUser]
  );

  /* ---------------- INCIDENT ACTIONS ---------------- */

  const addIncident = async (
    data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>
  ) => {
    if (!currentUser) return;

    const res = await api.createIncident({
      ...data,
      createdBy: currentUser.id,
      creatorName: currentUser.name
    });

    const newIncident: Incident = {
      ...data,
      id: res.id,
      status: IncidentStatus.OPEN,
      createdBy: currentUser.id,
      creatorName: currentUser.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };

    setIncidents((prev) => [newIncident, ...prev]);
    await addLog('CREATE', newIncident.id, 'INCIDENT', `Created: ${newIncident.title}`);
  };

  /* ✅ STATUS → DB */
  const updateIncidentStatus = async (
    id: string,
    status: IncidentStatus
  ) => {
    await api.updateIncidentStatus(id, status);

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? { ...inc, status, updatedAt: new Date().toISOString() }
          : inc
      )
    );

    await addLog('UPDATE_STATUS', id, 'INCIDENT', `Status changed to ${status}`);
  };

  /* ✅ COMMENTS → DB */
  const addComment = async (incidentId: string, content: string) => {
    if (!currentUser) return;

    const res = await api.addComment({
      incidentId,
      userId: currentUser.id,
      userName: currentUser.name,
      content
    });

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? {
            ...inc,
            comments: [
              ...inc.comments,
              {
                id: res.id,
                userId: currentUser.id,
                userName: currentUser.name,
                content,
                createdAt: res.created_at
              } as IncidentComment
            ],
            updatedAt: new Date().toISOString()
          }
          : inc
      )
    );

    await addLog('ADD_COMMENT', incidentId, 'INCIDENT', 'New comment added');
  };

  /* ---------------- USER ACTIONS (UI + API) ---------------- */
  const updateUserRole = async (id: string, role: UserRole) => {
    try {
      await api.updateUserRole(id, role);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, role } : u
        )
      );
      await addLog('UPDATE_ROLE', id, 'USER', `Changed role to ${role}`);
    } catch (error) {
      console.error("Failed to update user role", error);
    }
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, enabled: !u.enabled } : u
      )
    );
  };

  /* ---------------- LOGOUT ---------------- */
  const logout = async () => {
    if (currentUser) {
      await addLog('LOGOUT', currentUser.id, 'AUTH', 'User logged out');
    }
    setCurrentUser(null);
  };

  /* ---------------- STATS ---------------- */
  const stats: SystemStats = {
    total: incidents.length,
    open: incidents.filter((i) => i.status === IncidentStatus.OPEN).length,
    investigating: incidents.filter((i) => i.status === IncidentStatus.INVESTIGATING).length,
    resolved: incidents.filter((i) => i.status === IncidentStatus.RESOLVED).length,
    critical: incidents.filter((i) => i.priority === IncidentPriority.CRITICAL).length
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        incidents,
        addIncident,
        updateIncidentStatus,
        addComment,
        auditLogs,
        users,
        updateUserRole,
        toggleUserStatus,
        stats,
        logout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
