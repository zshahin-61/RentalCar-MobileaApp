import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, SafeAreaView,Image } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SignInScreen = ({ navigation }) => {
  const [usernameFromUI, setUsernameFromUI] = useState("zahra@gmail.com");
  const [passwordFromUI, setPasswordFromUI] = useState("zahra123");

  const onLoginClicked = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, usernameFromUI, passwordFromUI);
  alert("Sussesful")
        navigation.navigate('Home')
    } catch (err) {
      console.log(err);
      alert(err.message || "An error occurred while logging in.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Login Screen</Text>
      <Image
        source={require('../assets/RentalLogo.jpg')} 
        style={{ width: 320, height: 200, alignSelf:"center" }} 
      />
      <TextInput
        style={styles.tb}
        placeholder="peter@gmail.com"
        textContentType="emailAddress"
        autoCapitalize="none"
        value={usernameFromUI}
        onChangeText={setUsernameFromUI}
      />
      <TextInput
        style={styles.tb}
        placeholder="Enter your password"
        secureTextEntry={true}
        autoCapitalize="none"
        value={passwordFromUI}
        onChangeText={setPasswordFromUI}
      />

      <Pressable style={styles.btn} onPress={onLoginClicked}>
        <Text style={styles.btnLabel}>Login</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,

    },
    btn: {
      borderWidth: 1,
      borderColor: "#141D21",
      borderRadius: 8,
      paddingVertical: 16,
      marginVertical: 10
    },
    btnLabel: {
      fontSize: 16,
      textAlign: "center"
    },
    tb: {
      width: "100%",
        borderRadius: 5,
        backgroundColor: "#efefef",
        color: "#333",
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginVertical: 10,
    },
    formLabel: {
        fontSize: 16,
    },
    headerText: {
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 10
    }
});

export default SignInScreen;
