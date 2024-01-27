import { StyleSheet, Text, View, Button, Image, ScrollView, Pressable, StatusBar, SafeAreaView } from 'react-native';
import { useState, useEffect } from "react"
import MapView, { Marker } from 'react-native-maps';
import { collection, query, onSnapshot, addDoc, getDocs, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import ListingSummary from './ListingSummary';

export default function DetailScreen({ route, navigation }) {

  console.log("roooooute", route.params)
  console.log("useer", auth.currentUser.uid)
  const [selectedItem, setSelectedItem] = useState(route.params.selectedItem)

  const [bookingInProgress, setBookingInProgress] = useState(false);

  const generateRandomFutureDate = () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
    return futureDate;
  }
  useEffect(() => {
    // DEBUG: use this code to prove to yourself that when the 
    // Details screen loads, route.params.selectedPokemon contains the 
    // data sent by the previous screen
    console.log(route.params)
  }, [])



  const handleBookNow = async () => {
    try {
      const rentalListingID = selectedItem.uid;
      const renterUserID = auth.currentUser.uid;

      // Check if exists
      const bookingRef = query(collection(db, "bookings"), where("RentalListingID", "==", rentalListingID), where("RenterUserID", "==", renterUserID));
      const bookingSnapshot = await getDocs(bookingRef);

      if (!bookingSnapshot.empty) {

        alert("You have already booked this rental listing.");
        return;
      }

      // Booking doesn't exist:
      const bookingDate = generateRandomFutureDate();

      const newBooking = {
        BookingDate: generateRandomFutureDate(),
        ConfirmationCode: "",
        RentalListingID: rentalListingID,
        RenterUserID: renterUserID,
        Status: "Pending",
        bookingTimestamp: Date().toString(),
        handle: selectedItem.handle
      };

      // Insert the new booking into the database
      const insertedDocument = await addDoc(collection(db, "bookings"), newBooking);

      // Display success message
      console.log("Document written with ID: ", insertedDocument.id);
      alert(`Booking request submitted!\n Please wait for approval`);

      navigation.goBack();
    } catch (error) {
      console.error("Error while booking:", error);
      alert("Error while booking. Please try again later.");
    }
  };

  const btnBackPressed = async () => {

    console.log("going back, cancel")
    // Example of how to programatically navigate back to the previous screen
    navigation.goBack()

  }




  return (
    <View style={styles.container}>
      <ScrollView>

        <Image source={{ uri: selectedItem.PhotoURL }} style={styles.image} />

        <Text style={styles.tb}>Make: {selectedItem.Make}</Text>
        <Text style={styles.tb}>Model: {selectedItem.Model}</Text>

        <Text style={styles.tb}>Years: {selectedItem.modelYear}</Text>
        {/* <Text style={styles.tb}>Price: ${selectedItem.RentalPrice}</Text>
        <Text style={styles.tb}>Location: {selectedItem.PickupLocationAddress}</Text> */}
        {/* Load from Componnet */}
        <ListingSummary  listing={selectedItem} />

        <View style={{ paddingTop: 8, flexDirection: "row", justifyContent: "space-around" }}>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? '#f4511e' : '#0056b3' },
            ]}
            onPress={handleBookNow}>
            {/* <FontAwesome name="plus" size={20} style={styles.bookButtonText} /> */}
            <Text style={styles.buttonText}>
              BOOK NOW</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? '#f4511e' : '#0056b3' },
            ]}
            onPress={btnBackPressed} >
            {/* <FontAwesome name="times" size={20} style={styles.bookButtonText} /> */}

            <Text style={styles.buttonText}>CANCEL</Text>
          </Pressable>

        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 100 / 2,
    borderColor: "magenta",
    backgroundColor: "white",
    resizeMode: 'stretch',

  },
  tb: {
    width: "100%",
    borderRadius: 50,
    backgroundColor: "#efefef",
    color: "#333",
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
    fontSize: 18,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
