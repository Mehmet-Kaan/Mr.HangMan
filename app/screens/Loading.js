import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { customVariables } from '../assets/styles/customVariables';

export default function Loading(){
    return ( 
        <View style={styles.container}>
            <Text>Loading . . .</Text>
        </View>
     );
}

const styles = StyleSheet.create({
    container: {
        padding:24,
    },
});
