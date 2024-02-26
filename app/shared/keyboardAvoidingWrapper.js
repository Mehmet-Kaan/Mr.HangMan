import React from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";

const KeyboardAvoidingWrapper = ({children}) => {
    return ( 
        <KeyboardAvoidingView style={{flex:1}}>
            <ScrollView>
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
     );
}
 
export default KeyboardAvoidingWrapper;