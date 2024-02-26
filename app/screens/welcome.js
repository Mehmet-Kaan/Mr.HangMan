import { StyleSheet, View, Text, Image } from 'react-native';
import customVariables from '../assets/styles/customVariables';
import ImageBG from '../shared/imageBG';
// import { useNavigation } from '@react-navigation/native';

const Welcome = () => {
    // const navigation = useNavigation();´

    return ( 
        <ImageBG
            imgName={'hangman'}>
            <View style={styles.container}>
                {/* <Text style={styles.loadingText}>MR. HANGMAN</Text> */}
            </View>
        </ImageBG>
     );
}
 
export default Welcome;

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    loadingText:{
        color:customVariables.lightColor,
        fontSize:30,
        padding:10,
        // backgroundColor:customVariables.lightGold,
        // width:60,
        alignItems:'center',
        justifyContent:'center',
    },
})