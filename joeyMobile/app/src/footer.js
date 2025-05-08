import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

export default function Footer() {
  const navigation = useNavigation(); 

  return (
    <View>
        <View style={styles.divider}></View>

        <View style={styles.footer}>
            <View style={styles.footerSection}>
                <Text style={styles.footerHeader}>Explore</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.footerLink}>Homepage</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Map')}>
                    <Text style={styles.footerLink}>Map</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Plant')}>
                    <Text style={styles.footerLink}>Plant Identification</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Feedback')}>
                    <Text style={styles.footerLink}>Feedback</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footerSection}>
                <Text style={styles.footerHeader}>Contact</Text>
                
                <Text style={styles.footerText}>
                    <Text style={styles.boldText}>Address: </Text>
                    Lot 218, KCLD, Jalan Tapang, Kota Sentosa, 93250 Kuching, Sarawak, Malaysia
                </Text>
                    
                <Text style={styles.footerText}>
                    <Text style={styles.boldText}>Phone: </Text>
                6034909305035
                </Text>

                <Text style={styles.footerText}>
                    <Text style={styles.boldText}>Fax: </Text>
                0824859485
                </Text>
                <Text style={styles.footerText}>
                    <Text style={styles.boldText}>Email: </Text>
                email@gmail.com
                </Text>
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: '#ddd', 
        marginTop: 25,
    },

    footerSection:{
        marginBlock: 15
    },
      
    footer: {
        backgroundColor: '#f8f8f8',
        padding: 20,
    },

    footerHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    footerLink: {
        fontSize: 13,
        marginBottom: 10,
        color: '#0066cc', 
    },

    footerText: {
        fontSize: 13,
        marginBottom: 5,
        marginTop: 5
    },

    boldText: {
        fontWeight: 'bold',
    },
});
