import React, { useEffect, useState } from 'react';
import { TouchableOpacity, PermissionsAndroid, View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Toaster from './component/Toaster';
import { bleManager, connectDevice } from './component/bleManager';

const ListBleDevicesScreen = function App({ navigation }) {

    const [buttonTextState, setButtonTextState] = useState('Start Scanning')
    const [deviceList, setDeviceList] = useState([])
    const [isScanning, setIsScanning] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)

    const requestLocationPermission = async function () {

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Permission Localisation Bluetooth',
                message: 'Requirement for Bluetooth',
                buttonNeutral: 'Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permission Granted. Try scanning again");

        } else {
            console.log("Permission denied");
        }
    }

    const checkScanState = async () => {

        if (buttonTextState === 'Start Scanning') {
            setIsScanning(true)
            startScan()
            console.log("Scanning started")
            setButtonTextState("Stop Scanning")
        }
        else {
            stopScan()
        }
    }

    const startScan = async function () {
        Toaster("Scanning time : 10 seconds")
        deviceList.length = 0
        bleManager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                stopScan()
                console.log(error.message)
                switch (error.message) {
                    case "Device is not authorized to use BluetoothLE":
                        requestLocationPermission()
                        Toaster("Please provide location permissions")
                        return
                    case "BluetoothLE is powered off":
                        Toaster("Please turn on your bluetooth")
                        return
                    case "Location services are disabled":
                        Toaster("Please turn on your location")
                        return
                    default:
                        Toaster(error.message)
                }
                return
            }

            let deviceInfo = { deviceId: device.id, deviceName: device.name }
            let checkIfAlreadyListed = deviceList
                .map(item => item.deviceId)
                .includes(device.id)

            if (!checkIfAlreadyListed) {
                deviceList.push(deviceInfo)
                setDeviceList(deviceList)
                console.log(deviceList)
            }
        });

        setTimeout(() => { stopScan() }, 10000);
    }

    const stopScan = async function () {
        bleManager.stopDeviceScan()
        setIsScanning(false)
        console.log("Scanning Stopped")
        setButtonTextState("Start Scanning")
    }

    const connect = async function (deviceId, deviceName) {

        const connection = await connectDevice(deviceId)

        if (typeof (connection) === typeof (""))
            Toaster(connection)
        else
            upOnConnection(connection, deviceId, deviceName)
    }

    const upOnConnection = function (data, connectedDeviceId, connectedDeviceName) {

        Toaster("Connected with the device successfully");
        navigation.navigate("Device Action", { data: data, deviceId: connectedDeviceId, deviceName: connectedDeviceName })
        setIsConnecting(false)
    }

    return (
        <View style={styling.container}>
            <View style={styling.buttonContainer}>
                <TouchableOpacity style={styling.button} onPress={() => { checkScanState() }}>
                    <Text style={styling.buttonText}>{buttonTextState}</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }} >
                <FlatList
                    data={deviceList}
                    keyExtractor={(item) => {
                        return item.deviceId;
                    }}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity>
                                <View style={styling.row}>
                                    <View>
                                        <View style={styling.nameContainer}>
                                            <Text style={styling.nameTxt}>{item.deviceId}</Text>
                                            <TouchableOpacity style={styling.buttonConnect} onPress={() => { connect(item.deviceId, item.deviceName); setIsConnecting(true) }}>
                                                <Text style={styling.buttonTextConnect}>Connect</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styling.msgContainer}>
                                            <Text style={styling.msgTxt}>{item.deviceName}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }} />
            </View>

            {isScanning ? <ActivityIndicator style={styling.pBar} size="large" /> : null}
            {isConnecting ? Toaster("Connecting to device..please wait") : null}

        </View>
    );
}

const styling = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 10,
        borderRadius: 13,
        alignItems: 'center',
    },
    buttonConnect: {
        backgroundColor: '#549F58',
        width: '30%',
        padding: 5,
        borderRadius: 13,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonTextConnect: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#DCDCDC',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        padding: 10,
    },
    pic: {
        borderRadius: 30,
        width: 60,
        height: 60,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 280,
    },
    nameTxt: {
        marginLeft: 15,
        fontWeight: '600',
        color: '#222',
        fontSize: 18,
        width: 170,
    },
    mblTxt: {
        fontWeight: '200',
        color: '#777',
        fontSize: 13,
    },
    msgContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -20
    },
    msgTxt: {
        fontWeight: '400',
        color: '#008B8B',
        fontSize: 18,
        marginLeft: 15,
    },
    pBar: {
        borderColor: "black",
        position: "absolute",
        top: 300
    }
});


export default ListBleDevicesScreen