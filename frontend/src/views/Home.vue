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
						<button class="spe">Channel</button>
						<button class="spe">Message</button>
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
							<BanUserModal :show="showBanModal" :channelId="selectedChannel.id" @close="showBanModal = false;" @kick="notifyKick"></BanUserModal>
						</Teleport>
					</div>
					<div class="list">
						<ul>
							<li v-for="channel in channels"><button :key="channel.id" @click="showChannel(channel)">{{ channel.name }}</button></li>
						</ul>
						<div class="friends"></div>
					</div>
					
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
					<div class="channel_options">
						<button type="button" @click="quitChannel(sender)">Quit Channel</button>
						<div v-if="selectedChannel.admin == sender">
							<button type="button" @click="showKickModal = true">Kick User</button>
							<button type="button" @click="showBanModal = true">Ban User</button>
						</div>
					</div>
				</div>
				<div v-else-if="!connected">
					<p>connecting to websocket server...</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import io from 'socket.io-client';
import ModalAdd from '../components/ModalAdd.vue'
import ModalAddFriend from '../components/ModalAddFriend.vue'
import { defineComponent } from 'vue';
import ButtonAdd from '../components/ButtonAdd.vue'
import PlayModal from '@/components/PlayModal.vue';
import KickUserModal from '@/components/KickUserModal.vue';
import BanUserModal from '@/components/BanUserModal.vue';

interface Message {
	channelId: number;
	text: string;
	sender: number;
}

interface Channel {
	id: number;
	name: string;
	admin: number;
	messages: Message[],
	protected: boolean,
}

// Maybe store the selected channel in a cookie

export default defineComponent({
	components: {
		ButtonAdd,
		ModalAddFriend,
		ModalAdd,
		PlayModal,
		KickUserModal,
		BanUserModal,
	},

	data() {
		return {
			showModal: false,
			showModalFriend: false,
			showModalPlay: false,
			showKickModal: false,
			showBanModal: false,
			socket: null as any,
			connected: false as Boolean,
			sender: -1 as number,
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
		this.sender = (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/me', { credentials: 'include' })).json())['id'];
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

	methods: {
		init() {
			this.socket = io('http://' + import.meta.env.VITE_HOST + ':3000/')
			this.socket.on('connect', () => { this.connected = true; });
			this.socket.on('disconnect', () => { this.connected = false; });
			this.socket.on('message', (data: { channelId: number, text: string, sender: number }) => {
				const { channelId, text, sender } = data;
				const channel = this.findChannel(channelId);
					if (channel) {
						channel.messages.push({
							channelId: channelId,
							text: text,
							sender: sender,
						});
					}
			});
			this.socket.on('kick', (data: {channelId: number, userId: number}) => {
				const { channelId, userId } = data;
				if (this.sender === userId) {
					for (let i = 0; i < this.channels.length; i++) {
						if (this.channels[i].id === this.selectedChannel.id) {
							this.channels.splice(i, 1);
							if (this.selectedChannel.id === channelId)
								this.selectedChannel = {} as Channel;
							this.showDiv = false;
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
			if (this.findChannel(channel.id))
				return ;
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
			}
			else
				alert('Could not add user.');
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
						this.channels.splice(i, 1);
						this.selectedChannel = {} as Channel;
						this.showDiv = false;
						break ;
					}
				}
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
					});
				}
				return (messages);
			}
			catch {
				return ([] as Message[]);
			}
		},

		notifyKick(channelId: number, userId: number) {
			this.socket.emit('kick', {channelId, userId});
		}
	},
});

</script>

<style>
.home_body {
	display: flex;
	width: 95vw;
	height: 90%;
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
	height: 100%;
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
	background-color: rgb(47, 49, 49);;
}


.list {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	margin-top: 2%;
	align-items: center;
	background-color: rgb(255, 255, 255);
}

.friends {
	display: flex;
	flex-direction: column;
	align-items: center;
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
