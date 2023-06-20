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
					<label>right_point</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import io from 'socket.io-client';
import Head from '../components/head.vue'

export default {
	data() {
		return {playerName: "", socket: io()};
	},
	methods: {

	},
	mounted() {
		this.socket = io('http://localhost:3000/pong')

		this.socket.emit('onJoinGame', sessionStorage.getItem('token'));

		this.socket.on('disconnect', () => {
			this.socket.disconnect();
			console.log('Vous avez été déconnecté du jeu.');
		});

		
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