import {useState} from 'react';
import {StyleSheet, View, Text, TextInput, Button, ScrollView, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';


const AdminRegister=({})=> {
const[username, setUsername]=useState('');
const[email, setEmail]=useState('');
const[password, setPassword]=useState('');
const[repeatPassword, setRepeatPassword]=useState('');
const[errors, setErrors]=useState({});

const navigation = useNavigation();


const validateForm=async ()=>
{
  let errors={};

  if(!username)
  {
    errors.username = "Please enter your username";
  }

  if(!email)
  {
    errors.email = "Please enter your email address";
  }
  else
  {
    const reg=/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(!reg.test(email))
    {
      errors.email="Please enter a valid email address";
    }
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
      try {
        const response = await fetch('http://192.168.1.18:5000/api/adminRegister', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username,
            email,
            password,
            role: 'Admin'
          })
        });
    
        const result = await response.json();
    
        if (response.ok) {
          alert("Registration successful!");
          navigation.navigate("AddAdmin");
        } else {
          alert(result.error || "Registration failed.");
        }
      } catch (error) {
        console.error("Signup error:", error);
        alert("Error connecting to server.");
      }
    }    
}


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
        <Text style={styles.title}>Admin Register</Text>
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
        
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder='Email'
          onChangeText={setEmail}
        />
          {
            errors.email?<Text style={styles.errorText}>
              {errors.email}</Text>: null
          }

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder='Password'
          secureTextEntry
          onChangeText={setPassword}/>
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
            title="Add admin"
            color="#2C2C2C"
            onPress={validateForm}
            />
        </View>

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
export default AdminRegister;