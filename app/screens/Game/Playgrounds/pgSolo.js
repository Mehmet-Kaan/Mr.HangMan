import { StyleSheet, Platform, Text, TouchableOpacity, View, Image, Dimensions, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import customVariables from '../../../assets/styles/customVariables';
import ImageBG from '../../../shared/imageBG';
import { avatarMap } from '../../../shared/categories';

import allCategories from "../../../shared/categories";
import categories from '../../../shared/db';
import {getItemFor, resetStorage, storeData} from '../../../shared/storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function Playground({route, category, setSelectedCategory, levell, setSelectedLevel, allLevels}) {
    const navigation = useNavigation();
    
    const [paused, setPaused] = useState(false);

    let [word, setWord] = useState('');
    const [characters, setCharacters] = useState('');
    const [reveal, setReveal] = useState(false);
    let [level, setLevel] = useState(levell);
    let [wordsLeft, setWordsLeft] = useState(0);

    const [levelCompleted, setLevelCompleted] = useState(false);
    
    const { progress } = route.params;

    let [points, setPoints] = useState(parseInt(progress.points));
    let [streak, setStreak] = useState(parseInt(progress.streak));
    let [life, setLife] = useState(10);
    const [avatarSRC, setAvatarSRC] = useState(avatarMap[progress['activeAvatar']]);

    // Update avatar source when the screen comes into focus, 
    //(Re-renders on coming back from Shop component)
    useFocusEffect(
        React.useCallback(() => {
          setAvatarSRC(avatarMap[progress.activeAvatar]);
        }, [navigation])
    );
    
    //Saves the changes on progress updates to the device memory, (Asyncstorage)
    useFocusEffect(
        React.useCallback(() => {
            storeData('@gprogress', JSON.stringify(progress));
        }, [progress])
    );

    // console.log(progress['wordsRevealed'].includes({"desc": "Scarlet Speedster", "id": 677, "levelID": 112, "revealed": false, "word": "Flash"}));

    const [alphabetHorizontal, setAlphabetHorizontal] = useState([]);
    const [alphabetVertical, setAlphabetVertical] = useState([]);
    
    useEffect(()=>{
        getNewWord();
    },[]);

    const getNewWord = async (latestWord) => {

        let allWordsRevealedInTheCurrentLevel = progress['wordsRevealed'].filter(word => word.levelID == level.id);
        // let wordsAvaliable = level.words.filter(word => !allWordsRevealedInTheCurrentLevel.includes(word));
        let wordsAvaliable = level.words;
        
        //Updates the words left in the current level
        wordsLeft = wordsAvaliable.length - allWordsRevealedInTheCurrentLevel.length;
        setWordsLeft(wordsLeft);

        //If there is any word not completed in the level
        if(level.words.length == allWordsRevealedInTheCurrentLevel.length){
            //Pushed the currently completed level in to the progress.levelsCompleted
            progress['levelsCompleted'].push(level.id);
            
            //If all levels are completed in a category
            let allLevelsCompleted = allLevels.every(level => progress['levelsCompleted'].includes(level.id));
            
            if(allLevelsCompleted){
                let idOfCurrentCategory = allCategories.find(obj => obj.category == category).id;
                progress['categoriesCompleted'].push(idOfCurrentCategory);
                setSelectedLevel('');
            }
            
            await storeData('@progress', JSON.stringify(progress));
            //If all the words in a level completed - sends the user to the levels selection page
            // setSelectedLevel('');
            if (!allLevelsCompleted) {
                setLevelCompleted(true);
            }

        }else{
            let newWord = wordsAvaliable[allWordsRevealedInTheCurrentLevel.length];
            setCharacters(newWord.word.toUpperCase().split('').filter(char => 
                char !== `'`
                && char !== `-` 
                && char !== `.` 
                && char !== `,` 
                && char !== `:`
                && char !== `;` 
                && char !== `&` 
                && char !== `1` 
                && char !== `2`
                && char !== `3`
                && char !== `4`
                && char !== `5`
                && char !== `6`
                && char !== `7`
                && char !== `8`
                && char !== `9`
                && char !== `0`
                ).map(char => ({ char, show: true })));
            setWord(newWord);
        }
    }

    useEffect(()=>{        
        // Create an array with all uppercase letters
        const alphabetArrayHorizontal = [];
        for (let i = 65; i <= 81; i++) {
            alphabetArrayHorizontal.push({letter:String.fromCharCode(i), id:i});
        }
        setAlphabetHorizontal(alphabetArrayHorizontal);
        
        const alphabetArrayVertical = [];
        for (let i = 82; i <= 90; i++) {
            alphabetArrayVertical.push({letter:String.fromCharCode(i), id:i});
        }
        setAlphabetVertical(alphabetArrayVertical);
    
        setWordsLeft(wordsLeft);
    },[characters]);

    //Starts a new game 
    const handleNewGame = async () => {
        setReveal(false);
        setLife(10);
        getNewWord();
    }   

    // Checks if the player has revealed all the characters in the word
    const checkFinished = () => {
        //Filters array of characters from spaces => " "
        let filteredCharactersFromSpace = characters.filter(char => char.char !== ' ');
        // Check if every character's 'show' property is true
        let finished = filteredCharactersFromSpace.every(character => character.show === false);

        // 'finished' will be true if every character has show=true, otherwise false
        return finished;
    };

    const letterClicked = async (letterObj, selectedAlphabet, setSelectedAlpahabet) => {
        //Prevent clicking to the toucahbleopacity letterboxes if player is out of tries
        if(life != 0){
            let char = letterObj.letter;
    
            //replaces the selected letter with ' ';
            let selectedLetter = selectedAlphabet.find(letter => letter.letter == letterObj.letter);
            selectedAlphabet[selectedAlphabet.indexOf(selectedLetter)].letter = ' ';
            setSelectedAlpahabet(selectedAlphabet);
    
            let charsInWord = characters.filter(obj => obj.char.charCodeAt(0) == char.charCodeAt(0));
    
            //If clicked letter is not empty
            if(char !== ' '){
                if(charsInWord.length !== 0){
                    charsInWord.forEach(char => {
                        let index = characters.indexOf(char);
                        characters[index].show = false;
                        points++;
                        streak++;
                    })
                    setCharacters(characters);
                    setPoints(points);
                    setStreak(streak);
                        
                    if(checkFinished()){
                        progress['wordsCompleted'].push(word);
                        progress['wordsRevealed'].push(word);
                        progress['points'] = String(points);
                        progress['streak'] = String(streak);

                        if(streak > progress.record){
                            progress['record'] = String(streak);
                            // await storeData('@progress', JSON.stringify(progress));
                        }

                        setTimeout(() => {
                            getNewWord();
                        }, 1500);
                    }
                 
                    await storeData('@progress', JSON.stringify(progress));
    
                }else{
                    life--;
                    setLife(life);
    
                    streak = 0;
                    setStreak(streak);
    
                    if(life == 0){
                        let updatedPoints = points -= characters.length;
                        
                        if(updatedPoints < 0) {
                            setPoints(0);
                        }else{
                            setPoints(updatedPoints);
                        }
                        
                        progress['points'] = String(points);
                        progress['wordsRevealed'].push(word);
                        setReveal(true);

                        setTimeout(() => {
                            handleNewGame();
                        }, 1000);
                    }
    
                    progress['streak'] = String(streak);
                    await storeData('@progress', JSON.stringify(progress));
                }
            }
        }

    }

    //Get the next level of the current selected category
    const getNextLevel = async (id) => {        
        let nextLevelID = id;
        while(progress['levelsCompleted'].includes(nextLevelID)){
            nextLevelID++;
        }

        let nextLevel = categories[category].filter(level => level.id == nextLevelID)[0];
        setLevel(nextLevel);
        
        // getNewWord();
        handleNewGame();
        setLevelCompleted(false);
    }

    return ( 
        <View style={styles.pg}>
            {paused === false ?
                <>
                {levelCompleted && 
                    <View style={styles.completedView}>
                        <ImageBG imgName={category}>
                            <View style={styles.completedBtnsContainer}>
                                <Text style={styles.completedTxt}>Level Completed!</Text>
                                <TouchableOpacity style={styles.completedBtn} onPress={()=> setSelectedLevel('')}>
                                    <Text style={styles.completedBtnTxt}>Levels</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.completedBtn} onPress={()=> navigation.navigate('Shop', {route})}>
                                    <Text style={styles.completedBtnTxt}>Shop</Text>
                                </TouchableOpacity>
                                {level.id !== categories[category][categories[category].length-1].id &&
                                    <TouchableOpacity style={styles.completedBtn} onPress={()=> getNextLevel(level.id+1)}>
                                        <Text style={styles.completedBtnTxt}>Next Level</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </ImageBG>
                    </View>
                }
                <ImageBG imgName={category}>
                    <View style={styles.lowDarkTilt} />
                    <View style={styles.infoBox}>
                        <TouchableOpacity onPress={()=> navigation.navigate('Shop', {route})}>
                            <Image 
                                source={avatarSRC} 
                                style={styles.avatar}
                            />
                        </TouchableOpacity>
                        <Text style={styles.record}>Highest-Streak: {progress.record}</Text>
                        <Text style={styles.life}>Try: {life}</Text>
                        <Text style={styles.points}>Points: {points}</Text>
                    </View>
                    
                    {wordsLeft > 0 && 
                        <View style={[styles.streakBox, {bottom:60}]}>
                            <Text style={styles.streak}><Text style={{color:customVariables.lightGold, fontSize:20,}}>Left: </Text>{wordsLeft}</Text>
                        </View>
                    }

                    {streak > 0 && 
                        <View style={styles.streakBox}>
                            <Text style={styles.streak}><Text style={{color:customVariables.lightGold, fontSize:23,}}>x</Text>{streak}</Text>
                        </View>
                    }

                    {/* //Pause game button */}
                    <View style={styles.pauseView}>
                        <TouchableOpacity style={styles.pauseBtn} onPress={()=> setPaused(true)}>
                            <Text style={styles.pauseIcon}>||</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.descBox}>
                        <Text style={styles.descText}>{word.desc}</Text>
                    </View>
                    <View style={styles.boxes}>
                        {characters && characters.map((obj, index) => (
                                obj.char !== ' ' ?
                                    (
                                        <View style={styles.box} key={index}>
                                            <Text style={styles.char}>{obj.char}</Text>
                                            {reveal == false && obj.show && <View style={styles.cover} />}
                                        </View>                         
                                    ) 
                                    :
                                    (
                                        <View style={{opacity:0}} key={index}>
                                            <Text style={styles.char}>{obj.char}</Text>
                                        </View>  
                                    )
                        ))}
                        {/* Reveal solution button */}
                        {/* <Button title="Show solution" onPress={()=> showSolution()}/> */}
                    </View>
                
                    <View style={styles.lettersBoxesHorizontal}>
                        {alphabetHorizontal.map(letter => {         
                            return (
                                <TouchableOpacity key={letter.id} style={styles.letterTouchBox} onPress={() => letterClicked(letter, alphabetHorizontal, setAlphabetHorizontal)}>
                                    <Text style={styles.letter}>{letter.letter}</Text>
                                </TouchableOpacity>
                            )           
                        })}
                    </View>
                    <View style={styles.lettersBoxesVertical}>
                        {alphabetVertical.map(letter => {         
                            return (
                                <TouchableOpacity key={letter.id} style={styles.letterTouchBox} onPress={() => letterClicked(letter, alphabetVertical, setAlphabetVertical)}>
                                    <Text style={styles.letter}>{letter.letter}</Text>
                                </TouchableOpacity>
                            )           
                        })}
                    </View>
                </ImageBG>
                </>
            :
                <>
                    <ImageBG imgName={'pause'}>
                        <View style={styles.pauseMenuBtns}>
                            <TouchableOpacity style={styles.pauseMenuBtn} onPress={()=> setPaused(false)}>
                                <Text style={styles.pauseMenuBtnText}>CONTINUE</Text>
                                {/* <Svg height={50} width={50}>
                                    <Polygon points="20,0 50,25 20,50" fill="white" />
                                </Svg> */}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pauseMenuBtn} onPress={()=> setSelectedLevel('')}>
                                <Text style={styles.pauseMenuBtnText}>LEVELS</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pauseMenuBtn} onPress={()=> {setSelectedCategory(''), setSelectedLevel('')}}>
                                <Text style={styles.pauseMenuBtnText}>NEW GAME</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pauseMenuBtn} onPress={()=> navigation.navigate('Home')}>
                                <Text style={styles.pauseMenuBtnText}>MAIN MENU</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBG>
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    pg:{
        flex:'unset',
        height:Dimensions.get("window").height,
        width:Dimensions.get("window").width,
        //If the platform is Android
        ...Platform.select({
            android: {
                flex:1,
            },
        }),
    },
    infoBox:{
        position:'absolute',
        top:10,
        left:15,
        width:200,
           //If the platform is IOS
           ...Platform.select({
            ios: {
                left:'5%'
            },
        }),
    },
    avatar:{
        resizeMode:'cover',
        borderRadius:10,
        position:'absolute',
        width:60,
        height:60,
        borderWidth:1,
        borderColor:customVariables.lightGold,
    },
    lowDarkTilt:{
        height:'100%',
        width:'100%',
        backgroundColor:customVariables.lowDarkTilt,
        position:'absolute',
    },
    record:{
        marginVertical:3,
        color:customVariables.lightColor,
        left:70,
        fontFamily:customVariables.secondaryFont,
        letterSpacing:1,
    },
    life:{
        color:customVariables.lightColor,
        left:70,
        fontFamily:customVariables.secondaryFont,
        letterSpacing:1,
        marginBottom:3,
    },
    points:{
        color:customVariables.lightColor,
        left:70,
        fontFamily:customVariables.secondaryFont,
        letterSpacing:1,
    },
    streakBox:{
        position:'absolute',
        bottom:95,
        left:15,
        //If the platform is IOS
        ...Platform.select({
            ios: {
                left:'5%',
            },
        }),
    },
    streak:{
        color:customVariables.lightColor,
        fontFamily:customVariables.baseFont,
        fontSize:33,
    },

    descBox:{
        justifyContent:'center',
        alignItems:'center',
        // width:(customVariables.devicesWidth)*.5,
        position:'absolute',
        top:90,
        width:'100%',
        paddingRight:'7%',
        paddingLeft:'2%',
        //If the platform is IOS
        ...Platform.select({
            ios: {
                width:'90%',
                paddingLeft:'10%',
                paddingRight:0,
            },
        }),
    },
    descText:{
        borderBottomWidth:1,
        borderBottomColor:customVariables.darkGold,
        color:customVariables.lightColor,
        fontSize:35,
        textAlign:'center',
        fontFamily:customVariables.secondaryFont,
    },
    boxes:{
        // flex:1,
        // width:'auto',
        position:'absolute',
        // right:'17%',
        top:200,
        width:'100%',
        paddingRight:'7%',
        paddingLeft:'2%',
        //If the platform is IOS
        ...Platform.select({
            ios: {
                width:'90%',
                paddingLeft:'10%',
                paddingRight:0,
            },
        }),
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:10,
        flexWrap:'wrap',
    },
    box:{
        justifyContent:'center',
        alignItems:'center',
        borderColor:customVariables.lightGold,
        backgroundColor:customVariables.darkGold,

        borderWidth:1,
        // paddingHorizontal:3,
        borderRadius:6,
        width:42,
        height:42,
    },
    char:{
        color:customVariables.lightColor,
        fontSize:34,
        fontFamily:customVariables.baseFont,
        paddingBottom:5,
    },
    cover:{
        backgroundColor:customVariables.lightColor,
        height:39,
        width:39,
        position:'absolute',
        borderRadius:6,
    },
    lettersBoxesHorizontal:{
        position:'absolute',
        bottom:6,
        right:6.5,
        //If the platform is IOS
        ...Platform.select({
            ios: {
                bottom:19,
                right:88
            },
        }),
        flexDirection:'row',
        justifyContent:'space-between',
        gap:7,
        flexWrap:'wrap',
    },
    lettersBoxesVertical:{
        position:'absolute',
        bottom:46,
        right:6.5,
        ...Platform.select({
            ios: {
                bottom:"unset",
                right:48,
            },
        }),
        // marginVertical:10,
        justifyContent:'space-between',
        flexDirection:'column-reverse',
        gap:7,
        flexWrap:'wrap',
        // backgroundColor:customVariables.darkTilt,
    },
    letterTouchBox:{
        borderWidth:2,
        paddingHorizontal:3,
        borderRadius:8,
        width:33,
        height:33,
        justifyContent:'center',
        alignItems:'center',
        borderColor:customVariables.darkGold,
        // borderColor:'black',
        backgroundColor:customVariables.lightGold,
        // backgroundColor:'darkgray',

        shadowColor: customVariables.primaryColor,
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 5,

        //If the platform is Android
        ...Platform.select({
            android: {
                elevation:120,
            },
        }),
    },
    letter:{
        fontSize:20,
        fontFamily:customVariables.baseFont,
        color:customVariables.lightColor,
        // color:'black',
    },


    //Pause
    pauseView:{
        width:'100%',
        position:'absolute',
        top:10,
        alignItems:'center',
    },
    pauseBtn:{
        backgroundColor:customVariables.darkGold,
        borderRadius:5,
        borderWidth:2,
        borderColor:customVariables.lightGold,
        width:28,
        height:28,
        justifyContent:'center',
        alignItems:'center',
    },
    pauseIcon:{
        fontFamily:customVariables.baseFont,
        color:customVariables.lightColor,
        letterSpacing:2,
        fontSize:18,
          //If the platform is IOS
          ...Platform.select({
            ios: {
                letterSpacing:0,
            },
        }),
    },

    //Pause screen
    pauseMenuBtns:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:customVariables.darkTilt,
        height:'auto',
        minHeight:'52%',
        paddingVertical:12,
        gap:11,
    },  
    
    pauseMenuBtn:{
        backgroundColor:customVariables.lightGold,
        padding:5,
        borderRadius:5,
        borderWidth:1,
        borderColor:customVariables.lightColor,
        width:150,
        alignItems:'center'
    },
    pauseMenuBtnText:{
        fontFamily:customVariables.baseFont,
        color:customVariables.lightColor,
        fontSize:20,
    },

    //Level completed Navigation Box
    completedView:{
        position:'absolute',
        width:'100%',
        height:'100%',
        zIndex:1111,
        backgroundColor:customVariables.darkTilt,
    },
    completedBtnsContainer:{
        backgroundColor:customVariables.darkTilt,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        height:'100%',
        gap:20,
    },
    completedTxt:{  
        color:customVariables.lightColor,
        fontFamily:customVariables.baseFont,
        fontSize:customVariables.xlSize,
        position:'absolute',
        top:'30%',
        left:0,
        textAlign:'center',
        width:'100%',
    },
    completedBtn:{
        marginTop:120,
        borderWidth:1,
        borderColor:customVariables.lightColor,
        borderRadius:8,
        justifyContent:'center',
        alignItems:'center',
        padding:10,
        backgroundColor:customVariables.darkGold,
    },
    completedBtnTxt:{
        color:customVariables.lightColor,
        textAlign:"center",
        fontFamily:customVariables.baseFont,
        fontSize:customVariables.baseSize,
    },
});
