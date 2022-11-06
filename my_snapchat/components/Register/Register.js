import React from 'react';
import { useState } from 'react';
import { Text, View, Button } from 'react-native';
import axios from 'axios';
import TextInput from '../TextInput';
import Buttons from '../Button';

export default function Register({ navigation }) {

  const baseUrl = 'http://snapi.epitech.eu:8000/inscription';

  const [data, setData] = useState([])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const handleSubmit = () => {

    var data = { "email": email, "password": password }

    var config = {
      method: 'post',
      url: `${baseUrl}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };

    axios(config)
      .then((response) => {
        setData(response.data)
        navigation.navigate('Login')
        console.log(data);
      });
  }

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
          Register
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
          <Buttons label="Register" onPress={handleSubmit} />
        </View>
      </View>
    </View>
  );
}