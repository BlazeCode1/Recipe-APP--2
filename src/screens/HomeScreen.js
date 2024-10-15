import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, TextInput, StyleSheet, TouchableOpacity, Image, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { query, collection, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // Firebase config
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [recipe, setRecipe] = useState(null); // State for random recipe
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [searchResults, setSearchResults] = useState([]); // State for search results
  const [loading, setLoading] = useState(true);
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  // Fetch a new random recipe every time the app loads
  useEffect(() => {
    const fetchRandomMeal = async () => {
      try {
        // Fetch all meals from Firestore
        const mealsSnapshot = await getDocs(collection(db, 'meals'));
        const meals = mealsSnapshot.docs.map((doc) => doc.data());

        // Select a random meal from the fetched meals
        const randomMeal = meals[Math.floor(Math.random() * meals.length)];
        setRecipe(randomMeal);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching random meal: ', error);
        setLoading(false);
      }
    };

    fetchRandomMeal();
  }, []);

  // Function to handle search
  const handleSearch = async () => {
    try {
      setLoading(true); // Show loading indicator

      // Fetch all meals from Firestore
      const mealsRef = collection(db, 'meals');
      const querySnapshot = await getDocs(query(mealsRef, orderBy('strMeal')));
      const allMeals = querySnapshot.docs.map((doc) => doc.data());

      if (searchTerm.trim()) {
        const filteredResults = allMeals.filter((meal) =>
          meal.strMeal.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error searching meals:', error);
      setLoading(false);
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Search bar and icons */}
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for recipes"
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <FontAwesome name="search" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Favorites')}>
            <FontAwesome name="heart" size={24} color="#ff4757" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('LoginRegister')}>
            <MaterialIcons name="account-circle" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* If search results exist, show them; otherwise, show the random recipe */}
      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.mealBox}
              onPress={() => navigation.navigate('RecipeDetail', { mealId: item.idMeal })}
            >
              <Image source={{ uri: item.strMealThumb }} style={styles.mealImage} />
              <View style={styles.mealOverlay}>
                <Text style={styles.mealName}>{item.strMeal}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        recipe && (
          <ImageBackground
            source={{ uri: recipe.strMealThumb }}
            style={styles.imageBackgroundFull}
            imageStyle={{ opacity: 0.7 }}
          >
            <View style={styles.overlay}>
              <Text style={styles.title}>{recipe.strMeal.toUpperCase()}</Text>
              <Text style={styles.description}>{recipe.strInstructions.slice(0, 100)}...</Text>
            </View>

            <TouchableOpacity
              style={styles.moreInfoContainer}
              onPress={() => navigation.navigate('RecipeDetail', { mealId: recipe.idMeal })}
            >
              <View style={styles.circleImageContainer}>
                <Image source={{ uri: recipe.strMealThumb }} style={styles.circleImage} />
              </View>
              <Text style={styles.moreInfoText}>Click for more information</Text>
            </TouchableOpacity>
          </ImageBackground>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0e4d7', // Light sandy beach color
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 40,
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 10,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
  },
  imageBackgroundFull: {
    height: 400,
    justifyContent: 'space-between',
  },
  overlay: {
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
  },
  description: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    lineHeight: 22,
    fontFamily: 'Poppins_400Regular',
  },
  moreInfoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  circleImageContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  circleImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  moreInfoText: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  mealBox: {
    backgroundColor: '#ffdab9', // Light peachy background for meals
    borderRadius: 10,
    marginHorizontal: 10,
    width: '45%', // Adjust for two-column layout
    height: 150,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  mealImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.9,
  },
  mealOverlay: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Softer overlay for text
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

export default HomeScreen;
