import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

const NoteItem = ({ note, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(note.text);
    const inputRef = useRef(null);

    const handleSave = () => {
        if (editedText.trim() === '') return;
            onEdit(note.$id, editedText) 
            setIsEditing(false);
    };

    return (
        <View style={styles.noteItem}>
            {isEditing ? (
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={editedText}
                    onChangeText={setEditedText}
                    autoFocus
                    onSubmitEditing={handleSave} // ✅ Fixed typo
                    returnKeyType='done'
                />
            ) : (
                <Text style={styles.noteText}>{note.text}</Text>
            )}

            <View style={styles.actions}>
                {isEditing ? (
                    <TouchableOpacity
                        onPress={() => {
                            handleSave();
                            inputRef.current?.blur();
                        }}
                    >
                        <MaterialIcons name="save" size={24} color="green" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => setIsEditing(true)}>
                        <FontAwesome name="pencil" size={24} color="green" />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={() => {
                        console.log('Delete pressed for note:', note.$id);
                        if (typeof onDelete !== 'function') {
                            console.error('onDelete is not a function:', onDelete);
                        } else {
                            onDelete(note.$id);
                        }
                    }}
                >
                    <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    noteItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 5,
        marginVertical: 5,
        alignItems: 'center',
    },
    noteText: {
        fontSize: 18,
        flex: 1,
    },
    input: {
        fontSize: 18,
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
});

export default NoteItem;
