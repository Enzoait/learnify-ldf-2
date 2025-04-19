# 🃏 Learnify 
Learnify est une application React Native qui vous permet de créer des decks, d'ajouter des cartes à ces decks et d'étudier vos cours.

## 🚀 Démarrage

Pour configurer ce projet, veuillez suivre ces étapes :

1. Clonez le dépôt sur votre machine locale :

```bash
git clone https://github.com/Enzoait/learnify-ldf-2
```

2. Renommez le fichier `.env.example` en `.env`

3. Installez yarn si ce n'est pas déjà fait : 

```bash
npm install --global yarn
```

4. Installez les dépendances requises :

```bash
npx expo install
```

5. Lancez le serveur de développement Expo :

```bash
yarn start
```

6. Une fois l'application lancée, vous devrez vous créer un compte, merci de saisir comme domaine pour le mail `@supabase.co` !

Exemple : 
 ```sh
 Email : test@supabase.co
 Mot de passe : Mot de passe de plus de 8 caractères avec au moins 1 caractère spécial
 ```

# 📝 **Gestion des QCM et Notifications**

Ce projet permet de gérer des QCM, de créer, de jouer, de modifier et de supprimer des QCM, tout en ayant des notifications quotidiennes pour rappeler à l'utilisateur de jouer à un QCM. Ce projet utilise **Expo** pour faciliter le développement, les tests et le déploiement.

## 🌟 **Fonctionnalités**

### ❓ **1. Gestion des QCM**

L'application permet à l'utilisateur de :

- **Créer un QCM**
- **Modifier un QCM**
- **Supprimer un QCM**
- **Jouer à un QCM** et obtenir une évaluation des réponses

#### ✍️ **Création d'un QCM**

Les utilisateurs peuvent créer un QCM en remplissant des champs pour définir les questions, les réponses et la réponse correcte.

1. Dans le formulaire de création de QCM, les utilisateurs peuvent saisir :
  - Titre du QCM
  - Liste de questions
  - Liste de réponses pour chaque question
  - Réponse correcte à chaque question

#### 🛠️ **Modification d'un QCM**

Les utilisateurs peuvent modifier un QCM existant en cliquant sur un QCM dans la liste. Cela leur permet de changer le titre, les questions, les réponses et la réponse correcte.

#### 🗑️ **Suppression d'un QCM**

Les utilisateurs peuvent supprimer un QCM via une option dans l'interface, ce qui supprime définitivement le QCM de l'application.

#### 🎮 **Jouer à un QCM**

L'utilisateur peut jouer à un QCM en sélectionnant un QCM à partir de la liste. L'application affichera une question à la fois avec un ensemble de réponses. L'utilisateur doit sélectionner la bonne réponse et une fois le QCM terminé, l'application affichera un score en fonction des réponses correctes.

### 🔔 **2. Gestion des Notifications**

L'application permet de programmer des notifications quotidiennes à une heure précise pour rappeler à l'utilisateur de jouer à un QCM.

#### ⏰ **Fonctionnement des Notifications**

- **Activer/Désactiver les notifications :** L'utilisateur peut activer ou désactiver les notifications quotidiennes via un interrupteur.
- **Planifier une notification :** Lors de l'activation des notifications, l'utilisateur peut définir l'heure et la minute auxquelles il souhaite recevoir une notification quotidienne. Par défaut, l'heure est définie à 08:00 et la minute à 00:00.
- **Contenu de la notification :** L'utilisateur peut personnaliser le titre et le contenu de la notification.

Les notifications se répéteront tous les jours à l'heure spécifiée par l'utilisateur.

#### 💻 **Code pour gérer les notifications**

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
### 🃏 **3. Gestion des Decks et des cartes**

L'application permet à l'utilisateur de :

- **Créer un deck**
- **Modifier un deck**
- **Supprimer un deck**

Chaque deck peut contenir des cartes, un deck de départ est requis pour pourvoir créer sa première carte. Une fois son 1er deck créé, l'utilisateur peut alors créer des cartes, avec ses questions et réponses, puis ajouter ses cartes à un deck.

#### 📚 **Mode révision**

Lorsque l'utilisateur clique sur un deck contenant des cartes, il a la possibilité de réviser ses cartes en appuyant sur la carte pour la retourner et ainsi afficher la réponse, puis passer à la carte suivante en swipant. Une fois toutes les cartes swipées, l'utilisateur peut balayer vers la gauche (ou appuyer sur la flèche en haut à gauche) pour revenir à la page des decks et ainsi choisir un nouveau deck ou recommencer le deck joué.
