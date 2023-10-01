<template>
	<div class="history_container">
		<div class="history" v-if="matches.length">
			<div class="history-title">Historique de Match</div>
			<div class="matches">
				<Match v-for="match in matches" class="match" :match-object="match" :update-timestamp="updateTimestamp"></Match >
			</div>
		</div>
		<div v-else class="no-match">
			Pas de matchs joues ! 
		</div>
	</div>
</template>

<script lang="ts">
	import Match from '@/components/Match.vue'
	export default{
		components:{
			Match
		},

		props: ["user", "updateTimestamp"],

		data() {
			return {matches: ""}
		},

		methods:{
			async getMatches(){
				this.matches = await (await fetch("http://" + import.meta.env.VITE_HOST + ":3000/match/" + this.user.name, {credentials: "include"})).json()
			}
		},
		async created() {
			await this.getMatches();
		},

		watch: {
			async updateTimestamp() {
				await this.getMatches();
			}
		},
	}
</script>

<style>

.history-title{

}

.history_container{
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	width: 100%;
}

.no-match{
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: rgba(34, 158, 230, 0.103);
	border-radius: 50px;
	/* flex: 1; */
	width: 96%;
	height: 96%;
}

.matches{
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow-y: auto;
	height: 92%;
}

.history{
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
}

.match{
	margin-top: 2%;
	margin-bottom: 2%;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.matches::-webkit-scrollbar {
  display: none;
}

@media screen and (max-width: 950px) {
	.matches{
		width: 100%;
	}
	.history-title{
		font-size: 2vw;
	}
}

/* Hide scrollbar for IE, Edge and Firefox */
.matches {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

</style>
