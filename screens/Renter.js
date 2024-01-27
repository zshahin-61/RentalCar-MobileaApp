import React, { useState, useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { db } from '../firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'


const Renter = (props) => {
    const [renterData, setRenterData] = useState(null)

    useEffect(() => {
        const fetchRenterData = async () => {
            const renterRef = doc(db, 'userProfiles', props.renterId)
            const renterSnapshot = await getDoc(renterRef)

            if (renterSnapshot.exists()) {
                setRenterData(renterSnapshot.data())
            }
        }

        fetchRenterData()
    }, [props.renterId])

    if (!renterData) {
        return <Text>Loading...</Text>
    }

    return (
        <View>
            <View style={{ flexDirection: "row", alignItems: 'center',gap:8 }}>

                <Image style={{
                    height: 100,
                    width: 100,
                    borderRadius: 50,
                    overflow: 'hidden',
                }}
                    source={{ uri: renterData.pic || "https://golnazch.github.io/no-image-icon-23505.png" }} />
              
                <Text style={styles.labelBold}>{renterData ? renterData.name : ""}</Text>
            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    map: {
        height: "50%",
        width: "100%",
    },
    btn: {
        borderWidth: 1,
        borderColor: "#141D21",
        borderRadius: 8,
        padding: 16,
        marginVertical: 10,
    },
    btnLabel: {
        fontSize: 16,
        textAlign: "center",
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
    label: {
        fontSize: 18,
        marginVertical: 5,
        paddingVertical: 10,
    },
    labelBold: {
        fontSize: 18,
        marginVertical: 10,
        fontWeight: "bold",
        alignSelf: "center",
        paddingVertical: 10,
        // color:'f4511e',
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold"
    }
})

export default Renter