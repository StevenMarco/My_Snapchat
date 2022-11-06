import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';

export default function Home({navigation}) {

    return (
        <View style={styles.container}>
            <View style={styles.head}>
                <Image style={styles.img} source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2111/2111803.png' }}></Image>
                <Text style={styles.titre}>My Snapchat</Text>
            </View>
            <View style={styles.body}>
                <Pressable
                    style={styles.button}
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.text}>Login</Text>
                </Pressable>
                <Pressable style={styles.button}
                    onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.text}>Register</Text>
                </Pressable>
            </View>
            <View style={styles.foot}>
                <Text style={styles.footer}>© Test</Text>
            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff200',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
    },
    text: {
        color: '#3d3d3d',
        fontSize: 20,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 35,
        margin: 2,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'white',
    },
    titre: {
        color: '#3d3d3d',
        fontWeight: 'bold',
        fontSize: 45,
        margin: 15,

    },
    footer: {
        color: '#3d3d3d',
        fontSize: 7,
        margin: 15,
    },
    head: {
        flex: 2,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    body: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    foot: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    img: {
        height: 250,
        width: 250,
    }
});