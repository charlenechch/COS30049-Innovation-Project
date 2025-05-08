import {useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button, ScrollView, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForgotPassword=({})=> {
    const[username, setUsername]=useState('');
    const[password, setPassword]=useState('');
    const[repeatPassword, setRepeatPassword]=useState('');
    const[errors, setErrors]=useState({});

    const navigation = useNavigation();

    const handleSignUpPress=()=>
    {
        navigation.navigate('VisitorRegister');
    }

    const handleParkGuideSignUpPress=()=>
    {
        navigation.navigate('ParkGuideRegister');
    }
    

    const handleResetPress=()=>
    {
        navigation.navigate('Login');
    }

    const validateForm=()=>
    {
      let errors={};
    
      if(!username)
      {
        errors.username = "Please enter your username";
      }
    
      if(!password)
      {
        errors.password = "Please enter your password";
      }
      else
      {
        const reg=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    
        if(!reg.test(password))
        {
          errors.password="Password must contain at least 8 characters long and include an uppercase, a lowercase, and a digit.";
        }
      }
    
      if(!repeatPassword)
        {
          errors.repeatPassword = "Please repeat your password";
        }
        else
        {
          if(password!=repeatPassword)
          {
            errors.repeatPassword="Please enter the correct password";
          }
        }
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
          resetPassword(); // 👈 THIS is what triggers the request
        }
    }

    const resetPassword = async () => {
      try {
        const response = await fetch("http://192.168.154.1:5000/api/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            newPassword: password
          })
        });
    
        const result = await response.json();
    
        if (response.ok) {
          alert("Password reset successful!");
          navigation.navigate("Login");
        } else {
          alert(result.error || "Reset failed.");
        }
      } catch (error) {
        console.error("Reset error:", error);
        alert("Error connecting to server.");
      }
    };
    

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
        <Text style={styles.title}>Forgot Password</Text>
        <View style={styles.form}>
        
        <Text style={styles.label}>Username</Text>
        <TextInput
            style = {styles.input}
            placeholder='Username'
            onChangeText={setUsername}
        />
        {
            errors.username?<Text style={styles.errorText}>
            {errors.username}</Text>: null
        }

        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder='Password'
          secureTextEntry
          onChangeText={setPassword}
        />
        {
          errors.password?<Text style={styles.errorText}>
          {errors.password}</Text>: null
        }

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder='Repeat Password'
          secureTextEntry
          onChangeText={setRepeatPassword}/>
          {
            errors.repeatPassword?<Text style={styles.errorText}>
            {errors.repeatPassword}</Text>: null
          }

        <View style = {styles.registerBtn}>
            <Button
            title="Reset Password"
            color="#2C2C2C"
            onPress={validateForm}
            />
        </View>

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

        <View style={styles.registerAsParkGuideContainer}>
            <Text style={styles.registerAsParkGuide}>Login? </Text>
            <TouchableOpacity onPress={handleResetPress}>
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

});
export default ForgotPassword;