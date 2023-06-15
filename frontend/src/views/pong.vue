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

<script>
import io from 'socket.io-client';
import { onMounted } from 'vue';
import Head from '../components/head.vue'

export default {
	data() {
		return {playerName: ""};
	},
	methods: {
		async getData(){
			const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/me", {credentials: 'include'});
			const user = await res.json();
			this.playerName = user["name"];
		}
	},
	async mounted() {
		await this.getData();
		const socket = io("http://" + import.meta.env.VITE_HOST + ":3000", {
				extraHeaders: {"playername": this.playerName}
		});

		socket.on('gameJoined', (data) => {
			const playerId = data.playerId;
			console.log(`Vous avez rejoint le jeu. Votre identifiant de joueur est : ${playerId}`);
		});

		socket.on('playerJoined', (data) => {
			const playerId = data.playerId;
			console.log(`Un nouveau joueur a rejoint le jeu. Identifiant du joueur : ${playerId}`);
		});

		socket.on('disconnect', () => {
			console.log('Vous avez été déconnecté du jeu.');
		});

		socket.emit('joinGame');

		const canvas = document.getElementById('pongCanvas');
		const ctx = canvas.getContext('2d');
		socket.emit('ready');

		socket.on('updateBall', (data) => {
			drawBall(data.position.x, data.position.y);
		});

		const ballRadius = 10;


		function drawBall(x, y) {
			console.log(x, y)
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.beginPath();
			ctx.arc(x, y, ballRadius, 0, Math.PI*2);
			ctx.fillStyle = "#FFFFFF";
			ctx.fill();
			ctx.stroke();
			ctx.closePath();

		}
	}
}
</script>

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

}
#pongCanvas {
	width: 100%;
	height: 100%;
	background: black;
	border-radius: 5px;
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