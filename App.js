import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoodTracker from './MoodTracker';
import ShowMoods from './ShowMoods';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { PaperProvider } from 'react-native-paper';



const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <NavigationContainer>
  
          <Stack.Navigator initialRouteName="MoodTracker">
            <Stack.Screen name="MoodTracker" component={MoodTracker} />
            <Stack.Screen name="ShowMoods" component={ShowMoods} />
          </Stack.Navigator>

        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>

  );
}