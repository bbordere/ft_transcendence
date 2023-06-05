<template>
	<div class="panel">
		<div class="left-panel">
			<div class="centered-panel-item">
				<div v-if="dataLoaded && (stats.wins + stats.looses)">
					<WinCharts :wins="stats.wins" :looses="stats.looses" :show="dataLoaded"></WinCharts>
				</div>
				<div v-else>
					PAS DE STATS
				</div>
			</div>
			<div class="centered-panel-item">
				<div class="titleRank">Ranking Stats</div>
				<div class="split-stats">
					<div class="rank-stat">
						<h5>Classement</h5>
						{{ stats.mmr }} mmr					
					</div>
					<div class="rank-stat">
						<h5>Score Moyen</h5>
						{{ stats.meanScore }} pts
					</div>
				</div>
			</div>
		</div>
		<div class="right-panel">
			<div class="centered-panel-item">
				<h3>General Stats</h3>
				<div class="list-stats">
					<hr/>
					<h5>Nb Points Gagnes</h5>
					{{ this.stats["winPoints"] }}
					<h5>Nb Points Perdus</h5>
					{{ this.stats["loosePoints"] }}
					<h5>Score Max</h5>
					{{ this.stats["highScore"] }}
					<h5>Nb Parties Total</h5>
					{{ this.stats["totalGames"] }}
					<h5>Nb Parties Classic</h5>
					{{ this.stats["totalClassicGames"] }}
					<h5>Nb Duel Amis</h5>
					{{ this.stats["friendDuel"] }}
					<h5>Nb Powerups Actives</h5>
					{{ this.stats["totalPowerups"] }}
					<hr/>
					<h5>Nb Messages Envoyes</h5>
					{{ this.stats["totalMessages"] }}
					<h5>Nb Emotes Envoyes</h5>
					{{ this.stats["totalEmotes"] }}
					<h5>Nb Channel Joined</h5>
					<!-- {{ this.stats["loosePoints"] }}  NOT IMPLEMENTED YET-->
				</div>
			</div>

		</div>
	</div>
</template>

<script lang="ts">

import WinCharts from './WinCharts.vue';

export default{
	components:{
		WinCharts
	},
	props: ["username"],
	data(){
		return {stats: "", dataLoaded: false};
	},

	methods:{
		async getStats(){
			const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/stats/" + this.username, {credentials: 'include'})
			const text = await res.text();
			const data = await JSON.parse(text);
			this.stats = data;
			this.dataLoaded = true;
		},
	},
	mounted(){
		this.getStats();
		console.log(this.username);
	},
}

</script>



<style>

.panel{
	display: flex;
	flex-direction: row;
	width: 100%;
	height: 100%;
}

.left-panel, .right-panel{
	height: 100%;
	width: 50%;
 	display: flex;
	flex-direction: column;
	/* border: 1px solid black; */
}

.centered-panel-item {
	margin: 10px;
	background-color: rgba(34, 158, 230, 0.103);;
	border-radius: 50px;
	display: flex;
	flex-basis: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex-flow: column wrap;
}

.titleRank{
    display: block;
    font-size: 1.17em;
    margin-top: 1em;
    margin-bottom: 1em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
	padding-top: 0%;
	margin-top: 0;
}

.split-stats{
	margin-top: -10px;
	display: flex;
	width: 80%;
	flex-basis: 50%;
	border-radius: 20px;
	/* background-color: rgb(160, 160, 160); */
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
}

h5{
	margin: 0;
}

.rank-stat{
	text-align: center;
}

.list-stats {
	text-align: center;
}


</style>