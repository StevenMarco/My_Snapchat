import React, { useEffect } from 'react';
import { useState } from 'react';
import { Text, View, Button } from 'react-native';
import axios from 'axios';
import TextInput from '../TextInput';
import Buttons from '../Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLinkProps } from '@react-navigation/native';


export default function Login({ route, navigation }) {

  const baseUrl = 'http://snapi.epitech.eu:8000/connection';

  const [data, setData] = useState([])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  // const handleSubmit = () => {

  //   var config = {
  //     method: 'post',
  //     url: `${baseUrl}`,
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     data: {
  //       'email': email,
  //       'password': password,
  //     }
  //   };

  //   axios(config)
  //     .then((response) => {
  //       setData(response.data.data)
  //       console.log(response.data.data);
  //     });
  // }

  const handleSubmit = () => {
    // use fetch to send a POST request
    fetch('http://snapi.epitech.eu:8000/connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data.data)
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  useEffect(()=>{
    if(data.length !== 0) {
    AsyncStorage.setItem('email', data.email)
    AsyncStorage.setItem('token', data.token)
    route.params.refresh()
    }
    
  },[data])

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <View style={{flex:1,width:'100%',alignItems:'flex-start',paddingTop:45,paddingLeft:10}}>
        <Text
          style={{color:'#7158e2',fontSize:20}}
          onPress={() =>
            navigation.navigate('Home')
          }
        >← Back</Text>
      </View>
      <View style={{flex:2,width:'100%',alignItems:'center'}}>
        <Text style={{color: '#3d3d3d',fontWeight: 'bold', fontSize: 35, paddingBottom: 20 }}>
          Login
        </Text>
        <View style={{ paddingHorizontal: 32, marginBottom: 16, width: '100%' }}>
          <TextInput
            icon="mail"
            placeholder="Enter your email"
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
            icon="key"
            placeholder="Enter your password"
            secureTextEntry
            autoCompleteType="password"
            autoCapitalize="none"
            keyboardAppearance="dark"
            returnKeyType="go"
            returnKeyLabel="go"
            onChangeText={setPassword}
            value={password}
          />
        </View>
        <View style={{ marginTop: 20 }} >
          <Buttons label="Login" onPress={handleSubmit} />
        </View>
      </View>
    </View>
  );
}