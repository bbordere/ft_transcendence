<script lang="ts">
import { defineComponent, resolveDirective } from 'vue';
import Hamburger from '../components/Hamburger.vue'
import Invite from '../components/Invite.vue'
import router from '@/router';


export default defineComponent({
		props: ["profilObject", "myid", "blockList", "print"],
	components: {
		Hamburger,
		Invite,
	},

	data() {
		return {
			avatar: "" as string,
			username: "" as string,
			friendUsername: "" as string,
			userId: this.profilObject.UserId as number,
			friendId: this.profilObject.FriendId as number,
			modalHamburger: false,
			modalInvite: false,
			borderColor: "green" as string,
			dataLoaded: false,
		}
	},
	methods: {

		handleClick() {
			if (this.borderColor === 'green') {
				this.modalInvite = true;
			}
		},

		redirecToProfil(name: string) {
			router.push({path:'/profile', query: { user: name }});
		},

		getAvatarUrl(id: number) {
			return ("http://" + import.meta.env.VITE_HOST + ":3000/avatar/user/id/" + id.toString());
		},

		async unblockUser() {
			const response = await fetch(`http://${import.meta.env.VITE_HOST}:3000/user/block/unblock`,{
				credentials: 'include',
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: this.userId,
					unblockId: this.friendId,
				}),
			});
			this.modalHamburger = false;
		},

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

		async friendInfo() {
			const response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/id/' + this.friendId,{ 
				credentials: 'include'
			});
			const userData = await response.json();
			this.friendUsername = userData.name;
		},
	},

	async mounted() {
		if (this.profilObject.UserId === this.myid) {
			await this.userInfo(this.profilObject.FriendId);
		}
		else {
			await this.userInfo(this.profilObject.UserId);
			this.userId = this.profilObject.FriendId;
			this.friendId = this.profilObject.UserId;
		}
		await this.friendInfo();
		this.dataLoaded = true;
	}
});

</script>

<template>
	<div class="box" v-if="dataLoaded && print === 0 && profilObject.Status === 'accepted' && !blockList.includes(friendId)">
		<div class="img_user">
			<img class="img_user_profil" :style="{'border-color': borderColor}" :src="getAvatarUrl(friendId)" @click="redirecToProfil(friendUsername)">
		</div>
		<div class="name">
			{{ username }}
		</div>
		<div :style="{'color': borderColor}" v-on:click=handleClick>
			<font-awesome-icon icon="fa-solid fa-gamepad"/>
		</div>
		<div v-on:click="modalHamburger = true" class="menu-button">
			<font-awesome-icon icon="fa-solid fa-xmark"/>
		</div>
		<hamburger :show="modalHamburger" @close="modalHamburger = false" :id1="userId" :id2="friendId" :username="username"></hamburger>
		<invite :show="modalInvite" @close="modalInvite = false" :myId="myid" :friendId="friendId"></invite>
	</div>
	<div class="box" v-else-if="dataLoaded && print === 1 && profilObject.FriendId === myid && profilObject.Status === 'pending' && !blockList.includes(friendId)">
		<div class="img_user">
			<img class="img_user_profil" :src="getAvatarUrl(friendId)" @click="redirecToProfil(friendUsername)">
		</div>
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
	flex-direction: column;
	width: 10%;
	margin-left: 4%;
}

.img_user_profil {
	border-radius: 25px;
	width: 100%;
	aspect-ratio: 1;
	border: 2px solid;
	border-radius: 50%;
	display: inline-block;
	border-color: rgb(107, 106, 106);
	padding: 2px;
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