import AsyncStorage from '@react-native-async-storage/async-storage';
// import RNFS from 'react-native-fs';
import { avatarMap } from './categories';

export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.log('Error storing data',error);
    }
}

export const getItemFor = async (key) => {
    try{
        const data = await AsyncStorage.getItem(key);
        return data;
    }catch(error){
        console.log('Error on getting data from storage', error);
    }
}
export const resetStorage = async (key) => {
    try{
        // const data = await AsyncStorage.clear();
        // return data;
        
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
        let reseted = await storeData('@progress', JSON.stringify(usersProgress));

        return reseted;
    }catch(error){
        console.log('Error on clearing the save data from storage', error);
    }
}

// export const saveAvatarsToDeviceStorage = async () => {
//   try {
//     // Get the directory path for storing images
//     const directoryPath = RNFS.DocumentDirectoryPath;

//     // Iterate over the avatarMap and copy each image to the device storage
//     for (const avatarKey in avatarMap) {
//       const imagePath = avatarMap[avatarKey];
//       console.log(imagePath);
//     //   const sourcePath = require(`../assets/avatars/${imagePath}.jpg`);

//       // Copy the image to the device storage
//     //   await RNFS.copyFileAssets(sourcePath, `${directoryPath}/${imagePath}`);
//     }

//     console.log('Images saved to device storage successfully!');
//   } catch (error) {
//     console.error('Error saving images to device storage:', error);
//   }
// };