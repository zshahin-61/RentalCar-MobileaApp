import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { StyleSheet, Text, View, Button, Image, Pressable, TextInput, StatusBar, SafeAreaView } from 'react-native';
import { collection, query, onSnapshot, addDoc, getDocs, where, toLowerCase } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'
import { db, auth } from '../firebaseConfig'
import { Entypo } from '@expo/vector-icons'
import { FontAwesome } from 'react-native-vector-icons'
const navigation = useNavigation();

const CityMap = () => {
  const [cityName, setCityName] = useState('');
  const [cityCoordinates, setCityCoordinates] = useState(null);
  const [mapKey, setMapKey] = useState(0); // Add mapKey state
  const [currentLocation, setCurrentLocation] = useState(null);
  const [rentalListings, setRentalListings] = useState([]);
  const [deviceLocation, setDeviceLocation] = useState(null);

  const MarkerPress = (listing) => {
    // Debug: Check if the data is correct
    // alert("Selected Listing: " + JSON.stringify(listing));

    setSelectedListing(listing);
    // navigation.navigate('DetailScreen', { listing });
    navigation.navigate("DetailScreen", { selectedItem: listing });
  };

  useEffect(() => {
    fetchRentalListings();

    getCurrentLocation();
  }, []);

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
          // console.log(">>>>>",listing.city )
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
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error fetching current location:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await Location.geocodeAsync(cityName);
      if (response.length > 0) {
        const { latitude, longitude } = response[0];
        setCityCoordinates({
          latitude,
          longitude,
        });
        // Increment the mapKey to force re-render
        setMapKey(mapKey + 1);
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Enter city name"
          value={cityName}
          onChangeText={setCityName}
          style={styles.searchInput}
        />
        <Button title="Search" onPress={handleSearch} />
      </View>
      <View style={styles.mapContainer}>
        <MapView
          key={mapKey} 
          style={styles.map}
          initialRegion={{
            latitude: cityCoordinates ? cityCoordinates.latitude : currentLocation?.latitude || 0,
            longitude: cityCoordinates ? cityCoordinates.longitude : currentLocation?.longitude || 0,
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
          {/* {cityCoordinates && <Marker coordinate={cityCoordinates} />} */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    marginRight: 10,
    borderBottomWidth: 1,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default CityMap;
