import { useState } from 'react';
import { StyleSheet, View, Alert, FlatList } from 'react-native';
import { Button, TextInput, Card, Text, Modal, Portal, PaperProvider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MoodTracker({ navigation }) {

    const [moodType, setMoodType] = useState(""); // button-valinta
    const [description, setDescription] = useState(""); //tekstikenttä
    const [moods, setMoods] = useState([]);

    const [visible, setVisible] = useState(false); //modal

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    const containerStyle = { backgroundColor: 'white', padding: 20 };

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
        setDescription(""); //tyhjentää kentän
        setMoodType(""); //tyhjentää button-valinnan
    };

    const handleMoodButton = (moodbutton) => {
        setMoodType(moodbutton);
    }; //button-valinta

    const latestMoods = moods.slice(-1).reverse(); //viimeisin merkintä

    return (
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
                                labelStyle={{ fontFamily: undefined }}
                            >
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


                        <Button mode="contained-tonal" onPress={handleMood} >
                            Tallenna
                        </Button>
                    </Card.Content>
                </Card>

                {/*             <Card style={styles.card}>
                <Card.Content>

                    <Text variant="titleLarge">{moodType || "Tee valinta"}</Text>

                    <View style={styles.buttonRow}>
                        <Button mode="text" onPress={() => handleMoodButton("Ylivireys")} textColor="red" >
                            Ylivireys
                        </Button>

                        <Button mode="text" onPress={() => handleMoodButton("Optimi")} textColor="green" >
                            Optimi
                        </Button>

                        <Button mode="text" onPress={() => handleMoodButton("Alivireys")} textColor="blue" >
                            Alivireys
                        </Button>
                    </View>

                                        <View style={styles.buttonRow}>
                        <Button mode={moodType === "Ylivireys" ? "outlined" : "contained"}
                            onPress={() => handleMoodButton("Ylivireys")}
                            buttonColor={moodType === "Ylivireys" ? "white" : "red"}
                            textColor={moodType === "Ylivireys" ? "red" : "white"}
                            labelStyle={{ fontFamily: undefined }}
                        >
                            Ylivireys
                        </Button>
                        <Button mode={moodType === "Optimi" ? "outlined" : "contained"}
                            onPress={() => handleMoodButton("Optimi")}
                            buttonColor={moodType === "Optimi" ? "white" : "green"}
                            textColor={moodType === "Optimi" ? "green" : "white"}
                            labelStyle={{ fontFamily: undefined }} >
                            Optimi
                        </Button>
                        <Button mode={moodType === "Alivireys" ? "outlined" : "contained"}
                            onPress={() => handleMoodButton("Alivireys")}
                            buttonColor={moodType === "Alivireys" ? "white" : "blue"}
                            textColor={moodType === "Alivireys" ? "blue" : "white"}
                            labelStyle={{ fontFamily: undefined }}>
                            Alivireys
                        </Button>
                    </View>
 
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>

                    <TextInput
                        mode="outlined"
                        label="Kuvaile oloasi"
                        value={description}
                        onChangeText={text => setDescription(text)}
                        multiline
                        style={{ height: 100, marginBottom: 10 }}
                    />

                    <Button mode="contained-tonal" onPress={handleMood} >
                        Tallenna
                    </Button>
                </Card.Content>
            </Card>
 */}

                <Card style={styles.card}>
                    <Card.Content>
                        <Portal>
                            <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>

                                <Card style={styles.card}>
                                    <Card.Content>
                                        <Text variant="titleLarge">Viimeisin kirjaus</Text>

                                        <FlatList

                                            /* ItemSeparatorComponent={<View style={{ height: 2, backgroundColor: 'lightgray', marginVertical: 3 }}></View>} */

                                            data={latestMoods}

                                            renderItem={({ item }) => (<Text variant="bodyLarge">{item.moodType}: {item.description}</Text>)}
                                            style={{ width: '95%' }}

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
        marginVertical: 10,
        alignItems: 'center', //väri-teksti tasaus
    },
});