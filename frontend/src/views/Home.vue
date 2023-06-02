<script setup lang="ts">
	import image from "@/components/image.vue"
</script>

<template>
	<header class="header">
		<img class="logo" src="../assets/img/logo.png" alt="logo 42">
	</header>
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
	width: 95vw;
	height: 90vh;
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
	padding-left: 5%;
}

.header {
	display: flex;
	width: 100%;
	height: 85px;
	border-bottom: 2px solid #BC0002;
	background: #036280;
}

header .logo{
	display: flex;
	border: 3px solid #BC0002;
	background: #ffffff;
	border-radius: 290px;
	margin-left: 50px;
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
	height: 75%;
	width: 175%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.chat {
	height: 100%;
	width: 45%;
	display: flex;
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
	height: 66%;
	width: 175%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.join_panel {
	height: 33%;
	width: 175%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

</style>