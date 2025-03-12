import databaseService from './databaseService';
import { ID, Query } from 'react-native-appwrite';

// Appwrite database and collection id
const dbId = process.env.EXPO_PUBLIC_APPWRITE_DB_ID;
const colId = process.env.EXPO_PUBLIC_APPWRITE_COL_NOTES_ID;

const noteService = {
  // Get Notes
  async getNotes(userId) {
    if (!userId) {
      console.error('Error: User ID missing');
      return { data: [], error: 'User ID is missing' };
    }
  
    console.log('userId is:', userId);  // Log to check userId
  
    try {
      const response = await databaseService.listDocuments(dbId, colId, [
        Query.equal('user_id', userId)
      ]);
      console.log('Fetched notes:', response);
      return response;
    } catch (error) {
      console.error('Error fetching notes:', error.message);
      return { data: [], error: error.message };
    }
  },
  // Add New Note
  async addNote(user_id, text) {
    if (!text) {
      return { error: 'Note text cannot be empty' };
    }

    const data = {
      text: text,
      createdAt: new Date().toISOString(),
      user_id: user_id,
    };

    const response = await databaseService.createDocument(
      dbId,
      colId,
      data,
      ID.unique()
    );

    if (response?.error) {
      return { error: response.error };
    }

    return { data: response };
  },
  // Update Note
  async updateNote(id, text) {
    const response = await databaseService.updateDocument(dbId, colId, id, {
      text,
    });

    if (response?.error) {
      return { error: response.error };
    }

    return { data: response };
  },
  // Delete Note
  async deleteNote(id) {
    const response = await databaseService.deleteDocument(dbId, colId, id);
    if (response?.error) {
      return { error: response.error };
    }

    return { success: true };
  },
};

export default noteService;