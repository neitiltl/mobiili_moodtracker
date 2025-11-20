import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { PaperProvider } from 'react-native-paper';
import { registerTranslation } from 'react-native-paper-dates'; //Dates fi

import MoodTracker from './MoodTracker';
import ShowMoods from './ShowMoods';

import { SQLiteProvider } from 'expo-sqlite';

const Stack = createNativeStackNavigator();

/* https://web-ridge.github.io/react-native-paper-dates/docs/intro#register-translation */
registerTranslation('fi', {
  save: 'Tallenna',
  selectSingle: 'Valitse päivä',
  selectMultiple: 'Valitse päivät',
  selectRange: 'Valitse aikaväli',
  notAccordingToDateFormat: (inputFormat) =>
    `Päiväyksen tulee olla muotoa ${inputFormat}`,
  mustBeHigherThan: (date) => `Valitse myöhempi kuin ${date}`,
  mustBeLowerThan: (date) => `Valitse aikaisempi kuin ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Pitää olla väliltä ${startDate} - ${endDate}`,
  dateIsDisabled: 'Päivää ei voi valita',
  previous: 'Edellinen',
  next: 'Seuraava',
  typeInDate: 'Kirjoita päivämäärä',
  pickDateFromCalendar: 'Valitse kalenterista',
  close: 'Sulje',
})


export default function App() {

  const initialize = async (db) => {
    try {
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tracker(id INTEGER PRIMARY KEY NOT NULL,
        moodType TEXT,
        description TEXT,
        inputDate TEXT);
      `);

    } catch (error) {
      console.error('Could not open database', error);
    }
  }


  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <SQLiteProvider
            databaseName='trackerdb.db'
            onInit={initialize}
            onError={error => console.error('Could not open database', error)}
          >

            <Stack.Navigator initialRouteName="MoodTracker">
              <Stack.Screen name="MoodTracker" component={MoodTracker} />
              <Stack.Screen name="ShowMoods" component={ShowMoods} />
            </Stack.Navigator>
          </SQLiteProvider>

        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>

  );
}