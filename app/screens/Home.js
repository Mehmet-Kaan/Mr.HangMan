import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {useDeviceOrientation} from '@react-native-community/hooks'

import customVariables from '../assets/styles/customVariables';
import { globalStyles } from '../assets/styles/globalStyles';
import ImageBG from '../shared/imageBG';

export default function Home({ route, navigation }){
    const orientation = useDeviceOrientation();
    // const navigation = useNavigation();
// console.log(route?.params?.message);

    return ( 
        <View style={[globalStyles.container, {height: orientation === 'landscape' ? '100%' : '30%',}]}>
          <ImageBG imgName={'bg'}>
                <View style={styles.content}>
                    <Text style={styles.titleText}>Mr. HangMan</Text>
                    <Text style={globalStyles.subtitleText}>A game of guessing letters</Text>
                    <View style={styles.menuButtons}>
                        <TouchableOpacity style={styles.menuBtn} onPress={()=> navigation.navigate('PlayMenu', {route})}>
                            <Text style={styles.menuBtnText}>Play</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.menuBtn} onPress={()=> navigation.navigate('Login', {route})}>
                            <Text style={styles.menuBtnText}>Login</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
          </ImageBG>
        </View>
    );
}

const styles = StyleSheet.create({
    content:{
        // flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:customVariables.darkTilt,
        height:'auto',
        paddingVertical:10,
    },
    titleText:{
        textAlign:'center',
        fontFamily:customVariables.baseFont,
        fontSize:customVariables.xlSize,
        color:customVariables.lightColor,
    },
    menuButtons:{
        marginTop:20,
        marginBottom:7,
        gap:10,
        flexDirection:'row'
    },
    menuBtn:{
        backgroundColor:customVariables.lightGold,
        padding:5,
        borderRadius:5,
        borderWidth:1,
        borderColor:customVariables.lightColor,
        width:100,
        alignItems:'center'
    },
    menuBtnText:{
        fontFamily:customVariables.baseFont,
        color:customVariables.lightColor,
        fontSize:20,
    },
});