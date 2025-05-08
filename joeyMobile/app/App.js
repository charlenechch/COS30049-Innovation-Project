import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VisitorRegister from './src/visitorRegister';
import ParkGuideRegister from './src/parkGuideRegister';
import AdminRegister from './src/adminRegister';
import AddAdmin from './src/addAdmin';
import LoginPage from './src/login';
import Homepage from './src/homepage';
import ForgotPassword from './src/forgotPassword';
import Booking from './src/booking';
import OtpVerification from './src/OtpVerification';
import Feedback from './src/feedback';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="AddAdmin">
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="OtpVerification" component={OtpVerification} />
            <Stack.Screen name="VisitorRegister" component={VisitorRegister} />
            <Stack.Screen name="ParkGuideRegister" component={ParkGuideRegister} />
            <Stack.Screen name="AdminRegister" component={AdminRegister} />
            <Stack.Screen name="AddAdmin" component={AddAdmin} />
            <Stack.Screen name="MainApp" component={Homepage} /> 
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="Booking" component={Booking}/>
            <Stack.Screen name="Feedback" component={Feedback}/>
        </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
