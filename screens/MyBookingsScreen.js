import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, where, query } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function MyBookingsScreen() {
  const [userBookings, setUserBookings] = useState([]);

  const navigation = useNavigation();

  const navigateToDetailScreen = (booking) => {
    // alert("Selected Listing: " + JSON.stringify(booking));
    navigation.navigate('BookingDetail', { selectedID: booking });
  };

  const fetchUserBookings = useCallback(async () => {
    try {
      const user = auth.currentUser.uid;
      if (!user) {
        return;
      }

      const snapshot = await getDocs(query(collection(db, 'bookings'), where('RenterUserID', '==', user)));
      const userBookingsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      // Fetch rental listing details for each booking
      const userBookingsWithData = await Promise.all(
        userBookingsData.map(async (booking) => {
          const rentalListingRef = doc(db, 'rental_listings', booking.RentalListingID);
          const rentalListingSnapshot = await getDoc(rentalListingRef);
          const rentalListingData = rentalListingSnapshot.data();
          return { ...booking, ...rentalListingData };
        })
      );

      setUserBookings(userBookingsWithData);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
        //console.log("SCREEN HAS LOADED")
        fetchUserBookings()
    }, [])
);
  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToDetailScreen(item)}>
      <View style={styles.bookingItem}>
        {/* <Text>Booking ID: {item.id}</Text> */}
        <Text style={styles.items}>Make: {item.Make}</Text>
        <Text style={styles.items}>Model: {item.Model}</Text>
        <Text style={styles.items}>Price: ${item.RentalPrice}</Text>
        <Text style={styles.items}>Date:{new Date(item.BookingDate.seconds*100).toLocaleString()}</Text>

        <View style={styles.stats}>
        <Text style={styles.statusitem}> Status: {item.Status}</Text>
        {item.ConfirmationCode && (
          <Text style={styles.statusitem}> Confirmation Code: {item.ConfirmationCode}</Text>
        )}
        </View>
        <Image source={{ uri: item.PhotoURL }} style={styles.photo} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <Text style={styles.heading}>My Bookings</Text> */}
      <FlatList
        data={userBookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bookingItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    fontSize:16,
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  photo: {
   
    marginBottom: 10,
    width: 300,
    height: 300,
    borderRadius: 100 / 2,
    borderColor: "magenta",
    backgroundColor: "white",
    resizeMode: 'stretch',
  },
    items:{
      width: "100%",
      borderRadius: 50,
      // backgroundColor: "#efefef",
      color: "#333",
      // fontWeight: "bold",
      // paddingHorizontal: 10,
      // paddingVertical: 5,
      marginVertical: 1,
      fontSize: 17,
    },
    stats:{
      width: "100%",
      borderRadius: 10,
      // backgroundColor: "#efefef",
      color: "#333",
      borderWidth:2,
      borderColor:'#f4511e',
      fontSize: 18,
    },
    statusitem:{
      fontSize:18,

    },
  
});
