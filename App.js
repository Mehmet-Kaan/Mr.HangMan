import React, { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {getItemFor, resetStorage, saveAvatarsToDeviceStorage, storeData} from './app/shared/storage';
import Welcome from './app/screens/welcome';
import Home from './app/screens/Home';
import About from './app/screens/About';

import Play from './app/screens/Game/Play';
import PlayMenu from './app/screens/Game/PlayMenu';
import Solo from './app/screens/Game/Modes/Solo';
import Playground from './app/screens/Game/Playgrounds/pgSolo';
import PlaygroundMultiplayer from './app/screens/Game/Playgrounds/pgMultiplayer';
import Login from './app/screens/Login';
import { StatusBar } from 'react-native';
import Shop from './app/screens/Shop';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState({});

  //Loads the fonts
  const [fontsLoaded] = useFonts({
    Whisper: require('./app/assets/fonts/Whisper-Regular.ttf'),
    RubikBubblesRegular: require('./app/assets/fonts/RubikBubbles-Regular.ttf'),
    RubikMazeRegular: require('./app/assets/fonts/RubikMaze-Regular.ttf'),
    BebasNeueRegular: require('./app/assets/fonts/BebasNeue-Regular.ttf'),
  });
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();

    //Gets the data (usersprogress) from the devices storage
    async function getData() {
      try {
        //Check if progress['imagesSavedToDevice'] = true; , if not saveAvatarsToDeviceStorage

        // Call the function to save avatars during app initialization
        // saveAvatarsToDeviceStorage();

        const storedData = await getItemFor('@progress');

        if (storedData != null) {
          setProgress(JSON.parse(storedData));
        } else {

          // await resetStorage();

          let usersProgress = {
            record: 0,
            streak:0,
            points:0,
            avatars: [],
            activeAvatar: 'default',
            levelsCompleted: [],
            wordsCompleted: [],
            wordsRevealed:[],
            categoriesCompleted: [],
          };
          await storeData('@progress', JSON.stringify(usersProgress));
        }
      } 
      catch (error) {
        console.log('Error fetching data:', error);
      } 
      finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }
  
    getData();
  }, []);

  if (!fontsLoaded) {
    return <Welcome />;
  }else{
    SplashScreen.hideAsync();
  } 
  
  //When loading the values from the async storage
  if(isLoading){
    return <Welcome />;
  }

  return (
    //To create a stack navigator
    <NavigationContainer>
        <Stack.Navigator 
        initialRouteName="Home"
        //Hides the header
        screenOptions={{ headerShown: false, }}
      >
      <Stack.Screen name="Home" component={Home} initialParams={{ progress }} />
      <Stack.Screen name="Play" component={Play} initialParams={{ progress }} />
      <Stack.Screen name="PlayMenu" component={PlayMenu} initialParams={{ progress }} />
      <Stack.Screen name="Solo" component={Solo} initialParams={{ progress }} />
      <Stack.Screen name="Shop" component={Shop} initialParams={{ progress }} />
      <Stack.Screen name="Playground" component={Playground} initialParams={{ progress}} />
      <Stack.Screen name="PlaygroundMultiplayer" component={PlaygroundMultiplayer} initialParams={{ progress }} />
      <Stack.Screen name="About" component={About} initialParams={{ progress }} />
      <Stack.Screen name="Login" component={Login} initialParams={{ progress }} />
    </Stack.Navigator>
      <StatusBar hidden={true}/>
    </NavigationContainer>
  )
}
