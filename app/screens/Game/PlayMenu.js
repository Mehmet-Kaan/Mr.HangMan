import { StyleSheet, Text, TouchableOpacity, View, FlatList, Button, ImageBackground } from 'react-native';
import { useState } from 'react';
import { globalStyles } from '../../assets/styles/globalStyles';
import customVariables from '../../assets/styles/customVariables';

export default function PlayMenu({route, navigation}) {

    const [selectedMod, setSelectedMod] = useState('');
    
    return ( 
        <View style={styles.container}>
            {/* <ImageBG imgName={'theme'}> */}
                {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={globalStyles.backBtn}>Back</Text>
                </TouchableOpacity>
                 */}
            <View style={styles.modButtons}>
                    <TouchableOpacity style={selectedMod == 'Solo' ? [styles.selectedMod, {borderRightWidth:2}] 
                    :
                        selectedMod == 'Online' ? [styles.modBox, {borderRightWidth:0.55, borderColor:customVariables.lightColor}]
                    : 
                    styles.modBox} 
                    onPress={()=> setSelectedMod('Solo')}>
                        <ImageBackground style={styles.bgImage} source={require("../../assets/images/solo.jpg")}>
                            {selectedMod !== 'Solo' ? 
                                <>
                                    <View style={styles.darkTilt}/>
                                    <Text style={styles.title}>Solo</Text>
                                </>
                                :
                                <View style={styles.selectedModBox}>
                                    <Text style={styles.selectedTitle}>Solo</Text>
                                    <Text style={styles.descText}>
                                        Immerse yourself in the challenge of guessing words and solving puzzles independently. 
                                        With a diverse range of categories to choose from, you can tailor your solo adventure to suit your interests. 
                                        Sharpen your vocabulary, tackle various difficulty levels, and enjoy the satisfaction of conquering word challenges on your own. 
                                        Whether you're a seasoned wordsmith or a casual player, This mode provides an engaging and entertaining way to enhance your 
                                        language skills and have a blast with the timeless game of Hangman. Embark on a solo word-guessing journey and see how many words you can conquer!
                                    </Text>
                                    <TouchableOpacity style={styles.continueBtn} onPress={()=> navigation.navigate('Play', {mode:selectedMod, route})}>
                                        <Text style={styles.title}>Play</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity style={selectedMod == 'Friend' ? [styles.selectedMod, {borderRightWidth:2, borderLeftWidth:2}] 
                    :
                        selectedMod == 'Online' ? [styles.modBox, {borderRightWidth:0, borderLeftWidth:0, borderColor:customVariables.lightColor}]
                    :
                        selectedMod == 'Solo' ? [styles.modBox, {borderRightWidth:0.55, borderLeftWidth:0, borderColor:customVariables.lightColor}]
                    : 
                    [styles.modBox, {borderRightWidth:0.55, borderLeftWidth:0.55, borderColor:customVariables.lightColor}]} onPress={()=> setSelectedMod('Friend')}>
                        <ImageBackground style={styles.bgImage} source={require("../../assets/images/friend.jpg")}>
                            {selectedMod !== 'Friend' ? 
                                <>
                                    <View style={styles.darkTilt}/>
                                    <Text style={styles.title}>Multiplayer</Text>
                                </>
                                :
                                <View style={styles.selectedModBox}>
                                    <Text style={styles.selectedTitle}>Multiplayer</Text>
                                    <Text style={styles.descText}>
                                        In this mode, you can invite a friend to join you in a friendly battle of words. 
                                        Take turns selecting words and challenging each other's vocabulary prowess. 
                                        It's a delightful way to test your linguistic skills, engage in some friendly competition, and enjoy the thrill of solving word puzzles together. 
                                        Grab a friend, start a match, and see who emerges victorious as the ultimate wordsmith in this interactive and fun multiplayer mode!
                                    </Text>
                                    <TouchableOpacity style={styles.continueBtn} onPress={()=> navigation.navigate('Play', {mode:selectedMod, route})}>
                                        <Text style={styles.title}>Play</Text>
                                    </TouchableOpacity>
                                </View>
                            }
                        </ImageBackground>
                    </TouchableOpacity>
                    <TouchableOpacity style={selectedMod == 'Online' ? [styles.selectedMod, {borderRightWidth:0, borderLeftWidth:2}] 
                    : 
                    [styles.modBox, {borderLeftWidth:0.55, borderRightWidth:0}]} onPress={()=> setSelectedMod('Online')}>
                        <ImageBackground  style={styles.bgImage} source={require("../../assets/images/online.jpg")}>
                            {selectedMod !== 'Online' ? 
                                <>
                                    <View style={styles.darkTilt}/>
                                    <Text style={styles.title}>Online</Text>
                                </>
                                :
                                <View style={styles.selectedModBox}>
                                    <Text style={styles.selectedTitle}>Online</Text>
                                    <Text style={styles.descText}>
                                        Connect with friends or challenge opponents from around the world in thrilling online battles of wit and vocabulary. 
                                        Experience the thrill of competition as you take turns guessing and creating words, all in real-time interaction. 
                                        Customize your gaming experience by selecting categories and difficulty levels, adding an extra layer of strategy to each match. 
                                        Stay engaged with the global Hangman community, climb the leaderboards, and showcase your linguistic prowess.
                                        With seamless online multiplayer functionality, this mode offers a dynamic and interactive way to enjoy the classic Hangman game with friends and foes alike. 
                                        Ready to test your wordplay skills against the world? Join the online adventure and let the wordsmith battles begin!
                                    </Text>
                                    {/* <TouchableOpacity style={styles.continueBtn} onPress={()=> navigation.navigate('Play', {mode:selectedMod, route})}>
                                        <Text style={styles.title}>Play</Text>
                                    </TouchableOpacity> */}
                                </View>
                            }
                        </ImageBackground>
                    </TouchableOpacity>
            </View>
            {/* </ImageBG> */}
            {/* {selectedMod &&  
                <TouchableOpacity style={styles.continueBtn} onPress={()=> navigation.navigate('Play', {mod:selectedMod})}>
                    <Text style={styles.modText}>Play</Text>
                </TouchableOpacity>
            } */}
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        height:'100%',
    },
    modButtons:{
        // gap:10,
        borderColor:'black',
        flexDirection:'row',
        height:'100%',
        width:'100%',
    },
    modBox:{
        justifyContent:'center',
        alignItems:'center',
        flex:1,
    },
    title:{
        color:customVariables.lightColor,
        fontFamily:customVariables.baseFont,
    },
    //When selected
    selectedMod:{
        flex:2,
        fontWeight:'bold',
        justifyContent:'center',
        alignItems:'center',
        borderColor:customVariables.lightGold,
    },
    selectedModBox:{
        backgroundColor:customVariables.darkTilt,
        borderRadius:10,
        paddingHorizontal:10,
        paddingVertical:8,
        justifyContent:'space-evenly',
        alignItems:'center',
        height:'auto',
        width:'80%',
        gap:5,
        borderWidth:1,
        borderColor:customVariables.darkGold,
    },
    selectedTitle:{
        color:customVariables.darkGold,
        fontFamily:customVariables.baseFont,
        fontSize:24,
    },
    descText:{
        fontFamily:customVariables.secondaryFont,
        color:customVariables.lightColor,
        fontSize:12,
        lineHeight:17,
        marginVertical:3,
    },  

    darkTilt:{
        position:'absolute',
        width:'100%',
        height:'100%',
        backgroundColor:customVariables.darkTilt,
    },
    bgImage:{
        flex: 1,
        width:'100%',
        alignItems: "center",
        justifyContent:'center',
        resizeMode: "cover",
    },
    continueBtn:{
        // position:"absolute",
        // bottom:35,
        // right:35,
        padding:3,
        backgroundColor:customVariables.darkGold,
        borderWidth:1,
        borderColor:customVariables.lightColor,
        borderRadius:4,
        justifyContent:'center',
        alignItems:'center',
        marginVertical:2,
    },
});
  