<template>
	<div class="home_body">
		<div class="home_content">

			<div class="left_column">
				<button v-if="!recoButton" class="play_button" @click="showModalPlay = true">Jouer</button>
				<button v-else class="play_button" @click="reconnectToRoom">Reco</button>
				<Teleport to="body">
					<transition name="slide-fade" mode="out-in">
						<PlayModal v-show="showModalPlay" @close-modal="showModalPlay = false"></PlayModal>
					</transition>
				</Teleport>
				<div class="friend_list">
					<div class="add_friend">
						<button class="spe" @click="channelList = true;">Channel</button>
						<button class="spe" @click="channelList = false;">Amis</button>
						<ButtonAdd icon="fa-solid fa-user-plus" id="show-modal" @click="showModalFriend = true"></ButtonAdd>
						<Teleport to="body">
							<ModalAddFriend :show="showModalFriend" @close="showModalFriend = false"></ModalAddFriend>
						</Teleport>
							<ButtonAdd icon="fa-circle-plus" id="show-modal" @click="showModal = true"></ButtonAdd>
						<Teleport to="body">
							<ModalAdd :show="showModal" @close="showModal = false" @newChannel="joinChannel"></ModalAdd>
						</Teleport>
						<Teleport to="body">
							<KickUserModal :show="showKickModal" :channelId="selectedChannel.id" @close="showKickModal = false;" @kick="notifyKick"></KickUserModal>
						</Teleport>
						<Teleport to="body">
							<BanUserModal :show="showBanModal" :users="getUsersInChannel" :channelId="selectedChannel.id" @close="showBanModal = false;" @kick="notifyKick"></BanUserModal>
						</Teleport>
						<Teleport to="body">
							<UnBanUserModal :show="showUnBanModal" :channelId="selectedChannel.id" @close="showUnBanModal = false;"></UnBanUserModal>
						</Teleport>
					</div>
					<div class="list">
						<ul v-if="channelList">
							<li :class="clickedChannel(channel.id)" @click="showChannel(channel)" v-for="channel in channels"><span>{{ channel.name }}</span></li>
						</ul>
						<div v-else class="friends">
							<FriendList/>
						</div>
					</div>
				</div>
			</div>
			<div v-if="connected && showDiv" class="chat">
				<h1>{{ selectedChannel.name }}</h1>
				<div class="message_box">
					<ul class="msg_chat_box">
						<li>
							<div v-for="(msg, index) in selectedChannel.messages" class="single_message" :class="getMessageClass(msg)">
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
						<button type="button" @click="quitChannel(sender)">Quit Channel</button>
						<button v-if="selectedChannel.admin == sender" type="button" @click="showKickModal = true">Kick User</button>
						<button v-if="selectedChannel.admin == sender" type="button" @click="showBanModal = true">Ban User</button>
						<button v-if="selectedChannel.admin == sender" type="button" @click="showUnBanModal = true">Unban User</button>
					</div>
				</div>
			</div>
			<div v-else-if="!connected" class="chat">
				<p>connecting to websocket server...</p>
			</div>
			<div v-else-if="!showDiv" class="chat"></div>
		</div>
	</div>
</template>

<script lang="ts">
import io from 'socket.io-client';
import ModalAdd from '../components/ModalAdd.vue'
import ModalAddFriend from '../components/ModalAddFriend.vue'
import { defineComponent } from 'vue';
import { useNotification } from "@kyvg/vue3-notification";
import ButtonAdd from '../components/ButtonAdd.vue'
import PlayModal from '@/components/PlayModal.vue';
import KickUserModal from '@/components/KickUserModal.vue';
import BanUserModal from '@/components/BanUserModal.vue';
import UnBanUserModal from '@/components/UnBanUserModal.vue';
import FriendList from '../components/FriendList.vue'

interface User {
	id: number;
	name: string;
	img: string;
	admin: boolean;
}

interface Message {
	channelId: number;
	text: string;
	sender: number;
	sender_name: string;
	sender_img: string;
}

interface Channel {
	id: number;
	name: string;
	admin: number;
	messages: Message[],
	protected: boolean,
}

export default defineComponent({
	components: {
		ButtonAdd,
		ModalAddFriend,
		ModalAdd,
		PlayModal,
		KickUserModal,
		BanUserModal,
		UnBanUserModal,
		FriendList
	},

	data() {
		return {
			showModal: false,
			showModalFriend: false,
			showModalPlay: false,
			showKickModal: false,
			showBanModal: false,
			showUnBanModal: false,
			channelList: true,
			socket: null as any,
			connected: false as Boolean,
			sender: -1 as number,
			sender_name: '' as string,
			sender_img: '' as string,
			message: '' as string,
			channels: [] as Channel[],
			selectedChannel: {} as Channel,
			showDiv: false as Boolean,
			recoButton: false as Boolean,
			recoMode: -1 as number,
		}
	},

	props: {
		removedChannel: Number
	},

	async mounted() {
		const user = await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/me', { credentials: 'include' })).json()
		this.sender = user['id'];
		this.sender_name = user['name'];
		this.sender_img = user['avatarLink'];
		const channels_json = await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + this.sender + '/joinedChannels', { credentials: 'include' })).json();
		for (let i = 0; i < channels_json.length; i++) {
			this.channels.push({
				id: channels_json[i]['id'],
				admin: (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + channels_json[i]['id'] + '/admin', {credentials: 'include'})).json())['id'],
				name: channels_json[i]['name'],
				messages: await this.getChannelMessages(channels_json[i]['id']),
				protected: channels_json[i]['protected'],
			});
		}
		this.init();
		const token = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/auth/token", { credentials: 'include' });
		sessionStorage.setItem('token', await token.text());
		const disconnectObject = await ((await fetch("http://" + import.meta.env.VITE_HOST + ":3000/pong/status", { credentials: 'include' })).json());
		this.recoButton = disconnectObject["disconnect"];
		this.recoMode = disconnectObject["mode"];
		if (!this.recoButton)
			return;
		let timer: number = 0;
		const it = setInterval(async () => {
			const disconnectObject = await ((await fetch("http://" + import.meta.env.VITE_HOST + ":3000/pong/status", { credentials: 'include' })).json());
			this.recoButton = disconnectObject["disconnect"];
			timer++;
			if (timer === 8 || !this.recoButton)
				clearInterval(it);
		}, 500);
	},

	updated() {
		if (this.selectedChannel.messages) {
			const lastMessage = this.$refs[`message-${this.selectedChannel.messages.length - 1}`] as any;
			if (lastMessage)
				lastMessage[0].scrollIntoView();
		}
	},

	methods: {
		init() {
			this.socket = io('http://' + import.meta.env.VITE_HOST + ':3000/')
			this.socket.on('connect', () => { this.connected = true; });
			this.socket.on('disconnect', () => { this.connected = false; });
			this.socket.on('message',
				(data: { channelId: number,
					text: string,
					sender: number,
					sender_name: string,
					sender_img: string
				}) => {
				const { channelId, text, sender, sender_name, sender_img } = data;
				const channel = this.findChannel(channelId);
				if (channel) {
					channel.messages.push({
						channelId: channelId,
						text: text,
						sender: sender,
						sender_name: sender_name,
						sender_img: sender_img,
					});
				}
			});
			this.socket.on('kick', (data: {channelId: number, userId: number, ban: boolean}) => {
				const { channelId, userId, ban } = data;
				if (this.sender === userId) {
					for (let i = 0; i < this.channels.length; i++) {
						if (this.channels[i].id === this.selectedChannel.id) {
							const channel_name = this.channels[i].name;
							this.channels.splice(i, 1);
							if (this.selectedChannel.id === channelId)
								this.selectedChannel = {} as Channel;
							this.showDiv = false;
							const notif = useNotification()
							notif.notify({
								title: 'Erreur',
								text: `Vous avez ete ${ban ? 'ban' : 'kick'} du channel: ${channel_name}`,
								type: 'error',
								group: 'notif-center',
							});
							break ;
						}
					}
				}
			});
			this.socket.on('changeAdmin', (data: {channel_id: number, new_admin_id: number}) => {
				const {channel_id, new_admin_id} = data;
				if (this.sender === new_admin_id) {
					for (let i = 0; i < this.channels.length; i++) {
						if (this.channels[i].id === channel_id) {
							this.channels[i].admin = new_admin_id;
							const notif = useNotification();
							notif.notify({
								title: 'Nouvel admin',
								text: `Vous avez ete promu admin du channel ${this.channels[i].name}`,
								type: 'success',
								group: 'notif-center',
							});
							break ;
						}
					}
				}
			});
		},

		sendMessage() {
			if (this.socket && this.message) {
				const data = {
					channelId: this.selectedChannel.id,
					text: this.message,
					sender: this.sender,
					sender_name: this.sender_name,
					sender_img: this.sender_img,
				};
				this.socket.emit('message', data);
				this.message = '';
			}
		},

		async showChannel(chan: Channel) {
			this.showDiv = true;
			this.selectedChannel = chan;
		},

		async joinChannel(channel: Channel, password: string) {
			const found = this.findChannel(channel.id);
			if (found) {
				this.showChannel(found);
				return ;
			}
			const response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + this.sender + '/channels/' + channel['id'] + '/add', {
				credentials: 'include',
				method: "POST",
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					password: password,
				}),
			});
			const response_json = await response.json();
			if (response_json['ok'] === true) {
				channel.admin = (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + channel.id + '/admin', {credentials: 'include'})).json())['id'];
				this.channels.push(channel);
				this.selectedChannel = channel;
				this.selectedChannel.messages = await this.getChannelMessages(channel.id);
				this.showDiv = true;
			}
			else  {
				const notif = useNotification()
				notif.notify({
					title: 'Erreur',
					text: `Impossible de rejoindre le channel: ${response_json['message']}`,
					type: 'error',
					group: 'notif-center',
				});
			}
		},

		async quitChannel(id: number) {
			const response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + id + '/channels/' + this.selectedChannel.id + '/remove', {
				credentials: 'include',
				method: 'POST'
			});
			const response_json = await response.json();
			if (response_json['ok']) {
				for (let i = 0; i < this.channels.length; i++) {
					if (this.channels[i].id === this.selectedChannel.id) {
						if (this.selectedChannel.admin === this.sender) {
							const admin_response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + this.channels[i].id + '/admin');
							try {
								const new_admin_id = (await admin_response.json())['id'];
								let channel_id = this.channels[i].id;
								this.socket.emit('changeAdmin', {channel_id, new_admin_id});
							}
							catch {}
						}
						this.channels.splice(i, 1);
						this.selectedChannel = {} as Channel;
						this.showDiv = false;
						break ;
					}
				}
			}
		},

		async getUsersInChannel() {
			const response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + this.selectedChannel.id + '/getUsers', { credentials: 'include' });
			var users = [];
			try {
				var users_json = await response.json();
				for (let i = 0; i < users_json.length; i++) {
					users.push({
						id: users_json[i]['id'],
						name: users_json[i]['name'],
						img: users_json[i]['avatarLink'],
						admin: this.sender === this.selectedChannel.admin,
					});
				}
			}
			catch {}
			return (users);
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

		reconnectToRoom(){
			const mode = ["classic", "arcade", "ranked"][this.recoMode];
			this.$router.push({ path: '/pong', query: { mode: mode }});
		},

		async getChannelMessages(channelId: number): Promise<Message[]> {
			const message_response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/message/' + channelId + '/list', { credentials: 'include' });
			let messages = [] as Message[];
			try {
				const messages_json = await message_response.json();
				for (let i = 0; i < messages_json.length; i++) {
					messages.push({
						channelId: channelId,
						text: messages_json[i].text,
						sender: messages_json[i].sender.id,
						sender_name: (await ( await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/id/' + messages_json[i].sender.id, { credentials: 'include' })).json())['name'],
						sender_img: (await ( await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/id/' + messages_json[i].sender.id, { credentials: 'include' })).json())['avatarLink'],
					});
				}
				return (messages);
			}
			catch {
				return ([] as Message[]);
			}
		},

		notifyKick(channelId: number, userId: number, ban: boolean) {
			this.socket.emit('kick', {channelId, userId, ban});
		},

		clickedChannel(channelId: number) {
			return (this.selectedChannel.id === channelId ? 'selectedChannel' : '');
		},
	},
});

</script>

<style>
h1 {
	margin-top: 7%;
	width: 80%;
	text-align: left;
}

.message {
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

.home_body {
	height: 90%;
	padding: 2.5%;
	min-height: 600px;
	min-width: 500px;
}

.home_content {
	display: flex;
	height: 100%;
	width: 100%;
	align-items: center;
	justify-content: center;
	gap: 6%;
}

.left_column {
	display: flex;
	height: 100%;
	width: 10%;
	flex-direction: column;
	gap: 4%;
	flex-grow: 0.2;
}

.play_button {
	display: flex;
	width: 100%;
	height: 20%;
	justify-content: center;
	align-items: center;
	background: #036280;
	border: 3px solid #BC0002;
	border-radius: 25px;
	text-decoration: none;
	color: black;
	font-size: 3em;
}

.chat {
	display: flex;
	height: 100%;
	width: 45%;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	background: #F0F8FF;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.friend_list {
	display: flex;
	flex-direction: column;
	height: 80%;
	width: 100%;
	background-color: #ffffff;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

.add_friend {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 2%;
	height: 7%;
	padding-left: 3px;
	width: 97%;

}

.add_friend .spe {
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	background-color: black;
	height: 80%;
	flex-shrink: 0;
	width: 37%;
	overflow: hidden;
	border-radius: 20px;
	border: none;
	cursor: pointer;
}

.spe:hover {
	background-color: rgb(6, 56, 56);;
}

.list {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	margin-top: 2%;
	align-items: center;
	background-color: rgb(255, 255, 255);
	overflow-y: scroll;
}

.list ul {
	margin: 0;
	padding: 0;
	list-style-type: none;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.list ul li {
	margin-top: 10px;
	width: 90%;
	height: 10%;
	display: flex;
	border-radius: 20px;
	justify-content: center;
	align-items: center;
}

.list ul li:hover {
	background-color: #F0F8FF;
}

.list ul li span {
	font-family: 'Poppins', sans-serif;
	font-weight: bold;
	font-size: 1em;
}

.selectedChannel {
	background-color: #F0F8FF;
}

.friends {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	width: 100%;
	background-color: white;
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

.sent {
	text-align: right;
}

.received {
	text-align: left;
}

.slide-fade-enter-from {
	opacity: 0;
}

.slide-fade-leave-to {
	opacity: 0;
}

.slide-fade-enter-from .modal-container,
.slide-fade-leave-to .modal-container {
	-webkit-transform: scale(1.5);
	transform: scale(1.5);
}

</style>
left