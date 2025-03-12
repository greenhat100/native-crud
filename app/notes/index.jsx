import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import NoteList from '@/components/NoteList';
import AddNoteModal from '@/components/AddNoteModal';
import noteService from '@/services/noteService';

const NoteScreen = () => {
    
    const router = useRouter();
    const { user, loading:authLoading } = useAuth();

    const [notes, setNotes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading && !user) {
          router.replace('./auth');
        } else {
          console.log('User object:', user); // Check the user object
          fetchNotes();
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (user && user.$id) {
            fetchNotes();
        }
    }, [user]);

    const fetchNotes = async () => {
        setLoading(true);
        const response = await noteService.getNotes(user.$id);
    
        if (response.error) {
          setError(response.error);
          Alert.alert('Error', response.error);
        } else {
          setNotes(response.data);
          setError(null);
        }
    
        setLoading(false);
      };
    
    const addNote = async () => { 
        if (newNote.trim() === '') return;
        
        const response = await noteService.AddNote(user.$id, newNote)

        if(response.error) {
           Alert.alert('error', response.error)
        } else {
            setNotes([...notes, response.data])
        }

        setNewNote('');
        setModalVisible(false);
    };

    //delete
    const deleteNote = async (id) => {
        // Confirm deletion with a modal
        Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        // Call delete service to remove the note from the database
                        const response = await noteService.deleteNote(id);
                        console.log('Delete response:', response); // Log the response for debugging
    
                        // Check for errors in the response
                        if (response.error) {
                            Alert.alert('Error', response.error);
                            console.error('Error deleting note:', response.error); // Log error details
                        } else {
                            // Successfully deleted, update the state
                            setNotes((prevNotes) => prevNotes.filter((note) => note.$id !== id));
                            Alert.alert('Success', 'Note deleted successfully');
                            console.log('Note deleted:', id); // Log successful deletion
                        }
                    } catch (error) {
                        // Catch any unexpected errors
                        console.error('Unexpected error during deletion:', error.message);
                        Alert.alert('Error', 'Failed to delete the note');
                    }
                },
            },
        ]);
    };
    
    const editNote = async (id, newText) => {
        if (!newText.trim()) {
            Alert.alert('Error', 'Text is empty');
            return;
        }
    
        try {
            const response = await noteService.updateDocument(id, newText);
    
            if (response.error) {
                Alert.alert('Error', response.error);
            } else {
                setNotes((prevNotes) => 
                    prevNotes.map((note) => 
                        note.$id === id ? { ...note, text: response.data.text } : note
                    )
                );
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update note');
            console.error(error);
        }
    };
    
    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <> 
                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <NoteList notes={notes} onDelete={deleteNote} onEdit={editNote} />    
                </>
            )}
                    <TouchableOpacity 
                        style={styles.addButton} 
                        onPress={() => setModalVisible(true)}
                        disabled={loading}
                    >
                        <Text style={styles.addButtonText}>+ Add Note</Text>
                    </TouchableOpacity>
                    {/* Modal */}
                    <AddNoteModal 
                        modalVisible={modalVisible} 
                        setModalVisible={setModalVisible} 
                        addNote={addNote} 
                        newNote={newNote} 
                        setNewNote={setNewNote} 
                    />
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        backgroundColor: '#000',
        opacity: 0.8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 15,
    },
});

export default NoteScreen;
