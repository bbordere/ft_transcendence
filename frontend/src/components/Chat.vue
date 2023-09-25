<template>
	<div class="chat">
		<h1>{{ selectedChannel.name }}</h1>
		<div class="message_box">
			<ul class="msg_chat_box">
				<li>
					<div v-for="(msg, index) in selectedChannel.messages" class="single_message"
						:class="sender.id === msg.sender ? 'sent' : 'received'">
						<img :src="msg.sender_img">
						<div>
							<span class="sender_name">{{ msg.sender_name }}</span>
							<span :ref="`message-${index}`" class="message">{{ msg.text }}</span>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="send_container" v-if="selectedChannel.name">
			<form v-on:submit.prevent="sendMessage">
				<div class="sendbox">
					<input type="text" v-model="message">
					<button type="button" @click="sendMessage()">&#8593;</button>
				</div>
			</form>
			<div class="channel_options">
				<button type="button" @click="quitChannel(sender.id)">Quit Channel</button>
				<button v-if="selectedChannel.owner === sender.id" type="button"
					@click="$emit('displayChannelOption', 'kick')">Kick User</button>
				<button v-if="selectedChannel.owner === sender.id" type="button"
					@click="$emit('displayChannelOption', 'ban')">Ban User</button>
				<button v-if="selectedChannel.owner === sender.id" type="button"
					@click="$emit('displayChannelOption', 'unban')">Unban User</button>
				<button v-if="selectedChannel.owner === sender.id" type="button"
					@click="$emit('displayChannelOption', 'mute')">Mute User</button>
				<button v-if="selectedChannel.protected">Change/Remove Password</button>
				<button v-else>Add Password</button> 
			</div>
		</div>
	</div>
</template>
<script lang="ts">
import { SocketService } from '@/services/SocketService';

export default {

	data() {
		return {
			message: '' as string,
		};
	},

	updated() {
		if (this.selectedChannel.messages) {
			const lastMessage = this.$refs[`message-${this.selectedChannel.messages.length - 1}`] as any;
			if (lastMessage)
				lastMessage[0].scrollIntoView();
		}
	},

	props: ['selectedChannel', 'sender'],

	methods: {
		sendMessage() {
			if (SocketService.getStatus && this.message) {
				const data = {
					channelId: this.selectedChannel.id,
					text: this.message,
					sender: this.sender.id,
					sender_name: this.sender.name,
					sender_img: this.sender.img,
				};
				SocketService.getInstance.emit('message', data);
				this.message = '';
			}
		},

		async quitChannel(id: number) {
			const response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + id + '/channels/' + this.selectedChannel.id + '/remove', {
				credentials: 'include',
				method: 'POST'
			});
			const response_json = await response.json();
			if (response_json['ok'])
				this.$emit('removeChannel', id);
		}
	}
}
</script>
<style>
.chat {
	display: flex;
	height: 100%;
	width: 45%;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	background: #F0F8FF;
	border: 3px solid #515151;
	border-radius: 10px;
}

.message {
	text-align: left;
	word-wrap: break-word;
}

.message_box {
	padding-right: 20px;
	width: 90%;
	margin-bottom: 10px;
	max-height: 100%;
	overflow-y: auto;
	scrollbar-width: none;
}

::-webkit-scrollbar {
	width: 0;
	background-color: transparent;
}

.message_box ul {
	margin: 0;
	padding: 0;
	list-style-type: none;
}

.message_box ul li {
	padding: 5px;
}

.single_message {
	display: flex;
	margin-top: 10px;
}

.single_message div {
	display: flex;
	flex-direction: column;
	max-width: 50%;
}

.single_message img {
	padding-left: 5px;
	padding-right: 5px;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	overflow: hidden;
}

.sender_name {
	font-size: 10px;
}

.sent {
	text-align: right;
	justify-content: end;
	flex-direction: row-reverse;
}

.send_container {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	margin-bottom: 5%;
}

.send_container form {
	width: 80%;
}

.sendbox {
	width: 100%;
	background-color: white;
	text-align: center;
	display: flex;
	flex-direction: row;
	align-items: center;
}

.sendbox input {
	width: 90%;
	height: 50px;
	border: none;
	padding-left: 15px;
	border-right: 1px solid rgba(0, 0, 0, 0.1);
}

.sendbox input:focus {
	outline: none;
}

.sendbox button {
	padding-left: 20px;
	border: none;
	background-color: transparent;
	font-size: 20px;
	padding-right: 20px;
	color: rgba(0, 0, 0, 0.2);
}

.channel_options {
	display: flex;
	flex-direction: row;
	width: 80%;
	flex-wrap: wrap;
}

.channel_options button {
	flex: 1;
	padding: 10px;
	border: 1px solid rgba(0, 0, 0, 0.1);
	background-color: white;
}

@media screen and (max-width: 1150px) {
	.chat {
		width: 50%;
	}
}
</style>