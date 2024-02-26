import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function About({route, navigation}){
    let { itemId, otherParam } = "";
    if(route?.params){
        ({ itemId, otherParam } = route.params);
    }

    return ( 
        <View style={styles.container}>
            <Text style={styles.text}>About Screen</Text>
            <Button style={styles.navButton} onPress={()=> navigation.navigate('Home')} title='To Home'/>
        </View>
     );
}

const styles = StyleSheet.create({
    container: {
        padding:24,
    },
});
  