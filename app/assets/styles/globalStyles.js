import { StyleSheet, Platform, StatusBar } from 'react-native';

import customVariables from './customVariables';

export const globalStyles = StyleSheet.create({
    container: {
        flex:1,
        // paddingTop:Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        // backgroundColor:customVariables.baseColor,
    },
    content:{
        flex:1,
    },
    titleText:{
        textAlign:'center',
        padding:10,
        fontFamily:customVariables.baseFont,
        fontSize:customVariables.xlSize,
        color:customVariables.lightColor,
    },
    subtitleText:{
        textAlign:'center',
        fontFamily:customVariables.baseFont,
        color:customVariables.lightColor,
    },
    paragraph:{
        marginVertical:8,
        lineHeight:20,
    },
    backBtn:{
        width:50,
        borderWidth:1,
        borderColor:customVariables.lightColor,
        borderRadius:20,
        padding:3,
        textAlign:'center',
        fontWeight:'bold',
        backgroundColor:customVariables.baseColor,
        color:customVariables.lightColor,
        position:'absolute',
        left:10,
        top:10,
    },
})