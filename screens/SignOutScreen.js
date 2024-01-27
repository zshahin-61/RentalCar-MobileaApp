import React from 'react';

import { View, FlatList, Text, TouchableOpacity,StyleSheet } from 'react-native';

const SignOutScreen = () => {
    const handleSignOut = async () => {
      try {
        await signOut(); 
  
        Alert.alert('Signed Out', 'You have been successfully signed out.', [
          {
            text: 'OK',
            onPress: () => navigation.replace(''),
          },
        ]);
      } catch (error) {
        console.log(error);
        Alert.alert('Error', 'An error occurred while signing out. Please try again.');
      }
    };
  
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
    },
    text: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'black',
    },
  });
  
  export default SignOutScreen;