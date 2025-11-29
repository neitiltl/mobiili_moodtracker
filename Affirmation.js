import React, { useEffect, useState } from "react";
import { StyleSheet, Alert } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function Affirmation() {
    const [affirmation, setAffirmation] = useState("");

    const handleFetch = async () => {
        try {
            const response = await fetch("https://www.affirmations.dev/"); /* {"affirmation":"text quote "} */
            const data = await response.json();

            setAffirmation(data.affirmation);
        } catch (error) {
            console.error("Haku ei onnistunut", error);
            Alert.alert("Haku ei onnistunut")
        }
    }

    useEffect(() => {
        handleFetch();
    }, []);

    return (
        <Card style={styles.card}>
            <Card.Content>
                <Card style={styles.itemCard}>
                    <Text style={styles.textCenter}>
                        {affirmation}
                    </Text>
                </Card>

                <Button mode="contained-tonal" style={styles.button}
                    onPress={handleFetch}>
                    Hae uusi mietelause
                </Button>
            </Card.Content>
        </Card>
    )
}
const styles = StyleSheet.create({
    card: {
        marginBottom: 20,
        borderRadius: 10,
        elevation: 4,
        backgroundColor: "#faf0e6",
    },
    textCenter: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    itemCard: {
        marginVertical: 6,
        borderRadius: 12,
        elevation: 2,
        padding: 10,
        backgroundColor: "#f8f8f8",
    },
    button: {
        marginVertical: 5,
    },
})