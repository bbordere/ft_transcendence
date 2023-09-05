<script lang="ts">
import { defineComponent } from 'vue';
import Hamburger from '../components/Hamburger.vue'
export default defineComponent({
		props: ["profilObject", "myid"],
	components: {
		Hamburger
	},

	data() {
		return {
			avatar: "" as string,
			username: "" as string,
			ModalHamburger: false,
		}
	},
	methods: {
		async acceptFriend() {
			const response = await fetch(`http://${import.meta.env.VITE_HOST}:3000/friend/accept?id1=${this.profilObject.UserId}&id2=${this.profilObject.FriendId}`,{
				credentials: 'include',
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
			});
		},

		async deleteUser() {
			const response = await fetch(`http://${import.meta.env.VITE_HOST}:3000/friend/delete?id1=${this.profilObject.UserId}&id2=${this.profilObject.FriendId}`,{
				credentials: 'include',
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
			});
		},

		async User_Info(userid: number) {
			const response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/id/' + userid,{ 
				credentials: 'include'
			});
			const userData = await response.json();
			this.username = userData.name;
			this.avatar = userData.avatarLink;
		},
	},

	async mounted() {
		if (this.profilObject.UserId === this.myid)
			this.User_Info(this.profilObject.FriendId);
		else
			this.User_Info(this.profilObject.UserId);
	}
});
</script>
<!-- 
	profilObject.UserId
	profilObject.FriendId
	profilObject.Status
	myid
-->
<template>
	<div class="box" v-if="(profilObject.UserId === myid && profilObject.Status === 1) || (profilObject.FriendId === myid && profilObject.Status === 1)">
		<router-link class="img_user" to="/profile"><img class="img_user_profil" v-bind:src=avatar alt="default profile img"></router-link>
		<div class="name">
			{{ username }}
		</div>
		<div @click="ModalHamburger = true" class="menu-button">
			<div class="bar"></div>
			<div class="bar"></div>
			<div class="bar"></div>
		</div>
		<hamburger :show="ModalHamburger" @close="ModalHamburger = false"></hamburger>
	</div>
	<div class="box" v-else-if="profilObject.FriendId === myid && profilObject.Status === -1">
		<router-link class="img_user" to="/profile"><img class="img_user_profil" v-bind:src=avatar alt="default profile img"></router-link>
		<div class="name">
			{{ username }}
		</div>
		<button v-on:click="acceptFriend">V</button>
		<button v-on:click="deleteUser">D</button>
	</div>

</template>
<style>

.box {
	display: flex;
	justify-content: space-between;
}

.name {
	display: flex;
	align-items: center;
	justify-content: center;
}

.img_user {
	display: flex;
	width: 10%;
}

.img_user_profil {
	border-radius: 360px;
}

.menu-button {
	display: flex;
	flex-direction: column;
	cursor: pointer;
	justify-content: center;
	margin-right: 7%;
}

.bar {
	width: 22px;
	height: 2px;
	background-color: #000000;
	margin: 3px;
	transition: 0.4s;
}

</style>