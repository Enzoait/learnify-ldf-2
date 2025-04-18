# Learnify 🃏

Learnify is a React Native app that allows you to make decks, add cards to these decks and study your courses.

## Get Started

To set up this starter template, please follow these steps:

1. Configure Supabase:

- If you haven't already, create an new account on [Supabase](https://supabase.com/).
- Create a new project and obtain your Supabase URL and API key.
- Update the `EXPO_PUBLIC_API_URL` and `EXPO_PUBLIC_API_KEY` variables in the `.env` file with your Supabase URL and API key respectively.

Note: By default Supabase Auth requires email verification before a session is created for the users. To support email verification you need to implement deep link handling! Alternatively, you can disable email confirmation in your project's email auth provider settings.

2. Clone the repository to your local machine:

```bash
git clone https://github.com/Enzoait/learnify-ldf-2
```

3. Install the required dependencies:

```bash
yarn install
```

4. Start the Expo development server:

```bash
yarn start
```

# **Gestion des QCM et Notifications**

Ce projet permet de gérer des QCM, de créer, de jouer, de modifier et de supprimer des QCM, tout en ayant des notifications quotidiennes pour rappeler à l'utilisateur de jouer à un QCM. Ce projet utilise **Expo** pour faciliter le développement, les tests et le déploiement.

## **Fonctionnalités**

### **1. Gestion des QCM**

L'application permet à l'utilisateur de :

- **Créer un QCM**
- **Modifier un QCM**
- **Supprimer un QCM**
- **Jouer à un QCM** et obtenir une évaluation des réponses

#### **Création d'un QCM**

Les utilisateurs peuvent créer un QCM en remplissant des champs pour définir les questions, les réponses et la réponse correcte.

1. Dans le formulaire de création de QCM, les utilisateurs peuvent saisir :
   - Titre du QCM
   - Liste de questions
   - Liste de réponses pour chaque question
   - Réponse correcte à chaque question

#### **Modification d'un QCM**

Les utilisateurs peuvent modifier un QCM existant en cliquant sur un QCM dans la liste. Cela leur permet de changer le titre, les questions, les réponses et la réponse correcte.

#### **Suppression d'un QCM**

Les utilisateurs peuvent supprimer un QCM via une option dans l'interface, ce qui supprime définitivement le QCM de l'application.

#### **Jouer à un QCM**

L'utilisateur peut jouer à un QCM en sélectionnant un QCM à partir de la liste. L'application affichera une question à la fois avec un ensemble de réponses. L'utilisateur doit sélectionner la bonne réponse et une fois le QCM terminé, l'application affichera un score en fonction des réponses correctes.

### **2. Gestion des Notifications**

L'application permet de programmer des notifications quotidiennes à une heure précise pour rappeler à l'utilisateur de jouer à un QCM.

#### **Fonctionnement des Notifications**

- **Activer/Désactiver les notifications :** L'utilisateur peut activer ou désactiver les notifications quotidiennes via un interrupteur.
- **Planifier une notification :** Lors de l'activation des notifications, l'utilisateur peut définir l'heure et la minute auxquelles il souhaite recevoir une notification quotidienne. Par défaut, l'heure est définie à 08:00 et la minute à 00:00.
- **Contenu de la notification :** L'utilisateur peut personnaliser le titre et le contenu de la notification.

Les notifications se répéteront tous les jours à l'heure spécifiée par l'utilisateur.

#### **Code pour gérer les notifications**

Voici la fonction qui permet de planifier une notification quotidienne :

```javascript
const scheduleDailyNotification = async (title, body, hour, minute) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const currentDate = new Date();
  const notificationDate = new Date(currentDate.setHours(hour, minute, 0, 0));

  if (currentDate >= notificationDate) {
    notificationDate.setDate(notificationDate.getDate() + 1);
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: {
      hour: notificationDate.getHours(),
      minute: notificationDate.getMinutes(),
      repeats: true,
    },
  });
};
```