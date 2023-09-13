<template>
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
	<div class="send_container">
		<form v-on:submit.prevent="sendMessage">
			<div class="sendbox">
				<input type="text" v-model="message">
				<button type="button" @click="sendMessage()">&#8593;</button>
			</div>
		</form>
		<div class="channel_options">
			<button type="button" @click="quitChannel(sender.id)">Quit Channel</button>
			<button v-if="selectedChannel.admin == sender.id" type="button"
				@click="$emit('displayChannelOption', 'kick')">Kick User</button>
			<button v-if="selectedChannel.admin == sender.id" type="button"
				@click="$emit('displayChannelOption', 'ban')">Ban User</button>
			<button v-if="selectedChannel.admin == sender.id" type="button"
				@click="$emit('displayChannelOption', 'unban')">Unban User</button>
		</div>
	</div>
</template>
<script lang="ts">
export default {

	data() {
		return {
			message: '' as string,
		};
	},

	props: ['selectedChannel', 'sender', 'socket',
		'showKickModal', 'showBanModal', 'showUnBanModal'],

	methods: {
		sendMessage() {
			if (this.socket && this.message) {
				const data = {
					channelId: this.selectedChannel.id,
					text: this.message,
					sender: this.sender.id,
					sender_name: this.sender.name,
					sender_img: this.sender.img,
				};
				this.socket.emit('message', data);
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