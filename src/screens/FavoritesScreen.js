import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import navigation hooks
import { db, auth } from '../firebase/firebaseConfig'; // Firebase Firestore

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); // Initialize navigation

  const fetchFavorites = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const favsSnapshot = await getDocs(collection(db, 'users', user.uid, 'favorites'));
        const favs = favsSnapshot.docs.map(doc => doc.data());
        setFavorites(favs);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    }
  };

  // Use useFocusEffect to refetch the data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchFavorites();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff7f50" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noFavoritesText}>No favorite recipes yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Favorite Recipes</Text>
      <FlatList
        data={favorites}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('RecipeDetail', { mealId: item.idMeal })} // Navigate to RecipeDetailScreen
          >
            <Image source={{ uri: item.strMealThumb }} style={styles.image} />
            <Text style={styles.itemTitle}>{item.strMeal}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.idMeal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0e4d7', // Beachy sandy color for the background
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ff7f50', // Coral color for the header text
    textAlign: 'center', // Centered for a clean look
  },
  noFavoritesText: {
    fontSize: 18,
    color: '#555', // Soft grey for no favorites text
    textAlign: 'center',
    marginTop: 20,
  },
  item: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Slight elevation to lift item
    flexDirection: 'row', // Row layout to display image and text side by side
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 20, // Spacing between image and text
    flexShrink: 1, // Prevent text from overflowing
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default FavoritesScreen;
