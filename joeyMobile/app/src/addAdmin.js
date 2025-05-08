import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddAdmin = () => {
    const [admins, setAdmins] = useState([]);
    const navigation = useNavigation();

    
    useEffect(() => {
        fetchAdmin();
    }, []);


    const fetchAdmin = async () => {
        try {
          const token = await AsyncStorage.getItem('authToken');
      
          if (!token) {
            alert('Please log in to continue');
            navigation.navigate('Login'); // 🔁 redirect if token is missing
            return;
          }
      
          const response = await fetch('http://192.168.1.18:5000/api/adminRegister/all', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
      
          console.log('Response Status:', response.status);
      
          if (response.status === 401 || response.status === 403) {
            alert('Session expired or unauthorized. Please log in again.');
            await AsyncStorage.removeItem('authToken'); // Optional: clear invalid token
            navigation.navigate('Login');
            return;
          }
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          setAdmins(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error fetching admins:', error);
          alert('Failed to fetch data. Please log in.');
          navigation.navigate('Login');
        }
      };
    

    const handleAddAdmin = () => {
        navigation.navigate('AdminRegister');
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style = {styles.tableContainer}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <View style={styles.tableCellWrapper}>
                            <Text style={[styles.tableCell, styles.headerText]}>ID</Text>
                        </View>
                        <View style={styles.tableCellWrapper}>
                            <Text style={[styles.tableCell, styles.headerText]}>Username</Text>
                        </View>
                        <View style={styles.lastTableCellWrapper}>
                            <Text style={[styles.tableCell, styles.headerText]}>Email</Text>
                        </View>
                    </View>

                    {admins.length === 0 ? (
                        <Text style={styles.noDataText}>No Admins found.</Text>
                    ) : (
                        admins.map((admin, index) => (
                            <View key={index} style={styles.tableRow}>
                                <View style={styles.tableCellWrapper}>
                                    <Text style={styles.tableCell}>{admin.AdminID}</Text>
                                </View>
                                <View style={styles.tableCellWrapper}>
                                    <Text style={styles.tableCell}>{admin.Username}</Text>
                                </View>
                                <View style={styles.tableCellWrapper}>
                                    <Text style={styles.tableCell}>{admin.Email}</Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            <TouchableOpacity style={styles.addButton} onPress={handleAddAdmin}>
                <Text style={styles.addButtonText}>+ Add Admin</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#cccccc',
        alignItems: 'center',
    },
    
    tableHeader: {
        backgroundColor: '#007BFF',
    },

    tableCellWrapper: {
        flex: 1,
        borderRightColor: '#cccccc',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,  
        borderRightWidth: 1,  
        borderRightColor: '#cccccc', 
    },

    lastTableCellWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10, 
        borderRightWidth: 0, 

    },

    tableCell: {
        fontSize: 14,
        textAlign: 'center',
    },

    headerText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 50,
        elevation: 5
    },

    addButtonText: {
        color: '#fff',
        fontSize: 16
    },

    noDataText: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 20
    }
});

export default AddAdmin;
