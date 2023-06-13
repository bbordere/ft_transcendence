<template>
	<div class="chat">
		<span>Chat page</span>
		<div v-if="connected">
			<input type="text" v-model="message">
			<button @click="sendMessage">Send !</button>
		</div>
		<div v-else>
			<p>connecting to websocket server...</p>
		</div>
		<ul>
			<li v-for="msg in messages">{{ msg }}</li>
		</ul>
	</div>
</template>

<script lang="ts">
import io from 'socket.io-client';
import { Vue } from 'vue-property-decorator';

export default class ChatClient extends Vue {
	socket: any = null;
	connected: boolean = false;
	message: string = '';
	messages: string[] = [];

	created() {
		this.socket = io('http://localhost:3000');
		this.socket.on('connect', () => {this.connected = true;});
		this.socket.on('disconnect', () => {this.connected = false;});
		this.socket.on('message', (message: string) => {this.messages.push(message);});
	}

	sendMessage() {
		if (this.message) {
			this.socket.emit('message', this.message);
			this.message = '';
		}
	}
}
</script>