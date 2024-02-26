import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";
import customVariables from "../assets/styles/customVariables";
import { iconMap, avatarMap } from "./categories";
// Map your image URLs to require statements

export default function CategoryCard(prop) {
  // let image = iconMap[prop.imgName] || null;
  // prop.imgName == 'science fiction' ? image = iconMap['scifi'] : iconMap[prop.imgName];
  let image = null;
  if(prop.isAvatar){
    image = avatarMap[prop.imgName] ?? (prop.imgName === 'science-fiction' ? avatarMap['scifi'] : null);
  }else{
    image = iconMap[prop.imgName] ?? (prop.imgName === 'science-fiction' ? iconMap['scifi'] : null);
  }

  return ( 
      <ImageBackground 
        source={image}
        style={styles.bgImage}
        borderRadius={6}
      >
        <View style={styles.card}>
          <View style={styles.cardContent}>
              {prop.children}
          </View>

        </View>
      </ImageBackground>
     );
}

const styles = StyleSheet.create({
  bgImage:{
      flex:1,
      resizeMode: "cover",
  },
  card:{
      justifyContent:'center',
      alignItems:'center',
      width:120,
      height:150,
  },
  cardContent:{
      position:'absolute',
      bottom:0,
      backgroundColor:customVariables.darkTilt,
      width:'100%',
      height:'20%',
      justifyContent:'center',
      alignItems:'center',
      borderRadius:6,
      // borderStartStartRadius:0,
      // borderStartEndRadius:0,
      // borderEndEndRadius:7,
      // borderEndStartRadius:7,
      borderColor:customVariables.lightGold,
      borderTopWidth:1,
  }
})