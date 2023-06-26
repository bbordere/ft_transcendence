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

			<div class="right_column">

				<div class="friend_list">
					<label>friend_list</label>
					<ul>
						<li v-for="channel in channels"><button :key="channel.id" @click="showChannel(channel.id)">{{ channel.name }}</button></li>
					</ul>
				</div>

				<div class="join_panel">
					<button id="show-modal" @click="showModal = true">Rejoindre</button>
					<Teleport to="body">
						<ModalAdd :show="showModal" @close="showModal = false"></ModalAdd>
					</Teleport>
					<button id="show-modal" @click="showModal = true">Channel+</button>
					<Teleport to="body">
						<ModalAdd :show="showModal" @close="showModal = false"></ModalAdd>
					</Teleport>
					<button id="show-modal" @click="showModal = true">Ami+</button>
					<Teleport to="body">
						<ModalAdd :show="showModal" @close="showModal = false"></ModalAdd>
					</Teleport>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

/*
1. Will have to push the channels (and friends) in the database
*/
import io from 'socket.io-client';
import { ref } from 'vue'
import { defineComponent } from 'vue';
import Head from '../components/head.vue'
import ModalAdd from '../components/ModalAdd.vue'


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
		ModalAdd: ModalAdd,
		Head: Head,
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