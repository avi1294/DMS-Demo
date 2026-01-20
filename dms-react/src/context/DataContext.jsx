import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  membersStorage,
  documentsStorage,
  fieldsStorage,
  scanQueueStorage,
  isDataSeeded,
  markAsSeeded,
} from '../services/storageService';
import {
  seedMembers,
  seedDocuments,
  seedFields,
  seedScanQueue,
} from '../data/seedData';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [fields, setFields] = useState([]);
  const [scanQueue, setScanQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = () => {
    setLoading(true);

    // Check if data has been seeded
    if (!isDataSeeded()) {
      // Seed initial data
      membersStorage.save(seedMembers);
      documentsStorage.save(seedDocuments);
      fieldsStorage.save(seedFields);
      scanQueueStorage.save(seedScanQueue);
      markAsSeeded();
    }

    // Load data from storage
    setMembers(membersStorage.getAll());
    setDocuments(documentsStorage.getAll());
    setFields(fieldsStorage.getAll());
    setScanQueue(scanQueueStorage.getAll());

    setLoading(false);
  };

  // Reset to seed data
  const resetData = useCallback(() => {
    membersStorage.save(seedMembers);
    documentsStorage.save(seedDocuments);
    fieldsStorage.save(seedFields);
    scanQueueStorage.save(seedScanQueue);

    setMembers(seedMembers);
    setDocuments(seedDocuments);
    setFields(seedFields);
    setScanQueue(seedScanQueue);
  }, []);

  // ============== MEMBERS CRUD ==============
  const addMember = useCallback((memberData) => {
    const newMember = membersStorage.add(memberData);
    setMembers((prev) => [...prev, newMember]);
    return newMember;
  }, []);

  const updateMember = useCallback((id, updates) => {
    const updatedMember = membersStorage.update(id, updates);
    if (updatedMember) {
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? updatedMember : m))
      );
    }
    return updatedMember;
  }, []);

  const deleteMember = useCallback((id) => {
    const success = membersStorage.delete(id);
    if (success) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
    return success;
  }, []);

  const getMemberById = useCallback((id) => {
    return members.find((m) => m.id === id) || null;
  }, [members]);

  // ============== DOCUMENTS CRUD ==============
  const addDocument = useCallback((docData) => {
    const newDoc = documentsStorage.add({
      ...docData,
      status: docData.status || 'pending',
    });
    setDocuments((prev) => [...prev, newDoc]);
    return newDoc;
  }, []);

  const updateDocument = useCallback((id, updates) => {
    const updatedDoc = documentsStorage.update(id, updates);
    if (updatedDoc) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? updatedDoc : d))
      );
    }
    return updatedDoc;
  }, []);

  const deleteDocument = useCallback((id) => {
    const success = documentsStorage.delete(id);
    if (success) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
    return success;
  }, []);

  const getDocumentById = useCallback((id) => {
    return documents.find((d) => d.id === id) || null;
  }, [documents]);

  const getDocumentsByStatus = useCallback((status) => {
    return documents.filter((d) => d.status === status);
  }, [documents]);

  const verifyDocument = useCallback((id, verifiedBy) => {
    return updateDocument(id, {
      status: 'verified',
      verifiedAt: new Date().toISOString(),
      verifiedBy,
    });
  }, [updateDocument]);

  const rejectDocument = useCallback((id, reason) => {
    return updateDocument(id, {
      status: 'rejected',
      rejectionReason: reason,
      rejectedAt: new Date().toISOString(),
    });
  }, [updateDocument]);

  const holdDocument = useCallback((id, reason) => {
    return updateDocument(id, {
      status: 'hold',
      holdReason: reason,
    });
  }, [updateDocument]);

  // ============== FIELDS CRUD ==============
  const addField = useCallback((fieldData) => {
    const newField = fieldsStorage.add(fieldData);
    setFields((prev) => [...prev, newField]);
    return newField;
  }, []);

  const updateField = useCallback((id, updates) => {
    const updatedField = fieldsStorage.update(id, updates);
    if (updatedField) {
      setFields((prev) =>
        prev.map((f) => (f.id === id ? updatedField : f))
      );
    }
    return updatedField;
  }, []);

  const deleteField = useCallback((id) => {
    const success = fieldsStorage.delete(id);
    if (success) {
      setFields((prev) => prev.filter((f) => f.id !== id));
    }
    return success;
  }, []);

  // ============== SCAN QUEUE CRUD ==============
  const addToScanQueue = useCallback((itemData) => {
    const newItem = scanQueueStorage.add(itemData);
    setScanQueue((prev) => [...prev, newItem]);
    return newItem;
  }, []);

  const updateScanStatus = useCallback((id, status, notes = '') => {
    const updatedItem = scanQueueStorage.updateStatus(id, status, notes);
    if (updatedItem) {
      setScanQueue((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
    }
    return updatedItem;
  }, []);

  const deleteScanItem = useCallback((id) => {
    const success = scanQueueStorage.delete(id);
    if (success) {
      setScanQueue((prev) => prev.filter((item) => item.id !== id));
    }
    return success;
  }, []);

  // ============== STATISTICS ==============
  const getStats = useCallback(() => {
    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === 'active').length;
    const totalDocuments = documents.length;
    const pendingDocuments = documents.filter((d) => d.status === 'pending').length;
    const verifiedDocuments = documents.filter((d) => d.status === 'verified').length;
    const rejectedDocuments = documents.filter((d) => d.status === 'rejected').length;
    const holdDocuments = documents.filter((d) => d.status === 'hold').length;
    const pendingScans = scanQueue.filter((s) => s.status === 'pending').length;
    const completedScans = scanQueue.filter((s) => s.status === 'completed').length;

    return {
      totalMembers,
      activeMembers,
      totalDocuments,
      pendingDocuments,
      verifiedDocuments,
      rejectedDocuments,
      holdDocuments,
      pendingScans,
      completedScans,
      totalScans: scanQueue.length,
    };
  }, [members, documents, scanQueue]);

  const value = {
    // State
    members,
    documents,
    fields,
    scanQueue,
    loading,

    // Members
    addMember,
    updateMember,
    deleteMember,
    getMemberById,

    // Documents
    addDocument,
    updateDocument,
    deleteDocument,
    getDocumentById,
    getDocumentsByStatus,
    verifyDocument,
    rejectDocument,
    holdDocument,

    // Fields
    addField,
    updateField,
    deleteField,

    // Scan Queue
    addToScanQueue,
    updateScanStatus,
    deleteScanItem,

    // Stats & Utils
    getStats,
    resetData,
    refreshData: initializeData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export default DataContext;
