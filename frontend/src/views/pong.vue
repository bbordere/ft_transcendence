<template>
	<Head />
	<div class="pong_body">
		<div class="pong_content">
			<div class="left_column">
				<div class="left_point">
					<span id="score1"></span>
				</div>
			</div>
			<div class="middle_column">
				<div class="timer">
					<label>timer</label>
				</div>
				<div class="pong_screen">
					<canvas id="pongCanvas" width="2000" height="1200"></canvas>
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
					<span id="score2"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import io from 'socket.io-client';
import Head from '../components/head.vue'
import { no, ru } from 'vuetify/locale';
import { useRoute } from 'vue-router';

export default {
	data() {
		return {playerName: "", socket: io()};
	},
	methods: {
		getIdMode(mode: string){
			const modes: string[] = ["classic", "arcade", "ranked"];
			if (!modes.includes(mode)){
				this.$router.push('/notfound');
				return;
			}
			return modes.indexOf(mode);
		}
	},
	mounted() {
		this.socket = io("http://" + import.meta.env.VITE_HOST + ":3000/pong");		

		//TO DO GET MODE FROM PAGE QUERY
		const route = useRoute();
		const mode: string | undefined = route.query["mode"]?.toString();
		if (!mode){
			this.$router.push('notfound');
			return;
		}

		this.socket.emit('onJoinGame', sessionStorage.getItem('token'), this.getIdMode(mode));

		this.socket.on('disconnect', () => {
			this.socket.disconnect();
			console.log('Vous avez été déconnecté du jeu.');
		});
		

		var keyArrowUp: Boolean = false
		var keyArrowDown: Boolean = false
		document.addEventListener('keydown', (event) => {
 			if (event.key === "ArrowUp" && !keyArrowUp) {
				keyArrowUp = true;
				this.socket.emit("arrowUpdate", "arrowUp");
				console.log("up")
			}
			if (event.key === "ArrowDown" && !keyArrowDown) {
				keyArrowDown = true;
				this.socket.emit("arrowUpdate", "arrowDown");
				console.log("down")
			}
		});
		document.addEventListener('keyup', (event) => {
 			if (event.key === "ArrowUp" && keyArrowUp) {
				keyArrowUp = false;
				this.socket.emit("arrowUpdate", "stopArrowUp");
				console.log("upstop")
			}
			if (event.key === "ArrowDown" && keyArrowDown) {
				keyArrowDown = false;
				this.socket.emit("arrowUpdate", "stopArrowDown");
				console.log("downstop")
			}
		});

		this.socket.on('updateScore', (score1, score2) => {
  			const scoreElement1 = document.getElementById('score1');
			const scoreElement2 = document.getElementById('score2');
  			scoreElement1.textContent = score1;
  			scoreElement2.textContent = score2;
		});

		const canvas = document.getElementById('pongCanvas');
		const ctx = canvas.getContext('2d');

		this.socket.on('updateGame', (ball, racket1, racket2) => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawBall(ball.position.x, ball.position.y);
			// console.log(racket2.top_pos);
			drawRect(racket1.top_pos.x, racket1.top_pos.y, racket1.width, racket1.size);
			drawRect(racket2.top_pos.x - racket1.width, racket2.top_pos.y, racket2.width, racket2.size);
		});

		function drawRect(x: Number, y: Number, width: Number, size: Number) {
			ctx.beginPath();
			ctx.rect(x, y, width, size);
			ctx.fillStyle = "#FFFFFF";
			ctx.fill();
			ctx.closePath();
		}

		this.socket.on('text', (data) => {
			drawText(data);
		});

		const ballRadius = 20;


		function drawText(text: string){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.font = "200px serif";
			ctx.fillText(text, 50, canvas.height / 2);
			ctx.fillStyle = 'white'
		}
		
		function drawBall(x: Number, y: Number) {
			ctx.beginPath();
			ctx.arc(x, y, ballRadius, 0, Math.PI*2);
			ctx.fillStyle = "#FFFFFF";
			ctx.fill();
			ctx.closePath();
		}
		
	},
	beforeUnmount(){
		this.socket.disconnect();
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
	max-width: 100%;
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