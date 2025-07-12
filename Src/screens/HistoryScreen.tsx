import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ImageBackground } from 'react-native';
import { TimerContext } from '../context/TimerContext';

const HistoryScreen = () => {
  const { history } = useContext(TimerContext);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' }}
      style={{ flex: 1 }}
      blurRadius={2}
    >
      <View style={styles.overlay}>
        <Text style={styles.heading}>Completed Timers</Text>
        {history?.length === 0 ? (
          <Text style={styles.emptyText}>No completed timers yet.</Text>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.duration}>
                  Duration: {Math.floor(item.duration / 3600)}h {Math.floor((item.duration % 3600) / 60)}m {item.duration % 60}s
                </Text>
                <Text style={styles.time}>{new Date(item.completedAt).toLocaleString()}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 30 }}
          />
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    padding: 18,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: 1,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
    opacity: 0.8,
  },
  item: {
    backgroundColor: 'rgba(255,255,255,0.93)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#4f8cff',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4f8cff',
    marginBottom: 2,
  },
  category: {
    fontSize: 15,
    color: '#888',
    marginBottom: 4,
    fontStyle: 'italic',
  },
  duration: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
  },
  time: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
    textAlign: 'right',
  },
});

export default HistoryScreen;