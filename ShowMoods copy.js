import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Keyboard, Alert } from 'react-native';
import { Button, Text, Card, Modal, Portal, Divider, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatePickerModal } from 'react-native-paper-dates';

import { useSQLiteContext } from 'expo-sqlite'; /* https://docs.expo.dev/versions/latest/sdk/sqlite/ */


// flatlist mood-listauksille
function MoodList({ data }) {
    return (

        <FlatList
            data={data}

            keyExtractor={item => item.id.toString()}

            renderItem={({ item }) => (

                <Card style={styles.itemCard}>
                    <Card.Content>
                        <View style={styles.row}>
                            <Text variant="titleSmall" style={{ fontWeight: 'bold' }}>
                                {item.moodType}
                            </Text>
                            <Text variant="bodySmall" style={styles.dateText}>{item.inputDate ? new Date(item.inputDate).toLocaleDateString('fi-FI') : ""} </Text>
                            {/* jos item.inputDate olmessa, muutetaan FI-muotoon, muuten "" */}
                        </View>

                        <Divider style={{ height: 2, marginVertical: 2 }} />

                        <Text variant="bodyMedium" style={styles.descriptionText} >{item.description}</Text>
                        <Text variant="bodySmall">#{item.id}</Text>  {/* helpottaa järjestyksen hahmottamista */}
                    </Card.Content>
                </Card>)}

            ListEmptyComponent={<Text variant="bodyLarge" style={styles.textCenter}>Ei merkintöjä</Text>}
        />
    )
}

export default function ShowMoods({ navigation }) {

    const db = useSQLiteContext();

    const [moods, setMoods] = useState([]);

    const [dateRangeResults, setDateRangeResults] = useState([]); //päiväyshaku
    const [searchWord, setSearchWord] = useState(""); //sanahaku
    const [searchResults, setSearchResults] = useState([]);


    const formatDate = (date) => {
        return date.toISOString().split('T')[0]; //vvvv-kk-pp
    }

    const updateList = async () => {
        if (!db) return; //varmistaa, että tietokanta löytyy
        try {
            const list = await db.getAllAsync('SELECT * from tracker ORDER BY id ASC');  // id: 1, 2, 3 ...
            setMoods(list);
        } catch (error) {
            console.error('Could not get items', error);
        }
    }

    const getMoodByRange = async (start, end) => {
        if (!db) return; //varmistaa, että tietokanta löytyy
        try {
            const list = await db.getAllAsync(
                'SELECT * from tracker WHERE date(inputDate) BETWEEN date(?) AND date(?) ORDER BY inputDate ASC',
                [start, end]
            );
            return list;
        } catch (error) {
            console.error("haku epäonnistui", error);
            return [];
        }
    };

    /* https://www.sqlite.org/lang_select.html#where_clause_filtering_

    https://www.w3schools.com/SQL/sql_like.asp 
    % represents zero, one, or multiple characters */
    const searchByDescription = async (keyword) => {
        if (!db) return; //varmistaa, että tietokanta löytyy
        try {
            const list = await db.getAllAsync(
                'SELECT * from tracker WHERE description LIKE ? ORDER BY inputDate ASC',
                [`%${keyword}%`]
            );
            return list;

        } catch (error) {
            console.error("Sanahaku epäonnistui", error);
            return [];
        }
    };


    useEffect(() => {
        if (!db) return; //varmistaa, että tietokanta löytyy
        updateList()
    }, [db]);


    const [modalContent, setModalContent] = useState(null);
    const [visible, setVisible] = useState(false); //modal

    /*    const showModal = (content) => {
           setModalContent(content);
           setVisible(true)
       };
    */
    const hideModal = () => {
        setModalContent(null);
        setVisible(false)
    };

    const containerStyle = { margin: 20 }; // modalin tausta
    /* const containerStyle = { backgroundColor: "#f8f8f8", padding: 3, margin: 15 }; */

    const allMoods = moods;
    const lastTen = moods.slice(-10).reverse(); //näyttää viimeiset 10 merkintää

    const optimi = moods.filter(mood => mood.moodType === 'Optimi')
    const ylivireys = moods.filter(mood => mood.moodType === 'Ylivireys')
    const alivireys = moods.filter(mood => mood.moodType === 'Alivireys')


    /* https://web-ridge.github.io/react-native-paper-dates/docs/date-picker/range-date-picker */
    const [range, setRange] = useState({ startDate: undefined, endDate: undefined });
    const [open, setOpen] = useState(false);

    const onDismiss = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirm = React.useCallback(
        async ({ startDate, endDate }) => {
            setOpen(false);
            setRange({ startDate, endDate });

            if (startDate && endDate) {
                const from = formatDate(startDate);
                const to = formatDate(endDate);

                const results = await getMoodByRange(from, to);
                setModalContent("dateRange");
                setVisible(true);
                setDateRangeResults(results);
            }
        },
        [db]
    );


    return (

        <SafeAreaView style={styles.container}>

            <Card style={styles.card}>
                <Card.Content>

                    <View style={styles.buttonRow}>
                        <Button style={styles.button} mode="contained-tonal" buttonColor='red' textColor="#f8f8f8" onPress={() => {
                            setModalContent("ylivireys");
                            setVisible(true);
                        }}>
                            Ylivireys
                        </Button>

                        <Button style={styles.button} mode="contained-tonal" buttonColor='green' textColor="#f8f8f8" onPress={() => {
                            setModalContent("optimi");
                            setVisible(true);
                        }}>
                            Optimi
                        </Button>

                        <Button style={styles.button} mode="contained-tonal" buttonColor='blue' textColor="#f8f8f8" onPress={() => {
                            setModalContent("alivireys");
                            setVisible(true);
                        }}>
                            Alivireys
                        </Button>
                    </View>

                    <Button style={styles.button} mode="contained-tonal" onPress={() => {
                        setModalContent("allMoods");
                        setVisible(true);
                    }}>
                        Näytä kaikki merkinnät
                    </Button>

                    <Button style={styles.button} mode="contained-tonal" onPress={() => {
                        setModalContent("lastTen");
                        setVisible(true);
                    }}>
                        Näytä viimeiset 10 merkintää
                    </Button>


                </Card.Content>
            </Card>

            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                    <Card style={styles.card}>

                        <Card.Content style={{ maxHeight: '90%' }}>
                            {modalContent === "ylivireys" && (
                                <MoodList data={ylivireys} />
                            )}

                            {modalContent === "optimi" && (
                                <MoodList data={optimi} />
                            )}
                            {modalContent === "alivireys" && (
                                <MoodList data={alivireys} />
                            )}

                            {modalContent === "lastTen" && (
                                <MoodList data={lastTen} />
                            )}
                            {modalContent === "allMoods" && (
                                <MoodList data={allMoods}
                                />
                            )}
                            {modalContent === "dateRange" && (
                                <MoodList data={dateRangeResults} />
                            )}
                            {modalContent === "searchResults" && (
                                <MoodList data={searchResults} />
                            )}
                        </Card.Content>

                        <Card.Actions style={{ justifyContent: 'center', paddingBlock: 2 }}>
                            <Button style={styles.button} mode="contained-tonal" onPress={hideModal}>
                                Sulje
                            </Button>
                        </Card.Actions>
                    </Card>
                </Modal>
            </Portal>

            <Card style={styles.card}>
                <Card.Content>


                    <TextInput style={styles.textInput}
                        mode="outlined"
                        label="Hakusana kuvaustekstistä"
                        value={searchWord}
                        onChangeText={setSearchWord} />


                    <Button mode="contained-tonal" style={styles.button}
                        onPress={async () => {
                            const results = await searchByDescription(searchWord);
                            setSearchResults(results);
                            setModalContent("searchResults");
                            setVisible(true);
                            setSearchWord(""); //tyhjennä input
                            Keyboard.dismiss(); // poista kursori inputista
                        }}>
                        Tee haku
                    </Button>

                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                            Tee haku aikaväliltä
                        </Button>
                        <DatePickerModal
                            locale="fi"
                            mode="range"
                            visible={open}
                            onDismiss={onDismiss}
                            startDate={range.startDate}
                            endDate={range.endDate}
                            onConfirm={onConfirm}
                            startWeekOnMonday={true}
                            startYear={2020}
                            endYear={2030}

                        />
                    </View>

                </Card.Content>
            </Card>

        </SafeAreaView >
    );
}

/* esimerkkejä datepicker asetuksista 
https://stackoverflow.com/questions/78925061/react-native-paper-dates-datepickerinput-modal-customization 
https://medium.com/@dexiouz/step-by-step-guide-on-how-to-change-background-and-text-color-of-android-date-time-picker-in-react-fbf1a7dea17e
*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    card: {
        marginBottom: 20,
        borderRadius: 10,
        elevation: 4,
        backgroundColor: "#faf0e6",
    },
    button: {
        marginBottom: 10,
        borderRadius: 10,
        elevation: 4,
    },
    textCenter: {
        textAlign: 'center',
        marginTop: 10,
    },
    textInput: {
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
        alignItems: 'center'
    },
    datePicker: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    dateInput: {
        backgroundColor: "#f8f8f8",
    },

    itemCard: {
        marginVertical: 6,
        borderRadius: 12,
        elevation: 2,
        backgroundColor: "#f8f8f8",
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
