import React, { useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";

const AlertWindow = () => {
    
    return (
        Alert.alert("Connecting...", "Please wait while connecting to the device",
            [
                { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ],
            {cancelable: true}
        )
    )
}

const styling = StyleSheet.create({
});

export default AlertWindow;