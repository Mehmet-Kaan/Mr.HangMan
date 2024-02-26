import React from "react";
import { View, StyleSheet, ImageBackground } from "react-native";

// Map your image URLs to require statements
  const imageMap = {
    //Images
    welcome: require("../assets/images/welcome.jpg"),
    hangman: require("../assets/images/hangman.jpg"),
    book: require("../assets/images/book.jpg"),
    bg: require("../assets/images/bg.jpeg"),
    pause: require("../assets/images/pause.jpg"),
    gameover: require("../assets/images/gameover.jpg"),
    theme: require("../assets/images/theme.png"),

    //Playgrounds
    playground: require("../assets/images/playground.jpg"),
    playground2: require("../assets/images/playground2.jpg"),
    
    //Icons
    technology: require("../assets/icons/technology.png"),
    sport: require("../assets/icons/sport.png"),
    movies: require("../assets/icons/movies.png"),
    series: require("../assets/icons/series.png"),
    explore: require("../assets/icons/explore.png"),
    travel: require("../assets/icons/travel.png"),
    music: require("../assets/icons/music.png"),
    science: require("../assets/icons/science.png"),
    celebrities: require("../assets/icons/celebrities.png"),
    food: require("../assets/icons/food.png"),
    fashion: require("../assets/icons/fashion.png"),
    health: require("../assets/icons/health.png"),
    superheroes: require("../assets/icons/superheros.png"),
    business: require("../assets/icons/business.png"),
    education: require("../assets/icons/education.png"),
    art: require("../assets/icons/art.png"),
    books: require("../assets/icons/books.png"),
    fitness: require("../assets/icons/fitness.png"),
    home: require("../assets/icons/home.png"),
    gardening: require("../assets/icons/gardening.png"),
    cars: require("../assets/icons/cars.png"),
    pets: require("../assets/icons/pets.png"),
    'science-fiction': require("../assets/icons/scifi.png"),
    countries: require("../assets/icons/countries.png"),

  };

export default function ImageBG(prop) {
    const backgroundImage = imageMap[prop.imgName] || null;
    return ( 
            <ImageBackground 
                source={backgroundImage}
                style={styles.bgImage}
            >
                {prop.children}
            </ImageBackground>
     );
}

const styles = StyleSheet.create({
    bgImage:{
        flex: 1,
        justifyContent:'center',
        resizeMode: "cover",
    },
})