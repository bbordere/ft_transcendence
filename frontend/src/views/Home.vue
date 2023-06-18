<template>
	<Head />
	<div class="home_body">
		<div class="home_content">
			<div class="left_column">
				<router-link class="play_button" to="/pong">Jouer</router-link>
				<div class="match_historic">
					<label>macht_historic</label>
				</div>
			</div>
			<div class="chat">
				<div v-if="connected && showDiv">
					<h2>{{ selectedChannel.name }}</h2>
					<ul class="msg_chat_box">
						<li v-for="msg in selectedChannel.messages" :class="getMessageClass(msg)">{{ msg.text }}</li>
					</ul>
					<input type="text" v-model="message">
					<button type="button" @click="sendMessage()">Send !</button>
				</div>
				<div v-else-if="!connected">
					<p>connecting to websocket server...</p>
				</div>
			</div>

			<div class="right_column">

				<div class="friend_list">
					<label>friend_list</label>
					<ul>
						<li v-for="chan in channels"><button :key="chan.id" @click="showChannel(chan)">{{ chan.name
						}}</button></li>
					</ul>
				</div>

				<div class="join_panel">
					<button id="show-modal" @click="joinChannel('bonsoir')">Rejoindre</button>
					<Teleport to="body">
						<ModalAdd :show="showModal" @close="showModal = false"></ModalAdd>
					</Teleport>
					<button id="show-modal" @click="createChannel('bonsoir')">Channel+</button>
					<Teleport to="body">
						<ModalAdd :show="showModal" @close="showModal = false"></ModalAdd>
					</Teleport>
					<button id="show-modal" @click="showModal = true">Ami+</button>
					<Teleport to="body">
						<ModalAdd :show="showModal" @close="showModal = false"></ModalAdd>
					</Teleport>
					<button id="show-modal" @click="deleteChannel('bonsoir')">Channel-</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Head from '../components/head.vue'
import io from 'socket.io-client';
import { defineComponent } from 'vue';
import ModalAdd from '../components/ModalAdd.vue';

interface Message {
	chanId: number;
	text: string;
	sender: number;
}

interface Channel {
	id: number;
	name: string;
	messages: Message[],
}

// Why do I have to sockets with the same id ?

export default defineComponent({
	data() {
		return {
			socket: null as any,
			channels: [] as Channel[],
			connected: true as Boolean,
			sender: -1 as number,
			message: '' as string,
			selectedChannel: {} as Channel,
			showModal: false as Boolean,
			showDiv: false as Boolean,
		}
	},

	async mounted() {
		this.sender = (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/me', { credentials: 'include' })).json())['id'];
		const channels_json = await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + this.sender + '/joinedChannels', { credentials: 'include' })).json();
		for (let i = 0; i < channels_json.length; i++) {
			this.channels.push({
				id: channels_json[i]['id'],
				name: channels_json[i]['name'],
				messages: [] as Message[],
			});
		}
		this.init();
	},

	methods: {
		init() {
			this.socket = io('http://localhost:3000/')
			this.socket.on('connect', () => { this.connected = true; });
			this.socket.on('disconnect', () => { this.connected = false; });
			this.socket.on('message', (data: { chanId: number, text: string, sender: number }) => {
				const { chanId, text, sender } = data;
				const channel = this.findChannel(chanId);
				channel?.messages.push({
					chanId: chanId,
					text: text,
					sender: sender,
				});
			});
		},
		async createChannel(name: string) {
			this.showModal = true;
			const response_json = await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/create', {
				credentials: 'include',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					name: name
				}),
			})).json();
			this.joinChannel(name);
		},

		sendMessage() {
			if (this.socket && this.message) {
				const data = {
					chanId: this.selectedChannel.id,
					text: this.message,
					sender: this.sender,
				};
				// this.selectedChannel.messages.push(data);
				this.socket.emit('message', data);
				// Push the message into the database
				this.message = '';
			}
		},

		showChannel(chan: Channel) {
			this.showDiv = true;
			this.selectedChannel = chan;
		},

		async joinChannel(name: string) {
			const channel = await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + name, { credentials: 'include' })).json();
			for (let i = 0; i < this.channels.length; i++)
				if (this.channels[i].id === channel['id'])
					return;
			const response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + this.sender + '/channels/' + channel['id'] + '/add', {
				credentials: 'include',
				method: "POST",
			});
			if (response['ok'] === true) {
				this.channels.push(channel);
				this.selectedChannel = channel;
				// Retrieve all the messages from the database
				if (this.selectedChannel.messages === undefined)
					this.selectedChannel.messages = [] as Message[];
			}
		},

		findChannel(id: number): Channel | null {
			for (let i = 0; i < this.channels.length; i++)
				if (this.channels[i].id === id)
					return (this.channels[i]);
			return (null);
		},

		getMessageClass(message: Message): string {
			return (this.sender === message.sender ? 'sent' : 'received');
		},

		async deleteChannel(name: string) {
			// If only 1 user left in the channel delete it
			const channel = await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + name, { credentials: 'include' })).json();
			for (let i = 0; i < this.channels.length; i++)
				if (this.channels[i].id === channel['id'])
					this.channels.splice(i, 1);
			const response_json = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + this.sender + '/channels/' + channel['id'] + '/remove', { credentials: 'include', method: 'POST', });
			if (this.selectedChannel.messages != undefined) {
				this.selectedChannel = {} as Channel;
				this.showDiv = false;
			}
		},
	},

	components: {
		Head,
		ModalAdd,
	},
});

</script>

<style>
.home_body {
	display: flex;
	width: 95vw;
	height: 80vh;
	align-items: center;
	justify-content: center;
	padding-top: 2%;
	min-height: 600px;
}

.home_content {
	display: flex;
	height: 100%;
	align-items: center;
	justify-content: center;
	flex-basis: 100%;
	gap: 6%;
}

.left_column {
	display: flex;
	flex-direction: column;
	gap: 4%;
	flex-grow: 0.2;
}

.play_button {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 25%;
	width: 100%;
	background: #036280;
	border: 3px solid #BC0002;
	border-radius: 25px;
	text-decoration: none;
	color: black;
	font-size: 100%;
}

.play_button:hover {
	background-color: #42badf;
}

.match_historic {
	display: flex;
	height: 75%;
	width: 100%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.chat {
	display: flex;
	height: 100%;
	width: 45%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.right_column {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 4%;
	flex-grow: 0.2;
}

.friend_list {
	display: flex;
	height: 65%;
	width: 100%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.join_panel button {
	display: flex;
	flex-direction: row;
	height: 100%;
	width: 95%;
	align-items: center;
	justify-content: center;
	font-size: 100%;
	margin: 2%;
	background-color: #036280;
	border-radius: 10px;
	border: none;
	cursor: pointer;
}

.join_panel {
	display: flex;
	flex-direction: column;
	height: 35%;
	width: 100%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
}

.join_panel button:hover {
	background-color: #42badf;
}

@media screen and (max-width: 800px) {
	.join_panel button {
		font-size: 65%;
	}

	.right_column {
		flex-grow: 0.6;
		margin-right: 2%;
	}

	.left_column {
		flex-grow: 0.6;
		margin-left: 2%;
	}
}

.msg_chat_box {
	width: 100%;
}

.msg_chat_box li {
	text-decoration: none;
}

.sent {
	text-align: right;
}

.received {
	text-align: left;
}
</style>