<script lang="ts">
import { defineComponent } from 'vue';
import ProfilCell from './ProfilCell.vue';
import BlockListCell from './BlockListCell.vue';
import type { Channel } from '@/interfaces/channel.interface';
import type { Message } from '@/interfaces/message.interface';
import type { friendTab } from '@/interfaces/friendTab.interface';

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
			const friends = await response.json();
			this.friends = friends;
			for (let friend of friends) {
				const owner: number = (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + friend['channel']['id'] + '/owner', {credentials: 'include'})).json())['id'];
				const messages: Message[] = await this.getChannelMessages(friend['channel']['id']);
				const admins: number[] = await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + friend['channel']['id'] + '/getAdmins', { credentials: 'include' })).json();
				const channel: Channel = {
					id: friend['channel']['id'],
					name: friend['channel']['name'],
					owner: owner,
					messages: messages,
					protected: friend['channel']['protected'],
					isPrivate: friend['channel']['isPrivate'],
					admins: admins,
				}
				friend['channel'] = channel;
			}
		},

		async fetchBlockList() {
			const response = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/" + this.sender + "/block/blocklist", { credentials: 'include' });
			this.blockList = await response.json();
		},

		async getChannelMessages(channelId: number): Promise<Message[]> {
			const message_response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/message/' + channelId + '/list', { credentials: 'include' });
			let messages = [] as Message[];
			try {
				const messages_json = await message_response.json();
				for (let i = 0; i < messages_json.length; i++) {
					messages.push({
						channelId: channelId,
						text: messages_json[i].message_text,
						sender: messages_json[i].sender_id,
						sender_name: messages_json[i].sender_name,
						sender_img: messages_json[i].sender_avatarLink,
					});
				}
				return (messages);
			}
			catch {
				return ([] as Message[]);
			}
		},

		showChannelForwarder(channelId: number): void {
			this.$emit('showPrivateMessage', channelId);
		}
	},

	watch: {
		friendTimestamp: {
			async handler(){
				await this.fetchFriends();
				await this.fetchBlockList();
				console.log("update");
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
			<ProfilCell v-for="friend in friends" :friend="friend" :myId=sender :blockList=blockList :print=print @showChannel="showChannelForwarder"></ProfilCell>
		</div>
	</div>
</template>

<style>

.list_friend {
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 100%;
	height: 94%;
}

.friend_list_container{
	height: 100%;
}

.friend_buttons_container{
	display: flex;
	flex-direction: row;
	gap: 10px;
	justify-content: center;
	height: 6%;
}

.tri {
	color: white;
	background-color: #046280;
	width: 45%;
	overflow: hidden;
	border-radius: 20px;
	border: none;
	cursor: pointer;
	font-family: 'Poppins', sans-serif;
	font-weight: bold;
	font-size: clamp(0.5rem, 0.4118rem + 0.4706vw, 0.75rem);
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