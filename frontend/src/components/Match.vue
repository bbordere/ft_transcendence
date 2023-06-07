<template>
	<div class="match-card">
		<div class="player-card">
			<img class="avatar-match" :src="'http://localhost:3000/avatar/user/' + matchObject.player1.name"/>
			{{ matchObject.player1.name }}
		</div>
		<div class="score-card">
			<div class="score-text">
				<div class="score1" :class="[matchObject.scorePlayer1 > matchObject.scorePlayer2 ? 'text-green' : 'text-red']">
					{{ matchObject.scorePlayer1 }}
				</div>
				-
				<div class="score2" :class="[matchObject.scorePlayer1 < matchObject.scorePlayer2 ? 'text-green' : 'text-red']">
					{{ matchObject.scorePlayer2 }}
				</div>
			</div>
			<div class="mode">
				{{ matchObject.mode }}
			</div>
		</div>
		<div class="player-card">
			<img class="avatar-match" :src="'http://localhost:3000/avatar/user/' + matchObject.player2.name"/>
			{{ matchObject.player2.name }}
		</div>
	</div>
</template>
	
<script lang="ts">
	export default{
		props: ["matchObject"]

	}
</script>
	
<style>

.match-card{
	border-radius: 30px;
	background-color: rgba(34, 158, 230, 0.103);
	width: 90%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	text-align: center;
}

.player-card{
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 2%;
	/* justify-content: space-around; */
	width: 45%;
	border-radius: 30px;
	/* background-color: rgb(79, 79, 187); */
	font-size: 80%;
}

.score-card{
	display: flex;
	justify-content: center;
	flex-direction: column;
}

.avatar-match{
	border-radius: 50%;
	width: 20%;
	aspect-ratio: 1;
	border: 2px solid #b5dbdb;
}

@media (max-width: 950px) {
	.player-card{
		justify-content: center;
	}
  .avatar-match {
	display: none;
  }
}

.score-text{
	display: flex;
	flex-direction: row;
	justify-content: center;
}

.text-red{
	color: red;
}	

.text-green{
	color: green;
}

</style>