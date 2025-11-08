import { useState } from 'react';
import { StyleSheet, View, FlatList, Alert, TextInput } from 'react-native';
import { Button, Text, Card, Modal, Portal, PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShowMoods({ route, navigation }) {

    const { moods = [] } = route.params || {};

    const [visible, setVisible] = useState(false); //modal

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

    const testiMoods = [
        { moodType: "Optimi", description: "Tämä on testidataa" },
        { moodType: "Ylivireys", description: "Tässä on toisenlainen testidata jonka teksti on todella paljon pidempi" },
        { moodType: "Alivireys", description: "Kolmas testidataa" }]; // TESTIDATA


    let shownMoods;

    if (moods.length > 0) {
        shownMoods = moods;
    } else {
        shownMoods = testiMoods; //jos ei ole moods-dataa, näytä testiMoods
    };

    /*     if (shownMoods.length === 0) { //tarkistaa lengthin (kun testidata poistettu)
            return (
                <View style={styles.container}>
                    <Text variant="bodyLarge">Ei talletuksia.</Text>
                </View>
            )
        }
     */

    return (

        <PaperProvider>
            <SafeAreaView style={styles.container}>


                <Card style={styles.card}>
                    <Card.Content>
                        <Portal>
                            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>

                                <Card style={styles.card}>
                                    <Card.Content>

                                        <FlatList

                                            ItemSeparatorComponent={<View style={{ height: 2, backgroundColor: 'lightgray', marginVertical: 3 }}></View>}

                                            data={shownMoods} // KORJAA moods
                                            renderItem={({ item }) => (
                                                <View >
                                                    <Text variant="bodyMedium" style={{fontWeight: 'bold'}}>{item.moodType}: </Text>
                                                    <Text variant="bodyMedium">{item.description}</Text>
                                                </View>)}


                                            ListEmptyComponent={<Text variant="bodyMedium">Ei merkintöjä</Text>}


                                        />
                                    </Card.Content>
                                </Card>

                            </Modal>
                        </Portal>
                        <Button mode="contained-tonal" onPress={showModal}>
                            Kirjaukset
                        </Button>
                    </Card.Content>
                </Card>


                {/* <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleLarge">Kirjaukset</Text>

                        <FlatList

                            ItemSeparatorComponent={<View style={{ height: 2, backgroundColor: 'lightgray', marginVertical: 3 }}></View>}

                            data={shownMoods} // KORJAA moods
                            renderItem={({ item }) => <Text variant="bodyMedium">{item.moodType}: {item.description}</Text>}

                            ListEmptyComponent={<Text variant="bodyMedium">Ei merkintöjä</Text>}

                        />
                    </Card.Content>
                </Card> */}


                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleLarge">Tähän lisää sisältöä</Text>
                        <Button mode="contained-tonal" onPress={() => navigation.navigate('MoodTracker')}    >
                            MoodTracker
                        </Button>
                    </Card.Content>
                </Card>

            </SafeAreaView >
        </PaperProvider>
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
});