<script lang="ts">

import ProfileCard from '@/components/profilCard.vue';
import StatsPanel from '@/components/StatsPanel.vue'
import MatchHistory from '@/components/MatchHistory.vue'
import { useRoute } from 'vue-router';
import router from '../router';


export default{
	components: {
		ProfileCard,
		StatsPanel,
		MatchHistory
	},
	data(){
		return {username: "", dataLoaded: false};
	},
	methods:{
		getEditableStatus(){
			return (this.username === "me");
		},
		getUser(){
			let names: String[];
			let exist: boolean;
			let username: string;
			const route = useRoute();
			if (!route.query["user"]){
				this.username = "me";
				this.dataLoaded = true;
				return;
			}
			fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/")
			.then(res => res.json())
			.then(data => {names = data})
			.then(() => {username = route.query["user"]})
			.then(() => {exist = names.includes(username) || username === "me"})
			.then(() => {
				if (!exist)
					router.push('/invalidParams');
				else
					this.username = username;
				this.dataLoaded = true;
			})
		},
	},
	beforeMount() {
		this.getUser();
	},
}

</script>

<template>
	<div class="container">
		<div class="profileCard" v-if="dataLoaded">
			<ProfileCard :editable="getEditableStatus()" :username="username"/>
		</div>
		<div class="subCard">
			<div class="matchHistory" v-if="dataLoaded">
				<MatchHistory :username="username"/>
			</div>
			<div class="statsPanel" v-if="dataLoaded">
				<StatsPanel :username="username"></StatsPanel>
			</div>
		</div>
	</div>

</template>

<style>
	.container{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.profileCard{
		height: 15%;
		width: 80%;
	}
	
	.subCard{
		display: flex;
		flex-direction: row;
		margin-top: 3%;
		width: 80%;
		height: 75%;
		height: 60vh;
		justify-content: space-between;
	}

	.matchHistory{
		width: 40%;
		border-radius: 50px;
		background-color: aliceblue;
	}
	
	.statsPanel{
		width: 55%;
		background-color: aliceblue;
		border-radius: 50px;
	}
</style>