<template>
	<Head />
	<div class="pong_body">
		<div class="pong_content">
			<div class="left_column">
				<PongPlayerCard v-if="dataLoaded" :id="player1Id" side="0" :emote="emote1.emoji"></PongPlayerCard>
				<div class="left_point">
					<span id="score1">{{score1}}</span>
				</div>
			</div>
			<div class="middle_column">
				<div class="timer">
					<label>{{timer}}</label>
				</div>
				<div class="pong_screen">
					<canvas id="pongCanvas" width="2000" height="1200"></canvas>
				</div>
				<div class="button_panel">
					<div class="reaction_panel">
						<Emote emoji="🤣" :socket="socket"></Emote>
						<Emote emoji="😬" :socket="socket"></Emote>
						<Emote emoji="😭" :socket="socket"></Emote>
						<Emote emoji="🤝" :socket="socket"></Emote>
						<!-- <button id="reaction_1">rire</button>
						<button id="reaction_2">stresse</button>
						<button id="reaction_3">pleure</button>
						<button id="reaction_4">poignet de main</button> -->
					</div>

					<div class="forgive_button">
						<router-link to="/">abbandoner</router-link>
					</div>
				</div>
			</div>
			<div class="right_column">
				<PongPlayerCard v-if="dataLoaded && player2Id.length !== 0" :id="player2Id" side="1" :emote="emote2.emoji"></PongPlayerCard>
				<div class="right_point">
					<span id="score2">{{score2}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import io from 'socket.io-client';
import Head from '../components/head.vue'
import { useRoute } from 'vue-router';
import PongPlayerCard from '@/components/PongPlayerCard.vue';
import Emote from '@/components/Emote.vue'

interface emote{
	emoji: string,
	protected: Boolean,
}

export default {
	data() {
		return {player1Id: "",
				player2Id: "",
				dataLoaded: false,
				socket: io(),
				timer: "00:00",
				score1: 0,
				score2: 0,
				emote1: {} as emote,
				emote2: {} as emote,
			};
	},
	components: {
		PongPlayerCard,
		Emote,
		// Head,
	},
	methods: {
		getIdMode(mode: string){
			const modes: string[] = ["classic", "arcade", "ranked"];
			if (!modes.includes(mode)){
				this.$router.push('/notfound');
				return;
			}
			return modes.indexOf(mode);
		},

		emoteHandling(side: number, emoji: string){
			let emote = side === 1 ? this.emote1 : this.emote2 ;
			if (emote.protected)
				return;
			emote.protected = true;
			emote.emoji = emoji;
			setTimeout(() => {
				emote.emoji = "";
				emote.protected = false;
			}, 4000);
		}
	},
	mounted() {
		
		this.socket = io("http://" + import.meta.env.VITE_HOST + ":3000/pong");		

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
		
		this.socket.on('ids', (player1: string, player2: string) => {
			this.player1Id = player1;
			this.player2Id = player2;
			this.dataLoaded = true;
			console.log(this.player2Id.length);
		});


		var keyArrowUp: Boolean = false
		var keyArrowDown: Boolean = false
		document.addEventListener('keydown', (event) => {
 			if (event.key === "ArrowUp" && !keyArrowUp) {
				keyArrowUp = true;
				this.socket.emit("arrowUpdate", "arrowUp");
			}
			if (event.key === "ArrowDown" && !keyArrowDown) {
				keyArrowDown = true;
				this.socket.emit("arrowUpdate", "arrowDown");
			}
		});
		document.addEventListener('keyup', (event) => {
 			if (event.key === "ArrowUp" && keyArrowUp) {
				keyArrowUp = false;
				this.socket.emit("arrowUpdate", "stopArrowUp");
			}
			if (event.key === "ArrowDown" && keyArrowDown) {
				keyArrowDown = false;
				this.socket.emit("arrowUpdate", "stopArrowDown");
			}
		});

		this.socket.on('updateScore', (score1, score2) => {
			this.score1 = score1;
			this.score2 = score2;
		});

		const canvas = document.getElementById('pongCanvas');
		const ctx = canvas.getContext('2d');

		this.socket.on('updateGame', (ball, racket1, racket2, powerups) => {

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			drawRect(racket1.pos.x, racket1.pos.y, racket1.width, racket1.size, "#FFFFFF");
			drawRect(racket2.pos.x, racket2.pos.y, racket2.width, racket2.size, "#FFFFFF");

			if (powerups){
				for (var item of powerups){
					drawRect(item.pos.x, item.pos.y, item.radius, item.radius, item.color);
				}
			}

			drawCircle(ball.position.x, ball.position.y, ballRadius, ball.speed === 30 ? "#F44E1A" : "#2A52EB");

			// ctx.beginPath();
			// ctx.lineWidth = 5;
			// ctx.moveTo(canvas.width / 2, 0);
			// ctx.lineTo(canvas.width / 2, canvas.height); // Vous pouvez ajuster la longueur de la ligne ici
			// ctx.strokeStyle = "red";
			// ctx.stroke();
		});

		function drawRect(x: Number, y: Number, width: Number, size: Number, color: string) {
			ctx.beginPath();
			ctx.rect(x, y, width, size);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.closePath();
		}

		this.socket.on('text', (data) => {
			drawText(data);
		});

		this.socket.on('time', (time) => {
			this.timer = time;
		});

		this.socket.on('emote', (player, emoji) => {
			if (player == 0)
				this.emoteHandling(1, emoji);
			else
				this.emoteHandling(2, emoji);
			console.log(this.emote1, this.emote2);
		});

		const ballRadius = 20;

		function drawText(text: string){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.font = "200px serif";
			ctx.fillText(text, 50, canvas.height / 2);
			ctx.fillStyle = 'white'
		}
		
		function drawCircle(x: Number, y: Number, radius: number, color: string) {
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI*2);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.closePath();
		}
		
	},
	beforeUnmount(){
		this.socket.disconnect();
		this.dataLoaded = false;
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
	justify-content: center;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 20px;
}

.left_column, .right_column {
	height: 100%;
	width: 15%;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 40px;
	justify-content: center;
}

.middle_column {
	height: 100%;
	width: 70%;
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

.reaction_panel {
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 20px;
	align-items: center;
}

</style>