import { useState } from 'react';
import { StyleSheet, View, FlatList, Alert, TextInput } from 'react-native';
import { Button, Text, Card, Modal, Portal, PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatePickerInput } from 'react-native-paper-dates';
import { useSQLiteContext } from 'expo-sqlite';

// flatlist mood-listauksille
function MoodList({ data }) {
    return (
        <FlatList
            data={data}

            keyExtractor={item => item.id.toString()}

            ItemSeparatorComponent={<View style={{ height: 2, backgroundColor: 'lightgray', marginVertical: 3 }}></View>}

            renderItem={({ item }) => (
                <View >
                    <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>{item.moodType}: </Text>
                    <Text variant="bodyMedium">{item.description}</Text>
                    <Text variant="bodySmall">{new Date(item.inputDate).toLocaleDateString('fi-FI')} </Text>
                </View>)}

            ListEmptyComponent={<Text variant="bodyLarge" >Ei merkintöjä</Text>}
        />
    )
}

export default function ShowMoods({ route, navigation }) {

    const { moods = [] } = route.params || {};

    const [modalContent, setModalContent] = useState(null);
    const [visible, setVisible] = useState(false); //modal

    const showModal = (content) => {
        setModalContent(content);
        setVisible(true)
    };

    const hideModal = () => {
        setModalContent(null);
        setVisible(false)
    };

    const containerStyle = { backgroundColor: 'white', padding: 20 };

    const lastTen = moods.slice(-10).reverse(); //näyttää viimeiset 10 merkintää

    const optimi = moods.filter(mood => mood.moodType === 'Optimi')
    const ylivireys = moods.filter(mood => mood.moodType === 'Ylivireys')
    const alivireys = moods.filter(mood => mood.moodType === 'Alivireys')


    /*  const testiMoods = [
         { moodType: "Optimi", description: "Tämä on testidataa", inputDate: "2000-02-01T22:00:00.000Z" },
         { moodType: "Ylivireys", description: "Tässä on toisenlainen testidata jonka teksti on todella paljon pidempi", inputDate: "2000-02-01T22:00:00.000Z" },
         { moodType: "Alivireys", description: "Kolmas testidataa", inputDate: "2000-02-01T22:00:00.000Z" }]; // TESTIDATA
 
      const shownMoods;

    if (moods.length > 0) {
         shownMoods = moods;
     } else {
         shownMoods = testiMoods; //jos ei ole sql-dataa, näytä testiMoods
     }; */

    if (moods.length === 0) { //tarkistaa lengthin (kun testidata poistettu)
        return (
            <View style={styles.container}>
                <Text variant="bodyLarge">Ei merkintöjä.</Text>
            </View>
        )
    }


    return (

            <SafeAreaView style={styles.container}>

                <Card style={styles.card}>
                    <Card.Content>

                        <Button style={styles.button} mode="contained-tonal" onPress={() => {
                            setModalContent("lastTen");
                            setVisible(true);
                        }}>
                            Viimeiset 10 merkintää
                        </Button>

                        <Button style={styles.button} mode="contained-tonal" onPress={() => {
                            setModalContent("ylivireys");
                            setVisible(true);
                        }}>
                            Ylivireys
                        </Button>

                        <Button style={styles.button} mode="contained-tonal" onPress={() => {
                            setModalContent("optimi");
                            setVisible(true);
                        }}>
                            Optimi
                        </Button>

                        <Button style={styles.button} mode="contained-tonal" onPress={() => {
                            setModalContent("alivireys");
                            setVisible(true);
                        }}>
                            Alivireys
                        </Button>

                    </Card.Content>
                </Card>

                <Portal>
                    <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                        <Card style={styles.card}>
                            <Card.Content>
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
                            </Card.Content>
                        </Card>
                    </Modal>
                </Portal>

                <Card style={styles.card}>
                    <Card.Content>
                        <Button mode="contained-tonal" >
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
    button: {
        marginBottom: 10,
        borderRadius: 10,
        elevation: 4,
    },
    textCenter: {
        textAlign: 'center',
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
