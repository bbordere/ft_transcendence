<script lang="ts">

import ProfileCard from '@/components/ProfilCard.vue';
import StatsPanel from '@/components/StatsPanel.vue'
import MatchHistory from '@/components/MatchHistory.vue'
import { useRoute } from 'vue-router';
import router from '../router';
import { SocketService } from '@/services/SocketService';
import { State } from './Home.vue';


export default{
	components: {
		ProfileCard,
		StatsPanel,
		MatchHistory,
	},
	data(){
		return {username: "", dataLoaded: false, updateTimestamp: 0 as number};
	},
	methods:{

		getEditableStatus(){
			return (this.username === "me");
		},

		async getUser(){
			const route = useRoute();
			this.updateTimestamp = Date.now();
			if (!route.query["user"]){
				this.username = "me";
				this.dataLoaded = true;
				return;
			}

			const data = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/" + route.query["user"]);
			try {
				const json = await data.json()
				this.username = json["name"];
				this.dataLoaded = true;
			} catch (error) {
				router.push('/invalidParams');
			}
		},

		updateUsername(newUsername: string){
			this.updateTimestamp = Date.now();
			this.$emit('update', newUsername);
		}
	},
	async mounted() {
		await this.getUser();
		SocketService.getInstance.emit('setStatus', SocketService.getUser.id, State.ONLINE);
	},

}

</script>

<template>
	<div class="container">
		<div class="profileCard" v-if="dataLoaded">
			<ProfileCard :editable="getEditableStatus()" :username="username" @update="updateUsername"/>
		</div>
		<div class="subCard">
			<div class="matchHistory" v-if="dataLoaded">
				<MatchHistory :username="username" :updateTimestamp="updateTimestamp"/>
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
		padding-top: 2.5%;
		width: 80%;
	}
	
	.subCard{
		display: flex;
		flex-direction: row;
		margin-top: 1%;
		width: 80%;
		justify-content: space-between;
		height: 45vh;
	}

	.matchHistory{
		width: 40%;
		border-radius: 50px;
		background-color: white;
		border: 2px solid #515151;
	}
	
	.statsPanel{
		flex-grow: 1;
		margin-left: 2%;
		background-color: white;
		border-radius: 50px;
		border: 2px solid #515151;
	}
</style>