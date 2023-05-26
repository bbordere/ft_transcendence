<script setup lang="ts">
</script>

<template>
	<div class="home_body">
		<div class="left_column">
			<div class="play_button">
				<router-link to="/pong">jouer</router-link>			</div>
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
</template>

<style>

.home_body {
	display: flex;
	height:100vh;
	width: 100vw;
	flex-direction: row;
	align-items: baseline;
	justify-content: space-around;
}

.left_column {
	display: flex;
	flex-direction: column;
	justify-content: space-between;

	width: 20%;
	height: 70%;
}

.play_button {
	width: 100%;
	height: 10%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 20px;
}

.match_historic {
	width: 100%;
	height: 70%;

	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.chat {
	width: 50%;
	height: 70%;

	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.right_column {
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 20%;
	height: 70%;
}

.friend_list {
	width: 100%;
	height: 70%;

	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.join_panel {
	width: 100%;
	height: 25%;

	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

</style>