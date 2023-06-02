<script lang="ts">
import io from 'socket.io-client';

export default {
  mounted() {
    // Établis la connexion avec le serveur
    const socket = io('http://localhost:3000');

    // Événement lorsqu'un joueur rejoint le jeu
    socket.on('gameJoined', (data) => {
      const playerId = data.playerId;
      console.log(`Vous avez rejoint le jeu. Votre identifiant de joueur est : ${playerId}`);
      
      // Tu peux ajouter ici le code pour initialiser le jeu du client
    });

    // Événement lorsqu'un nouveau joueur rejoint le jeu
    socket.on('playerJoined', (data) => {
      const playerId = data.playerId;
      console.log(`Un nouveau joueur a rejoint le jeu. Identifiant du joueur : ${playerId}`);
      
      // Tu peux ajouter ici le code pour gérer l'affichage du nouveau joueur dans le jeu
    });

    // Événement lorsqu'un joueur se déconnecte du jeu
    socket.on('disconnect', () => {
      console.log('Vous avez été déconnecté du jeu.');
      
      // Tu peux ajouter ici le code pour gérer la déconnexion du joueur
    });

    // Envoie l'événement "joinGame" au serveur pour rejoindre le jeu
    socket.emit('joinGame');
  }
}

</script>

<template>

</template>

<style>

</style>