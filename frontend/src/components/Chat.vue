<template>
	<div class="chat" @click="showMenu = false">
		<Teleport to="body">
			<ModalChat :show="modalChat" @close="modalChat = false" :connected_user="connected_user" :friendId="friendId" :username="username" :selectedChannel="selectedChannel" />
		</Teleport>
		<div class="top_chat_container">
			<!-- {{ selectedChannel.admins }} -->
			<div class="channel_name">{{ selectedChannel.name }}</div>
			<ChannelOptionsMenu v-if="selectedChannel.name" :isAdmin="selectedChannel.owner === sender.id"
			:showMenu="showMenu" :isProtected="selectedChannel.protected"
			@openMenu="toggleMenu" @quitChannel="quitChannel(sender.id)" 
			@removePassword="removePassword()" @displayChannelOption="emitToModalManager"></ChannelOptionsMenu>
		</div>
		<div class="message_box">
			<div v-for="(msg, index) in selectedChannel.messages" class="single_message" :class="sender.id === msg.sender ? 'sent' : 'received'">
				<img v-if="sender.id !== msg.sender" alt="avatar" @click="showChatModal(msg)" :src="msg.sender_img">
				<div class="msg_txt_box">
					<span v-if="sender.id !== msg.sender" class="sender_name">{{ msg.sender_name }}</span>
					<div :class="sender.id === msg.sender ? 'sent_txt' : 'received_txt'" :ref="`message-${index}`" class="message">{{ msg.text }}</div>
				</div>
			</div>
		</div>
		<div class="send_container" v-if="selectedChannel.name">
			<form v-on:submit.prevent="sendMessage">
				<div class="sendbox">
					<input type="text" v-model="message" :placeholder="'Envoyer un message dans ' + [[selectedChannel.name]]">
					<button type="button" @click="sendMessage()">
						<font-awesome-icon icon="fa-solid fa-paper-plane" />
					</button>
				</div>
			</form>
		</div>
	</div>
</template>
<script lang="ts">
import { SocketService } from '@/services/SocketService';
import ModalChat from '../components/ModalChat.vue';
import { useNotification } from '@kyvg/vue3-notification';
import router from '@/router';
import ChannelOptionsMenu from '@/components/ChannelOptionsMenu.vue'

export default {
	components: {
		ModalChat,
		ChannelOptionsMenu,
	},

	data() {
		return {
			message: '' as string,
			modalChat: false as boolean,
			connected_user: -1 as number,
			friendId: -1 as number,
			username: '' as string,
			showMenu: false,
		};
	},

	updated() {
		if (this.selectedChannel.messages) {
			const lastMessage = this.$refs[`message-${this.selectedChannel.messages.length - 1}`] as any;
			if (lastMessage)
				lastMessage[0].scrollIntoView();
		}
	},

	mounted() {
		this.connected_user = SocketService.getUser;
	},

	props: ['selectedChannel', 'sender'],

	methods: {

		redirecToProfil(name: string) {
			router.push({ path: '/profile', query: { user: name } });
		},

		toggleMenu(){
			this.showMenu = !this.showMenu;
		},
		emitToModalManager(modalToggled: string){
			this.$emit('displayChannelOption', modalToggled);
		},
		sendMessage() {
			if (SocketService.getStatus && this.message) {
				if (/^\s+$/i.test(this.message))
					return;
				this.message = this.message.trimStart().trimEnd();
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
		},

		showChatModal(msg: any) {
			if (msg.sender === this.sender.id) {
				this.redirecToProfil(msg.send_name);
				return ;
			}
			this.friendId = msg.sender;
			this.username = msg.sender_name;
			this.modalChat = true;
		},

		async removePassword() {
			const response = (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + this.$props.selectedChannel.id + '/' + this.$props.sender.id + '/removePassword', {
				credentials: 'include',
				method: 'POST',
			} )).json());
			const notif = useNotification();
			if (!response['ok']) {
				notif.notify({
					title: 'Erreur',
					text: response['message'],
					type: 'error',
					group: 'notif-center',
				});
				return ;
			}
			notif.notify({
				title: 'Mot de passe',
				text: response['message'],
				type: 'success',
				group: 'notif-center',
			});
			this.$props.selectedChannel.protected = false;
		},
	}
}
</script>

<style>

input:placeholder-shown {
  text-overflow: ellipsis;
}

.chat {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	background: white;
	width: 60%;
	height: 100%;
	border: 3px solid #515151;
	border-radius: 10px;
	background-image: url('/public/chat_background.png');
	background-size: contain ;
	background-repeat: no-repeat;
	background-position: center;
}
.top_chat_container{
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 40px;
	position: relative;
}

.channel_name{
	width: 100%;
	padding-left: 10px;
	font-weight: bold;
	font-size: clamp(1rem, 0.4231rem + 1.8462vw, 1.75rem);
}

.message {
	text-align: left;
	word-wrap: break-word;
	padding: 10px;
	max-width: 100%;
	font-size: clamp(0.75rem, 0.5577rem + 0.6154vw, 1rem);
	overflow-wrap: anywhere;
	white-space: break-spaces
}

.msg_txt_box{
	display: flex;
	flex-direction: column;
	align-items: start;
	max-width: 70%;
}

.sent_txt{
	background: rgb(187, 214, 255);
	border-radius: 20px 20px 0px 20px;
}

.received_txt{
	background-color: #d4eefd;
	border-radius: 20px 20px 20px 0px;
}

.message_box {
	display: flex;
	flex-direction: column;	
	width: 95%;
	margin-bottom: 10px;
	height: 100%;
	max-height: 100%;
	overflow-y: scroll;
	scrollbar-width: none;
	min-height: min-content;
}

.message_box .single_message:first-child {
    margin-top: auto;
}

::-webkit-scrollbar {
	width: 0;
	background-color: transparent;
}

.single_message {
	display: flex;
	align-items: end;
	margin-top: 10px;
	overflow-wrap: break-word;
}

.single_message img {
	padding-left: 5px;
	padding-right: 5px;
	width: 40px;
	height: 40px;
	border-radius: 50%;
}

.msg_chat_box img:hover {
	cursor: pointer;
}

.sender_name {
	font-size: 10px;
	margin-left: 10px;
}

.sent {
	text-align: right;
	display: flex;
	flex-direction: row-reverse;
}

.send_container {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	margin-bottom: 10px;
}

.send_container form {
	width: 95%;
	border-radius: 10px;
}

.sendbox {
	width: 100%;
	text-align: center;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 10px;
}

.sendbox input {
	width: 100%;
	height: 50px;
	border: none;
	border-radius: 500px;
	background-color: #ebebeb;
	padding-left: 15px;
	font-size: clamp(0.6875rem, 0.4471rem + 0.7692vw, 1rem);
}

.sendbox input:focus {
	outline: none;
}

.sendbox button {
	padding: 20px;
	text-align: center;
	color: white;
	font-weight: bold;
	border: none;
	border-radius: 500px;
	background-color:  #036280;
	cursor: pointer;
}

.sendbox button:hover {
	background-color:  #004d64;
}

</style>