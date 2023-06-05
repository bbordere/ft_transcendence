<script setup lang="ts">
	import Head from '../components/head.vue'
</script>

<template>

	<Head />
	<div class="home_body">
		<div class="home_content">
			<div class="left_column">
				<router-link class="play_button" to="/pong">jouer</router-link>	
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
					<label>join_panel</label>
				</div>
			</div>
		</div>
	</div>
</template>

<style>

.home_body {
	display: flex;
	width: 95vw;
	height: 90vh;
	align-items: center;
	justify-content: center;
}

.home_content {
	display: flex;
	height: 80%;
	width: 100%;
	align-items: center;
	justify-content: center;
	gap: 8%;
	padding-left: 5%;
}

.left_column {
	display: flex;
	flex-direction: column;
	gap: 4%;
}

.play_button {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 25%;
	width: 175%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 25px;
}

.match_historic {
	display: flex;
	height: 75%;
	width: 175%;
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
}

.friend_list {
	display: flex;
	height: 66%;
	width: 175%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.join_panel {
	display: flex;
	height: 33%;
	width: 175%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

</style>