<script lang="ts">

import ProfileCard from '@/components/profilCard.vue';

export default{
	components: {
		ProfileCard
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
			<div class="buttonBox">
				STATS
			</div>
		</div>
	</div>

</template>

<style>
	.container{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	.profileCard{
		width: 80%;
		margin: auto;
	}
	
	.subCard{
		display: flex;
		flex-direction: row;
		height: 500px;
		width: 80%;
		margin-top: 45px;
		justify-content: space-between;
	}

	.matchHistory{
		width: 40%;
		background-color: aliceblue;
	}

	.buttonBox{
		width: 55%;
		background-color: aliceblue;
	}
</style>