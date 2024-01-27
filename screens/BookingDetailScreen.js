import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Renter from './Renter';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BookingDetailScreen({ route }) {
  const [selectedItem, setSelectedItem] = useState(route.params.selectedID);
  const [rentalListingData, setRentalListingData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchRentalListingData();
  }, [selectedItem.RentalListingID]);

  const fetchRentalListingData = async () => {
    try {
      const rentalListingRef = doc(db, 'rental_listings', selectedItem.RentalListingID);
      const rentalListingSnapshot = await getDoc(rentalListingRef);

      if (rentalListingSnapshot.exists()) {
        setRentalListingData(rentalListingSnapshot.data());
      } else {
        console.log('Rental listing not found');
      }
    } catch (error) {
      console.error('Error fetching rental listing data:', error);
    }
  };
  const btnBackPressed = async () => {

    console.log("going back, cancel")
    // Example of how to programatically navigate back to the previous screen
    navigation.goBack()

  }
  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.heading}>Owner </Text>
        {rentalListingData && (
          <View style={styles.ownerInfo}>
            <Renter renterId={rentalListingData.OwnerUserID} />
            {rentalListingData.OwnerName && <Text>Owner Name: {rentalListingData.OwnerName}</Text>}
            {rentalListingData.OwnerPhotoURL && (
              <Image source={{ uri: rentalListingData.OwnerPhotoURL }} style={styles.ownerPhoto} />
            )}
          </View>
        )}
<Text style={styles.heading}>Car Status</Text>
<View style={styles.stats}>
        <Text style={styles.statusitem}> Status: {selectedItem.Status}</Text>
        {selectedItem.ConfirmationCode && (
          <Text style={styles.statusitem}> Confirmation Code: {selectedItem.ConfirmationCode}</Text>
        )}
        </View>
      

        {rentalListingData && (
          <View style={{ borderWidth: 1, borderColor: 'lightgray' }}>
            <View >
              <Image source={{ uri: rentalListingData.PhotoURL }} style={styles.photo} />
              <View style={styles.textInfo} >
                <Text style={styles.tb}>Make: {rentalListingData.Make}</Text>
                <Text style={styles.tb}>Model: {rentalListingData.Model}</Text>
                <Text style={styles.tb}>Model Year: {rentalListingData.modelYear}</Text>
                {/* Add other vehicle details here */}

                <Text style={styles.tb}>Booking Date: {new Date(selectedItem.BookingDate.seconds * 1000).toLocaleString()}</Text>
                <Text style={styles.tb}>License Plate: {rentalListingData.LicensePlate}</Text>
                {/* Add other booking details here */}
              </View>
            </View>

            {rentalListingData.PickupLocationAddress ? (
              <>
                <Text style={{ fontWeight: 'bold', fontSize: 16, margin: 6 }}>Pickup Location Address: {rentalListingData.PickupLocationAddress}</Text>
                {rentalListingData.latitude && rentalListingData.longitude && (
                  <MapView
                    style={styles.map}
                    initialRegion={{
                      latitude: parseFloat(rentalListingData.latitude),
                      longitude: parseFloat(rentalListingData.longitude),
                      latitudeDelta: 0.3,
                      longitudeDelta: 0.3,
                    }}
                  >
                    <Marker
                      coordinate={{
                        latitude: parseFloat(rentalListingData.latitude),
                        longitude: parseFloat(rentalListingData.longitude),
                      }}>
                      <View style={{ borderColor: "magenta", backgroundColor: "white", height: 25, width: 50, borderRadius: 100 / 2, justifyContent: "center", alignItems: "center" }}>
                        <FontAwesome name="car" size={20} color="red" />
                      </View>
                    </Marker>
                  </MapView>
                )}
              </>
            ) : (
              <Text>Pickup Location Address is not available.</Text>
            )}
          </View>
        )}
        <View style={{ paddingTop: 8, flexDirection: "row", justifyContent: "space-around" }}>
          <Pressable
            style={({ pressed }) => [
              styles.bookButton,
              { backgroundColor: pressed ? '#f4511e' : '#0056b3' },
            ]}
            onPress={btnBackPressed} >

            <Ionicons name="md-arrow-back" size={20} style={styles.bookButtonText} />
          </Pressable>

        </View>
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    // paddingBottom: 80,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop:10,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  photo: {
    width: 300,
    height: 200,
    borderRadius: 100 / 2,
    resizeMode: 'stretch',
    margin: 10,

  },
  map: {
    height: 100,
    width: '100%',
    marginBottom: 10,
  },

  textInfo: {
    flexDirection: 'column',
    // alignItems: 'center',
    // marginBottom: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  ownerInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  ownerPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 10,
  },
  bookButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    // marginTop: 20,
  },
  bookButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tb: {
    width: "100%",
    borderRadius: 50,
    backgroundColor: "#efefef",
    color: "#333",
    // fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 5,
    fontSize: 18,
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



{/* <View style={{ borderWidth: 1, borderColor: 'gray', gap: 2, paddingTop: 5 }}>
<Text style={styles.heading}>Booking Status</Text>
<Text style={{ fontSize: 24, fontWeight: 'bold', color: 'red' }}>{selectedItem.Status}</Text>
<Text style={{ fontSize: 24, fontWeight: 'bold', }}>By Code: {selectedItem.ConfirmationCode}</Text>


</View> */}