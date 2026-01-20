/**
 * Storage Service - localStorage utilities for DMS
 */

const STORAGE_KEYS = {
  MEMBERS: 'dms_members',
  DOCUMENTS: 'dms_documents',
  FIELDS: 'dms_fields',
  SCAN_QUEUE: 'dms_scan_queue',
  USER: 'dms_user',
  AUTH_TOKEN: 'dms_auth_token',
  SETTINGS: 'dms_settings',
};

/**
 * Generic storage operations
 */
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return null;
    }
  },

  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
      return false;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
      return false;
    }
  },

  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage', error);
      return false;
    }
  },
};

/**
 * Members storage operations
 */
export const membersStorage = {
  getAll: () => storage.get(STORAGE_KEYS.MEMBERS) || [],

  save: (members) => storage.set(STORAGE_KEYS.MEMBERS, members),

  getById: (id) => {
    const members = membersStorage.getAll();
    return members.find((m) => m.id === id) || null;
  },

  add: (member) => {
    const members = membersStorage.getAll();
    const newMember = {
      ...member,
      id: member.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    members.push(newMember);
    membersStorage.save(members);
    return newMember;
  },

  update: (id, updates) => {
    const members = membersStorage.getAll();
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) return null;

    members[index] = {
      ...members[index],
      ...updates,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };
    membersStorage.save(members);
    return members[index];
  },

  delete: (id) => {
    const members = membersStorage.getAll();
    const filtered = members.filter((m) => m.id !== id);
    membersStorage.save(filtered);
    return filtered.length < members.length;
  },
};

/**
 * Documents storage operations
 */
export const documentsStorage = {
  getAll: () => storage.get(STORAGE_KEYS.DOCUMENTS) || [],

  save: (documents) => storage.set(STORAGE_KEYS.DOCUMENTS, documents),

  getById: (id) => {
    const documents = documentsStorage.getAll();
    return documents.find((d) => d.id === id) || null;
  },

  getByStatus: (status) => {
    const documents = documentsStorage.getAll();
    return documents.filter((d) => d.status === status);
  },

  add: (document) => {
    const documents = documentsStorage.getAll();
    const newDoc = {
      ...document,
      id: document.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    documents.push(newDoc);
    documentsStorage.save(documents);
    return newDoc;
  },

  update: (id, updates) => {
    const documents = documentsStorage.getAll();
    const index = documents.findIndex((d) => d.id === id);
    if (index === -1) return null;

    documents[index] = {
      ...documents[index],
      ...updates,
      id,
      updatedAt: new Date().toISOString(),
    };
    documentsStorage.save(documents);
    return documents[index];
  },

  delete: (id) => {
    const documents = documentsStorage.getAll();
    const filtered = documents.filter((d) => d.id !== id);
    documentsStorage.save(filtered);
    return filtered.length < documents.length;
  },
};

/**
 * Fields storage operations (for custom field definitions)
 */
export const fieldsStorage = {
  getAll: () => storage.get(STORAGE_KEYS.FIELDS) || [],

  save: (fields) => storage.set(STORAGE_KEYS.FIELDS, fields),

  add: (field) => {
    const fields = fieldsStorage.getAll();
    const newField = {
      ...field,
      id: field.id || Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    fields.push(newField);
    fieldsStorage.save(fields);
    return newField;
  },

  update: (id, updates) => {
    const fields = fieldsStorage.getAll();
    const index = fields.findIndex((f) => f.id === id);
    if (index === -1) return null;

    fields[index] = { ...fields[index], ...updates, id };
    fieldsStorage.save(fields);
    return fields[index];
  },

  delete: (id) => {
    const fields = fieldsStorage.getAll();
    const filtered = fields.filter((f) => f.id !== id);
    fieldsStorage.save(filtered);
    return filtered.length < fields.length;
  },
};

/**
 * Scan Queue storage operations
 */
export const scanQueueStorage = {
  getAll: () => storage.get(STORAGE_KEYS.SCAN_QUEUE) || [],

  save: (queue) => storage.set(STORAGE_KEYS.SCAN_QUEUE, queue),

  add: (item) => {
    const queue = scanQueueStorage.getAll();
    const newItem = {
      ...item,
      id: item.id || Date.now().toString(),
      status: item.status || 'pending',
      createdAt: new Date().toISOString(),
    };
    queue.push(newItem);
    scanQueueStorage.save(queue);
    return newItem;
  },

  updateStatus: (id, status, notes = '') => {
    const queue = scanQueueStorage.getAll();
    const index = queue.findIndex((item) => item.id === id);
    if (index === -1) return null;

    queue[index] = {
      ...queue[index],
      status,
      notes: notes || queue[index].notes,
      updatedAt: new Date().toISOString(),
    };
    scanQueueStorage.save(queue);
    return queue[index];
  },

  delete: (id) => {
    const queue = scanQueueStorage.getAll();
    const filtered = queue.filter((item) => item.id !== id);
    scanQueueStorage.save(filtered);
    return filtered.length < queue.length;
  },
};

/**
 * Auth storage operations
 */
export const authStorage = {
  getUser: () => storage.get(STORAGE_KEYS.USER),

  setUser: (user) => storage.set(STORAGE_KEYS.USER, user),

  getToken: () => storage.get(STORAGE_KEYS.AUTH_TOKEN),

  setToken: (token) => storage.set(STORAGE_KEYS.AUTH_TOKEN, token),

  clear: () => {
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  },

  isAuthenticated: () => {
    const user = authStorage.getUser();
    const token = authStorage.getToken();
    return !!(user && token);
  },
};

/**
 * Settings storage operations
 */
export const settingsStorage = {
  get: () => storage.get(STORAGE_KEYS.SETTINGS) || {},

  set: (settings) => storage.set(STORAGE_KEYS.SETTINGS, settings),

  update: (key, value) => {
    const settings = settingsStorage.get();
    settings[key] = value;
    settingsStorage.set(settings);
    return settings;
  },
};

/**
 * Check if data has been seeded
 */
export const isDataSeeded = () => {
  return storage.get('dms_seeded') === true;
};

/**
 * Mark data as seeded
 */
export const markAsSeeded = () => {
  storage.set('dms_seeded', true);
};

export { STORAGE_KEYS, storage };
