import { Stack } from "expo-router";
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const RootLayout = () => {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#264d00',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
          headerRight: () => <HeaderLogout />, // ✅ Now inside AuthProvider
          contentStyle: {
            paddingHorizontal: 10,
            paddingTop: 10,
            backgroundColor: '#fff',
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="notes" options={{ headerTitle: "Notes" }} />
        <Stack.Screen name="auth" options={{ headerTitle: "Login" }} />
      </Stack>
    </AuthProvider>
  );
};

const HeaderLogout = () => {
  const { user, logout } = useAuth();

  if (!user) return null; // Hide button if no user is logged in

  return (
    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
      <Text style={styles.logoutText}>Log Out</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    marginRight: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'blue',
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RootLayout;
