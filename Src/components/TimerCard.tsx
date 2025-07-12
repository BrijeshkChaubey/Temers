import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ProgressBarAndroid, ProgressViewIOS } from 'react-native';

const TimerCard = ({ timer, onStart, onPause, onReset }) => {
  const progress = timer.duration > 0 ? timer.remaining / timer.duration : 0;
  const minutes = Math.floor(timer.remaining / 60);
  const seconds = timer.remaining % 60;

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{timer.name}</Text>
      <Text style={[styles.status, timer.status === 'Completed' && styles.completed]}>
        Status: {timer.status}
      </Text>
      <Text style={styles.time}>{`${minutes}m ${seconds}s remaining`}</Text>
      <View style={styles.progressBar}>
        {Platform.OS === 'android' ? (
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={progress}
            color="#4f8cff"
          />
        ) : (
          <ProgressViewIOS progress={progress} progressTintColor="#4f8cff" />
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            timer.status === 'Running' && styles.disabledButton,
          ]}
          onPress={onStart}
          disabled={timer.status === 'Running' || timer.status === 'Completed'}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.pauseButton,
            timer.status !== 'Running' && styles.disabledButton,
          ]}
          onPress={onPause}
          disabled={timer.status !== 'Running' || timer.status === 'Completed'}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>Pause</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.resetButton]}
          onPress={onReset}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f7faff',
    padding: 18,
    borderRadius: 14,
    marginVertical: 8,
    shadowColor: '#4f8cff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e3eaff',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  status: {
    fontSize: 14,
    marginVertical: 2,
    color: '#4f8cff',
    fontWeight: '600',
  },
  completed: {
    color: '#43a047',
  },
  time: {
    fontSize: 16,
    marginVertical: 4,
    color: '#333',
    fontWeight: '500',
  },
  progressBar: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4f8cff',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    opacity: 1,
  },
  pauseButton: {
    backgroundColor: '#ffb300',
  },
  resetButton: {
    backgroundColor: '#ff5252',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
export default TimerCard;



