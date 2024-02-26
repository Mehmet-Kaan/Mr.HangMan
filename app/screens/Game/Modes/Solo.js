import { Text, TouchableOpacity, View, StyleSheet, FlatList, SafeAreaView, Platform, Dimensions } from "react-native";
import Playground from "../Playgrounds/pgSolo";
import React, { useEffect, useState } from "react";
import customVariables from "../../../assets/styles/customVariables";
import CategoryCard from "../../../shared/categoryCard";
import allCategories from "../../../shared/categories";
import categories from '../../../shared/db';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { storeData } from "../../../shared/storage";

export default function Solo({route}) {
    const { progress } = route.params;

    const navigation = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState('');
    const [levelsOfSelectedCategory, setLevelsOfSelectedCategory] = useState([]);

    const [selectedLevel, setSelectedLevel] = useState('');
    const [gameSettings, setGameSettings] = useState(false);

    const categoryPressed = (item) => {
        setSelectedCategory(item.category);

        let categoryChosen = categories[item.category];
        setLevelsOfSelectedCategory(categoryChosen);
    }

    useEffect(()=>{
        if(selectedCategory && selectedLevel){
            setGameSettings(true);
        }else{
            setGameSettings(false);
        }
    },[selectedLevel, selectedCategory]);

    //Saves the changes on progress updates to the device memory, (Asyncstorage)
    useFocusEffect(
    React.useCallback(() => {
        storeData('@gprogress', JSON.stringify(progress));
    }, [progress])
    );

    return ( 
        <SafeAreaView style={styles.content}>
            {!gameSettings &&  
                <TouchableOpacity style={styles.shopBtn} onPress={()=> navigation.navigate('Shop', progress)}>
                    <Text style={styles.backBtnText}>Shop</Text>
                </TouchableOpacity>
            }
            
            {gameSettings == false ? 
                <>
                    {selectedCategory == '' &&  (
                        <View style={styles.categoriesContainer}>
                            <TouchableOpacity style={styles.backBtn} onPress={()=> navigation.navigate('PlayMenu')}>
                                <Text style={styles.backBtnText}>Play</Text>
                            </TouchableOpacity>
                            
                            <Text style={styles.title}>CATEGORIES</Text>
                            <FlatList 
                                data={allCategories}
                                // horizontal={true} // Set this to true for horizontal rendering
                                keyExtractor={(item) => item.id.toString()}
                                contentContainerStyle={{ alignItems: 'center' }}
                                numColumns={4}
                                renderItem={({item}) => {
                                    // Check if the object includes the specific value
                                    let isCategoryCompleted = false;
                                    if(progress.categoriesCompleted){
                                        isCategoryCompleted = progress['categoriesCompleted'].includes(item.id);
                                    }

                                    return(
                                        <TouchableOpacity style={styles.categoryBox} key={item.id} onPress={() => categoryPressed(item)}>
                                            <CategoryCard imgName={item.category}>
                                                <Text style={styles.categoryBoxText}>{(item.category).toUpperCase()}</Text>
                                            </CategoryCard>
                                            {isCategoryCompleted && 
                                                <View style={styles.completed}>
                                                    <Text style={styles.checkmark}>&#10003;</Text>
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    )
                                }}
                                //Add spaces "gaps" between items in this case "touchable opacity" components 
                                // ItemSeparatorComponent={() => <View style={{ height: 150, width: 5 }} />} 
                            />
                        </View>
                    )}

                    {/* Displays level of selectedCategory */}
                    {selectedCategory && 
                        <View style={styles.categoriesContainer}>
                            <TouchableOpacity style={styles.backBtn} onPress={()=> setSelectedCategory('')}>
                                <Text style={styles.backBtnText}>Categories</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>LEVELS</Text>
                            <FlatList 
                                data={levelsOfSelectedCategory}
                                // horizontal={true} // Set this to true for horizontal rendering
                                keyExtractor={(item) => item.id.toString()}
                                contentContainerStyle={{ alignItems: 'center' }}
                                numColumns={4}
                                renderItem={({item}) => {
                                    let isLevelCompleted = progress['levelsCompleted'].includes(item.id);
                                    let wordsCompletedInTheLevel = progress['wordsCompleted'].filter(word => word.levelID == item.id);
                                    let wordsRevealedInTheLevel = progress['wordsRevealed'].filter(word => word.levelID == item.id);
                                    let amountMissedWords = wordsRevealedInTheLevel.length - wordsCompletedInTheLevel.length;

                                    if(wordsRevealedInTheLevel.length == item.words.length) {
                                        isLevelCompleted = true;
                                    }

                                    return(
                                        <TouchableOpacity style={styles.categoryBox} key={item.id} onPress={() => setSelectedLevel(item)} disabled={isLevelCompleted}>
                                            <View style={styles.levelNumberBox}>
                                                <Text style={styles.levelNumber}>{levelsOfSelectedCategory.indexOf(item)+1}</Text>
                                            </View>
                                            <CategoryCard imgName={'level'}>
                                                {amountMissedWords > 0 && <Text style={styles.amountMissedWordsText}>{amountMissedWords}</Text>}
                                                <Text style={styles.levelBoxText}>{wordsCompletedInTheLevel.length}/{item.words.length}</Text>
                                            </CategoryCard>
                                            {isLevelCompleted && 
                                                <View style={styles.completed}>
                                                    <Text style={styles.checkmark}>&#10003;</Text>
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    )
                                }}
                                //Add spaces "gaps" between items in this case "touchable opacity" components 
                                // ItemSeparatorComponent={() => <View style={{ height: 150, width: 5 }} />} 
                            />
                        </View>
                    }
                 </>
            :
                <Playground category={selectedCategory} setSelectedCategory={() => setSelectedCategory('')} levell={selectedLevel} setSelectedLevel={() => setSelectedLevel('')} allLevels={levelsOfSelectedCategory} route={route} />
            }
          
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    content:{
        // justifyContent:'center',
        flex:1,

        //If the platform is android
        ...Platform.select({
            android: {
                width:'100%',
                height:"100%"
            },
        }),
    },
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
    backBtn:{
        position:'absolute',
        top:-5,
        left:15,
          //If the platform is ios
          ...Platform.select({
            ios: {
                top:0,
                left:15,
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
        fontSize:16,
    },
    shopBtn:{
        position:'absolute',
        top:'5%',
        right:15,
          //If the platform is ios
          ...Platform.select({
            ios: {
                top:'7%',
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
    //Categories
    categoryBox: {
        margin: 7, // Adjust this value to control the gap
        // height:'auto',
        // marginLeft:15,
        
        borderWidth:2,
        borderColor:customVariables.lightGold,
        borderRadius:8,
    },
    categoryBoxText:{
        color: customVariables.lightColor,
        fontFamily:customVariables.baseFont,
        zIndex:1,
        fontSize:12,
    },  

    //Levels
    levelNumberBox:{
        position:'absolute',
        height:'80%',
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        zIndex:10,
    },
    levelBoxText:{
        color: customVariables.lightColor,
        fontFamily:customVariables.baseFont,
        // zIndex:1,
        fontSize:15,
    },
    levelNumber:{
        color:customVariables.darkColor,
        fontSize:60,
        fontFamily:customVariables.secondaryFont,
        fontFamily:customVariables.baseFont,
    },
    amountMissedWordsText:{
        color:'red',
        fontFamily:customVariables.baseFont,
        zIndex:1,
        fontSize:12,
        position:'absolute',
        left:5,
    },
    
    completed:{
        position:'absolute',
        height:'100%',
        width:'100%',
        backgroundColor:customVariables.darkTilt,
        borderRadius:8,
        justifyContent:'center',
        alignItems:'center',
        zIndex:12,
    },
    checkmark:{
        color: customVariables.darkGold,
        fontSize:60,
    },
    toThemeBtn:{
        position:'absolute',
        top:15,
        left:15,
    },
});
