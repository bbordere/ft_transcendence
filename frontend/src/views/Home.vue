<script setup lang="ts">
	import { ref } from 'vue'
	import Head from '../components/head.vue'
	import ModalAdd from '../components/ModalAdd.vue'

	const showModal = ref(false)
</script>

<template>

	<Head />
	<div class="home_body">
		<div class="home_content">
			<div class="left_column">
				<router-link class="play_button" to="/pong">Jouer</router-link>	
				<div class="match_historic">
					<label>macht_historic</label>
				</div>
			</div>
			<div class="chat">
				<label>chat</label>
			</div>

			<div class="right_column">

				<div class="friend_list">
					<label>friend_list</label>
				</div>

				<div class="join_panel">
					<button id="show-modal" @click="showModal = true">Rejoindre</button>
					<Teleport to="body">
						<ModalAdd :show="showModal" @close="showModal = false"></ModalAdd>
					</Teleport>
					<button id="show-modal" @click="showModal = true">Channel+</button>
					<Teleport to="body">
						<ModalAdd :show="showModal" @close="showModal = false"></ModalAdd>
					</Teleport>
					<button id="show-modal" @click="showModal = true">Ami+</button>
					<Teleport to="body">
						<ModalAdd :show="showModal" @close="showModal = false"></ModalAdd>
					</Teleport>
				</div>
			</div>
		</div>
	</div>
</template>

<style>

.home_body {
	display: flex;
	width: 100vw;
	height: 80vh;
	align-items: center;
	justify-content: center;
	padding-top: 2%;
	min-height: 350px;
}

.home_content {
	display: flex;
	height: 100%;
	align-items: center;
	justify-content: center;
	flex-basis: 100%;
	gap: 6%;
}

.left_column {
	display: flex;
	flex-direction: column;
	gap: 4%;
	flex-grow: 0.2;
}

.play_button {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 25%;
	width: 100%;
	background: #036280;
	border: 3px solid #BC0002;
	border-radius: 25px;
	text-decoration: none;
	color: black;
	font-size: 100%;
}

.play_button:hover {
	background-color: #42badf;
}

.match_historic {
	display: flex;
	height: 75%;
	width: 100%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.chat {
	display: flex;
	height: 100%;
	width: 45%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.right_column {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4%;
	flex-grow: 0.2;
}

.friend_list {
	display: flex;
	height: 65%;
	width: 100%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.join_panel button {
	display: flex;
	flex-direction: row;
	height: 100%;
	width: 95%;
	align-items: center;
	justify-content: center;
	font-size: 100%;
	margin: 2%;
	background-color: #036280;
	border-radius: 10px;
	border: none;
	cursor: pointer;
}

.join_panel {
	display: flex;
	flex-direction: column;
	height: 35%;
	width: 100%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
}

.join_panel button:hover {
	background-color: #42badf;
}

@media screen and (max-width: 700px) {
	.join_panel button {
		font-size: 65%;
	}

	.right_column {
		flex-grow: 0.6;
		margin-right: 2%;
	}

	.left_column {
		flex-grow: 0.6;
		margin-left: 2%;
	}
}

</style>