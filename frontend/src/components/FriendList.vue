<script lang="ts">
import { defineComponent } from 'vue';
import ProfilCell from './ProfilCell.vue';
import BlockListCell from './BlockListCell.vue';

export interface friendTab {
	id: number;
	status: string;
	username: string;
	request: number;
}

export default defineComponent({
	components: {
		ProfilCell,
		BlockListCell
	},
	props: ['updateTimestamp', 'socket', 'friendTimestamp'],
	data() {
		return {
			friends: [] as friendTab[],
			blockList: [] as number[],
			sender: -1 as number,
			block: false as boolean,
			print: 0 as number,
		};
	},

	computed:{
		getFriendRequest(){
			let number = 0;
			for (let friend of this.friends) {
				if (friend.request !== this.sender && friend.status === 'pending' && !this.blockList.includes(friend.id))
					number++;
			}
			return (number);
		},
	},

	async mounted() {
		this.sender = (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/me', { credentials: 'include' })).json())['id'];
		await this.fetchBlockList();
		await this.fetchFriends();
	},

	methods: {
		async fetchFriends() {
			const response = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/friend/" + this.sender + "/list", { credentials: 'include' });
			this.friends = await response.json();
		},

		async fetchBlockList() {
			const response = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/" + this.sender + "/block/blocklist", { credentials: 'include' });
			this.blockList = await response.json();
		}
	},

	watch: {
		friendTimestamp: {
			handler(){
				this.fetchFriends();
				this.fetchBlockList();
			}
		},
		updateTimestamp: {
			handler() {
				this.print = 0;
			},
		},
	},
});

</script>

<template>
	<div class="friend_list_container">
		<div class="friend_buttons_container">
			<button class="tri" @click="print = 1;">Demande</button>
			<button class="tri" @click="print = 2;">Bloqué</button>
			<div v-if="getFriendRequest"  class="notifDemande">
				<strong>{{ getFriendRequest }}</strong>
			</div>
		</div>
		<div v-if="print === 2" class="list_friend">
			<BlockListCell v-for="block in blockList" :block=block :myId=sender></BlockListCell>
		</div>
		<div v-else class="list_friend">
			<ProfilCell v-for="friend in friends" :friend="friend" :myId=sender :blockList=blockList :print=print></ProfilCell>
		</div>
	</div>
</template>

<style>

.list_friend {
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 100%;
	/* height: 100%; */
}

.friend_list_container{
	height: 100%;
	/* background-color: rebeccapurple; */
}

.friend_buttons_container{
	display: flex;
	flex-direction: row;
	gap: 10px;
	justify-content: center;
	/* align-items: center; */
	/* margin-top: -5px; */
	/* background: purple; */
	/* padding: 10px; */
	/* margin-bottom: -10px; */
	height: 6%;
	/* background: red; */
	/* padding: 100px; */
}

.tri {
	color: white;
	background-color: #046280;
	width: 45%;
	overflow: hidden;
	border-radius: 20px;
	border: none;
	cursor: pointer;
}

.tri:hover {
	background-color: #032f3d;
}

.tri:focus {
	background-color: #032f3d;
}

.notifDemande {
	position: absolute;
	background: red;
	border-radius: 50px;
	width: 20px;
	font-size: 0.6em;
	text-align: center;
	margin-right: 20px;
	margin-bottom: 20px;
	color: white;
}
</style>