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
	props: ['updateTimestamp', 'socket'],
	data() {
		return {
			friends: [] as friendTab[],
			blockList: [],
			sender: -1 as number,
			block: false as boolean,
			print: 0 as number,
		};
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
		friends: {
			handler() {
				this.fetchFriends();
			},
			deep: true,
		},
		updateTimestamp: {
			handler(){
				this.print = 0;
			},
			deep: true
		},
		blockList: {
			handler() {
				this.fetchBlockList();
			},
			deep: true,
		},
	},
});

</script>

<template>
	<div class="add_friend">
		<button class="tri" @click="print = 1;">Demande</button>
		<button class="tri" @click="print = 2;">Bloqué</button>
		<div class="notifDemande">
			5
		</div>
	</div>
	<div v-if="print === 2" class="list_friend">
		<BlockListCell v-for="block in blockList" :block=block :myId=sender></BlockListCell>
	</div>
	<div v-else class="list_friend">
		<ProfilCell v-for="friend in friends" :socket='socket' :friend="friend" :myId=sender :blockList=blockList :print=print></ProfilCell>
	</div>
</template>

<style>

.list_friend {
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 100%;
	height: 100%;
}

.add_friend .tri {
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	background-color: #046280;
	height: 65%;
	flex-shrink: 0;
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