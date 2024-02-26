import { Text, View, TouchableOpacity, StyleSheet, FlatList, Platform } from "react-native";
import ImageBG from "../shared/imageBG";
import { globalStyles } from "../assets/styles/globalStyles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import customVariables from "../assets/styles/customVariables";
import CategoryCard from "../shared/categoryCard";
import allCategories from "../shared/categories";
//Imports the icons
import Icon from 'react-native-vector-icons/FontAwesome';
import React, { useState } from "react";
import { storeData } from "../shared/storage";

export default function Shop({route}) {
    let progress = route.params.progress;

    const [usersPoints, setUsersPoints] = useState(progress.points);
    const [activeAvatar, setActiveAvatar] = useState(progress.activeAvatar);

    const navigation = useNavigation();

    function calculateCost(id) {
        let cost = 350 * id;
        return cost == 0 ? 100 : cost;
    }

    const itemBuyPressed = async (item) => {
        let cost = calculateCost(item.id);

        if(progress['avatars'].includes(item.id)){
            progress['activeAvatar'] = item.category;
            setActiveAvatar(item.category);
        }else{
            if(usersPoints > cost){
                progress.points = usersPoints - cost;
                setUsersPoints(progress.points);
                setActiveAvatar(item.category);
                
                progress['avatars'].push(item.id);
                progress['activeAvatar'] = item.category;
            }else{
                console.log('Not enought points! Keep playing to earn some!');
            }
        }

        await storeData('@progress', JSON.stringify(progress));
    }

    //Saves the changes on progress updates to the device memory, (Asyncstorage)
    useFocusEffect(
        React.useCallback(() => {
            storeData('@gprogress', JSON.stringify(progress));
        }, [progress])
    );

    return ( 
        <View style={globalStyles.container}>
           <ImageBG imgName={'theme'}>
               {/* Back button */}
               <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack({route})}>
                   <Text style={styles.backBtnText}>Back</Text>
               </TouchableOpacity>
               <View style={styles.infoBox}>
                <Text style={styles.points}>Points: {usersPoints}</Text>
               </View>
               <View style={styles.categoriesContainer}>
                    <Text style={styles.title}>SHOP</Text>
                    <FlatList 
                        data={allCategories}
                        // horizontal={true} // Set this to true for horizontal rendering
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ alignItems: 'center' }}
                        numColumns={4}
                        renderItem={({item}) => {
                            // Check if the object includes the specific value
                            let isCategoryCompleted = progress['categoriesCompleted'].includes(item.id);
                            let isBought = progress['avatars'].includes(item.id);
                            let isActiveAvatar = progress['activeAvatar'] == item.category;

                            return(
                                <TouchableOpacity style={[styles.imageBox, isBought && {borderWidth:1, borderColor:customVariables.lightGold}]} 
                                                key={item.id}
                                                disabled={!isCategoryCompleted}
                                                onPress={() => itemBuyPressed(item)}>
                                    <CategoryCard isAvatar={true} imgName={item.category}>
                                        {isActiveAvatar ?
                                            (
                                                <Icon name="circle" style={styles.trophy}/>
                                            )
                                        :
                                        isBought ? 
                                            (
                                                <Icon name="trophy" style={styles.trophy}/>
                                            )
                                        :
                                            <Text style={styles.imageBoxText}>{calculateCost(item.id)} Points</Text>
                                        }
                                    </CategoryCard>
                                    {!isCategoryCompleted ? 
                                        <View style={styles.lockedBox}>
                                            <Icon name="lock" style={styles.locked}/>
                                        </View>
                                    :
                                    !isBought ? 
                                        (
                                            <View style={styles.unlockedBox}>
                                                <Icon name="unlock" style={styles.unlocked}/>
                                            </View>
                                        )
                                    :
                                     <>
                                     </>
                                    }
                                </TouchableOpacity>
                            )
                        }}
                        //Add spaces "gaps" between items in this case "touchable opacity" components 
                        // ItemSeparatorComponent={() => <View style={{ height: 150, width: 5 }} />} 
                    />
                </View>

           </ImageBG>
       </View>
     );
}

const styles = StyleSheet.create({
    categoriesContainer:{
        marginVertical:25,
    }, 
    backBtn:{
        position:'absolute',
        top:5,
        right:15,
        backgroundColor:customVariables.lightGold,
        padding:5,
        borderRadius:5,
        borderWidth:1,
        borderColor:customVariables.lightColor,
        // width:100,
        alignItems:'center',
        zIndex:10,

        //If the platform is IOS
        ...Platform.select({
            ios: {
                right:'5%',
            },
        }),
    },
    backBtnText:{
        fontFamily:customVariables.baseFont,
        color:customVariables.lightColor,
        fontSize:12,
    },
    infoBox:{
        position:'absolute',
        top:15,
        left:'11%',
    },
    points:{
        color:customVariables.lightColor,
        fontFamily:customVariables.secondaryFont,
        letterSpacing:1,
    },
    title:{
        textAlign:'center',
        fontFamily:customVariables.baseFont,
        color: customVariables.lightColor,
        fontSize:28,
        marginBottom:5,
    },
    imageBox: {
        margin: 7, // Adjust this value to control the gap
        // height:'auto',
        // marginLeft:15,
        
        // borderWidth:1,
        // borderColor:customVariables.lightGold,
        borderRadius:8,
    },
    imageBoxText:{
        color: customVariables.lightColor,
        fontFamily:customVariables.baseFont,
        zIndex:1,
        fontSize:12,
    },  
    lockedBox:{
        position:'absolute',
        height:'100%',
        width:'100%',
        backgroundColor:customVariables.darkTilt,
        borderRadius:8,
        justifyContent:'center',
        alignItems:'center',
        zIndex:12,
        borderWidth:1,
        borderColor:customVariables.secondaryColor,
    },
    locked:{
        color: customVariables.secondaryColor,
        fontSize:45,
    },
    unlockedBox:{
        position:'absolute',
        height:'100%',
        width:'100%',
        backgroundColor:customVariables.darkTilt,
        borderRadius:8,
        justifyContent:'center',
        alignItems:'center',
        zIndex:12,
        borderWidth:1,
        borderColor:customVariables.lightColor,
        opacity:.4,
    },
    unlocked:{
        color: customVariables.lightColor,
        fontSize:25,
        opacity:1,
    },
    trophy:{
        color:customVariables.lightGold,
    },
});