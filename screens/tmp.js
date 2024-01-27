
import React, { useState, useEffect, useCallback, SafeAreaView, StatusBar } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, where, query } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

export default function MyBookingsScreen() {
  const [userBookings, setUserBookings] = useState([]);
  const [rentalList, setRentalList] = useState([])
  const [bookingList, setBookingList] = useState([])

  const navigation = useNavigation();

  const navigateToDetailScreen = (booking) => {
    alert("Selected Listing: " + JSON.stringify(booking));
    navigation.navigate('BookingDetailScreen', { selectedID: booking });
  };

  useEffect(() => {
    // retrieveFromDb()
},[]);

  useFocusEffect(
    React.useCallback(() => {
      console.log('screen is loaded');
      fetchUserBookings();
    }, [])
  );

  const fetchUserBookings = useCallback(async () => {
    try {

      const user = auth.currentUser.uid;
      if (!user) {
        return;

      }
      const snapshot = await getDocs(query(collection(db, 'bookings'), where('RenterUserID', '==', user)));

      const userBookingsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(userBookingsData)
      setUserBookings(userBookingsData);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
    }
  }, []);


  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToDetailScreen(item)}>
      <View style={styles.bookingItem}>
        {/* <Text>Booking ID: {item.id}</Text> */}
        {/* <Text>Booking Date: {item.BookingDate}</Text> */}
        <Text>Status: {item.Status}</Text>

        {/* Add other booking fields you want to display */}
      </View>
    </TouchableOpacity>
  );

  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.heading}>My Reservations</Text>
  //     <FlatList
  //       data={myReservationList}
  //       renderItem={({ item }) => (
  //         <View style={styles.reservationItem}>
  //           {/* Vehicle details */}
  //           <Text>{`Make: ${item.Make} ${item.Model} ${item.Trim}`}</Text>
  //           <Text>Booking ID: {item.id}</Text>
  //           <Text>License Plate: {item.LicensePlate}</Text>
  //           {item.PhotoURL && <Image source={{ uri: item.PhotoURL }} style={styles.image} />}


  //           {/* Additional rental information */}
  //           <Text>Booking Date: {item.BookingDate}</Text>
  //           <Text>Pickup Location: {item.PickupLocation}</Text>
  //           <Text>Price: {item.Price}</Text>

  //           {/* Display owner name and photo */}
  //           {item.owner && (
  //             <View key={item.owner.id}>
  //               <Text>Owner Name: {item.owner.name}</Text>
  //               <Image source={{ uri: item.owner.photoURL }} style={styles.ownerImage} />
  //             </View>
  //           )}

  //           {/* Booking status and confirmation code */}
  //           <Text>Booking Status: {item.Status}</Text>
  //           {item.Status === 'confirmed' && <Text>Booking Confirmation Code: {item.ConfirmationCode}</Text>}
  //         </View>
  //       )}
  //       keyExtractor={(item) => item.id}
  //     />
  //   </View>
  // );
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Bookings</Text>
      <FlatList
        data={userBookings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
      // Add any additional FlatList props you need
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
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  ownerImage: {
    width: 100,
    height: 100,
  },
});

---------------
golnaz 


import React, { useState, useEffect, useCallback, SafeAreaView, ScrollView,StatusBar } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, doc, getDoc, where, query } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import Renter from './Renter';
import "firebase/firestore";

export default function MyBookingsScreen() {
  const [userBookings, setUserBookings] = useState([]);
  const [rentalList, setRentalList] = useState([])
  const [bookingList, setBookingList] = useState([])

  const navigation = useNavigation();

  const navigateToDetailScreen = (booking) => {
    alert("Selected Listing: " + JSON.stringify(booking));
    navigation.navigate('BookingDetailScreen', { selectedID: booking });
  };

  useEffect(() => {
    retrieveFromDb()
  }, []);

  useEffect(() => {

    const fetchBookingData = async () => {
      const bookingData = {};
      //const userProfileData = {}
      for (const rentalItem of rentalList) {
        const bookings = await carRentalInfo(rentalItem.id)
        bookingData[rentalItem.id] = bookings
      }
      setBookingList(bookingData)
    };

    fetchBookingData();

  }, [rentalList]);

  useFocusEffect(
    React.useCallback(() => {
      console.log("SCREEN HAS LOADED")
      retrieveFromDb()
      const fetchBookingData = async () => {
        const bookingData = {};
        //const userProfileData = {}
        for (const rentalItem of rentalList) {
          const bookings = await carRentalInfo(rentalItem.id)
          bookingData[rentalItem.id] = bookings
        }
        setBookingList(bookingData)
      };

      fetchBookingData();
    }, [])
  );


  const retrieveFromDb = async () => {
    // retrieve data from firestore
    try {
        const q = query(collection(db, "rental_listings"), where("OwnerUserID", "==", auth.currentUser.uid));
        //const querySnapshot = await getDocs(collection(db, "rental_listings"));
        const querySnapshot = await getDocs(q);
        const resultsFromFirestore = []
        querySnapshot.forEach(async (doc) => {
            console.log(doc.id, " => ", doc.data());

            const itemToAdd = {
                id: doc.id,
                ...doc.data()
            }
            resultsFromFirestore.push(itemToAdd)
        });

        setRentalList(resultsFromFirestore)
    } catch (err) {
        console.log(err)
    }
}

  const carRentalInfo = async (carID) => {
    const q = query(collection(db, "bookings"), where("RentalListingID", "==", carID));
    try {
      const querySnapshot = await getDocs(q);
      let temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return temp;
    } catch (err) {
      console.log(err);
    }
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToDetailScreen(item)}>
      <View style={styles.bookingItem}>
        {/* <Text>Booking ID: {item.id}</Text> */}
        {/* <Text>Booking Date: {item.BookingDate}</Text> */}
        <Text>Status: {item.Status}</Text>

        {/* Add other booking fields you want to display */}
      </View>
    </TouchableOpacity>
  );

  // return (
  //   <View style={styles.container}>
  //     <Text style={styles.heading}>My Reservations</Text>
  //     <FlatList
  //       data={myReservationList}
  //       renderItem={({ item }) => (
  //         <View style={styles.reservationItem}>
  //           {/* Vehicle details */}
  //           <Text>{`Make: ${item.Make} ${item.Model} ${item.Trim}`}</Text>
  //           <Text>Booking ID: {item.id}</Text>
  //           <Text>License Plate: {item.LicensePlate}</Text>
  //           {item.PhotoURL && <Image source={{ uri: item.PhotoURL }} style={styles.image} />}


  //           {/* Additional rental information */}
  //           <Text>Booking Date: {item.BookingDate}</Text>
  //           <Text>Pickup Location: {item.PickupLocation}</Text>
  //           <Text>Price: {item.Price}</Text>

  //           {/* Display owner name and photo */}
  //           {item.owner && (
  //             <View key={item.owner.id}>
  //               <Text>Owner Name: {item.owner.name}</Text>
  //               <Image source={{ uri: item.owner.photoURL }} style={styles.ownerImage} />
  //             </View>
  //           )}

  //           {/* Booking status and confirmation code */}
  //           <Text>Booking Status: {item.Status}</Text>
  //           {item.Status === 'confirmed' && <Text>Booking Confirmation Code: {item.ConfirmationCode}</Text>}
  //         </View>
  //       )}
  //       keyExtractor={(item) => item.id}
  //     />
  //   </View>
  // );
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Bookings</Text>


      <FlatList
        data={rentalList}
        renderItem={(rowData) => {
          const bkLIST = bookingList[rowData.item.id] || []

          return (
            <View>
              <Text style={styles.labelBold}>{`${rowData.item.Make} ${rowData.item.Model}`}</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text>Lisence Plate: {rowData.item.LicensePlate}</Text>
                <Text>Price: ${rowData.item.RentalPrice}</Text>
              </View>
              <ScrollView>
                {bkLIST.map((row_data) => (
                  <View>
                    {/* Pass renterId to RenterInfo component */}
                    <Renter renterId={row_data.RenterUserID} />
                    <View style={{ flexDirection: "row", padding: 5, justifyContent: "space-between" }} >
                      <Text>{new Date(row_data.BookingDate.seconds * 1000).toLocaleString()}</Text>
                      {/* <Text style={{ color: "red" }}>{row_data.Status}</Text> */}

                    </View>
                    <ConfirmBooking
                      bookingId={row_data.id}
                      initialStatus={row_data.Status}
                      initialConfrimCode={row_data.ConfirmationCode}
                    />
                  </View>

                ))}
              </ScrollView>
            </View>
          );
        }}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={
          // ItemSeparatorComponent is used to draw a "line" between each row
          () => {
            return (
              <View
                style={{ marginLeft: 0, borderWidth: 1, borderColor: "#ccc", marginVertical: 5 }}
              />
            )
          }}

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
  },
  flatListContainer: {
    paddingBottom: 20,
  },
  ownerImage: {
    width: 100,
    height: 100,
  },
});
---------
rental list code ?????????

import { StyleSheet, Text, View, Button, Image, Pressable, TextInput, StatusBar, SafeAreaView } from 'react-native';
import { useState, useEffect } from "react"
import MapView, { Marker } from 'react-native-maps';
import { collection, query, onSnapshot, addDoc, getDocs, where,toLowerCase } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../firebaseConfig';
import * as Location from 'expo-location';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from 'react-native-vector-icons';


export default function RentalListingScreen({ route }) {


  // const [selectedItem, setSelectedItem] = useState(route.params.selectedItem)
  const [rentalListings, setRentalListings] = useState([]);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);

  const [currAddress, setCurrAddress] = useState(null);
  const navigation = useNavigation();

  // state variables for location
  // const [cityFromUI, setCityFromUI] = useState("165 Kendal Avenue, Toronto, Ontario")
  const [latFromUI, setLatFromUI] = useState("43.676410")
  const [lngFromUI, setLngFromUI] = useState("-79.410150")

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    // Filter the rental listings based on the searchQuery
    const filteredListings = rentalListings.filter((listing) =>
      listing.PickupLocationAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setRentalListings(filteredListings);
  };

  const getCurrentLocation = async () => {
    try {
      // 1. get permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert(`Permission to access location was denied`)
        return
      }
      alert("Permission granted")
      // 2. if permission granted, then get the location
      // 3. do something with the retreived location
      let location = await Location.getCurrentPositionAsync()
      alert(JSON.stringify(location))
      console.log(location)
      // display the location in the UI
      setDeviceLocation({ lat: location.coords.latitude, lng: location.coords.longitude })


    } catch (err) {
      console.log(err)
    }
  }
  const addMarker = () => {
    alert("Add marker pressed")
    }
    
  useEffect(() => {
    // DEBUG: use this code to prove to yourself that when the 
    // Details screen loads, route.params.selectedPokemon contains the 
    // data sent by the previous screen
    // console.log(route.params.selectedItem)
    fetchRentalListings();
  }, [])

  const MARKERS_ARRAY = [
    {
      lat: 43.676410,
      lng: -79.410150,
      name: "San Francisco",
      desc: "Home of Apple and Facebook"
    },
    {
      lat: 43.676410,
      lng: -79.410150,
      name: "Union Square",
      desc: "A central meeting square surrounded by shops.",
    },
  ]

 
  const MarkerPress = (listing) => {
    // Debug: Check if the data is correct
    alert("Selected Listing: " + JSON.stringify(listing));
  
    setSelectedListing(listing);
    // navigation.navigate('DetailScreen', { listing });
    navigation.navigate("DetailScreen", { selectedItem: listing});
  };
  

  const fetchRentalListings = async () => {
    try {
      const rentalListingsRef = collection(db, "rental_listings");
      const q = query(rentalListingsRef);
  
      const snapshot = await getDocs(q);
      const listings = snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
      setRentalListings(listings);
  
      // Return the uid values as an array
      return listings.map((listing) => listing.uid);
    } catch (error) {
      console.error("Error fetching rental listings:", error);
      return [];
    }
  };
  
  useEffect(() => {
    fetchRentalListings();
    getCurrentLocation();
  }, []); 
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by address..."
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
        onSubmitEditing={handleSearch}
      />

      {(deviceLocation !== null) &&
        (
          <View style={{ marginVertical: 10 }}>
            <Text>
              Device latitude:
              <Text style={{ color: "blue" }}> {deviceLocation.lat}</Text>
            </Text>
            <Text>
              Device longitude:
              <Text style={{ color: "blue" }}> {deviceLocation.lng}</Text>
            </Text>
          </View>
        )
      }
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: deviceLocation?.lat || parseFloat(latFromUI),
            longitude: deviceLocation?.lng || parseFloat(lngFromUI),
            latitudeDelta: 0.1 ,
            longitudeDelta: 0.1,
          }}
        >
          {rentalListings.map((listing, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(listing.latitude) || 0,
                longitude: parseFloat(listing.longitude) || 0,
              }}
              onPress={() => MarkerPress(listing)} >
            <View style={{ borderColor:"magenta", backgroundColor:"white", height:40, width:70, borderRadius:100/2,flexDirection:'row',alignContent:'center'}}>
            <Text>        <FontAwesome name="dollar" size={24} color="black" />{(listing.RentalPrice)}</Text>
            {/* <Entypo name="price-tag" size={24} color="black" /> */}
    

            </View>
            </Marker>
          ))}
        </MapView>


        {/* <Button title="Add to Favorite List" onPress={} /> */}
        {/* <Button title="Continue" onPress={} /> */}


      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    // alignItems: 'center',
    justifyContent: 'space-around',//'center',
    backgroundColor: '#fff',
    paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight : 0,
    // borderWidth:2,
    borderColor: "#f4511e",
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',

  },
  flagImage: {
    width: 100,
    height: 70,
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },

};

----------

import { StyleSheet, Text, View, Button, Image, Pressable, TextInput, StatusBar, SafeAreaView } from 'react-native';
import { useState, useEffect } from "react"
import MapView, { Marker } from 'react-native-maps'
import { collection, query, onSnapshot, addDoc, getDocs, where, toLowerCase } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'
import { db, auth } from '../firebaseConfig'
import * as Location from 'expo-location'
import { Entypo } from '@expo/vector-icons'
import { FontAwesome } from 'react-native-vector-icons'
import ListingSummary from './ListingSummary'
 
export default function RentalListingScreen({ route }) {


  // const [selectedItem, setSelectedItem] = useState(route.params.selectedItem)
  const [rentalListings, setRentalListings] = useState([]);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);

  const [currAddress, setCurrAddress] = useState(null);
  const navigation = useNavigation();

  // state variables for location
  const [cityFromUI, setCityFromUI] = useState("165 Kendal Avenue, AUrora, Ontario")
  const [latFromUI, setLatFromUI] = useState("43.676410")
  const [lngFromUI, setLngFromUI] = useState("-79.410150")
  const [postcode, setPostcode] = useState("")


  const handleSearch = () => {
    // Filter the rental listings based on the searchQuery
    const filteredListings = rentalListings.filter((listing) =>
      listing.PickupLocationAddress.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setRentalListings(filteredListings);
  };

  const doForwardGeocode = async () => {
    // 0. On android, permissions must be granted
    // code to ask for permissions goes here

    try {
      // 1. Do forward geocode
      const geocodedLocation
        = await Location.geocodeAsync("Toronto, Canada")


      // 2. Check if a matching location is found
      const result = geocodedLocation[0]
      if (result === undefined) {
        alert("No coordinates found")
        return
      }

      ///---------
      // 3. If yes, extract relevant data
      console.log(`Latitude: ${result.latitude}`)
      console.log(`Longitude: ${result.longitude}`)


    } catch (err) {
      console.log(err)
    }
  }

  const getCurrentLocation = async () => {
    try {
      // 1. get permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert(`Permission to access location was denied`)
        return
      }
      alert("Permission granted")
      // 2. if permission granted, then get the location
      // 3. do something with the retreived location
      let location = await Location.getCurrentPositionAsync()
      //  alert(JSON.stringify(location))
      console.log(location)
      // display the location in the UI
      setDeviceLocation({ lat: location.coords.latitude, lng: location.coords.longitude })


    } catch (err) {
      console.log(err)
    }
  }
  const addMarker = () => {
    alert("Add marker pressed")
  }

  useEffect(() => {
    // DEBUG: use this code to prove to yourself that when the 
    // Details screen loads, route.params.selectedPokemon contains the 
    // data sent by the previous screen
    // console.log(route.params.selectedItem)
    fetchRentalListings()
    getCurrentLocation()
  }, [])

  const MARKERS_ARRAY = [
    {
      lat: 43.676410,
      lng: -79.410150,
      name: "San Francisco",
      desc: "Home of Apple and Facebook"
    },
    {
      lat: 43.676410,
      lng: -79.410150,
      name: "Union Square",
      desc: "A central meeting square surrounded by shops.",
    },
  ]


  const MarkerPress = (listing) => {
    // Debug: Check if the data is correct
    // alert("Selected Listing: " + JSON.stringify(listing));

    setSelectedListing(listing);
    // navigation.navigate('DetailScreen', { listing });
    navigation.navigate("DetailScreen", { selectedItem: listing });
  };


  const fetchRentalListings = async () => {
    try {
      const rentalListingsRef = collection(db, "rental_listings");
      const q = query(rentalListingsRef);

      const snapshot = await getDocs(q);
      const listings = snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));

      //Use geocoding 
      for (const listing of listings) {
        const geocodedLocation = await Location.geocodeAsync(listing.PickupLocationAddress);
        if (geocodedLocation.length > 0) {
          listing.city = geocodedLocation[0].city;
          console.log(">>>>>",listing.city )
        } else {
          listing.city = "Unknown";
        }
      }
      setRentalListings(listings);

      // Return the uid values as an array
      return listings.map((listing) => listing.uid);
    } catch (error) {
      console.error("Error fetching rental listings:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchRentalListings();
    getCurrentLocation();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      {/* ----- */}
      {/* --- */}


      {/* {(deviceLocation !== null) &&
        (
          <View style={{ marginVertical: 10 }}>
            <Text>
              Device latitude:
              <Text style={{ color: "blue" }}> {deviceLocation.lat}</Text>
            </Text>
            <Text>
              Device longitude:
              <Text style={{ color: "blue" }}> {deviceLocation.lng}</Text>
            </Text>
          </View>
        )
      } */}
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: deviceLocation?.lat || parseFloat(latFromUI),
            longitude: deviceLocation?.lng || parseFloat(lngFromUI),
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          {rentalListings.map((listing, index) =>
            listing.city === deviceLocation?.city ? (
              <Marker
                key={index}
                coordinate={{
                  latitude: parseFloat(listing.latitude) || 0,
                  longitude: parseFloat(listing.longitude) || 0,
                }}
                onPress={() => MarkerPress(listing)}
              >
                <View
                   style={{
                    flexDirection: "row",
                    alignItems: "center", // Center vertically
                    justifyContent: "center", // Center horizontally
                    borderColor: "magenta",
                    backgroundColor: "white",
                    height: 40,
                    width: 70,
                    borderRadius: 100 / 2,
                  }}
                >
                  <Text style={{fontWeight:'bold'}}>
                    {" "}
                    <FontAwesome name="dollar" size={16} color="black" />
                    {listing.RentalPrice}
                  </Text>
                  {/* <Entypo name="price-tag" size={24} color="black" /> */}
                </View>
              </Marker>
            ) : null
          )}
        </MapView>



        {/* <Button title="Add to Favorite List" onPress={} /> */}
        {/* <Button title="Continue" onPress={} /> */}


      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    // alignItems: 'center',
    justifyContent: 'space-around',//'center',
    backgroundColor: '#fff',
    paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight : 0,
    // borderWidth:2,
    borderColor: "#f4511e",
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: 'bold',

  },
  flagImage: {
    width: 100,
    height: 70,
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },

};