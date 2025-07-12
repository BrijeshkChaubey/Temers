import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import TimerCard from './TimerCard';

const CategorySection = ({ category, timers, onStartAll, onPauseAll, onResetAll, onTimerAction }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.header}>
        <Text style={styles.title}>{category}</Text>
        <Text style={styles.arrow}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <>
          <View style={styles.bulkActions}>
            <TouchableOpacity style={[styles.bulkButton, { backgroundColor: '#4f8cff' }]} onPress={onStartAll}>
              <Text style={styles.bulkButtonText}>Start All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bulkButton, { backgroundColor: '#ffb300' }]} onPress={onPauseAll}>
              <Text style={styles.bulkButtonText}>Pause All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.bulkButton, { backgroundColor: '#ff5252' }]} onPress={onResetAll}>
              <Text style={styles.bulkButtonText}>Reset All</Text>
            </TouchableOpacity>
          </View>
          {timers.map((timer) => (
            <View key={timer.id} style={styles.cardWrapper}>
              <TimerCard
                timer={timer}
                onStart={() => onTimerAction(timer.id, 'start')}
                onPause={() => onTimerAction(timer.id, 'pause')}
                onReset={() => onTimerAction(timer.id, 'reset')}
              />
            </View>
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4f8cff',
    letterSpacing: 1,
  },
  arrow: {
    fontSize: 18,
    color: '#888',
  },
  bulkActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  bulkButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  bulkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  cardWrapper: {
    marginTop: 10,
    marginBottom: 6,
  },
});

export default CategorySection;