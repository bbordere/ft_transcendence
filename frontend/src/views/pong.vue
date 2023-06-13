<script>
import io from 'socket.io-client';
import { onMounted } from 'vue';
import Head from '../components/head.vue'

export default{
	mounted() {

    const socket = io('http://localhost:3000');

    socket.on('gameJoined', (data) => {
		const playerId = data.playerId;
		console.log(`Vous avez rejoint le jeu. Votre identifiant de joueur est : ${playerId}`);
      
      // Tu peux ajouter ici le code pour initialiser le jeu du client
    });

    socket.on('playerJoined', (data) => {
		const playerId = data.playerId;
		console.log(`Un nouveau joueur a rejoint le jeu. Identifiant du joueur : ${playerId}`);
      
      // Tu peux ajouter ici le code pour gérer l'affichage du nouveau joueur dans le jeu
    });

    socket.on('disconnect', () => {
     	console.log('Vous avez été déconnecté du jeu.');
      
      // Tu peux ajouter ici le code pour gérer la déconnexion du joueur
    });

    socket.emit('joinGame');






	const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
	var x = canvas.width/2;
	var y = canvas.height/2;
	var dx = 1;
	var dy = 1;
	var ballRadius = 10;

	function drawBall() {
		ctx.beginPath();
		ctx.arc(x, y, ballRadius, 0, Math.PI*2);
		ctx.fillStyle = "#0095DD";
		ctx.fill();
		ctx.closePath();
	}

	function drawPong() {
    	// Efface le contenu précédent du canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawBall();
		if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    	    dx = -dx;
    	}
   		if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
        	dy = -dy;
    	}
		x+=dx;
		y+=dy;
	}

	function gameLoop() {
      // Appelle la fonction de rendu pour mettre à jour le canvas
      drawPong();

      // Appelle la boucle de rendu à la prochaine frame
      requestAnimationFrame(gameLoop);
    }
	gameLoop();
  }
}

</script>

<template>
	<Head />
	<div class="pong_body">
		<div class="pong_content">
			<div class="left_column">
				<div class="left_point">
					<label>left_point</label>
				</div>
			</div>
			<div class="middle_column">
				<div class="timer">
					<label>timer</label>
				</div>
				<div class="pong_screen">
					<canvas id="pongCanvas"></canvas>
				</div>
				<div class="button_panel">
					<div class="reaction_panel">
						<button id="reaction_1">rire</button>
						<button id="reaction_2">stresse</button>
						<button id="reaction_3">pleure</button>
						<button id="reaction_4">poignet de main</button>
					</div>

					<div class="forgive_button">
						<router-link to="/">abbandoner</router-link>
					</div>
				</div>
			</div>
			<div class="right_column">
				<div class="right_point">
					<label>right_point</label>
				</div>
			</div>
		</div>
	</div>
</template>

<style>

.pong_body {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
}

.pong_content {
	height: 80%;
	width: 90%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;


	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 20px;
}

.left_column {
	height: 100%;
	width: 10%;
	display: flex;
	align-items: center;
	justify-content: center;

}

.middle_column {
	height: 100%;
	width: 65%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
}

.timer {
	display: flex;
	height: 10%;
	width: 100%;
	align-items: center;
	justify-content: center;
}

.pong_screen {
	max-width: 80%;
	max-height: 80%;
	min-width: auto;
	width: 100%;
	aspect-ratio: 4/3;

}
#pong {
	width: 100ss%;
	height: 100%;
	background: black;
	border-radius: 20px;
}

.button_panel {
	display: flex;
	height: 10%;
	width: 100%;
	align-items: center;
	justify-content: space-between;
}

.right_column {
	height: 100%;
	width: 10%;
	display: flex;
	align-items: center;
	justify-content: center;

}

</style>