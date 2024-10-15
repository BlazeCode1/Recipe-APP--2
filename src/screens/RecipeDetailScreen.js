import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'; // Added deleteDoc for removing from favorites
import { db, auth } from '../firebase/firebaseConfig';
import { FontAwesome } from '@expo/vector-icons';

const RecipeDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { mealId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false); // Favorite state
  const [user, setUser] = useState(null); // Current user

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const mealDoc = await getDoc(doc(db, 'meals', mealId));
        if (mealDoc.exists()) {
          setRecipe(mealDoc.data());
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meal:', error);
        setLoading(false);
      }
    };

    const checkUser = () => {
      const currentUser = auth.currentUser;
      setUser(currentUser);
      if (currentUser) {
        checkIfFavorite(currentUser.uid); // Check if the recipe is already favorited
      }
    };

    const checkIfFavorite = async (userId) => {
      try {
        const userFavoriteRef = doc(db, 'users', userId, 'favorites', mealId);
        const favDoc = await getDoc(userFavoriteRef);
        if (favDoc.exists()) {
          setIsFavorite(true); // Recipe is already in favorites
        } else {
          setIsFavorite(false); // Recipe is not in favorites
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    fetchMeal();
    checkUser(); // Check if user is signed in and check favorite status
  }, [mealId]);

  const toggleFavorite = async () => {
    if (!user) {
      Alert.alert('Please Sign In', 'You need to sign in to add to favorites.');
      navigation.navigate('LoginRegister'); // Redirect to login screen if not signed in
      return;
    }

    try {
      const userFavoritesRef = doc(db, 'users', user.uid, 'favorites', mealId);
      if (isFavorite) {
        await deleteDoc(userFavoritesRef); // Remove from favorites if already favorited
        setIsFavorite(false);
      } else {
        await setDoc(userFavoritesRef, recipe); // Add to favorites
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {recipe && (
        <View>
          {/* Recipe Image */}
          <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />

          {/* Favorite Button inside Image */}
          <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
            <FontAwesome name={isFavorite ? 'heart' : 'heart-o'} size={30} color="#ff4757" />
          </TouchableOpacity>

          <View style={styles.recipeDetails}>
            <Text style={styles.title}>{recipe.strMeal}</Text>

            {/* Instructions */}
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.instructions}>{recipe.strInstructions}</Text>

            {/* Ingredients and Measurements */}
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsContainer}>
              {recipe.ingredients.map((item, index) => (
                <Text key={index} style={styles.ingredient}>
                  {item.measure} {item.ingredient}
                </Text>
              ))}
            </View>

            {/* YouTube Video Button */}
            {recipe.strYoutube && (
              <TouchableOpacity style={styles.youtubeButton} onPress={() => Linking.openURL(recipe.strYoutube)}>
                <Text style={styles.youtubeText}>Watch Video Tutorial</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0e4d7',
  },
  image: {
    width: '100%',
    height: 400,
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  recipeDetails: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#ff7f50', // Coral color
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  ingredientsContainer: {
    marginBottom: 16,
  },
  ingredient: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },
  youtubeButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#ff7f50',
    borderRadius: 8,
    alignItems: 'center',
  },
  youtubeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecipeDetailScreen;
