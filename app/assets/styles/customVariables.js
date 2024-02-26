import { Platform, StatusBar, Dimensions } from 'react-native';

export default {
    //Device
    OS: Platform.OS,
    StatusBarCurrentHeight: StatusBar.currentHeight,
    devicesHeight: Dimensions.get('screen').height,
    devicesWidth: Dimensions.get('screen').width,
    //Fonts
    baseFont:'RubikBubblesRegular',
    secondaryFont:'BebasNeueRegular',
    thirdFont:'RubikMazeRegular',
    smoothFont:'Whisper',

    //Colors
    primaryColor:'#bfa100d4',
    secondaryColor:'red',
    lightGold:'#e69c11f7',
    darkGold:'#bf710e',
    baseColor:'#5289',
    lightColor:'#fff',
    darkColor:'#000',
    darkTilt:'rgba(0, 0, 0, 0.8)',
    lowDarkTilt:'rgba(0, 0, 0, 0.6)',
    letterBoxBG:'radial-gradient(ellipse, #ee982a, #c8ad7a)',
    
    //Sizes
    baseSize:20,
    lSize:30,
    xlSize:40,
    basePadding:10,
    baseMargin:10,
    baseRadius:10,
    baseOpacity:0.5,
    
    //Shadows
    baseShadow:'0px 0px 10px rgba(0,0,0,0.2)',
    baseShadowHover:'0px 0px 10px rgba(0,0,0,0.5)',

}

