import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
// import Todo from "./todo";
// import Home from "./home";
import HomeTwo from "./homeTwo";

export default function App() {
  return (
    <View>
      
      <HomeTwo />
     
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   // flex: 1,
  //   // backgroundColor: "#fff",
  //   padding: 10,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
});
