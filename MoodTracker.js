import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, FlatList, Keyboard } from 'react-native';
import { Button, TextInput, Card, Text, Modal, Portal, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatePickerInput } from 'react-native-paper-dates';

import { useSQLiteContext } from 'expo-sqlite'; /* https://docs.expo.dev/versions/latest/sdk/sqlite/ */


export default function MoodTracker({ navigation }) {

    const [visible, setVisible] = useState(false); //Modal flatlistille
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { margin: 20 };  // modalin tausta

    const [moodType, setMoodType] = useState(""); // button-valinta
    const [description, setDescription] = useState(""); //tekstikenttä
    const [inputDate, setInputDate] = React.useState(undefined) // päiväys, aiemmin  = useState(new Date());

    const db = useSQLiteContext();

    const [moods, setMoods] = useState([]); // 

    const today = new Date(); //DatePicker range
    const twoMonths = new Date();
    twoMonths.setMonth(today.getMonth() - 2);
    const datePickerKey = inputDate ? inputDate.toString() : "empty-date"
    //inputDate kun päivämäärä valittu | valitsematta, datePickerin oman virheilmon varalta


    const saveDiary = async () => {
        if (!db) {
            Alert.alert("Odota hetki tietokannan latautumista ja paina uudelleen Tallenna");
            return;
        }
        if (description.trim().length === 0) { // tekstikenttä tyhjä, trimmaa pelkät välilyönnit
            Alert.alert("Kirjoita ensin kuvaus.");
            return;
        }
        if (!moodType) { // button-valinta tekemättä
            Alert.alert("Valitse vireystila.");
            return;
        }
        if (inputDate > new Date()) { // päiväys epäkelpo
            Alert.alert("Päiväys ei voi olla tulevaisuudesta.");
            return;
        }
        if (!inputDate) {// button-valinta tekemättä || ei ole Date  oli (!inputDate || !(inputDate instanceof Date) || isNaN(inputDate.getTime()))
            Alert.alert("Tallenna päiväys kalenterissa.");
            return;
        }

        try {
            await db.runAsync(
                'INSERT INTO tracker (moodType, description, inputDate) VALUES (?, ?, ?)',
                [moodType, description, inputDate.toISOString()]);

            await updateList();

            setDescription(""); //tyhjentää kentän
            setMoodType(""); //tyhjentää button-valinnan
            setInputDate(undefined); //palauttaa käyttöpäivään (new Date()  )
        } catch (error) {
            console.error('Could not ad item', error);
            Alert.alert("Tallennus ei onnistunut.");
        }
    };

    const updateList = async () => {
        if (!db) return; //varmistaa, että tietokanta löytyy
        try {
            const list = await db.getAllAsync('SELECT * from tracker ORDER BY id ASC');  // id: 1, 2, 3 ...
            setMoods(list);
        } catch (error) {
            console.error('Could not get items', error);
        }
    }

    const deleteItem = async (id) => {
        try {
            await db.runAsync('DELETE FROM tracker WHERE id=?', [id]);
            await updateList();
        }
        catch (error) {
            console.error('Could not delete item', error);
        }
    }

    useEffect(() => {
        if (!db) return; //varmistaa, että tietokanta löytyy
        updateList()
    }, [db]);


    const handleMoodButton = (moodbutton) => {
        setMoodType(moodbutton);
    }; //button-vireystilavalinta

    const latestMoods = moods.slice(-1).reverse(); // viimeinen elementti

    return (

        <SafeAreaView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>

                    <TextInput style={styles.textInput}
                        mode="outlined"
                        label="Miltä tuntuu?"
                        value={description}
                        onChangeText={text => setDescription(text)}
                        multiline
                    />

                    {/*   <View >
                        <Text style={styles.textCenter} variant="titleLarge">Valitse vireystila värinapeista</Text>
                    </View> */}

                    <View style={styles.buttonRow}>
                        <Button mode={moodType === "Ylivireys" ? "outlined" : "contained"}
                            onPress={() => {
                                Keyboard.dismiss();
                                handleMoodButton("Ylivireys")
                            }}
                            /* https://reactnative.dev/docs/keyboard#dismiss */
                            buttonColor={moodType === "Ylivireys" ? "white" : "red"}
                            textColor={moodType === "Ylivireys" ? "red" : "white"}

                            labelStyle={{ fontFamily: undefined }}>
                            Ylivireys
                        </Button>
                        <Button mode={moodType === "Optimi" ? "outlined" : "contained"}
                            onPress={() => {
                                Keyboard.dismiss();
                                handleMoodButton("Optimi")
                            }}
                            buttonColor={moodType === "Optimi" ? "white" : "green"}
                            textColor={moodType === "Optimi" ? "green" : "white"}
                            labelStyle={{ fontFamily: undefined }} >
                            Optimi
                        </Button>
                        <Button mode={moodType === "Alivireys" ? "outlined" : "contained"}
                            onPress={() => {
                                Keyboard.dismiss();
                                handleMoodButton("Alivireys")
                            }}
                            buttonColor={moodType === "Alivireys" ? "white" : "blue"}
                            textColor={moodType === "Alivireys" ? "blue" : "white"}
                            labelStyle={{ fontFamily: undefined }}>
                            Alivireys
                        </Button>
                    </View>
                    {/*                     <View style={styles.buttonRow}>
                        <Text variant="titleMedium">Ylivireys</Text>
                        <Text variant="titleMedium">Optimi</Text>
                        <Text variant="titleMedium">Alivireys</Text>
                    </View>
 */}
                    {/* https://web-ridge.github.io/react-native-paper-dates/docs/date-picker/input-date-picker */}
                    <View style={styles.datePicker}>

                        <DatePickerInput
                            key={datePickerKey} //daPicker luodaan uudelleen, kun key muuttuu
                            mode="outlined"
                            locale="fi"
                            label="Päivämäärä"
                            value={inputDate}
                            onChange={(d) =>
                                setInputDate(d)
                            }

                            startYear={2020}
                            endYear={2050}
                            validRange={{
                                startDate: twoMonths,
                                endDate: today
                            }}

                            startWeekOnMonday={true}
                            style={styles.dateInput}
                        />
                    </View>

                    <View>
                        <Button mode="contained-tonal" style={styles.button} onPress={saveDiary} >
                            Tallenna
                        </Button>
                    </View>
                </Card.Content>
            </Card>


            <Card style={styles.card}>
                <Card.Content >
                    <Portal>
                        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>

                            <Card style={styles.card}>
                                <Card.Content >

                                    <FlatList
                                        data={latestMoods}
                                        keyExtractor={item => item.id.toString()}

                                        renderItem={({ item }) =>
                                        (
                                            <Card style={styles.itemCard}>
                                                <Card.Content>
                                                    <View style={styles.row}>
                                                        <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>
                                                            {item.moodType}
                                                        </Text>
                                                        <Text variant="bodySmall" style={styles.dateText}>{new Date(item.inputDate).toLocaleDateString('fi-FI')} </Text>
                                                    </View>

                                                    <Divider style={{ height: 2, marginVertical: 2 }} />

                                                    <Text variant="bodyMedium" style={styles.descriptionText} >{item.description}</Text>
                                                </Card.Content>

                                                <Card.Actions>
                                                    <Text style={{ color: 'red', fontWeight: 'bold' }} onPress={() => deleteItem(item.id)}>Poista</Text>
                                                </Card.Actions>
                                            </Card>)}

                                        ListEmptyComponent={<Text variant="bodyLarge" style={styles.textCenter} >Ei merkintöjä</Text>}
                                    />
                                </Card.Content>
                            </Card>

                        </Modal>
                    </Portal>

                    <Button mode="contained-tonal" onPress={showModal}>
                        Viimeisin merkintä
                    </Button>
                </Card.Content>
            </Card>


            <Card style={styles.card}>
                <Card.Content>
                    <Button mode="contained-tonal" onPress={() => navigation.navigate('ShowMoods')}    >
                        Kaikki merkinnät
                    </Button>
                </Card.Content>
            </Card>

        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    card: {
        marginBottom: 10,
        borderRadius: 10,
        elevation: 4,
    },
    textCenter: {
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold'
    },

    textInput: {
        height: 100,
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        alignItems: 'center', //väri-teksti tasaus
    },
    datePicker: {
        flexDirection: 'row',
        marginBottom: 20
    },
    dateInput: {
        backgroundColor: 'white',
        padding: 5,
    },
    button: {
        marginVertical: 5,
    },
    itemCard: {
        marginVertical: 6,
        borderRadius: 12,
        elevation: 2,
        backgroundColor: 'white',
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },

    moodType: {
        fontWeight: 'bold',
    },

    dateText: {
        color: 'gray',
    },

    descriptionText: {
        marginTop: 4,
        lineHeight: 20,
    },

});