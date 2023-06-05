<script lang="ts">

import ProfileCard from '@/components/profilCard.vue';
import StatsPanel from '@/components/StatsPanel.vue'
import { useRoute } from 'vue-router';
import router from '../router';


export default{
	components: {
		ProfileCard,
		StatsPanel
	},
	data(){
		return {username: "", dataLoaded: false};
	},
	beforeMount() {
		let names: String[];
		let exist: boolean;
		let user: string;
		const route = useRoute();
		if (!route.query["user"]){
			router.push('/profile/me');
			this.username = "me";
			this.dataLoaded = true;
			return;
		}
		fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/")
			.then(res => res.json())
			.then(data => {names = data})
			.then(getUser => {user = route.query["user"]})
			.then(verif => {exist = names.includes(user) || user === "me"})
			.then(redirect => {
				if (!exist)
				router.push('/invalidParams');
				else
				this.username = user;
				this.dataLoaded = true;
			})

		// console.log(useRoute().query);
		// console.log(names);
	},
	methods:{
		getEditableStatus(){
			return (this.username === "me");
		}
	}
}

</script>

<template>
	<div class="container">
		<div class="profileCard" v-if="dataLoaded">
			<ProfileCard :editable="getEditableStatus()" :username="username"/>
		</div>
		<div class="subCard">
			<div class="matchHistory" v-if="dataLoaded">
				MATCH
			</div>
			<div class="statsPanel" v-if="dataLoaded">
				<StatsPanel :username="username"></StatsPanel>
			</div>
		</div>
	</div>

</template>

<style>
	.container{
		height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 8%;
		align-items: center;
	}

	.profileCard{
		width: 80%;
	}
	
	.subCard{
		display: flex;
		flex-direction: row;
		flex-basis: 80%;
		width: 80%;
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