import { StyleSheet, Text, View, Button, Image, Pressable, TextInput, StatusBar, SafeAreaView } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import MapView, { Marker } from 'react-native-maps'
import { collection, query, onSnapshot, addDoc, getDocs, where, toLowerCase } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { db, auth } from '../firebaseConfig'
import * as Location from 'expo-location'
import { Entypo } from '@expo/vector-icons'
import { FontAwesome } from 'react-native-vector-icons'
import ListingSummary from './ListingSummary'
 
export default function RentalListingScreen({ route }) {

  const [mapKey, setMapKey] = useState(0); 
  // const [selectedItem, setSelectedItem] = useState(route.params.selectedItem)
  const [rentalListings, setRentalListings] = useState([]);
  const [deviceLocation, setDeviceLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);

  const navigation = useNavigation();

  // state variables for location
  const [cityFromUI, setCityFromUI] = useState("")
  const [latFromUI, setLatFromUI] = useState("43.676410")
  const [lngFromUI, setLngFromUI] = useState("-79.410150")
  const [postcode, setPostcode] = useState("")


  const handleSearchPress = async () => {
    try {
      const response = await Location.geocodeAsync(cityFromUI);
      if (response.length > 0) {
        const { latitude, longitude } = response[0];
        // setCityCoordinates({
        //   latitude,
        //   longitude,
        // });
        setLatFromUI(latitude)
        setLngFromUI(longitude)

        setDeviceLocation({ lat: latitude, lng: longitude })
        // Increment the mapKey to force re-render
        setMapKey(mapKey + 1);
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
    }
  };
  

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
alert("count")

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
      // alert("Permission granted")
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
      alert("here")
      const rentalListingsRef = collection(db, "rental_listings");
      const q = query(rentalListingsRef);

      const snapshot = await getDocs(q);
      const listings = snapshot.docs.map((doc) => ({ ...doc.data(), uid: doc.id }));
      //Use geocoding 
      for (const listing of listings) {
        const geocodedLocation = await Location.geocodeAsync(listing.PickupLocationAddress);
        if (geocodedLocation.length > 0) {
          listing.city = geocodedLocation[0].city;
          // alert(">>>>>",listing.city )
        } else {
          listing.city = "Unknown";
        }
      }
      console.log(">>>>>",listings)

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
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Enter city name"
          value={cityFromUI}
          onChangeText={setCityFromUI}
          style={styles.searchInput}
        />
        <Button title="Search" onPress={handleSearchPress} />
      </View>

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
        key={mapKey} // Add key prop
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
    // borderWidth:2,
    borderColor: "#f4511e",
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    borderBottomWidth: 1,
  },
};