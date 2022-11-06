import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, DatePickerIOSComponent } from 'react-native';

export default function Settings({ route, navigation }) {

    const [email, setEmail] = useState('')

    useEffect(() => {
        AsyncStorage.getItem('email').then((value) => {
            setEmail(value)
        })
    }, [])

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.text}>Welcome {email}</Text>
            <Text style={styles.button} 
                onPress={() => {
                    AsyncStorage.setItem('email', '')
                    AsyncStorage.setItem('token', '')
                    route.params.refresh()
                }}
            >Disconnect</Text>
            <StatusBar style="auto" />
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    button: {
        color: '#7158e2',
        fontSize: 20,
        margin: 5,
    },
    title: {
        fontSize: 45,
        fontWeight: 'bold',
        margin: 10,
    },
    text: {
        fontSize: 18,
        margin: 5,
    }
})