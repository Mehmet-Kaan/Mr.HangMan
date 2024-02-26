import { StyleSheet, Platform, Text, TouchableOpacity, View, FlatList, Button, Alert, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { globalStyles } from '../../../assets/styles/globalStyles';
import customVariables from '../../../assets/styles/customVariables';
import ImageBG from '../../../shared/imageBG';
// import categories, {updateCategory} from '../../shared/db';
import { Svg, Polygon, } from 'react-native-svg';

import categories from '../../../shared/db';
import { useNavigation } from '@react-navigation/native';

export default function Playground({route, category, setSelectedCategory, level, setSelectedLevel, progress}) {
    const navigation = useNavigation();
console.log(level);
    const [paused, setPaused] = useState(false);
    const selectedCategory = categories[category];

    let [wordsRevealed, setWordsRevealed] = useState([]);
    let [word, setWord] = useState('');
    const [reveal, setReveal] = useState(false);
    // const [characters, setCharacters] = useState(word.word.toUpperCase().split('').map(char => ({ char, show: true })));
    const [characters, setCharacters] = useState('');
    let [counter, setCounter] = useState(0);
    let [life, setLife] = useState(10);
    const [alphabetHorizontal, setAlphabetHorizontal] = useState([]);
    const [alphabetVertical, setAlphabetVertical] = useState([]);
    const [basket, setBasked] = useState([]);
    
    // let currentLevel = selectedCategory.find(level => level.completed == false);

    useEffect(()=>{
        getNewWord();
    },[]);

    const getNewWord = (latestWord) => {
        //If all the words in a level completed starts a new game
        if(wordsRevealed.length == selectedCategory[0].words.length){
            handleNewGame();
        }else{
            // let randomLevel = Math.floor(Math.random() * 10);
            let randomLevel = 0;
            let randomWordIndex = Math.floor(Math.random() * 6);
    
            let newWord = selectedCategory[randomLevel].words[randomWordIndex];
    
            while(wordsRevealed.includes(newWord)){
                // randomLevel = Math.floor(Math.random() * 10);
                randomWordIndex = Math.floor(Math.random() * 6);
                newWord = selectedCategory[randomLevel].words[randomWordIndex];
            }
            setCharacters(newWord.word.toUpperCase().split('').filter(char => char !== `'`).map(char => ({ char, show: true })));
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

    },[characters]);

    //Starts a new game 
    const handleNewGame = () => {
        wordsRevealed = [];
        setWordsRevealed(wordsRevealed);
        setReveal(false);
        getNewWord();
    }   

    const endGame = () => {
        showSolution();
        setTimeout(() => {
            setLife(10);
            setCounter(0);
            handleNewGame();
        }, 2000);
    }

    const showSolution = () => {
        setReveal(true);
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

    const letterClicked = (letterObj, selectedAlphabet, setSelectedAlpahabet) => {
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
                    counter++;
                })
                setCharacters(characters);
                setCounter(counter);

                if(checkFinished()){
                    wordsRevealed.push(word);
                    setWordsRevealed(wordsRevealed);
                    console.log(wordsRevealed);
                    setTimeout(() => {
                        getNewWord();
                    }, 2000);
                }
                
            }else{
                life--;
                setLife(life);
                if(life == 0){
                    endGame();
                }
            }
        }
    }

    return ( 
        <>
            {paused === false ?
                <>
                <ImageBG imgName={'playground'}>
                    <View style={styles.infoBox}>
                        <Text style={styles.life}>Life: {life}</Text>
                        <Text style={styles.counter}>Points: {counter}</Text>
                    </View>

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

                    
                    {/* //Frames */}
                    {/* <Image source={require('../../assets/frames/hFrame.jpeg')} style={styles.hFrame} resizeMode="contain" />
                    <Image source={require('../../assets/frames/vFrame.jpeg')} style={styles.vFrame} resizeMode="contain"/> */}
                    {/* <Image source={require('../../assets/frames/rope.png')} style={styles.rope}/> */}
                    {/* <Image source={require('../../assets/icons/trashbasket.png')} style={styles.trashbasket} resizeMode="contain"/> */}

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
        </>
    );
}

const styles = StyleSheet.create({
    infoBox:{
        position:'absolute',
        top:10,
        left:15,
        padding:10,
        backgroundColor:customVariables.darkTilt,

        borderWidth:1,
        borderColor:customVariables.lightGold,
        borderRadius:10,
    },
    life:{
        color:customVariables.lightColor,
    },
    counter:{
        color:customVariables.lightColor
    },
    descBox:{
        justifyContent:'center',
        alignItems:'center',
        // width:(customVariables.devicesWidth)*.5,
        position:'absolute',
        top:90,
        width:'100%',
        paddingHorizontal:'7%',
    },
    descText:{
        borderBottomWidth:1,
        borderBottomColor:customVariables.darkGold,
        color:customVariables.lightColor,
        fontSize:35,
        fontFamily:customVariables.secondaryFont,
    },
    boxes:{
        // flex:1,
        // width:'auto',
        position:'absolute',
        // right:'17%',
        top:200,
        width:'100%',
        paddingHorizontal:'7%',
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
        flexDirection:'row',
        justifyContent:'space-between',
        gap:7,
        flexWrap:'wrap',
    },
    lettersBoxesVertical:{
        position:'absolute',
        bottom:46,
        right:6.5,
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

    // Frames
    // rope:{
    //     display:'none',
    //     position:'absolute',
    //     top:-7,
    //     left:'10%',
    //     // flex: 1,
    //     resizeMode: "contain",
    //     width:100,
    //     height:200,
    //     // justifyContent: "center",
    // },
    // trashbasket:{
    //     width:'10%',
    //     height:'30%',
    //     position:'absolute',
    //     bottom:-20,
    //     left:10,
    // },
    // hFrame:{
    //     width:'100%',
    //     height:20,
    //     position:'absolute',
    //     bottom:-1,
    // },
    // vFrame:{
    //     height:'100%',
    //     position:'absolute',
    //     right:0,
    //     width:19,
    // },


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
        width:23,
        height:23,
        justifyContent:'center',
        alignItems:'center',
    },
    pauseIcon:{
        fontFamily:customVariables.baseFont,
        color:customVariables.lightColor,
        letterSpacing:2,
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
});
