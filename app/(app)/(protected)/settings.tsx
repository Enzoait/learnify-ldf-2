import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Platform, Switch, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useSupabase } from '@/context/supabase-provider';
import { Button } from '@/components/ui/button';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notificationTitle, setNotificationTitle] = useState('Rappel quotidien');
  const [notificationBody, setNotificationBody] = useState('Ceci est votre notification !');
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('00');
  const [enabled, setEnabled] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const { signOut } = useSupabase();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification reçue :', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Réponse à la notification :', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (enabled) {
      const currentDate = new Date();
      const notificationDate = new Date(currentDate.setHours(parseInt(hour), parseInt(minute), 0, 0));

      if (currentDate >= notificationDate) {
        notificationDate.setDate(notificationDate.getDate() + 1);
      }

      scheduleDailyNotification(notificationTitle, notificationBody, notificationDate.getHours(), notificationDate.getMinutes());
    } else {
      Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, [enabled, hour, minute]);

  const scheduleDailyNotification = async (title, body, hour, minute) => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
  };

  return (
		<View style={styles.container}>
			<Text style={styles.label}>Titre :</Text>
			<TextInput
				style={styles.input}
				value={notificationTitle}
				onChangeText={setNotificationTitle}
			/>

			<Text style={styles.label}>Contenu :</Text>
			<TextInput
				style={styles.input}
				value={notificationBody}
				onChangeText={setNotificationBody}
			/>

			<Text style={styles.label}>Heure (HH):</Text>
			<TextInput
				style={styles.input}
				keyboardType="numeric"
				value={hour}
				onChangeText={setHour}
				maxLength={2}
			/>

			<Text style={styles.label}>Minute (MM):</Text>
			<TextInput
				style={styles.input}
				keyboardType="numeric"
				value={minute}
				onChangeText={setMinute}
				maxLength={2}
			/>

			<View style={styles.switchContainer}>
				<Text style={styles.label}>Activer notification quotidienne :</Text>
				<Switch value={enabled} onValueChange={setEnabled} />
			</View>

			<Button
				className="w-full"
				size="default"
				variant="default"
				onPress={signOut}
			>
				<Text>Se déconnecter</Text>
			</Button>
		</View>
	);
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Platform.OS === 'ios') {
    await Notifications.requestPermissionsAsync();
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Permission refusée pour les notifications.');
      return;
    }

    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (e) {
      console.log('Erreur token :', e);
    }
  } else {
    alert('Notifications push disponibles uniquement sur appareil physique');
  }

  return token;
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  label: { fontSize: 16, marginBottom: 4, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#15803d',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  token: {
    marginTop: 16,
    fontSize: 12,
    color: '#666',
  },
});
