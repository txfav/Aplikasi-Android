import React, { useContext } from "react";
import { Text, View, TouchableOpacity, TextInput, SafeAreaView, StatusBar, Image } from "react-native";
import { AppContext } from "./Auth";


const Login = ({navigation}) => {
  const { name, setName } = useContext(AppContext);

  const onPress = () => {
    navigation.navigate('Utama');
  };
  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#91a7cd', alignItems: 'center', justifyContent: 'center'}}>
      <StatusBar backgroundColor={'#91a7cd'}/>
      <Image 
        source={require('../Halo.png')}
        style={{width: 100, height: 100}}
      />
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 25, color: 'white', fontWeight: 'bold'}}>WELCOME</Text>
        <Text style={{fontSize: 25, color: '#303131', fontWeight: 'bold'}}> Back</Text>
      </View>
      <TextInput
        style={{
          borderRadius: 8,
          borderColor: "#ccc",
          height: 40,
          width: '80%',
          borderWidth: 1,
          padding: 8,
          marginBottom: 16,
          textAlign: 'center',
          alignContent: 'center'
        }}
        placeholder="Enter your name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TouchableOpacity 
        style={{    
          backgroundColor: '#0a9c9c',
          shadowColor: "black",
          paddingVertical: 16,
          paddingHorizontal: 32,
          borderRadius: 8,
        }}
        onPress={onPress}        
      >
        <Text style={{color: '#FFF', fontSize: 18, fontWeight: 'bold'}}>MASUK</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Login;
