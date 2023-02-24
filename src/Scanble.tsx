import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  NativeEventEmitter,
  NativeModules,
  Platform,
  PermissionsAndroid,
  AppState,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Switch,
} from 'react-native';
import BleManager, { isPeripheralConnected } from 'react-native-ble-manager';
import Menu from './component/Menu';
import { Buffer } from 'buffer';
import Toaster from './component/Toaster';



const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


export default class Scanble extends Component {
  constructor(){
    super()

    this.state = {
      scanning:false,
      peripherals: new Map(),
      appState: '',
      isSwitchOn: false,
      connectedPeripheral: null,
      hasilData: '',
      isConnected: false,
    }

    this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
    this.handleStopScan = this.handleStopScan.bind(this);
    this.handleDisconnectedPeripheral = this.handleDisconnectedPeripheral.bind(this);
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);

    BleManager.start({showAlert: false});

    this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );
    this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan );
    this.handlerDisconnect = bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnectedPeripheral );
    this.handlerUpdate = bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic );



    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
          if (result) {
            console.log("Permission is OK");
          } else {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
              if (result) {
                console.log("User accept");
              } else {
                console.log("User refuse");
              }
            });
          }
      });
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
        if (result){
          console.log("Permission is OK");
        }else{
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Permission Localisation Bluetooth',
              message: 'Requirement for Bluetooth',
              buttonNeutral: 'Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }).then((result) => {
              if (result){
                console.log("OK");
              }else{
                console.log("refuse")
              }
            });
        }
      });
    }

  }

  handleAppStateChange(nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!')
      BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
        console.log('Connected peripherals: ' + peripheralsArray.length);
      });
    }
    this.setState({appState: nextAppState});
  }

  componentWillUnmount() {
    this.handlerDiscover.remove();
    this.handlerStop.remove();
    this.handlerDisconnect.remove();
    this.handlerUpdate.remove();
  }

  handleDisconnectedPeripheral(data) {
    let peripherals = this.state.peripherals;
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.services = [];
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      this.setState({peripherals});
    }
    console.log('Disconnected from ' + data.peripheral);
    clearInterval(this.readInterval);
  }

  

  handleStopScan() {
    console.log('Scan is stopped');
    this.setState({ scanning: false });
  }

  startScan() {
    
    if (!this.state.scanning) {
      Toaster ('Cari Banana');
      BleManager.scan([], 5, true).then((results) => {
        console.log('Scanning...');
      });
      this.setState({scanning:true});
    }
  }

  retrieveConnected(){
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals')
      }
      console.log(results);
      var peripherals = this.state.peripherals;
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        BleManager.retrieveServices(peripheral.id).then((peripheralInfo) => {
          console.log(peripheralInfo.services);
          peripheral.services = peripheralInfo.services;
          peripherals.set(peripheral.id, peripheral);
          this.setState({ peripherals });
        });

        this.setState({ peripherals });
      }
    });
  }

  readChar(){
    if(this.state.connectedPeripheral){
      var serviceUUID ='3d4b169a-5fe7-45d8-bb40-2fa4090a7cf5';
      var charUUID = '41f719c9-a8f4-45f0-bbfb-fbeef9d51412';
      BleManager.read(this.state.connectedPeripheral, serviceUUID, charUUID).then((readData) => {
        let decodedString = Buffer.from(readData).toString('utf-8');
        console.log('decoded string: ' + decodedString);
        this.setState({ hasilData: decodedString });
      })
      .catch((error) => {
        console.log('read Error' + error);
      });
    }else{
      console.log('No connected peripherals');
    }
  }

  onToggleSwitch = (value) => {
    this.setState({ isSwitchOn: value });
    if (value) {
      this.readInterval = setInterval(() => this.readChar(),500);
    }else{
      clearInterval(this.readInterval);
    }
  };

  

  handleDiscoverPeripheral(peripheral){
    var peripherals = this.state.peripherals;
    console.log('Got ble peripheral', peripheral);
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    peripherals.set(peripheral.id, peripheral);
    this.setState({ peripherals });
  }

  connect(peripheral){
    BleManager.stopScan();
    if(peripheral.connected){
      BleManager.disconnect(peripheral.id);
      this.setState({ connected: false, connectedPeripheral: null});
      if (this.state.peripherals.has(peripheral.id)) {
        let peripherals = this.state.peripherals;
        let p = peripherals.get(peripheral.id);
        if (p) {
          p.connected = false;
          peripherals.set(peripheral.id, p);
          this.setState({ peripherals, isConnected: false });
        }
      }
    }else{
      BleManager.connect(peripheral.id);
      this.setState({ connected: true, connectedPeripheral: peripheral.id });
      if (this.state.peripherals.has(peripheral.id)) {
        let peripherals = this.state.peripherals;
        let p = peripherals.get(peripheral.id);
        if (p) {
          p.connected = true;
          peripherals.set(peripheral.id, p);
          this.setState({ peripherals,isConnected: true });
          Toaster('Connected to '+peripheral.name);
        }
      }
    }
  }


  renderItem(item) {
    
    const color = item.connected ? 'green' : '#fff';        
    return (
      <TouchableHighlight onPress={() => this.connect(item) }>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text style={{fontSize: 12, textAlign: 'center', color: '#333333', padding: 2}}>{item.name}</Text>
          <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 2}}>RSSI: {item.rssi}</Text>
          <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 10}}>{item.id}</Text>
          {item.services && item.connected && (
            <View style={{padding: 10, margin : 10,}}>
              <Text style={{fontWeight: 'bold'}}>Services:</Text>
              <FlatList
                data={item.services}
                renderItem={({ item }) => <Text key={item.uuid} >{item.uuid}</Text>}
                keyExtractor={item => item.uuid}
              />
            </View>
          )}
        </View>
      </TouchableHighlight>
    );
  }


  render() {
    const list = Array.from(this.state.peripherals.values());
    const { isConnected } = this.state;    
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={{width: '50%', justifyContent: 'center'}}>
            <TouchableOpacity style={styles.button} onPress={() => this.startScan() }>
              <Text>SCAN ({this.state.scanning ? 'on' : 'off'})</Text>
            </TouchableOpacity>
          </View>
          <View style={{width: '50%', justifyContent: 'center'}}>
            <TouchableOpacity style={styles.button} onPress={() => this.retrieveConnected() }>
              <Text>{this.state.connected ? 'Connected' : 'Disconnected'} </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{height: '50%'}}>
          <View style={styles.scroll}>
            {(list.length == 0) &&
              <View style={{flex:1, margin: 20}}>
                <Text style={{textAlign: 'center', fontSize: 30, color: 'grey'}}>No peripherals</Text>
              </View>
            }
            <FlatList
              data={list}
              renderItem={({ item }) => this.renderItem(item) }
              keyExtractor={item => item.id}
            />
          </View>
        </View>
        <View style={{flex: 1}}>
          {(this.state.connected == true) && 
            <View style={{height: '20%', alignItems: 'center', justifyContent: 'center'}}>
              <View style={{flexDirection: 'row'}}>
                <Switch 
                  trackColor={{false: '#767577', true: '#81b0ff'}}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={this.onToggleSwitch}
                  value={this.state.isSwitchOn}
                />
                <Text style={{fontSize: 20, color: 'black'}}>
                  Baca Data
                </Text>

              </View>

              <Text style={{fontSize: 20, fontWeight: 'bold', color: 'grey'}}>{this.state.hasilData}</Text>
            </View>
          }

        </View>
        <Menu/>

      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#c6e6e6',
  },
  header: {
    height: '15%',
    elevation: 5,
    flexDirection: 'row',
    backgroundColor: '#1cffea',
  },
  button: {
    padding: 10, 
    margin: 10, 
    backgroundColor: '#3dabea', 
    alignItems: 'center', 
    justifyContent: 'center',
    borderRadius: 15,
    elevation: 5
  },
  scroll: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    margin: 16,
    borderRadius: 10,
    elevation: 3,
  },
  row: {
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 20,
    elevation: 5,
  },
  footer: {
    height: '20%',
  }
});