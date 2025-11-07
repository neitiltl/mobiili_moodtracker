import { StyleSheet, Text, Button, View, FlatList, Alert, TextInput, Platform } from 'react-native';

export default function ShowMoods({ route, navigation }) {

    const { moods = [] } = route.params || {};

    const testiMoods = [
        /* { moodType: "Optimi", description: "Tämä on testidataa" },
        { moodType: "Ylivireys", description: "Tässä on toisenlainen testidata jonka teksti on todella paljon pidempi" },
        { moodType: "Alivireys", description: "Kolmas testidataa" } */]; // TESTIDATA


    let shownMoods;

    if (moods.length > 0) {
        shownMoods = moods;
    } else {
        shownMoods = testiMoods; //jos ei ole moods-dataa, näytä testiMoods
    };

    /*     if (shownMoods.length === 0) { //tarkistaa lengthin (kun testidata poistettu)
            return (
                <View style={styles.container}>
                    <Text>Ei talletuksia.</Text>
                </View>
            )
        }
     */
    return (

        <View style={styles.container}>
            <View style={{
                flex: 1, flexDirection: 'column',
                alignItems: 'center', justifyContent: 'space-around'
            }}>

                <FlatList
                    ItemSeparatorComponent={<View style={{ height: 2, backgroundColor: 'lightgray', marginVertical: 3 }}></View>}

                    data={shownMoods} // KORJAA moods
                    renderItem={({ item }) => <Text>{item.moodType}: {item.description}</Text>}

                    ListEmptyComponent={<Text>Ei merkintöjä</Text>}
                />

            </View>

            <View style={{
                flex: 1, flexDirection: 'column',
                alignItems: 'center', justifyContent: 'space-around'
            }}>



            </View>


            <View style={{
                flex: 1, flexDirection: 'column',
                alignItems: 'center', justifyContent: 'space-around'
            }}>


                <Button title="MoodTracker" onPress={() => navigation.navigate('MoodTracker')} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});