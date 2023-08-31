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
							<li :class="clickedChannel(channel.id)" @click="showChannel(channel)" v-for="channel in channels"><span>{{ channel.name }}</span></li>
						</ul>
						<!-- <div class="friends"></div> -->
					</div>
					
				</div>
			</div>
			<div v-if="connected && showDiv" class="chat">
				<h1>{{ selectedChannel.name }}</h1>
				<div class="message_box">
					<ul class="msg_chat_box">
						<li v-for="msg in selectedChannel.messages" :class="getMessageClass(msg)"><span>{{ msg.text }}</span></li>
					</ul>
				</div>
				<div class="send_container">
					<div class="sendbox">
						<input type="text" v-model="message">
						<button type="button" @click="sendMessage()">&#8593;</button>
					</div>
					<div class="channel_options">
						<button type="button" @click="quitChannel(sender)">Quit Channel</button>
						<button v-if="selectedChannel.admin == sender" type="button" @click="showKickModal = true">Kick User</button>
						<button v-if="selectedChannel.admin == sender" type="button" @click="showBanModal = true">Ban User</button>
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
import '../assets/css/home.css';
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
		const hasDisconnectObject = await ((await fetch("http://" + import.meta.env.VITE_HOST + ":3000/pong/status", { credentials: 'include' })).json());
		this.recoButton = hasDisconnectObject["disconnect"];
		this.recoMode = hasDisconnectObject["mode"];
		setTimeout(async () => {
			const hasDisconnectObject = await ((await fetch("http://" + import.meta.env.VITE_HOST + ":3000/pong/status", { credentials: 'include' })).json());
			this.recoButton = hasDisconnectObject["disconnect"];
			this.recoMode = hasDisconnectObject["mode"];
			console.log("RECHECK", this.recoButton, this.recoMode);
		}, 4000);
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
			const mode = ["classic", "ranked", "arcade"][this.recoMode];
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
		},

		clickedChannel(channelId: number) {
			return (this.selectedChannel.id === channelId ? 'selectedChannel' : '');
		}
	},
});

</script>