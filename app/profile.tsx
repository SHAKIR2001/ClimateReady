// app/profile.tsx
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profile</Text>
      {user ? (
        <>
          <Text>Email: {user.email}</Text>
          <Text>User ID: {user.uid}</Text>
        </>
      ) : (
        <Text>No user logged in</Text>
      )}
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
});
