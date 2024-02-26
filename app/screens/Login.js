import { Button, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import ImageBG from '../shared/imageBG';
import customVariables from '../assets/styles/customVariables';
import { useState } from 'react';

// import auth from "@react-native-firebase/auth";
// import db from "@react-native-firebase/database";

export default function Login({navigation}){

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [hidePassword, setHidePassword] = useState(true);

    const createUser = async (response) => {
        db().ref(`/users/${response.user.uid}`).set({name});
        db().ref(`/users/${response.user.uid}/leaderbord`).set({totalPoints: 0});
        
    }

    const pressSubmit = async (e)=>{
        e.preventDefault();

        setLoading(true);

        // if(email && password){
        //     try {
        //         const response = await auth().createUserWithEmailAndPassword(email, password);
                
        //         if(response.user){
        //             console.log(response.user);
        //             await createUser(response);

        //             setLoading(false);
        //         }

        //     } catch (error) {  
        //         Alert.alert("Opps!", "Please try again!")
        //         console.log(error);
        //     }
            
        // }

        // signInWithEmailAndPassword(auth, email, pwd)
        // .then((userCredential) => {
        //     // console.log(userCredential);
        //     navigate("/");
        // })
        // .catch((error) => {
        //     console.log(error);
        //     setLoading(false);
        //     setErrMsg("Sorry! Not in the fellowship!");
        // })

    }

    return ( 
        <ImageBG imgName={'theme'}>
            <View style={styles.container}>
                <Text style={styles.loginTxt}>Sign up</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor={customVariables.darkGold}
                    onChangeText={setName}
                    value={name}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={customVariables.darkGold}
                    onChangeText={setEmail}
                    value={email}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={customVariables.darkGold}
                    //This key hides the entered text
                    secureTextEntry={hidePassword}
                    onChangeText={setPassword}
                    value={password}
                />
                <TouchableOpacity onPress={pressSubmit}>
                    <Text style={styles.submitBtn}>
                        Sign in!
                    </Text>
                </TouchableOpacity>

            <Text>Don´t have an account yet? <Text to="/signup" style={styles.register}>Register!</Text></Text>
            </View>
        </ImageBG>
     );
}



const styles = StyleSheet.create({
    container: {
        justifyContent:'center',
        alignItems:'center',
        height:'100%',
        width:'100%',

    },
    loginTxt:{
        color:customVariables.lightColor,
    },
    submitBtn:{
        color:customVariables.lightColor,
    },
    input:{
        borderWidth:1,
        borderColor:customVariables.lightGold,
        width:'50%',
        color:customVariables.lightColor,
        marginBottom: 16,
        paddingLeft: 8,
        paddingRight: 8,
    },

});
  