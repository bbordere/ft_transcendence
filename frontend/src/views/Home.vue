<template>
	<Head />
	<div class="home_body">
		<div class="home_content">
			<div class="left_column">
				<router-link class="play_button" to="/pong">jouer</router-link>
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
					<label>join_panel</label>
					<label for="channel_field">Join a channel or add a friend</label>
					<input type="text" name="channel_field" v-model="channelName">
					<input type="button" value="Create/Join channel" @click="createChannel(channelName)">
					<input type="button" value="Add a friend" @click="addFriend(channelName)">
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
	data() {
		return {
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
	components: {
		Head,
	}
});

</script>

<style>
.home_body {
	display: flex;
	width: 95vw;
	height: 90vh;
	align-items: center;
	justify-content: center;
}

.home_content {
	display: flex;
	height: 80%;
	width: 100%;
	align-items: center;
	justify-content: center;
	gap: 8%;
	padding-left: 5%;
}

.left_column {
	display: flex;
	flex-direction: column;
	gap: 4%;
}

.play_button {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 25%;
	width: 175%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 25px;
}

.match_historic {
	display: flex;
	height: 75%;
	width: 175%;
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
}

.friend_list {
	display: flex;
	height: 66%;
	width: 175%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.join_panel {
	display: flex;
	height: 33%;
	width: 175%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
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