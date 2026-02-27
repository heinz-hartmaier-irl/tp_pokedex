# tp_pokedex

Application de Pokedex

# Back : 
Node.js, avec le framework Express
# Front : 
Angular
# BDD : 
MongoDb

# Objectif : 
Créer une application de Pokedex, avec un affichage des pokemons, et la possibilité de visionner les détails d'un pokemon tout en gardant un historique des pokemons visités ou capturés.

# Fonctionnalités : 
- Affichage des pokemons
- Visionnage des détails d'un pokemon
- Historique des pokemons visités ou capturés
- Lecture des détails d'un pokemon avec la voix du navigateur

# Installation : 
- Back : 
  - Cloner le repository
  - Ouvrir un terminal dans le dossier backend
  - Lancer la commande : npm install
  - Lancer la commande : npm start
- Front : 
  - Cloner le repository
  - Ouvrir un terminal dans le dossier frontend
  - Lancer la commande : npm install
  - Lancer la commande : npm start
- BDD : 
  - Décompressez l’archive MongoDB dans un espace accessible en écriture (comme le bureau)
  - Créez un dossier data dans le dossier MongoDB
  - Ouvrez un terminal dans le dossier MongoDB
  - Lancer la commande : .\bin\mongod.exe --dbpath data
  - ! Laissez tourner ce terminal !
  - Installer l'extension MongoDb pour Visual Studio Code
  - Configurez la connexion au serveur local avec la chaîne de connexion standard (mongodb://localhost)

# Import des données pokemons : 
  - A la racine du projet se trouve des fichiers python / js / json qui sont un esnsemble qui permet d'aller chercher les données des pokemons sur l'api pokeapi et de les mettre au bon format pour la bdd MongoDB 
  - Cela risque de prendre du temps, afin de ne pas surcharger l'api pokeapi et éviter les erreurs
  - Il faut d'abord lancer le fichier python pour récupérer les données des pokemons : python fetch_pkmn_data.py 
  - Ensuite, il faut lancer le fichier js pour importer les données dans la bdd MongoDB : node seed.js
  - Rendez vous dans le dossier backend et lancer le fichier seed.js : node seed.js
  - Toutes les données sont maintenant dans la bdd MongoDB et vous pouvez lancer l'application
  - Si vous désirer changer les données des pokemons récupérés, vous pouvez modifier le paramètre ranges dans le fichier fetch_pkmn_data.py et fetch_pkmn_data.js pour ensuite relancer les fichiers python et js 