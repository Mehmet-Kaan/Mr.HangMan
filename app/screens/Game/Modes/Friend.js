import { Text, TouchableOpacity, View, StyleSheet, FlatList, TextInput, TouchableWithoutFeedback, Keyboard, Image, Platform } from "react-native";
import PlaygroundMultiplayer from "../Playgrounds/pgMultiplayer";
import { useState } from "react";
import customVariables from "../../../assets/styles/customVariables";
import CategoryCard from "../../../shared/categoryCard";
import categories from "../../../shared/categories";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";

export default function Friend() {
    const navigation = useNavigation();

    const [player1, setPlayer1] = useState('Player 1');
    const [player2, setPlayer2] = useState('Player 2');
    const [playerSelected, setPlayersSelected] = useState(false);
    const [countdown, setCountdown] = useState(20);
    const [checked, setChecked] = useState('easy'); 

    const [selectedCategory, setSelectedCategory] = useState('');

    return ( 
        <View style={styles.content}>
            {playerSelected == false ? 
                <>
                    <TouchableOpacity style={styles.backBtn} onPress={()=> navigation.navigate('PlayMenu')}>
                        <Text style={styles.backBtnText}>Play</Text>
                    </TouchableOpacity>
                    <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>
                        <View style={styles.playerSettings}>
                            <Text style={styles.playersTitle}>Players Settings</Text>
                            <View style={styles.playerBoxes}>
                                <View style={styles.playerBox}>
                                    <Image 
                                        source={require('../../../assets/icons/player1.png')}
                                        style={styles.playerImg}
                                    />
                                    <TextInput 
                                    style={styles.input}
                                    placeholder="Player 1"
                                    placeholderTextColor={customVariables.lightColor}
                                    maxLength={15}
                                    value={player1}
                                    onChangeText={setPlayer1}/>
                                </View>
                                <View>
                                    <Text style={{color:customVariables.lightGold, fontFamily:customVariables.baseFont, fontSize:25,}}>VS</Text>
                                </View>
                                <View style={styles.playerBox}>
                                    <Image 
                                        source={require('../../../assets/icons/player2.png')} 
                                        width={20}
                                        height={20}
                                        style={styles.playerImg}
                                    />
                                    <TextInput 
                                    style={styles.input}
                                    placeholder="Player 2"
                                    placeholderTextColor={customVariables.lightColor}
                                    maxLength={15}
                                    value={player2}
                                    onChangeText={setPlayer2}/>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                        {/* //Games Settings */}
                        <View style={styles.gameSettings}>
                            <Text style={styles.settingsTitle}>Game Settings</Text>
                            <View style={styles.optionsBox}>
                                <View style={styles.optionBox}>
                                    <Text style={styles.sliderText}>Countdown:</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={20}
                                        maximumValue={120}
                                        minimumTrackTintColor={customVariables.lightGold}
                                        maximumTrackTintColor={customVariables.darkGold}
                                        thumbTintColor={customVariables.darkGold}
                                        value={countdown}
                                        onValueChange={setCountdown}
                                        step={1}
                                    />
                                    <Text style={styles.sliderValue}>{countdown}s</Text>
                                </View>
                                <View style={styles.optionBox}>
                                    <TouchableOpacity
                                        style={styles.checkboxContainer}
                                        onPress={() => setChecked('easy')}
                                        >
                                        <View style={[styles.checkbox, { backgroundColor: checked == 'easy' ? customVariables.darkGold : customVariables.lightColor }]}>
                                            {checked == 'easy' && <Text style={styles.checkmark}>&#10003;</Text>}
                                        </View>
                                        <Text style={styles.checkboxText}>Easy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.checkboxContainer}
                                        onPress={() => setChecked('normal')}
                                        >
                                        <View style={[styles.checkbox, { backgroundColor: checked == 'normal' ? customVariables.darkGold : customVariables.lightColor }]}>
                                            {checked == 'normal' && <Text style={styles.checkmark}>&#10003;</Text>}
                                        </View>
                                        <Text style={styles.checkboxText}>Normal</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.checkboxContainer}
                                        onPress={() => setChecked('hard')}
                                        >
                                        <View style={[styles.checkbox, { backgroundColor: checked == 'hard' ? customVariables.darkGold : customVariables.lightColor }]}>
                                            {checked == 'hard' && <Text style={styles.checkmark}>&#10003;</Text>}
                                        </View>
                                        <Text style={styles.checkboxText}>Hard</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.nextBtn} onPress={()=> setPlayersSelected(true)}>
                            <Text style={styles.nextText}>Continue</Text>
                        </TouchableOpacity>
                </>
            :
                <>
                    {selectedCategory == '' &&
                        <TouchableOpacity style={styles.backBtn} onPress={()=> setPlayersSelected(false)}>
                            <Text style={styles.backBtnText}>Players</Text>
                        </TouchableOpacity>
                    }
                    {selectedCategory == '' &&  (
                        <View style={styles.categoriesContainer}>
                            <Text style={styles.title}>CATEGORIES</Text>
                            <FlatList 
                                data={categories}
                                // horizontal={true} // Set this to true for horizontal rendering
                                keyExtractor={(item) => item.id.toString()}
                                contentContainerStyle={{ alignItems: 'center' }}
                                numColumns={4}
                                renderItem={({item}) => {
                                    return(
                                        <TouchableOpacity style={styles.categoryBox} key={item.id} onPress={()=>{setSelectedCategory(item.category)}}>
                                            <CategoryCard imgName={item.category}>
                                                <Text style={styles.categoryBoxText}>{item.category}</Text>
                                            </CategoryCard>
                                        </TouchableOpacity>
                                    )
                                }}
                                //Add spaces "gaps" between items in this case "touchable opacity" components 
                                // ItemSeparatorComponent={() => <View style={{ height: 150, width: 5 }} />} 
                            />
                        </View>
                    )}
                    {selectedCategory && <PlaygroundMultiplayer category={selectedCategory} gameSettings={{player1, player2, countdown, checked}} setPlayersSelected={() => setPlayersSelected(false)} setSelectedCategory={() => setSelectedCategory('')}/>}
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    content:{
        justifyContent:'center',
        alignItems:'center',
        flex:1,
        width:'100%',
    },
    backBtn:{
        position:'absolute',
        top:5,
        left:15,
        //If the platform is ios
        ...Platform.select({
            ios: {
                left:'5%',
                top:10,
            },
        }),
        backgroundColor:customVariables.lightGold,
        padding:5,
        borderRadius:5,
        borderWidth:1,
        borderColor:customVariables.lightColor,
        // width:100,
        alignItems:'center',
        zIndex:10,
    },
    backBtnText:{
        fontFamily:customVariables.baseFont,
        color:customVariables.lightColor,
        fontSize:12,
    },
    playerSettings:{
        // gap:20,
        // height:300,
        borderWidth:1,
        borderColor:customVariables.lightGold,
        borderRadius:15,
        width:'75%',
        paddingTop:5,
    },
    playerBoxes:{
        // justifyContent:'center',
        justifyContent:'space-around',
        alignItems:'center',
        flexDirection:'row',
        // marginHorizontal:'15%',
    },
    playersTitle:{
        color:customVariables.lightColor,
        fontFamily:customVariables.secondaryFont,
        left:'4%',
        top:-25,
        position:'absolute',
        fontSize:20,
    },
    playerBox:{
        justifyContent:'center',
        alignItems:'center'
    },
    playerImg:{
        resizeMode:'cover',
        width:140,
        height:140,
        borderRadius:29,
    },
    input:{
        marginTop:0,
        marginBottom:5,
        paddingHorizontal:5,
        paddingVertical:0,
        borderBottomWidth:1,
        borderBottomColor:customVariables.darkGold,
        color:customVariables.lightColor,
        fontFamily:customVariables.baseFont,
        textAlign:'center',
        borderRadius:18,
        width:'100%',

           //If the platform is ios
           ...Platform.select({
            ios: {
                marginTop:7,
                marginBottom:9,
                paddingVertical:3,
            },
        }),
    },
    gameSettings:{
        borderWidth:1,
        borderColor:customVariables.lightGold,
        borderRadius:15,
        width:'75%',
        paddingTop:5,
        marginTop:40,
    },
    settingsTitle:{
        color:customVariables.lightColor,
        fontFamily:customVariables.secondaryFont,
        right:'4%',
        top:-25,
        position:'absolute',
        fontSize:20,
    },
    optionsBox:{
        justifyContent:'space-evenly',
        alignItems:'center',
        height:80,
    },
    optionBox:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'80%',
    },
    slider: {
        width: 300,
        color:customVariables.lightColor,
        position:'absolute',
        left:75,
        top:2.9,
        //If the platform is ios
        ...Platform.select({
            ios: {
                left:100,
                top:-8,
            },
        }),
    },
    sliderText:{
        color: customVariables.lightColor,
        fontWeight:"bold",
        fontSize: 15,
    },
    sliderValue:{
        color: customVariables.lightColor,
        fontWeight:"bold",
        fontSize: 15,
        position:'absolute',
        right:0,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        color: 'white',
    },
    checkboxText:{
        color:customVariables.lightGold,
        fontFamily:customVariables.baseFont,
        marginLeft:5,
    },  
    nextBtn:{
        position:"absolute",
        bottom:10,
        right:'15%',
        padding:3,
        backgroundColor:customVariables.darkGold,
        borderWidth:1,
        borderColor:customVariables.lightColor,
        borderRadius:4,
        justifyContent:'center',
        alignItems:'center',
        marginTop:2,
    },
    nextText:{
        fontFamily:customVariables.baseFont,
        color:customVariables.lightColor,
    },
    //Categories
    categoriesContainer:{
        marginVertical:25,
    },
    title:{
        textAlign:'center',
        fontFamily:customVariables.baseFont,
        color: customVariables.lightColor,
        fontSize:28,
        marginBottom:5,
    },
    categoryBox: {
        margin: 8, // Adjust this value to control the gap
        // height:'auto',
        // marginLeft:15,
        
        borderWidth:1,
        borderColor:customVariables.lightGold,
        borderRadius:8,
    },
    categoryBoxText:{
        color: customVariables.lightGold,
        color: customVariables.lightColor,
        fontFamily:customVariables.secondaryFont,
        zIndex:1,
        fontSize:17,
    },

    toThemeBtn:{
        position:'absolute',
        top:15,
        left:15,
    },
});
