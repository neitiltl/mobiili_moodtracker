import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, FlatList } from 'react-native';
import { Button, TextInput, Card, Text, Modal, Portal, PaperProvider } from 'react-native-paper';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { DatePickerInput } from 'react-native-paper-dates';

import * as SQLite from 'expo-sqlite';

export default function MoodTracker({ navigation }) {

    const [visible, setVisible] = useState(false); //Modal flatlistille
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    const [moodType, setMoodType] = useState(""); // button-valinta
    const [description, setDescription] = useState(""); //tekstikenttä
    const [inputDate, setInputDate] = useState(new Date()) // päiväys

    const [moods, setMoods] = useState([]); // 

    const today = new Date(); //DatePicker range
    const twoMonths = new Date();
    twoMonths.setMonth(today.getMonth() - 2);

    const db = SQLite.openDatabaseSync('trackerdb'); //trackerdb - tracker

    const initialize = async () => {
        try {
            await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tracker (id INTEGER PRIMARY KEY NOT NULL, 
      moodType TEXT, 
      description TEXT, 
      inputDate TEXT);
    `);
        } catch (error) {
            console.error('Could not open database', error);
        }
        await updateList();
    }


    const saveMood = async () => {
        if (!moodType) { // button-valinta tekemättä
            Alert.alert("Valitse mieliala.");
            return;
        }
        if (!inputDate || !(inputDate instanceof Date) || isNaN(inputDate.getTime())) {// button-valinta tekemättä || ei ole Date
            Alert.alert("Tallenna päiväys kalenterissa.");
            return;
        }
        if (inputDate > new Date()) { // päiväys epäkelpo
            Alert.alert("Päiväys ei voi olla tulevaisuudesta.");
            return;
        }
        if (description.trim().length === 0) { // tekstikenttä tyhjä, trimmaa pelkät välilyönnit
            Alert.alert("Kirjoita ensin kuvaus.");
            return;
        }

        try {
            await db.runAsync(
                'INSERT INTO tracker (moodType, description, inputDate) VALUES (?, ?, ?)',
                [moodType, description, inputDate.toISOString()]
            );

            await updateList();

            setDescription(""); //tyhjentää kentän
            setMoodType(""); //tyhjentää button-valinnan
            setInputDate(new Date()); //palauttaa käyttöpäivään

        } catch (error) {
            console.error('Could not ad item', error);
            Alert.alert("Tallennus epäonnistui", "Tarkista päiväys ja yritä uudelleen.");
        }
    };

    const updateList = async () => {
        try {
            const list = await db.getAllAsync('SELECT * from tracker');
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

    useEffect(() => { initialize() }, [])

    const handleMoodButton = (moodbutton) => {
        setMoodType(moodbutton);
    }; //button-vireystilavalinta

    const latestMoods = moods.slice(-1).reverse(); //viimeisin merkintä

    return (
        <SafeAreaProvider>
            <PaperProvider>
                <SafeAreaView style={styles.container}>
                    <Card style={styles.card}>
                        <Card.Content>

                            <TextInput
                                mode="outlined"
                                label="Kuvaile oloasi ja valitse vireystila värinapeista"
                                value={description}
                                onChangeText={text => setDescription(text)}
                                multiline
                                style={{ height: 100, marginBottom: 10 }}
                            />

                            <View style={styles.buttonRow}>
                                <Button mode={moodType === "Ylivireys" ? "outlined" : "contained"}
                                    onPress={() => handleMoodButton("Ylivireys")}
                                    buttonColor={moodType === "Ylivireys" ? "white" : "red"}
                                    textColor={moodType === "Ylivireys" ? "red" : "white"}
                                    labelStyle={{ fontFamily: undefined }}>
                                    {/* Ylivireys */}
                                </Button>
                                <Button mode={moodType === "Optimi" ? "outlined" : "contained"}
                                    onPress={() => handleMoodButton("Optimi")}
                                    buttonColor={moodType === "Optimi" ? "white" : "green"}
                                    textColor={moodType === "Optimi" ? "green" : "white"}
                                    labelStyle={{ fontFamily: undefined }} >
                                    {/* Optimi */}
                                </Button>
                                <Button mode={moodType === "Alivireys" ? "outlined" : "contained"}
                                    onPress={() => handleMoodButton("Alivireys")}
                                    buttonColor={moodType === "Alivireys" ? "white" : "blue"}
                                    textColor={moodType === "Alivireys" ? "blue" : "white"}
                                    labelStyle={{ fontFamily: undefined }}>
                                    {/* Alivireys */}
                                </Button>
                            </View>
                            <View style={styles.buttonRow}>
                                <Text variant="titleMedium">Ylivireys</Text>
                                <Text variant="titleMedium">Optimi</Text>
                                <Text variant="titleMedium">Alivireys</Text>
                            </View>


                            {/* https://web-ridge.github.io/react-native-paper-dates/docs/date-picker/input-date-picker */}
                            <View style={styles.datePicker}>

                                <DatePickerInput
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

                                    startWeekOnMonday

                                    style={styles.dateInput}
                                />
                            </View>

                            <View>
                                <Button mode="contained-tonal" onPress={saveMood} >
                                    Tallenna
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>


                    <Card style={styles.card}>
                        <Card.Content>
                            <Portal>
                                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>

                                    <Card style={styles.card}>
                                        <Card.Content>

                                            <FlatList

                                                data={latestMoods}

                                                keyExtractor={item => item.id.toString()}

                                                renderItem={({ item }) =>
                                                (
                                                    <View >
                                                        <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{item.moodType}: </Text>
                                                        <Text variant="bodyMedium">{item.description}</Text>
                                                        <Text variant="bodySmall">{new Date(item.inputDate).toLocaleDateString('fi-FI')} </Text>

                                                        <Text style={{ color: '#ff0000' }} onPress={() => deleteItem(item.id)}>Poista</Text>

                                                    </View>)}

                                                ListEmptyComponent={<Text variant="bodyLarge" >Ei merkintöjä</Text>}

                                            />
                                        </Card.Content>
                                    </Card>

                                </Modal>
                            </Portal>

                            <Button mode="contained-tonal" onPress={showModal}>
                                Viimeisin kirjaus
                            </Button>
                        </Card.Content>
                    </Card>


                    <Card style={styles.card}>
                        <Card.Content>
                            <Button mode="contained-tonal" onPress={() => navigation.navigate('ShowMoods', { moods })}    >
                                Kaikki kirjaukset
                            </Button>
                        </Card.Content>
                    </Card>


                </SafeAreaView >
            </PaperProvider>
        </SafeAreaProvider>
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
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
        alignItems: 'center', //väri-teksti tasaus
    },
    datePicker: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    dateInput: {
        backgroundColor: 'white',
    }

});