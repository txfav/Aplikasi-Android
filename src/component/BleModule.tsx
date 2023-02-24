import BleManager from 'react-native-ble-manager';

const BleModule = {
  start: async () => {
    await BleManager.start({showAlert: false});
  },
  scan: async (timeout, serviceUUIDs) => {
    return new Promise((resolve, reject) => {
      BleManager.scan(serviceUUIDs, timeout, true)
        .then(results => {
          resolve(results);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  connect: async (peripheralId) => {
    return new Promise((resolve, reject) => {
      BleManager.connect(peripheralId)
        .then(() => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  write: async (peripheralId, serviceUUID, characteristicUUID, data) => {
    return new Promise((resolve, reject) => {
      BleManager.write(peripheralId, serviceUUID, characteristicUUID, data)
        .then(() => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  read: async (peripheralId, serviceUUID, characteristicUUID) => {
    return new Promise((resolve, reject) => {
      BleManager.read(peripheralId, serviceUUID, characteristicUUID)
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  stopScan: async () => {
    return new Promise((resolve, reject) => {
      BleManager.stopScan()
        .then(() => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
};

export default BleModule;
