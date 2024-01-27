import React from 'react'
import { StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MyBookingsScreen from './MyBookingsScreen'
import RentalListingScreen from './RentalListingScreen'
import DetailScreen from './DetailScreen'
import BookingDetailScreen from './BookingDetailScreen'
import ProfileScreen from './ProfileScreen'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StackNavContainerRental() {
  return (
    <Stack.Navigator>
   
      <Stack.Screen
        name="RentalListingScreen"
        component={RentalListingScreen}
        options={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
   <Stack.Screen
        name="DetailScreen"
        component={DetailScreen}
        options={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}
function StackNavContainerBooking() {
  return (
    <Stack.Navigator>
   
      <Stack.Screen
        name="MyBookings"
        component={MyBookingsScreen}
        options={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
   <Stack.Screen
        name="BookingDetail"
        component={BookingDetailScreen}
        options={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}
const HomeScreen = ({ navigation, route }) => {


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Rental Map List') {
            iconName = focused ? 'magnify' : 'magnify';
          } else if (route.name === 'MyBookings') {
            iconName = focused ? 'view-list' : 'view-list';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'purple',
        inactiveTintColor: 'gray',
        style: {
          backgroundColor: 'pink',
          justifyContent: 'center',
        },
        labelStyle: {
          fontSize: 15,
          fontWeight: 'bold',
        },

      }}
    >
      <Tab.Screen name="Rental Map List" component={StackNavContainerRental} options={{headerShown:false,}} />
      <Tab.Screen name="MyBookings" component={StackNavContainerBooking} options={{headerShown:false,}} />
         <Tab.Screen name="Profile" component={ProfileScreen} options={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}/>
    </Tab.Navigator>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeScreen;
