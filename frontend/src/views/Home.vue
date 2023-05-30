<script setup lang="ts">
</script>

<template>
	<div class="home_body">
		<div class="home_content">
			<div class="left_column">
				<div class="play_button">
					<router-link to="/pong">jouer</router-link>	
				</div>
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
	width: 100vw;
	height: 100vh;
	display: flex;
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
}

.left_column {
	height: 100%;
	width: 20%;
	display: flex;
	flex-direction: column;
	gap: 20%;
}

.play_button {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 20%;
	height: 10%;
	width: 150%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 20px;
}

.match_historic {
	height: 70%;
	width: 200%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.chat {
	height: 100%;
	width: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.right_column {
	height: 100%;
	width: 10%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.friend_list {
	height: 70%;
	width: 200%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.join_panel {
	height: 30%;
	width: 200%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

</style>