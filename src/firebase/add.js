const { db } = require('./firebaseConfig'); // Import Firestore from firebaseConfig
const axios = require('axios'); // Import axios for HTTP requests
const { collection, doc, setDoc } = require('firebase/firestore'); // Import Firestore methods

const fetchAndStoreMeals = async () => {
  try {
    // Fetch meal data from TheMealDB API
    const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    const meals = response.data.meals;

    // Loop through each meal and store it in Firestore
    for (const meal of meals) {
      const mealRef = doc(collection(db, 'meals'), meal.idMeal); // Reference to the meal document
      await setDoc(mealRef, {
        idMeal: meal.idMeal,
        strMeal: meal.strMeal,
        strCategory: meal.strCategory,
        strArea: meal.strArea,
        strInstructions: meal.strInstructions,
        strMealThumb: meal.strMealThumb,
        strYoutube: meal.strYoutube,
        ingredients: Array.from({ length: 20 }, (_, i) => ({
          ingredient: meal[`strIngredient${i + 1}`],
          measure: meal[`strMeasure${i + 1}`],
        })),
      });
    }

    console.log('Meals added to Firestore');
  } catch (error) {
    console.error('Error fetching and storing meals:', error);
  }
};

// Call the function
fetchAndStoreMeals();
