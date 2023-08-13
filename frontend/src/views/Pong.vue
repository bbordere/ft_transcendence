<template>
	<div class="pong_body">
		<div class="pong_content">
			<div class="left_column">
				<PongPlayerCard v-if="dataLoaded" :id="player1Id" side="0" :emote="emote1.emoji"></PongPlayerCard>
			</div>
			<div class="middle_column">
				<div class="timer">
					<label>{{timer}}</label>
				</div>
				<div class="scores">
					<span id="score1">{{score1}}</span>
					-
					<span id="score1">{{score2}}</span>
				</div>
				<div class="pong_screen">
					<canvas id="pongCanvas" width="2000" height="1200"></canvas>
				</div>
				<div class="button_panel">
					<div class="reaction_panel">
						<EmoteButton emoji="🤣" :socket="socket"></EmoteButton>
						<EmoteButton emoji="😬" :socket="socket"></EmoteButton>
						<EmoteButton emoji="😭" :socket="socket"></EmoteButton>
						<EmoteButton emoji="🤝" :socket="socket"></EmoteButton>
					</div>

					<div class="forgive_button">
						<router-link to="/">Quitter la partie</router-link>
					</div>
				</div>
			</div>
			<div class="right_column">
				<PongPlayerCard v-if="dataLoaded && player2Id.length !== 0" :id="player2Id" side="1" :emote="emote2.emoji"></PongPlayerCard>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

import io from 'socket.io-client';
import { useRoute } from 'vue-router';
import PongPlayerCard from '@/components/PongPlayerCard.vue';
import EmoteButton from '@/components/EmoteButton.vue'

interface emote{
	emoji: string,
	changed: Boolean,
	timeout: ReturnType<typeof setTimeout>,
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
				emote1: {emoji: ''} as emote,
				emote2: {emoji: ''} as emote,
				sprites: [new Image(), new Image(), new Image()] as Array<HTMLImageElement>,
			};
	},
	components: {
		PongPlayerCard,
		EmoteButton,
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
			if (emote.emoji !== ''){
				if (!emote.changed){
					emote.emoji = '';
					emote.changed = true;
					setTimeout(() => {
						emote.emoji = emoji;
						emote.changed = false;
					}, 500)
				}
			}
			else
				emote.emoji = emoji;
			if (emote.timeout)
				clearTimeout(emote.timeout);			
			emote.timeout = setTimeout(() => {
				emote.emoji = "";
			}, 2000);
		},

		async loadImage(path: string): Promise<HTMLImageElement> {
  			return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = path; });
		},

		async spritesInit(){
			this.sprites[0] = await this.loadImage("/powerups/big_pad.png");
			this.sprites[1] = await this.loadImage("/powerups/lil_pad.png");
			this.sprites[2] = await this.loadImage("/powerups/speed.png");
		},

		initKeyHandler(){
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
		},

		drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, size: number, color: string) {
			ctx.beginPath();
			ctx.rect(x, y, width, size);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.closePath();
		},

		drawText(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, text: string){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.font = "200px serif";
			ctx.fillText(text, 50, canvas.height / 2);
			ctx.fillStyle = 'white'
		},

		drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, Math.PI*2);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.closePath();
		},

		drawPowerups(ctx: CanvasRenderingContext2D, powerups: any){
			if (!powerups)
				return;
			for (var item of powerups){
				ctx.drawImage(this.sprites[item.effect], item.pos.x, item.pos.y, item.radius, item.radius);
			}
		},
	},
	mounted() {

		const ballRadius = 20;
		const route = useRoute();
		const mode: string | undefined = route.query["mode"]?.toString();
		if (!mode){
			this.$router.push('notfound');
			return;
		}

		this.socket = io("http://" + import.meta.env.VITE_HOST + ":3000/pong");	
		this.socket.emit('onJoinGame', sessionStorage.getItem('token'), this.getIdMode(mode));
	
		this.spritesInit();
		this.initKeyHandler();

		const canvas = <HTMLCanvasElement> document.getElementById('pongCanvas');
		if (!canvas)
			return; // ERROR HANDLING
		const ctx = canvas.getContext('2d');
		if (!ctx)
			return; // ERROR HANDLING

		this.socket.on('disconnect', () => {
			this.socket.disconnect();
			console.log('Vous avez été déconnecté du jeu.');
		});
		
		this.socket.on('ids', (player1: string, player2: string) => {
			this.player1Id = player1;
			this.player2Id = player2;
			this.dataLoaded = true;
		});

		this.socket.on('updateScore', (score1, score2) => {
			this.score1 = score1;
			this.score2 = score2;
		});

		this.socket.on('updateGame', (ball, racket1, racket2, powerups) => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.drawRect(ctx, racket1.pos.x, racket1.pos.y, racket1.width, racket1.size, "#FFFFFF");
			this.drawRect(ctx, racket2.pos.x, racket2.pos.y, racket2.width, racket2.size, "#FFFFFF");
			this.drawPowerups(ctx, powerups);
			this.drawCircle(ctx, ball.position.x, ball.position.y, ballRadius, ball.speed === 30 ? "#F44E1A" : "#2A52EB");
		});

		this.socket.on('text', (data) => {
			this.drawText(ctx, canvas, data);
		});

		this.socket.on('time', (time) => {
			this.timer = time;
		});

		this.socket.on('emote', (player, emoji) => {
			if (player == 0)
				this.emoteHandling(1, emoji);
			else
				this.emoteHandling(2, emoji);
		});		
	},
	beforeUnmount(){
		this.socket.disconnect();
		this.dataLoaded = false;
	}
}
</script>

<style>

.image{
		filter: drop-shadow(0 0 8px #1f81dd);
		aspect-ratio: 1;
		width: 100%;
		border-radius: 50%;
		border: 2px solid #b5dbdb;
}

.pong_body {
	width: 100vw;
	height: 88vh;
	display: flex;
	align-items: center;
	justify-content: center;
}

.pong_content {
	height: 90%;
	width: 90%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
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
	justify-content: center;
}

.timer {
	display: flex;
	height: 10%;
	width: 100%;
	align-items: center;
	justify-content: center;
	font-size: 2em;
	font-family: 'digital-clock-font', regular;
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

@font-face{
 font-family:'digital-clock-font';
 src: url('./fonts/digital-7.regular.ttf');
}

.scores{
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: center;
	gap: 20%;
	font-size: 3em;
	margin-top: -35px;
	margin-bottom: 5px;
	font-family: 'digital-clock-font', regular;
}

</style>