import { useState, useEffect, useCallback } from 'react';
import { contactsAPI } from '../services/api';
import { onNewContact, onContactUpdate, onContactDelete, joinAlertsRoom, unsubscribeAll } from '../services/socket';
import { ContactType } from '../components/ContactCard';

export interface Contact {
  id: string;
  name: string;
  number: string;
  type: ContactType;
  role?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch contacts
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await contactsAPI.getAll();
      setContacts(result.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create contact
  const createContact = async (data: {
    name: string;
    number: string;
    type: string;
    role?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await contactsAPI.create(data);
      // Socket will handle the update, but we can also add locally for immediate feedback
      setContacts(prev => [result.data, ...prev]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Update contact
  const updateContact = async (id: string, data: Partial<Omit<Contact, 'role'> & { role?: string }>): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await contactsAPI.update(id, {
        ...data,
        role: data.role ?? undefined,
      });
      setContacts(prev => prev.map(c => c.id === id ? result.data : c));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Delete contact
  const deleteContact = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await contactsAPI.delete(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Initial fetch and socket setup
  useEffect(() => {
    fetchContacts();
    joinAlertsRoom();

    // Real-time listeners
    onNewContact((newContact: any) => {
      setContacts(prev => {
        // Avoid duplicates
        if (prev.some(c => c.id === newContact.id)) {
          return prev;
        }
        return [newContact, ...prev];
      });
    });

    onContactUpdate((updatedContact: any) => {
      setContacts(prev => prev.map(c => c.id === updatedContact.id ? updatedContact : c));
    });

    onContactDelete((data: { id: string }) => {
      setContacts(prev => prev.filter(c => c.id !== data.id));
    });

    return () => {
      unsubscribeAll();
    };
  }, [fetchContacts]);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  };
}
