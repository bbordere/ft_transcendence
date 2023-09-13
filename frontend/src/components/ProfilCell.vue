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

		async userInfo(userid: number) {
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
			await this.userInfo(this.profilObject.FriendId);
		else
			await this.userInfo(this.profilObject.UserId);
	}
});

</script>

<template>
	<div class="box" v-if="profilObject.Status === 1">
		<router-link class="img_user" to="/profile">
			<img class="img_user_profil" v-bind:src=avatar alt="default profile img">
		</router-link>
		<div class="name">
			{{ username }}
		</div>
			<font-awesome-icon icon="fa-solid fa-gamepad"/>
		<div @click="ModalHamburger = true" class="menu-button">
			<font-awesome-icon icon="fa-solid fa-xmark"/>
		</div>
		<hamburger :show="ModalHamburger" @close="ModalHamburger = false" :id1="profilObject.UserId" :id2="profilObject.FriendId" :username="username"></hamburger>
	</div>
	<div class="box" v-else-if="profilObject.FriendId === myid && profilObject.Status === -1">
		<router-link class="img_user" to="/profile">
			<img class="img_user_profil" v-bind:src=avatar alt="default profile img">
		</router-link>
		<div class="name">
			{{ username }}
		</div>
		<button v-on:click="acceptFriend">V</button>
		<button v-on:click="deleteUser">D</button>
	</div>

</template>
<style>

.box {
	margin-top: 10px;
	width: 90%;
	height: 10%;
	display: flex;
	border-radius: 20px;
	justify-content: space-between;
	align-items: center;
}

.box:hover {
	background-color: #F0F8FF;
}

.name {
	font-family: 'Poppins', sans-serif;
	font-weight: bold;
	font-size: 1em;
}

.img_user {
	display: flex;
	width: 10%;
	margin-left: 7%;
}

.img_user_profil {
	border-radius: 25px;
	width: 100%;
	aspect-ratio: 1;
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
	margin: 3px;
	transition: 0.4s;
}

</style>