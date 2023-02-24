import { BleManager } from 'react-native-ble-plx';
import Toaster from './Toaster';

const _BleManager = new BleManager()

const connectDevice = async function (deviceId) {

    console.log("connecting to device..")
    
    const msg = await _BleManager.connectToDevice(deviceId, null)
        .then(async (device) => {

            console.log('isConnected', await device.isConnected())
            console.log('discovering all services and characteristics...')
            const data = await _BleManager.discoverAllServicesAndCharacteristicsForDevice(device.id)
            console.log("Discovery", data)
            console.log('success')
            console.log('listing all available service uuids')
            const services = await data.services();
            console.log('services', services);
            console.log("success")
            console.log("Listing readable characteristics for service : '00001801-0000-1000-8000-00805f9b34fb' ")
            const readableCharacteristics = await data.characteristicsForService('00001801-0000-1000-8000-00805f9b34fb')
            console.log('readable chars', readableCharacteristics);
            console.log('success')
            //upOnConnection(data, device.id, device.name)

            return data
            
        })
        .catch((error) => {
            console.log(error.message)
            return error.message
        });

    return msg
}




export { _BleManager, connectDevice }