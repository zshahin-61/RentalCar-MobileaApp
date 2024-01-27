import React from 'react';
import { View, Text } from 'react-native';

const ListingSummary = ({ listing }) => {
  return (
    <View style={styles.tb}>
      <Text style={{fontSize:18,fontWeight:'bold'}}>Location: {listing.PickupLocationAddress}</Text>
      <Text></Text>
      <Text style={{fontSize:18,fontWeight:'bold'}}>Rental Price: {listing.RentalPrice}</Text>
    </View>
  );
};
const styles = {
  tb: {
    width: "100%",
    borderRadius: 50,
    backgroundColor: "#white",
    color: "#333",
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
  },
}
export default ListingSummary;
