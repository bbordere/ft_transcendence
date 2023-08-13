<template>
	<div class="match-card">
		<div class="player-card">		
			<img class="avatar-match" :src="getAvatarUrl(matchObject.player1.id)" @click="redirecToProfil(matchObject.player1.name)"/>
			{{ matchObject.player1.name }}
		</div>
		<div class="score-card">
			<div class="score-text">
				<div :class="getColorClass(1)">
					{{ matchObject.scorePlayer1 }}
				</div>
				-
				<div :class="getColorClass(2)">
					{{ matchObject.scorePlayer2 }}
				</div>
			</div>
			<div class="mode">
				{{ matchObject.mode }}
			</div>
		</div>
		<div class="player-card">
			<img class="avatar-match" :src="getAvatarUrl(matchObject.player2.id)" @click="redirecToProfil(matchObject.player2.name)"/>
			{{ matchObject.player2.name }}
		</div>
	</div>
</template>
	
<script lang="ts">
	import router from '@/router';
	export default{
		props: ["matchObject", "updateTimestamp"],
		methods:{
			redirecToProfil(name: string){
				router.push({path:'/profile', query: { user: name }});
			},
			getAvatarUrl(id: number){
				return ("http://" + import.meta.env.VITE_HOST + ":3000/avatar/user/id/" + id.toString() + "?" + this.updateTimestamp);
			},
			getColorClass(playerId: number){
				if (this.matchObject["scorePlayer" + playerId] === "ABD" || this.matchObject["leaverId"] === this.matchObject["player" + playerId]["id"]){
					this.matchObject["scorePlayer" + playerId] = "ABD";
					return ("text-red");
				}
				else if (this.matchObject["scorePlayer" + playerId] === this.matchObject["scorePlayer" + (playerId ^ 3)])
					return ("text-blue");
				else if (this.matchObject["scorePlayer" + playerId] < this.matchObject["scorePlayer" + (playerId ^ 3)])
					return ("text-red");
				else
					return ("text-green");
			}
		},
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
	font-size: 1em;
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
	transition: background-color 0.5s ease;
}

.avatar-match:hover{
	opacity: 0.5;
}

@media screen and (max-width: 950px) {
	.match-card{
		height: 25%;
		font-size: 2.5vw;
	}
	.player-card{
		justify-content: center;
		font-size: 70%;
		font-weight: bold;
	}
	.mode{
		margin-top: 1px;
		font-size: 1.7vw;
	}
	.avatar-match {
		display: none;
	}
	.score-text{
		font-size: 1.9vw;
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

.text-blue{
	color: blue;
}

</style>