import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OtpVerification = ({ route, navigation }) => {
  const { username, role } = route.params;
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    try {
      console.log("📨 Sending OTP verification:", { username, otp });
  
      const response = await fetch("http://192.168.1.18:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, otp })
      });
  
      const result = await response.json();
      console.log("📦 Server response:", result);
  
      if (response.ok && result.success) {
        await AsyncStorage.setItem("token", result.token);
        alert("✅ OTP verified! Login successful.");
        navigation.navigate("MainApp");
      } else {
        alert("❌ " + (result.error || "Invalid OTP"));
      }
  
    } catch (error) {
      console.error("❌ OTP verification error:", error);
      alert("Failed to verify OTP: " + error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter OTP sent to your email</Text>
      <TextInput
        style={styles.input}
        placeholder="OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />
      <Button title="Verify OTP" onPress={handleVerify} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, justifyContent: 'center'
  },
  label: {
    fontSize: 16, marginBottom: 10
  },
  input: {
    borderWidth: 1, padding: 10, marginBottom: 20
  }
});

export default OtpVerification;
