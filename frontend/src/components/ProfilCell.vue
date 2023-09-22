<script lang="ts">
import { defineComponent } from 'vue';
import Hamburger from '../components/Hamburger.vue'
import Invite from '../components/Invite.vue'
import router from '@/router';
import { State } from '@/views/Home.vue';
import { SocketService } from '@/services/SocketService';


export default defineComponent({
		props: ["friend", "myId", "blockList", "print", ],
	components: {
		Hamburger,
		Invite,
	},

	data() {
		return {
			borderColor: "grey" as string,
			modalInvite: false,
			modalHamburger: false,
			dataLoaded: false,
			state: -1,
			myUser: {} as any,
			friendUser: {} as any,
		}
	},
	methods: {

		handleClick() {
			if (this.borderColor === 'green') {
				this.modalInvite = true;
			}
		},

		redirecToProfil(name: string) {
			router.push({ path: '/profile', query: { user: name } });
		},

		getAvatarUrl(id: number) {
			return ("http://" + import.meta.env.VITE_HOST + ":3000/avatar/user/id/" + id.toString());
		},

		async unblockUser() {
			const response = await fetch(`http://${import.meta.env.VITE_HOST}:3000/user/block/unblock`, {
				credentials: 'include',
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: this.myId,
					unblockId: this.friend.id,
				}),
			});
			this.modalHamburger = false;
			SocketService.getInstance.emit('refreshFriendListId', this.myId);
			SocketService.getInstance.emit('refreshFriendListId', this.friend.id);
		},

		async acceptFriend() {
			const response = await fetch(`http://${import.meta.env.VITE_HOST}:3000/friend/accept?id1=${this.myId}&id2=${this.friend.id}`,{
				credentials: 'include',
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
			});
			SocketService.getInstance.emit('refreshFriendListId', this.myId);
			SocketService.getInstance.emit('refreshFriendListId', this.friend.id);
		},

		async deleteUser() {
			const response = await fetch(`http://${import.meta.env.VITE_HOST}:3000/friend/delete?id1=${this.myId}&id2=${this.friend.id}`,{
				credentials: 'include',
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
			});
			SocketService.getInstance.emit('refreshFriendListId', this.myId);
			SocketService.getInstance.emit('refreshFriendListId', this.friend.id);
		},
	},

	async mounted() {
		this.dataLoaded = true;
		SocketService.getInstance.emit('getStatus', this.friend.id);
		SocketService.getInstance.on('getStatus', (data: { userId: number, state: State }) => {
			const { userId, state } = data;
			if (userId === this.friend.id) {
				if (state === State.OFFLINE)
					this.borderColor = 'grey';
				else if (state === State.ONLINE)
					this.borderColor = 'green';
				else if (state === State.INGAME)
					this.borderColor = 'cyan';
			}
		});
	}
});

</script>

<template>
	<div class="box" v-if="dataLoaded && print === 0 && friend.status === 'accepted' && !blockList.includes(friend.id)">
		<div class="img_user">
			<img class="img_user_profil" :style="{'border-color': borderColor}" :src="getAvatarUrl(friend.id)" @click="redirecToProfil(friend.username)">
		</div>
		<div class="name">
			{{ friend.username }}
		</div>
		<div :style="{ 'color': borderColor }" v-on:click=handleClick>
			<font-awesome-icon icon="fa-solid fa-gamepad" />
		</div>
		<div v-on:click="modalHamburger = true" class="menu-button">
			<font-awesome-icon icon="fa-solid fa-xmark" />
		</div>
		<hamburger :show="modalHamburger" @close="modalHamburger = false" :id1="myId" :id2="friend.id" :username="friend.username"></hamburger>
		<invite :show="modalInvite" @close="modalInvite = false" :myId="myId" :friendId="friend.id"></invite>
	</div>
	<div class="box" v-else-if="dataLoaded && print === 1 && friend.request !== myId && friend.status === 'pending' && !blockList.includes(friend.id)">
		<div class="img_user">
			<img class="img_user_profil" :src="getAvatarUrl(friend.id)" @click="redirecToProfil(friend.username)">
		</div>
		<div class="name">
			{{ friend.username }}
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