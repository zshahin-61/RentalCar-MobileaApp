import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';

// import the auth variable
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';
import Renter from './Renter';


const ProfileScreen = ({ navigation }) => {

    const onLogoutClicked = async () => {
        try {
            // 1. check if a user is currently logged in
            if (auth.currentUser === null) {
                alert("Sorry, no user is logged in.")
            }
            else {
                await signOut(auth)
                //alert("Logout complete!")
                navigation.navigate("G & Z EV Rental")
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <View style={styles.container}>

            <Renter renterId={auth.currentUser.uid} />

            <Pressable style={{ ...styles.btn, marginTop: 150 }}>
                <Text style={styles.btnLabel} onPress={onLogoutClicked}>Logout</Text>
            </Pressable>

        </View>
    );
}

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

export default ProfileScreen;