import { StyleSheet, Platform, Text, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import customVariables from '../../../assets/styles/customVariables';
import ImageBG from '../../../shared/imageBG';

import categories from '../../../shared/db';
import { useNavigation } from '@react-navigation/native';
import useCountdown from '../../../shared/useCountdown';

export default function PlaygroundMultiplayer({route, category, setSelectedCategory, setPlayersSelected, gameSettings}) {
    const navigation = useNavigation();
    
    //Categories and words
    const selectedCategory = categories[category];
    let [wordsRevealed, setWordsRevealed] = useState([]);
    let [word, setWord] = useState('');
    // const [characters, setCharacters] = useState(word.word.toUpperCase().split('').map(char => ({ char, show: true })));
    const [characters, setCharacters] = useState('');
    
    //Game setups
    const [alphabetHorizontal, setAlphabetHorizontal] = useState([]);
    const [alphabetVertical, setAlphabetVertical] = useState([]);
    const [reveal, setReveal] = useState(false);

    const [paused, setPaused] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const {secondsLeft, start} = useCountdown();
    const [pausedSeconds, setPausedSeconds] = useState(countdown);
    const [difficulty, setDifficulty] = useState(0);
    const [limit, setLimit] = useState(10);
    let [turn, setTurn] = useState(0);

    //User attributes
    const {player1, player2, countdown, checked} = gameSettings;
    let [activePlayer, setActivePlayer] = useState(player1);
    
    let [pointsPlayer1, setPointsPlayer1] = useState(0);
    let [pointsPlayer2, setPointsPlayer2] = useState(0);

    let [lpPlayer1, setLpPlayer1] = useState(10);
    let [lpPlayer2, setLpPlayer2] = useState(10);
    
    // let currentLevel = selectedCategory.find(level => level.completed == false);
    useEffect(()=>{
        getNewWord();
    },[]);

    const getNewWord = (latestWord) => {
        //Sets the next players turn
        activePlayer == player1 ? setActivePlayer(player2) : setActivePlayer(player1);

        let selectedDifficulty = gameSettings.checked;
        if(selectedDifficulty == 'easy'){
            setDifficulty(Math.floor(Math.random() * 3));
        }else if(selectedDifficulty = 'normal'){
            setDifficulty(Math.floor(Math.random() * (8 - 4) + 3));
            setLpPlayer1(6);
            setLpPlayer2(6);
        }else{
            setDifficulty(Math.random() * (11 - 4) + 3);
            setLpPlayer1(3);
            setLpPlayer2(3);
        }

        if(turn !== limit){

            //If all the words in a level completed starts a new game
            if(wordsRevealed.length == selectedCategory[0].words.length){
                handleNewGame();
            }else{
                // let randomLevel = Math.floor(Math.random() * 10);
                let levelDifficulty = difficulty;
                let randomWordIndex = Math.floor(Math.random() * 6);
                let newWord = selectedCategory[levelDifficulty].words[randomWordIndex];
        
                while(wordsRevealed.includes(newWord)){
                    // randomLevel = Math.floor(Math.random() * 10);
                    randomWordIndex = Math.floor(Math.random() * 6);
                    newWord = selectedCategory[levelDifficulty].words[randomWordIndex];
                }
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
    
            //Starts the countdown after 2 secs
            start(countdown);
        }else{
            setGameOver(true);
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

    useEffect(()=>{
        setTurn(turn);
    },[turn]);

    //Starts a new game 
    const handleNewGame = () => {
        wordsRevealed = [];
        setWordsRevealed(wordsRevealed);
        setReveal(false);
        getNewWord();
    }

    const endGame = () => {
        setReveal(true);
        setTimeout(() => {
            //Removes the points equal to the word that been revealed from the active player (which is the one that missed the word)
            let amountChars = characters.length;
            activePlayer == player1 ? 
            setPointsPlayer1(pointsPlayer1 -= amountChars)
            : 
            setPointsPlayer2(pointsPlayer2 -= amountChars);
            
            // handleNewGame();
            setGameOver(true);
        }, 1250);
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
                let tempPoints = activePlayer == player1 ? pointsPlayer1 : pointsPlayer2;

                charsInWord.forEach(char => {
                    let index = characters.indexOf(char);
                    characters[index].show = false;
                    // counter++;
                    tempPoints++;
                })
                setCharacters(characters);

                //Upadtes the current players points
                if(activePlayer == player1){
                    setPointsPlayer1(tempPoints);
                }else{
                    setPointsPlayer2(tempPoints);
                }
             
                if(checkFinished()){
                    wordsRevealed.push(word);
                    setWordsRevealed(wordsRevealed);

                    setTimeout(() => {
                        endTurn();
                    }, 1500);
                }
                
            }else{
                let life = activePlayer == player1 ? lpPlayer1 : lpPlayer2;
                life--;

                 //Upadtes the current players points
                 if(activePlayer == player1){
                    setLpPlayer1(life);
                }else{
                    setLpPlayer2(life);
                }

                if(life == 0){
                    endGame();
                    // setGameOver(true);
                }
            }
        }
    }

    const endTurn = () => {
        turn += 1;
        setTurn(turn);
        getNewWord();
    }
    
    //changes the turn
    if(secondsLeft == 0){
        endTurn();
    }

    const getPlayerWon = () => {
        let playerWon = player1;
        
        if(lpPlayer1 === 0 || lpPlayer2 === 0){
            playerWon = lpPlayer1 < lpPlayer2 ? player2 : player1;
        }
        else{
            if(pointsPlayer1 == pointsPlayer2){
                if(lpPlayer1 == lpPlayer2){
                   playerWon = 'draw';
                }else{
                    playerWon = lpPlayer1 > lpPlayer2 ? player1 : player2;
                }
            }else{
                playerWon = pointsPlayer1 < pointsPlayer2 ? player2 : player1;
            }
        }
        return playerWon;
    }
    
    // Memoize the result of getPlayerWon
    const playerWon = useMemo(() => getPlayerWon(), [gameOver]);

    return ( 
        <View style={styles.containerMPPlayground}>
            {gameOver === false ? 
            <>
                {paused === false ?
                    <>
                    <ImageBG imgName={category}>
                        <View style={styles.lowDarkTilt} />

                        <View style={styles.infoBox}>
                            <Image 
                                source={require('../../../assets/icons/player1.png')} 
                                style={[styles.playerImg, activePlayer == player1 && styles.activePlayer]}
                            />
                            <Image 
                                source={require('../../../assets/icons/player2.png')} 
                                style={[styles.playerImg, activePlayer == player2 && styles.activePlayer]}
                            />
                            <Text style={styles.activePlayersName}>{activePlayer}´s Turn</Text>
                            <Text style={styles.life}>Life: {activePlayer == player1 ? lpPlayer1 : lpPlayer2}</Text>
                            <Text style={styles.points}>Points: {activePlayer == player1 ? pointsPlayer1 : pointsPlayer2}</Text>
                        </View>

                        {secondsLeft !== 0 && 
                            <View style={styles.countdown}>
                                <Text style={styles.countdownText}><Text style={{fontWeight:'bold'}}>{secondsLeft}</Text>s</Text>
                            </View>
                        }
                        <View style={styles.turnLeft}>
                            <Text style={styles.turnLeftText}>Left: <Text style={{color:customVariables.lightColor, fontSize:25,}}>{limit-turn}</Text></Text>
                        </View>

                        {/* //Pause game button */}
                        <View style={styles.pauseView}>
                            <TouchableOpacity style={styles.pauseBtn} onPress={()=> {
                                    setPausedSeconds(secondsLeft);
                                    setPaused(true);
                                }}>
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
                                <TouchableOpacity style={styles.pauseMenuBtn} onPress={()=> {
                                    setPaused(false);
                                    start(pausedSeconds);
                                }}>
                                    <Text style={styles.pauseMenuBtnText}>CONTINUE</Text>
                                    {/* <Svg height={50} width={50}>
                                        <Polygon points="20,0 50,25 20,50" fill="white" />
                                    </Svg> */}
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.pauseMenuBtn} onPress={()=> {setSelectedCategory(''),setPlayersSelected('')}}>
                                    <Text style={styles.pauseMenuBtnText}>NEW GAME</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.pauseMenuBtn} onPress={()=> setSelectedCategory('')}>
                                    <Text style={styles.pauseMenuBtnText}>CATEGORIES</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.pauseMenuBtn} onPress={()=> navigation.navigate('Home')}>
                                    <Text style={styles.pauseMenuBtnText}>MAIN MENU</Text>
                                </TouchableOpacity>
                            </View>
                        </ImageBG>
                    </>
                }
            </>
            :
                <ImageBG imgName={'pause'}>
                    <View style={styles.pauseMenuBtns}>
                        {/* if life points of any player goes zero, game over!
                            Otherwise player with most points win!
                        */}
                        <View>
                            {playerWon == 'draw' ? 
                            <>
                                <Text style={[styles.playerWonText, {fontSize:55}]}>Draw!</Text>
                            </>
                            :
                                <View style={styles.playerWon}>
                                    {playerWon == player1 ?
                                            <>
                                                <Image 
                                                    source={require('../../../assets/icons/player1.png')} 
                                                    style={styles.gameOverPlayerImg}
                                                />
                                                <View>
                                                    <Text style={styles.playerWonText}>{player1} Won!</Text>
                                                    <Text style={styles.playerWonSubText}>Points: {pointsPlayer1}</Text>
                                                </View>
                                            </>
                                    :
                                        <>
                                            <Image 
                                                source={require('../../../assets/icons/player2.png')} 
                                                style={styles.gameOverPlayerImg}
                                            />
                                            <View>
                                                <Text style={styles.playerWonText}>{player2} Won!</Text>
                                                <Text style={styles.playerWonSubText}>Points: {pointsPlayer2}</Text>
                                            </View>
                                        </>
                                    }
                                </View>
                            }
                        </View>
                        <View style={styles.gameOverNavigateBtns}>
                            <TouchableOpacity style={styles.pauseMenuBtn} onPress={()=> {setSelectedCategory(''),setPlayersSelected('')}}>
                                <Text style={styles.pauseMenuBtnText}>NEW GAME</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.pauseMenuBtn} onPress={()=> navigation.navigate('Home')}>
                                <Text style={styles.pauseMenuBtnText}>MAIN MENU</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBG>
            }

        </View>
    );
}

const styles = StyleSheet.create({
    containerMPPlayground:{
        width:'100%',
        height:'100%',
    },
    lowDarkTilt:{
        height:'100%',
        width:'100%',
        backgroundColor:customVariables.lowDarkTilt,
        position:'absolute',
    },
    infoBox:{
        position:'absolute',
        top:5,
        left:5,
        // backgroundColor:customVariables.lowDarkTilt,
        width:200,
        borderRadius:10,
           //If the platform is IOS
           ...Platform.select({
            ios: {
                left:'5%'
            },
        }),
    },
    activePlayersName:{
        color:customVariables.lightGold,
        left:75,
        fontFamily:customVariables.secondaryFont,
        letterSpacing:1,
        fontSize:18,
        marginTop:12,
        marginBottom:3,
    },
    life:{
        color:customVariables.lightColor,
        left:75,
        fontFamily:customVariables.secondaryFont,
        letterSpacing:1,
    },
    points:{
        color:customVariables.lightColor,
        left:75,
        fontFamily:customVariables.secondaryFont,
        letterSpacing:1,
    },
    // activePlayersName:{
    //     color:customVariables.lightColor,
    //     position:'absolute',
    //     left:17,
    //     top:80,
    //     fontFamily:customVariables.secondaryFont,
    //     letterSpacing:1,
    //     fontSize:17,
    // },
    playerImg:{
        resizeMode:'cover',
        width:55,
        height:55,
        borderRadius:10,
        position:'absolute',
        opacity:0.35,
    },
    activePlayer:{
        zIndex:1,
        marginLeft:10,
        marginTop:10,
        width:60,
        height:60,
        opacity:1,
        borderWidth:1,
        borderColor:customVariables.lightGold,
    },
    countdown:{
        position:'absolute',
        bottom:90,
        left:5,
        width:45,
        height:45,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:100,
        borderWidth:3,
        borderColor:customVariables.darkGold,
        backgroundColor:customVariables.lightColor,

        //If the platform is IOS
        ...Platform.select({
            ios: {
                left:'5%',
            },
        }),
    },
    countdownText:{
        fontSize:16,
        color:customVariables.lightGold,
        fontFamily:customVariables.baseFont,
    },
    turnLeft:{
        position:'absolute',
        bottom:55,
        left:10,
        justifyContent:'center',
        alignItems:'center',

        //If the platform is IOS
        ...Platform.select({
            ios: {
                left:'5%',
            },
        }),
    },
    turnLeftText:{
        fontSize:16,
        color:customVariables.lightGold,
        fontFamily:customVariables.baseFont,
    },
    descBox:{
        justifyContent:'center',
        alignItems:'center',
        // width:(customVariables.devicesWidth)*.5,
        position:'absolute',
        top:110,
        width:'100%',
        paddingHorizontal:'7%',

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
        fontFamily:customVariables.secondaryFont,
    },
    boxes:{
        // flex:1,
        // width:'auto',
        position:'absolute',
        // right:'17%',
        top:220,
        width:'100%',
        paddingHorizontal:'7%',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        gap:10,
        flexWrap:'wrap',
          //If the platform is IOS
          ...Platform.select({
            ios: {
                width:'90%',
                paddingLeft:'10%',
                paddingRight:0,
            },
        }),
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
        //If the platform is IOS
        ...Platform.select({
            ios: {
                bottom:19,
                right:88
            },
        }),
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

        ...Platform.select({
            ios: {
                bottom:"unset",
                right:48,
            },
        }),
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
        width:23,
        height:23,
        justifyContent:'center',
        alignItems:'center',
    },
    pauseIcon:{
        fontFamily:customVariables.baseFont,
        color:customVariables.lightColor,
        letterSpacing:2,
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
    
    //GameOver Screen
    playerWon:{
        flexDirection:'row',
        justifyContent:'space-around',
        gap:15,
        alignItems:'center',
    },
    gameOverPlayerImg:{
        resizeMode:'cover',
        width:100,
        height:100,
        borderRadius:10,
    },
    playerWonText:{
        fontFamily:customVariables.baseFont,
        color:customVariables.lightColor,
        fontSize:20,
    },  
    playerWonSubText:{
        fontFamily:customVariables.baseFont,
        color:customVariables.lightColor,
        fontSize:20,
    },  
    
    gameOverNavigateBtns:{
        marginTop:10,
        flexDirection:"row",
        gap:15,
    },

});
