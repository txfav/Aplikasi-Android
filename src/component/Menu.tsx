import React,{useState} from "react";
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";




const Menu = () => {
  const navigation = useNavigation();
    return (
        <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#078f8f',
          elevation: 20,
          alignItems: 'center',
          paddingTop: 7,
          paddingBottom: 7,
          marginHorizontal: 20,
          marginBottom: 20,
          borderRadius: 20,
        }}>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={()=>navigation.navigate('Utama' )}
          >
            <Icon name='home' size={50} color="#900" style={{marginTop: 15}} />
            <Text style={{fontSize: 15, fontWeight: '900'}}>HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
            onPress={()=>navigation.navigate('Scanble')}
          >
            <Icon name='scan' size={50} color="#900" style={{marginTop: 15}} />
            <Text style={{fontSize: 15, fontWeight: '900'}}>SCAN BLE</Text>
          </TouchableOpacity>  
        </View>
        
    );
}

export default Menu;