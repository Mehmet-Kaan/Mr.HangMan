import React from "react";
import { View, StyleSheet, Image } from "react-native";
import customvariables from '../assets/styles/customVariables';

export default function Card(prop) {
    return ( 
        <View style={styles.card}>
            <View style={styles.cardContent}>
                {prop.children}
            </View>
        </View>
     );
}

const styles = StyleSheet.create({
    card:{
        justifyContent:'center',
        alignItems:'center',
        borderRadius:6,
        elevation:3,
        backgroundColor:'#fff',
        shadowOffset: {width:1,height:1},
        shadowColor: '#333',
        shadowOpacity: .5,
        shadowRadius:4,
        width:120,
        height:150,
    },
    cardImg:{
        borderRadius:6,
        height:'100%', 
        width:'100%',
    },
    cardContent:{
        zIndex:2,
        position:'absolute',
        bottom:0,
        backgroundColor:customvariables.darkTilt,
        width:'100%',
        height:'20%',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:6,
    }
})