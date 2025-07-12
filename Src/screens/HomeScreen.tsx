import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Platform,
} from 'react-native';
import { TimerContext } from '../context/TimerContext';
import uuid from 'react-native-uuid';
import CategorySection from '../components/CategorySection';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

const CATEGORIES = ['Work', 'Study', 'Exercise', 'Break', 'Other'];

const HomeScreen = ({ navigation }) => {
  const {
    timers = [],
    addTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    startAllInCategory,
    pauseAllInCategory,
    resetAllInCategory,
  } = useContext(TimerContext);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState({});
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');

  // Group timers by category
  const groupedTimers = timers.reduce((groups, timer) => {
    if (!groups[timer.category]) groups[timer.category] = [];
    groups[timer.category].push(timer);
    return groups;
  }, {});

  const validate = () => {
    const errs = {};
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;
    if (!name.trim()) errs.name = 'Name is required';
    if (totalSeconds <= 0) errs.duration = 'Enter valid time (H/M/S)';
    if (!category) errs.category = 'Select a category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = () => {
    if (!validate()) return;
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const totalSeconds = h * 3600 + m * 60 + s;

    addTimer({
      id: uuid.v4(),
      name: name.trim(),
      duration: totalSeconds,
      remaining: totalSeconds,
      category,
      status: 'Paused',
    });

    // Reset inputs
    setName('');
    setHours('0');
    setMinutes('0');
    setSeconds('0');
    setCategory('');
    setErrors({});
    Alert.alert('Success', 'Timer added!');
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      }}
      style={{ flex: 1 }}
      blurRadius={2}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.heading}>Add Timer</Text>

          <TextInput
            placeholder="Name"
            placeholderTextColor="#aaa"
            value={name}
            onChangeText={setName}
            style={[styles.input, errors.name && styles.inputError]}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}

         <Text style={styles.pickerLabel}>Duration</Text>
<View style={styles.timeInputContainer}>
  <View style={styles.timeGroup}>
    <Text style={styles.timeLabel}>Hours</Text>
    <TextInput
      style={styles.timeInput}
      keyboardType="numeric"
      placeholder="HH"
      placeholderTextColor="#999"
      value={hours}
      onChangeText={setHours}
      maxLength={2}
    />
  </View>
  <View style={styles.timeGroup}>
    <Text style={styles.timeLabel}>Minutes</Text>
    <TextInput
      style={styles.timeInput}
      keyboardType="numeric"
      placeholder="MM"
      placeholderTextColor="#999"
      value={minutes}
      onChangeText={setMinutes}
      maxLength={2}
    />
  </View>
  <View style={styles.timeGroup}>
    <Text style={styles.timeLabel}>Seconds</Text>
    <TextInput
      style={styles.timeInput}
      keyboardType="numeric"
      placeholder="SS"
      placeholderTextColor="#999"
      value={seconds}
      onChangeText={setSeconds}
      maxLength={2}
    />
  </View>
</View>
{errors.duration && <Text style={styles.error}>{errors.duration}</Text>}

<Text style={styles.pickerLabel}>Category</Text>
<View style={[styles.pickerContainer, errors.category && styles.inputError]}>
  <Picker
    selectedValue={category}
    onValueChange={setCategory}
    style={styles.picker}
    dropdownIconColor="#333"
  >
    <Picker.Item label="Select Category..." value="" color="#aaa" />
    {CATEGORIES.map(cat => (
      <Picker.Item key={cat} label={cat} value={cat} />
    ))}
  </Picker>
</View>
{errors.category && <Text style={styles.error}>{errors.category}</Text>}

          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.addButtonText}>Add Timer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate('History')}
          >
            <Text style={styles.historyButtonText}>Go to History</Text>
          </TouchableOpacity>

          <View style={styles.sectionContainer}>
            {Object.keys(groupedTimers).map(cat => (
              <CategorySection
                key={cat}
                category={cat}
                timers={groupedTimers[cat]}
                onStartAll={() => startAllInCategory(cat)}
                onPauseAll={() => pauseAllInCategory(cat)}
                onResetAll={() => resetAllInCategory(cat)}
                onTimerAction={(id, action) => {
                  if (action === 'start') startTimer(id);
                  else if (action === 'pause') pauseTimer(id);
                  else if (action === 'reset') resetTimer(id);
                }}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    minHeight: '100%',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    color: '#222',
  },
  inputError: {
    borderColor: '#ff5252',
    borderWidth: 1.5,
  },
  error: {
    color: '#ff5252',
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 13,
  },
  pickerLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 2,
    textAlign: 'center',
  },
timeInputContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 12,
  backgroundColor: 'rgba(255,255,255,0.9)',
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 10,
},
timeGroup: {
  alignItems: 'center',
  flex: 1,
},
timeLabel: {
  fontSize: 13,
  color: '#333',
  marginBottom: 6,
  fontWeight: '600',
},
 timeInput: {
  backgroundColor: '#fff',
  textAlign: 'center',
  fontSize: 18,
  color: '#222',
  paddingVertical: 8,
  paddingHorizontal: 10,
  borderRadius: 8,
  width: '90%',
  borderWidth: 1,
  borderColor: '#ccc',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 1 },
  elevation: 2,
},
  timeColon: {
    fontSize: 18,
    color: '#222',
    paddingHorizontal: 5,
    lineHeight: 40,
  },
 pickerContainer: {
  backgroundColor: 'rgba(255,255,255,0.95)',
  borderRadius: 10,
  marginBottom: 8,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: '#ccc',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2,
},
picker: {
  color: '#222',
  height: 50,
  width: '100%',
},
addButton: {
    backgroundColor: '#4f8cff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  historyButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#4f8cff',
  },
  historyButtonText: {
    color: '#4f8cff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  sectionContainer: {
    marginTop: 10,
  },
});

export default HomeScreen;
