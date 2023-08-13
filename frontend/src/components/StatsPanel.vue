<template>
	<div class="panel">
		<div class="left-panel">
			<div class="centered-panel-item">
				<div v-if="dataLoaded && (stats.wins + stats.looses)">
					<div v-if="windowWidth >= 700">
						<WinCharts :wins="stats.wins" :looses="stats.looses" :show="dataLoaded"></WinCharts>
					</div>
					<div v-else class="small-winrate">
						<div class="small-winrate-title">
							Taux de victoires: {{ ((this.stats.wins * 100) /  (this.stats.wins +this.stats.looses)).toFixed(2) }}%
						</div>
						<div class="small-winrate-text">
							Victoires: {{ stats.wins }}
						</div>
						<div class="small-winrate-text">
							Défaites: {{ stats.looses }}
						</div>
					</div>
				</div>
				<div v-else>
					Aucune Statistiques à afficher !
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
			<div class="stat-panel-item">
				<h3>General Stats</h3>
				<div class="list-stats">
					<h5>Nombre de Points Gagnés</h5>
					{{ this.stats["winPoints"] }}
					<h5>Nombre de Points Perdus</h5>
					{{ this.stats["loosePoints"] }}
					<h5>Score Maximal</h5>
					{{ this.stats["highScore"] }}
					<h5>Nombre de Parties Totales</h5>
					{{ this.stats["totalGames"] }}
					<h5>Nombre de Parties Classiques</h5>
					{{ this.stats["totalClassicGames"] }}
					<h5>Nombre de Duels Amis</h5>
					{{ this.stats["friendDuel"] }}
					<h5>Nombre de Powerups Activés</h5>
					{{ this.stats["totalPowerups"] }}
					<hr/>
					<h5>Nombre de Messages Envoyés</h5>
					{{ this.stats["totalMessages"] }}
					<h5>Nombre de Emotes Envoyes</h5>
					{{ this.stats["totalEmotes"] }}
					<h5>Nombre de Channel Rejoints</h5>
					{{  }}  NOT IMPLEMENTED YET
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
		return {stats: Object, dataLoaded: false, windowWidth: window.innerWidth,};
	},

	methods:{
		async getStats(){
			const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/stats/" + this.username, {credentials: 'include'})
			const text = await res.text();
			const data = await JSON.parse(text);
			this.stats = data;
			this.dataLoaded = true;
		},
		handleResize() {
			this.windowWidth = window.innerWidth;
		},
	},
	mounted(){
		window.addEventListener('resize', this.handleResize);
		this.getStats();
	},
}

</script>



<style>

.small-winrate{
	/* background-color: rgb(180, 154, 206); */
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	gap: 20px;
	text-align: center;
}

.small-winrate-title{
	font-size: 2.3vw;
	font-weight: bold;
}

.small-winrate-text{
	font-size: 2vw;
}

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
	background-color: rgba(34, 158, 230, 0.103);
	border-radius: 50px;
	display: flex;
	height: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	flex-flow: column wrap;
}

.stat-panel-item {
	margin: 10px;
	background-color: rgba(34, 158, 230, 0.103);
	border-radius: 50px;
	display: flex;
	height: 97%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
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
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
}

h5{
	margin: 0;
}

h3{
	text-align: center;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.list-stats::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.list-stats {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.rank-stat{
	text-align: center;
}

.list-stats {
	text-align: center;
	overflow-y: auto;
}

@media screen and (max-width: 950px) {
	h5{
		font-size: 1.5vw;
	}
	h3{
		font-size: 2vw;
		margin-top: 0;
	}
	.list-stats{
		font-size: 2vw;
	}
	.titleRank{
		font-size: 2.3vw;
	}
	.rank-stat{
		font-size: 2vw;
	}
}

</style>