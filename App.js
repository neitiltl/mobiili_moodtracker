import { PaperProvider } from 'react-native-paper';
import MoodTracker from './MoodTracker';


export default function App() {
  return (
    <PaperProvider>
      <MoodTracker />
    </PaperProvider>

  );
}