import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
} from 'react-native'
import { useEffect, useRef, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Camera } from 'expo-camera'
import { shareAsync } from 'expo-sharing'
import * as MediaLibrary from 'expo-media-library'

import axios from 'axios';

import TextInput from '../TextInput';

const Cam = () => {
  let cameraRef = useRef()
  const [hasCameraPermission, setHasCameraPermission] = useState()
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState()
  const [data, setData] = useState([])
  const [email, setEmail] = useState('')
  const [duration, setDuration] = useState('')
  const [photo, setPhoto] = useState()
  const [token, setToken] = useState()
  const [picture, setPicture] = useState()

  useEffect(() => {
    AsyncStorage.getItem('token').then((token) => {
      if (token !== null) {
        setToken(token)
      } else {
        setToken('')
      }
    })
  }, [data])

  useEffect(() => {
    ;(async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync()
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync()
      setHasCameraPermission(cameraPermission.status === 'granted')
      setHasMediaLibraryPermission(mediaLibraryPermission.status === 'granted')
    })()
  }, [])

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    )
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    }

    let newPhoto = await cameraRef.current.takePictureAsync(options)
    setPhoto(newPhoto)
  }

  if (photo) {
    const sendImage = async () => {
      var formData = new FormData()
      formData.append('duration', parseInt(duration))
      formData.append('to', email)
      formData.append('image', {
        uri: photo.uri,
        name: 'fileName',
        type: 'image/jpg',
      })

      console.log('token ', token)
      console.log(formData)

      var config = {
        method: 'post',
        url: 'http://snapi.epitech.eu:8000/snap',
        headers: {
          'Content-Type': 'multipart/form-data',
          token: token,
        },
        data: formData,
      }
      axios(config)
      .then((response) => {
          setData(response)
          console.log('response ', response.data)
          setPhoto(null)
      });
    }
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined)
      })
    }

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined)
      })
    }

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: 'data:image/jpg;base64,' + photo.base64 }}
        />


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
          <Text style={{ color: '#7158e2', fontSize: 20 }} onPress={sendImage}>
            Send
          </Text>
        </View>

        <Button title="Share" onPress={sharePic} />
        {hasMediaLibraryPermission ? (
          <Button title="Save" onPress={savePhoto} />
        ) : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    )
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title="Take Pic" onPress={takePic} />
      </View>
      <StatusBar style="auto" />
    </Camera>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1,
  },
})

export default Cam
