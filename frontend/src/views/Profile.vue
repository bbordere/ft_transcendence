<script lang="ts">

import ProfileCard from '@/components/profilCard.vue';
import StatsPanel from '@/components/StatsPanel.vue'

export default{
	components: {
		ProfileCard,
		StatsPanel
  },
	data: function(){
		return {user: Object};
	},

	methods:{
		getUser: async(vm: any) => {
			const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/me", {credentials: 'include'});
			const user = await res.json();
			vm.user = user;
		}
	},

	beforeMount(){
        this.getUser(this);
      },
}

</script>

<template>
	<div class="container">
		<div class="profileCard">
			<ProfileCard :user="this.user"/>
		</div>
		<div class="subCard">
			<div class="matchHistory">
				MATCH
			</div>
			<div class="statsPanel">
				<StatsPanel></StatsPanel>
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
		/* margin: auto; */
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