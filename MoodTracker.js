import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MoodTracker() {
    return (
        <SafeAreaView style={styles.container}>
            <Text>Mood Tracker Component</Text>

        </SafeAreaView>
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