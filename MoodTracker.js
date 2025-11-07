import { useState } from 'react';
import { StyleSheet, Text, Button, View, Alert, TextInput, FlatList } from 'react-native';

export default function MoodTracker({ navigation }) {

    const [moodType, setMoodType] = useState(""); // button-valinta
    const [description, setDescription] = useState(""); //tekstikenttä
    const [moods, setMoods] = useState([]);


    const handleMood = () => {
        if (!moodType) { // button-valinta tekemättä
            Alert.alert("Valitse mieliala.");
            return;
        } else if
            (description.length === 0) { // tekstikenttä tyhjä
            Alert.alert("Kirjoita ensin kuvaus.");
            return;
        };

        const newMood = { moodType, description };
        setMoods([...moods, newMood]);
        /*  Alert.alert(`Tallennettu: ${moodType}: ${description}`); */
        setDescription(""); //tyhjentää kentän
        setMoodType(""); //tyhjentää button-valinnan
    };

    const handleMoodButton = (moodbutton) => {
        setMoodType(moodbutton);
    }; //button-valinta


    return (

        <View style={styles.container}>

            <View style={{
                flex: 1, flexDirection: 'column',
                alignItems: 'center', justifyContent: 'space-around'
            }}>
                <Text>{moodType || "Tee valinta"}</Text>
                <Button title="Ylivireys" onPress={() => handleMoodButton("Ylivireys")} />
                <Button title="Optimi" onPress={() => handleMoodButton("Optimi")} />
                <Button title="Alivireys" onPress={() => handleMoodButton("Alivireys")} />
            </View>

            <View style={{
                flex: 2, flexDirection: 'column',
                alignItems: 'center', justifyContent: 'space-around'
            }}>
                <TextInput
                    placeholder='Kuvaile oloasi'
                    onChangeText={text => setDescription(text)}
                    value={description}
                />
                <Button onPress={handleMood} title="Tallenna" />

            </View>

            <View style={{
                flex: 1, flexDirection: 'column',
                alignItems: 'center', justifyContent: 'space-around'
            }}>
                <FlatList
                    data={moods}
                    renderItem={({ item }) => <Text>{item.moodType}: {item.description}</Text>}
                />
                <Button title="Näytä kirjaukset" onPress={() => navigation.navigate('ShowMoods', { moods })} />
            </View>




        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        marginBottom: 30,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});