import { StyleSheet, Text, TouchableOpacity, View, FlatList, Button, ImageBackground } from 'react-native';
import { useState } from 'react';
import { globalStyles } from '../../assets/styles/globalStyles';

//Play modes
import Friend from './Modes/Friend';
import Online from './Modes/Online';
import Solo from './Modes/Solo';
import customVariables from '../../assets/styles/customVariables';
import ImageBG from '../../shared/imageBG';


export default function Play({route, navigation}) {
    const Mode = route.params.mode;
    let progress = route?.params?.progress;

    return ( 
        <View style={globalStyles.container}>
            <ImageBG imgName={'theme'}>
                {/* Back button */}
                {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={globalStyles.backBtn}>Back</Text>
                </TouchableOpacity> */}
                
                <View style={styles.content}>
                    {
                        Mode == 'Friend' ? <Friend /> 
                        : Mode == 'Online' ? <Online /> 
                        : Mode == 'Solo' ? <Solo route={route} /> 
                        : navigation.navigate('PlayMenu')
                    }
                </View> 

            </ImageBG>
        </View>
    );
}

const styles = StyleSheet.create({
    content:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },

});
