<template>
	<div class="panel">
		<div class="left-panel">
			<div class="centered-panel-item">
				<div v-if="dataLoaded && (stats.wins + stats.looses)">
					<div v-if="windowWidth >= 700" class="chart">
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
				<div class="titleRank">Classement</div>
				<div class="split-stats">
					<div class="rank-stat">
						<h5>Côte</h5>
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
				<h3>Statistiques</h3>
				<div class="list-stats">
					<h5>Nombre de Points Gagnés</h5>
					{{ this.stats["winPoints"] }}
					<h5>Nombre de Points Perdus</h5>
					{{ this.stats["loosePoints"] }}
					<h5>Score Maximal</h5>
					{{ this.stats["highScore"] }}
					<h5>Nombre de Parties Total</h5>
					{{ this.stats["totalGames"] }}
					<h5>Nombre de Parties Classiques</h5>
					{{ this.stats["totalClassicGames"] }}
					<h5>Nombre de Parties Arcades</h5>
					{{ this.stats["totalArcadeGames"] }}
					<h5>Nombre de Parties Classées</h5>
					{{ this.stats["totalRankedGames"] }}
					<h5>Nombre de Duels Amis</h5>
					{{ this.stats["totalFriendsDuel"] }}
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
	font-size: clamp(0.5rem, -0.1944rem + 2.2222vw, 1.125rem);

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
    margin-top: 1em;
    margin-bottom: 1em;
    margin-left: 0;
    margin-right: 0;
    font-weight: bold;
	padding-top: 0%;
	margin-top: 0;
	font-size: clamp(0.6875rem, 0.1319rem + 1.7778vw, 1.1875rem);
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

h5{
	font-size: clamp(0.4375rem, -0.1875rem + 2vw, 1rem);
}

h3{
	font-size: clamp(0.6875rem, -0.0764rem + 2.4444vw, 1.375rem);
}

.chart{
	/* background: pink; */
	/* height: 200%; */
}


/* @media screen and (max-width: 950px) {
	h5{
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
} */

</style>