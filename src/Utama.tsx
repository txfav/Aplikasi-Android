import React,{useState, useEffect, useContext} from "react";
import { View, Text, SafeAreaView, StatusBar } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import moment from "moment";
import { AppContext } from "./Auth";

import Menu from "./component/Menu";
import database from "./component/Firebaseconfig";
import Toaster from "./component/Toaster";

const Utama = () => {
  const {name} = useContext(AppContext);

  const [cTime, setCTime] = useState('');
  let [doorState, setDoorState] = useState('');
  const [lastOpenedCal, setLastOpenedCal] = useState('');
  const [lastOpenedTime, setLastOpenedTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() =>{
      setCTime(moment().format('HH:mm:ss'));
    }, 1000);   
  
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    database.ref("data/Pintu/").on("value", function (snapshot){
      let data = snapshot.val();
      setDoorState(data);
      if (data === 1){
        setLastOpenedCal(moment().format('YYYY-MM-DD'));
        setLastOpenedTime(moment().format('HH:mm:ss'));
      }
    });
  },[]);


  let sPintu;
  if (doorState === 0) {
    sPintu = "PINTU TERTUTUP";
  } else {
    sPintu = "PINTU TERBUKA";
    Toaster(sPintu)
  }

  
  return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#c6e6e6'}}>
      <StatusBar backgroundColor={'#c6e6e6'}/>
      <View style={{
        height: '15%', 
        backgroundColor: '#49e4dd', 
        flexDirection: 'row',
        borderBottomLeftRadius: 15, 
        borderBottomRightRadius: 15,
      }}>
        <View style={{
          width: '45%',
          backgroundColor: '#dfff',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopRightRadius: 15,
          borderBottomRightRadius: 15,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 5, height: 3 },
          shadowOpacity: 1,
          shadowRadius: 2,
        }}>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: 'black', }}>SELAMAT DATANG</Text>
          <Text style={{fontSize: 15, fontWeight: 'bold', color: 'black', }}>'{name}'</Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center', width: '55%', flexDirection: 'row'}}>
          <Icon name='time' size={50} color="#fff" />
          <Text style={{
            fontSize: 30,
            fontWeight: 'bold'
          }}>
            {cTime}
          </Text>
        </View>
      </View>   
      <View style={{flex: 1, alignItems: 'center'}}>
        <Text style={{fontSize: 25}}>{sPintu}</Text>
        
        {lastOpenedCal && <Text style={{fontSize: 16, marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>Pintu terakhir kali terbuka pada: {lastOpenedCal}</Text>}
        <Text style={{fontSize: 20, justifyContent: 'center'}}>{lastOpenedTime}</Text>
      </View>
      <Menu />
      
    </SafeAreaView>
  );
}


export default Utama;