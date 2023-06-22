<template>
	<Head />
	<div class="home_body">
		<div class="home_content">
			<div class="left_column">
				<router-link class="play_button" to="/pong">Jouer</router-link>	
				<div class="friend_list">
					<div class="add_friend">
						<button id="show-modal" @click="showModal = true">Ami +</button>
						<Teleport to="body">
						<ModalAdd :show="showModal" @close="showModal = false"></ModalAdd>
						</Teleport>
						<button id="show-modal" @click="showModal = true">Channel +</button>
						<Teleport to="body">
						<ModalAdd :show="showModal" @close="showModal = false"></ModalAdd>
						</Teleport>
					</div>
					<div class="list">
						<div class="friends"></div>
					</div>
					<!-- <ul>
						<li v-for="channel in channels"><button :key="channel.id" @click="showChannel(channel.id)">{{ channel.name }}</button></li>
					</ul> -->
				</div>
			</div>
			<div class="chat">
				<div v-if="showDiv">
					Chat
					<h2>{{ selectedChannel.name }}</h2>
					<ul class="msg_chat_box">
						<li v-for="msg in selectedChannel.messages" :key="msg.id" :class="getMessageClass(msg)">{{ msg.text }}</li>
					</ul>
					<div v-if="connected">
						<input type="text" v-model="message">
						<button type="button" @click="sendMessage">Send !</button>
					</div>
					<div v-else>
						<p>connecting to websocket server...</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

/*
 1. Will have to push the channels (and friends) in the database
*/

import Head from '../components/head.vue'
import io from 'socket.io-client';
import ModalAdd from '../components/ModalAdd.vue'
import { defineComponent } from 'vue';

interface Message {
	id: number,
	text: string,
	sender: number,
};

export class Channel {
	public id: number;
	public name: string;
	public messages: Message[];
	public users: number[];

	constructor(name: string, id: number) {
		this.id = id;
		this.messages = [];
		this.users = [];
		this.name = name;
	}
};

export default defineComponent({
	components: {
			ModalAdd,
			Head
		},
	data() {
		return {
			showModal: false,
			socket: null as any,
			connected: false as Boolean,
			message: '' as string,
			messages: [] as Message[],
			sender: -1 as number,
			channels: [] as Channel[],
			selectedChannel: {} as Channel,
			showDiv: false as Boolean,
		};
	},

	async mounted() {
		const response = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/me", { credentials: 'include' });
		const response_json = await response.json();
		this.sender = response_json['id'];
		this.initSocket();
	},

	methods: {
		initSocket() {
			this.socket = io('http://localhost:3000/');
			this.socket.on('connect', () => { this.connected = true; });
			this.socket.on('disconnect', () => { this.connected = false; });
			this.socket.on('message', (data: { text: string, sender: number }) => {
				const { text, sender } = data;
				if (sender !== this.sender) {
					this.selectedChannel.messages.push({
						id: this.selectedChannel.messages.length + 1,
						text: text,
						sender: sender,
					});
				}
			});
		},

		sendMessage() {
			if (this.message && this.socket) {
				this.socket.emit('message', { text: this.message, sender: this.sender });
				this.selectedChannel.messages.push({
					id: this.selectedChannel.messages.length + 1,
					text: this.message,
					sender: this.sender,
				});
				this.message = '';
			}
		},

		getMessageClass(message: Message): string {
			return (this.sender === message.sender ? 'sent' : 'received');
		},

		// Maybe collapse these two functions into one
		createChannel(name: string): void {
			name = '#' + name;
			for (let i = 0; i < this.channels.length; i++) {
				if (this.channels[i].name === name) {
					if (!(this.channels[i].users.includes(this.sender))) {
						this.channels[i].users.push(this.sender);
					}
					else {
						this.selectedChannel = this.channels[i];
					}
					return;
				}
			}
			this.channels.push(new Channel(name, this.channels.length));
		},

		addFriend(name: string): void {
			console.log('@' + name);
		},

		showChannel(id: number): void {
			this.showDiv = true;
			this.selectedChannel = this.channels[id];
		}
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
	padding-top: 2.5%;
	padding-left: 2.7%;
	padding-bottom: 2%;
	min-height: 600px;
	min-width: 500px;
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
	height: 20%;
	width: 100%;
	background: #036280;
	border: 3px solid #BC0002;
	border-radius: 25px;
	text-decoration: none;
	color: black;
	font-size: 3em;
}

.play_button:hover {
	background-color: #42badf;
}

.chat {
	display: flex;
	height: 99%;
	width: 45%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: #F0F8FF;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.friend_list {
	display: flex;
	flex-direction: column;
	height: 90%;
	width: 100%;
	background-color: #F0F8FF;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.add_friend {
	display: flex;
	justify-content: center;
	align-items: center;
	padding-left: 2%;
	padding-top: 2%;
	height: 8%;
	width: 95%;
	gap: 2%;
}

.add_friend button {
	display: flex;
	background-color: #DBEFFC;
	align-items: center;
	justify-content: center;
	height: 100%;
	flex-grow: 1;
	font-size: 1em;
	border-radius: 10px;
	cursor: pointer;
}

.add_friend button:hover {
	background-color: #42badf;
}

.list {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	margin-top: 2%;
	align-items: center;
	background-color: red;
}

.friends {
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow-y: auto;
	height: 92%;
	background-color: black;
}

.friend {
	margin-top: 5%;
	margin-bottom: 5%;
}


@media screen and (max-width: 1150px) {
	.join_panel button {
		font-size: 65%;
	}

	.left_column {
		flex-grow: 0.6;
	}

	.chat {
		width: 50%;
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