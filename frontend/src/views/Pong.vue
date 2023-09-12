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
				<PongCanvas v-if="dataLoaded" :socket="this.socket"/>
				<div class="button_panel">
					<div class="reaction_panel">
						<EmoteButton emoji="🤣" :socket="socket"></EmoteButton>
						<EmoteButton emoji="😬" :socket="socket"></EmoteButton>
						<EmoteButton emoji="😭" :socket="socket"></EmoteButton>
						<EmoteButton emoji="🤝" :socket="socket"></EmoteButton>
					</div>

					<div class="forgive_button">
						<router-link to="/">
							<button id="exit_button" role="link">Quitter la partie</button>
						</router-link>
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
import PongCanvas from '@/components/PongCanvas.vue'

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
		};
	},
	components: {
		PongPlayerCard,
		EmoteButton,
		PongCanvas,
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
	},
	mounted() {

		this.timer = "00:00";
		const route = useRoute();
		const mode: string | undefined = route.query["mode"]?.toString();
		if (!mode){
			this.$router.push('notfound');
			return;
		}

		this.socket = io("http://" + import.meta.env.VITE_HOST + ":3000/pong");	
		this.socket.emit('onJoinGame', sessionStorage.getItem('token'), this.getIdMode(mode));
	
		this.initKeyHandler();

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
	font-family: 'digital-clock-font', monospace;
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
	justify-content: space-between;
	width: 35%;
}

#exit_button {
	position: relative;
	background-color: gray;
	font-size: 2vh;
	padding: 0.7vw;
	margin-right: 1vw;
	border-radius: 40px;
	border-color: gray;
}

@font-face{
 font-family:'digital-clock-font';
 src: url('./fonts/digital-7.mono.ttf');
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