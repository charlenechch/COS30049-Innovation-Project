import {useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button, ScrollView, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login=({})=> {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUpPress=()=>
    {
        navigation.navigate('VisitorRegister');
    }

    const handleParkGuideSignUpPress=()=>
    {
        navigation.navigate('ParkGuideRegister'); 
    }
    

    const handleSignInPress = async () => {
      try {
        const response = await fetch("http://172.17.26.0:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        });
    
        const result = await response.json();
    
        if (response.ok && result.otpSent) {
          alert("OTP sent to your email. Please check and enter it.");
          navigation.navigate("OtpVerification", {
            username: username,
            role: result.role // optional, in case your backend returns it
          });
        } else {
          alert(result.error || "Login failed");
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Error connecting to server");
      }
    };    

    const handleForgotPassword=()=>
    {
        navigation.navigate('ForgotPassword');
    }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.form}>
        
        <Text style={styles.label}>Username</Text>
        <TextInput
            style = {styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <View style = {styles.registerBtn}>
            <Button
            title="Login"
            color="#2C2C2C"
            onPress={handleSignInPress}
            />
        </View>

        </View>

        <View style={{width:'80%'}}>
            <TouchableOpacity onPress = {handleForgotPassword}>
                <Text style = {styles.forgotPassword}>Forgot Password</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.registerAsParkGuideContainer}>
            <Text style={styles.registerAsParkGuide}>Register as Visitor? </Text>
            <TouchableOpacity onPress={handleSignUpPress}>
                <Text style={{color:'#090D99', fontSize: 16}}> Click here</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.registerAsParkGuideContainer}>
            <Text style={styles.registerAsParkGuide}>Register as Park Guide? </Text>
            <TouchableOpacity onPress={handleParkGuideSignUpPress}>
                <Text style={{color:'#090D99', fontSize: 16}}> Click here</Text>
            </TouchableOpacity>
        </View>


        </View>
    </ScrollView>


    

    
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginLeft: 40, 
    marginTop: 20
  },

  logo: {
    width: 100,
    height: 100,
    marginBottom: 32,
  },

  form: {
    width: '80%',
    borderWidth: 2,
    borderColor: '#DFDFE1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    margin: 20,
  },

  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 20,
    color: '#333',
  },

  input: {
    borderWidth: 2,
    borderColor: '#DFDFE1',
    borderRadius: 8,
    padding: 8,
    width: '100%',
    marginTop: 10,
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },

  registerAsParkGuideContainer:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  
  registerAsParkGuide: {   
    fontSize: 16,
  },

  registerBtn: {
    marginTop: 20,
    width: '100%', 
    borderRadius: 8,
    overflow: 'hidden',
  },

  forgotPassword:{
    color: '#090D99',
    fontSize: 12,
    textAlign: 'right',
  },

});
export default Login;