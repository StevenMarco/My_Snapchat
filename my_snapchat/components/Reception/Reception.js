import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, View, FlatList, TouchableHighlight, Image, Pressable, Modal, Alert, Button } from 'react-native';

export default function Reception({ navigation }) {

    const baseUrl = 'http://snapi.epitech.eu:8000/snaps';
    const baseUrlSnap = 'http://snapi.epitech.eu:8000/snap/';
    const baseUrlDelet = 'http://snapi.epitech.eu:8000/seen';


    const [refresh, setRefresh] = useState(false);
    const [snaps, setSnaps] = useState([]);
    const [snap, setSnap] = useState('');
    const [token, setToken] = useState('');
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        AsyncStorage.getItem('token').then((value) => {
            if (value !== null) {
                setToken(value)
            }
        })
    }, [])

    useEffect(() => {
        var config = {
            method: 'get',
            url: `${baseUrl}`,
            headers: {
                'token': token
            },
        }
        if (token !== '') {
            axios(config)
                .then((response) => {
                    setSnaps(response.data.data.sort(function (a, b) {
                        return b.snap_id - a.snap_id
                    }))
                    console.log(response.data.data);
                });
        }
    }, [refresh, token])

    useEffect(() => {
        console.log(snap);
    }, [snap])

    function seeSnap(id, duration) {
        var config = {
            method: 'get',
            url: `${baseUrlSnap}` + id,
            headers: {
                'token': token
            },
            responseType: 'arraybuffer'
        }
        if (token !== '') {
            axios(config)
                .then((response) => {
                    readSnap(id, response.data, duration)
                    console.log(response.data);
                });
            console.log(config);
        }
    }

    function readSnap(id, img, duration) {
        const read = Buffer.from(img, 'binary').toString('base64')
        var image = `data:image/gif;base64,${read}`
        setSnap(image)
        setModalVisible(true)
        const myInterval = setInterval(Timer, 1000);
        var count = 0
        function Timer() {
            count++
            if (count >= duration) {
                seen(id)
                clearInterval(myInterval)
            }
            console.log(count);
        }
    }

    function seen(id) {

        var config = {
            method: 'post',
            url: `${baseUrlDelet}`,
            headers: {
                'Content-Type': 'application/json',
                'token': token
            },
            data: {
                id: id
            }
        }
        if (token !== '') {
            axios(config)
                .then((response) => {
                    setModalVisible(false)
                    refresh ? setRefresh(false) : setRefresh(true)
                    setSnap('')
                    console.log(response.status);
                });
        }
        console.log(config);
    }

    if (snaps.length !== 0) {

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.button} onPress={() => { refresh ? setRefresh(false) : setRefresh(true) }}>Refresh</Text>
                    {/* <View style={styles.hr}></View> */}
                    <View style={styles.list}>
                        <FlatList
                            data={snaps}
                            renderItem={({ item, index, separators }) => (
                                <TouchableHighlight
                                    key={item.key}
                                    onShowUnderlay={separators.highlight}
                                    onHideUnderlay={separators.unhighlight}>
                                    <View style={styles.item}>
                                        <Pressable style={styles.from} onPress={() => { seeSnap(item.snap_id, item.duration) }}>
                                            <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center'}}>
                                                <View>

                                                    <Ionicons name='md-image' style={{ color: 'red', fontSize: 45 }} />
                                                </View>
                                                <View>

                                                    <Text style={{ fontSize: 25 }}>{item.from}</Text>
                                                </View>
                                            </View>
                                        </Pressable>
                                    </View>
                                </TouchableHighlight>
                            )}
                        />
                    </View>
                </View>
                {snap != ''}
                <Modal animationType='slide'
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Snap deleted !');
                    }}>
                    <View style={styles.modal}>
                        <Image style={styles.img} source={{ uri: snap }} />
                    </View>
                </Modal>
                <StatusBar style="auto" />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Button title='Refresh' style={styles.button} onPress={() => { refresh ? setRefresh(false) : setRefresh(true) }}>Refresh</Button>
                </View>
                <View style={styles.containe}>
                    <Text style={{ fontSize: 20 }}>Vous n'avez aucun snap</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: '100%'
    },
    header: {
        flex: 1,
        marginTop: 35,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    containe: {
        flex: 1,
        width: '100%',
        alignContent: 'center',
        alignItems: 'center',
    },
    hr: {
        width: '100%',
        backgroundColor: '#3d3d3d',
        height: 1,
    },
    button: {
        color: '#7158e2',
        fontSize: 35,
        padding: 15,
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    item: {
        flex: 1,
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 5,
    },
    from: {
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#f7f1e3',
        width:'80%'
    },
    modal: {
        height: '100%',
        width: '100%',
        alignItems: "center",
        justifyContent: 'center',
    },
    img: {
        height: '100%',
        width: '100%',
    },
})