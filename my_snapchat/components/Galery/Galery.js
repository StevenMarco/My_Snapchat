import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import TextInput from '../TextInput';
import Buttons from '../Button';

export default function ImagePickerExample() {

    const [data, setData] = useState([])
    const [picture, setPicture] = useState()
    const [image, setImage] = useState(null)
    const [duration, setDuration] = useState("")
    const [token, setToken] = useState()
    const [email, setEmail] = useState("")

    useEffect(() => {
        AsyncStorage.getItem('token').then((token) => {
            if (token !== null) {
                setToken(token)
            } else {
                setToken('')
            }
        })
    }, [data])

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
            setPicture(result);
        }

    };

    const sendImage = async () => {

        var formData = new FormData();
        formData.append('duration', parseInt(duration));
        formData.append('to', email);
        formData.append('image', {
            uri: picture.uri,
            name: 'fileName',
            type: 'image/jpg'
        });

        console.log('token ', token);
        console.log(formData);

        // use fetch
        fetch('http://snapi.epitech.eu:8000/snap', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'token': token,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data.data)
                console.log('Success:', data);
                setImage(null)
            }
            )
            .catch((error) => {
                console.error('Error:', error);
            }
            );
    }
    
    if (!image) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {image && <Image source={{ uri: image }} style={{ width: "75%", height: "75%", marginBottom: 50 }} />}
                {/* <Button title="Pick an image from camera roll" onPress={pickImage} /> */}
                <Text style={{color:'#7158e2',fontSize:20}} onPress={pickImage}>Pick an image from camera roll</Text>
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                {image && <Image source={{ uri: image }} style={{ width: "65%", height: "65%", marginBottom: 10 }} />}
                <View style={{ paddingHorizontal: 32, marginBottom: 16, width: '100%' }}>
                    <TextInput
                        icon="mail"
                        placeholder="Send to .."
                        autoCapitalize="none"
                        autoCompleteType="email"
                        keyboardType="email-address"
                        keyboardAppearance="dark"
                        returnKeyType="next"
                        returnKeyLabel="next"
                        onChangeText={setEmail}
                        value={email}
                    />
                </View>
                <View style={{ paddingHorizontal: 32, marginBottom: 16, width: '100%' }}>
                    <TextInput
                        icon="clock"
                        placeholder="Duration"
                        autoCapitalize="none"
                        keyboardAppearance="dark"
                        returnKeyType="go"
                        returnKeyLabel="go"
                        onChangeText={setDuration}
                        value={duration}
                    />
                </View>
                <View style={{ marginBottom: 8 }}>
                    {/* <Button title="Send" onPress={sendImage} /> */}
                    <Text style={{color:'#7158e2',fontSize:20}} onPress={sendImage}>Send</Text>
                </View>
                {/* <Button title="Pick another image" onPress={pickImage} /> */}
                <Text style={{color:'#7158e2',fontSize:20}} onPress={pickImage}>Pick another image</Text>

            </View>
        );
    }
}