import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Text,
  TextInput,
} from "react-native";

import { realtimeDb } from "./firebaseConfig";
import { onValue, ref, remove, set } from "firebase/database";
import { uid } from "uid";

const HomeTwo = () => {
  const uuId = uid();
  const [x, setName] = useState("");
  const [data, setData] = useState([]);
  const [edit,setEdit] = useState(false);
  const [idItem,setIdItem] = useState("");

  //read
  useEffect(() => {
    const startCountref = ref(realtimeDb);
    onValue(startCountref, (shot) => {
      setData(Object.values(shot.val()));
    });
  }, []);
  //create
  const addUser = () => {
    set(ref(realtimeDb, uuId), {
      name: x,
      id: uuId,
    });
    setName("");
    // console.log(name);
  };
  const handleDelete = (id) => {
    remove(ref(realtimeDb,id))
  }
  const handleEdit = (item) => {
    setEdit(true);
    setName(item.name);
    setIdItem(item.id);
  };

  const editUser = () => {
    const itemRef = ref(realtimeDb, idItem);
    set(itemRef, {
      name: x,
      id: idItem,
    });
    setEdit(false);
    setName("");
    setIdItem("");
  };

  return (
    <View style={styles.continer}>
      <>
        <Text style={{ fontSize: 18 }}>Name:</Text>
        <TextInput
          style={styles.input}
          value={x}
          onChangeText={(value) => setName(value)}
        />

        <Pressable style={styles.btn} onPress={edit ? editUser:addUser}>
          <Text style={styles.text}>add</Text>
        </Pressable>
      </>
      {/* {data.map((ele) => (
        <Text>{ele.name}</Text>
      ))} */}

      {data.map((zz) => (
        <Text key={zz.id}>{zz.name}</Text>
      ))}
      <ScrollView style={{ height: 300 }} showsVerticalScrollIndicator={false}>
        {data.length > 0 &&
          data.map((ele) => (
            <View style={{ marginTop: 10 }} key={ele.id}>
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                {ele.name}
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Pressable
                  style={{
                    backgroundColor: "#dddd",
                    borderRadius: 5,
                    flex: 1,
                    marginEnd: 3,
                  }}
                  onPress={(()=>handleEdit(ele))}
                >
                  
                   <Text style={{
                    fontSize: 20,
                    textAlign: "center",
                    padding: 5,
                  }}>{edit ? "Edit" : "Add"}</Text>
                </Pressable>
                <Pressable
                  style={{
                    backgroundColor: "#ff0009",
                    borderRadius: 5,
                    flex: 1,
                  }}
                  onPress={() => handleDelete(ele.id)}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      textAlign: "center",
                      padding: 5,
                      color: "white",
                    }}
                  >
                    Delete
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  continer: {
    marginTop: 40,
    paddingHorizontal: 10,

    height: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#263238",
    borderRadius: 5,
    color: "black",
    padding: 5,
    textAlign: "left",
  },
  btn: {
    backgroundColor: "#00796b",
    padding: 5,
    borderRadius: 6,
    marginTop: 10,
  },
  text: {
    padding: 5,
    color: "white",
    textAlign: "center",
    fontSize: 19,
  },
});

export default HomeTwo;
