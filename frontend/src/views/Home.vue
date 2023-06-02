<template>
	<div class="home_body">
		<div class="home_content">
			<div class="left_column">
				<div class="play_button">
					<router-link to="/pong">jouer</router-link>
				</div>
				<div class="match_historic">
					<label>macht_historic</label>
				</div>
			</div>
			<div class="chat">
				Chat
				<ul class="msg_chat_box">
					<li v-for="msg in messages" :key="msg.id" :class="{ 'sent': msg.direction === 'sent', 'received': msg.direction === 'received'}">{{ msg.text }}</li>
				</ul>
				<div v-if="connected">
					<input type="text" v-model="message">
					<button type="button" @click="sendMessage">Send !</button>
				</div>
				<div v-else>
					<p>connecting to websocket server...</p>
				</div>
			</div>
			<div class="right_column">
				<div class="friend_list">
					<label>friend_list</label>
				</div>
				<div class="join_panel">
					<label>join_panel</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import io from 'socket.io-client';
import { Vue } from 'vue-property-decorator';

interface Message {
	id: number;
	text: string;
	direction: 'sent' | 'received';
}

export default class ChatClient extends Vue {
	private socket: any = null;
	private connected: boolean = false;
	private message: string = '';
	private messages: Message[] = [];

	created() {
		this.socket = io('http://localhost:3000');
		this.socket.on('connect', () => { this.connected = true; });
		this.socket.on('disconnect', () => { this.connected = false; });
		this.socket.on('message', (message: string) => {
			this.messages.push({
				id: this.messages.length + 1,
				text: message,
				direction: 'received',
			});
		});
	}

	sendMessage() {
		if (this.message) {
			this.socket.emit('message', this.message);
			this.messages.push({
				id: this.messages.length + 1,
				text: this.message,
				direction: 'sent',
			});
			this.message = '';
		}
	}
}
</script>

<style>
.home_body {
	width: 100vw;
	height: 100vh;
	display: flex;
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
}

.left_column {
	height: 100%;
	width: 20%;
	display: flex;
	flex-direction: column;
	gap: 20%;
}

.play_button {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 20%;
	height: 10%;
	width: 150%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 20px;
}

.match_historic {
	height: 70%;
	width: 200%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.chat {
	height: 100%;
	width: 50%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.right_column {
	height: 100%;
	width: 10%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.friend_list {
	height: 70%;
	width: 200%;
	background: #D9D9D9;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.join_panel {
	height: 30%;
	width: 200%;
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