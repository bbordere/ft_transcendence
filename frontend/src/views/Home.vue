<template>
	<div class="home_body">
		<div class="home_content">
			<div class="left_column">
				<PlayButton />
				<div class="friend_list">
					<ModalManager :selectedChannel="selectedChannel" @joinChannel="joinChannel" @kick="notifyKick"
						ref="ModalManager" @click="updateTimestamp = Date.now()"/>
					<ChannelList v-if="ModalManagerData && ModalManagerData.listView" :channels="channels"
						:selectedChannel="selectedChannel" @showChannel="showChannel" />
					<FriendList v-else :socket="socket" :updateTimestamp="updateTimestamp"/>
				</div>
			</div>
			<Chat :selectedChannel="selectedChannel" :sender="sender"
				:socket="socket" @removeChannel="removeChannel" @displayChannelOption="displayChannelOption"></Chat>
		</div>
	</div>
</template>

<script lang="ts">
import io from 'socket.io-client';
import ModalAdd from '../components/ModalAdd.vue'
import ModalAddFriend from '../components/ModalAddFriend.vue'
import { defineComponent } from 'vue';
import { useNotification } from "@kyvg/vue3-notification";
import PlayModal from '@/components/PlayModal.vue';
import ChannelList from '../components/ChannelList.vue';
import ModalManager from '../components/ModalManager.vue';
import FriendList from '@/components/FriendList.vue';
import Chat from '@/components/Chat.vue';
import PlayButton from '@/components/PlayButton.vue';

interface User {
	id: number;
	name: string;
	img: string;
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

enum State {
	OFFLINE,
	ONLINE,
	INGAME,
}

export default defineComponent({
	components: {
		ModalAddFriend,
		ModalAdd,
		PlayModal,
		ChannelList,
		ModalManager,
		FriendList,
		Chat,
		PlayButton,
	},

	data() {
		return {
			showChannelDiv: false,
			socket: null as any,
			sender: {} as User,
			channels: [] as Channel[],
			selectedChannel: {} as Channel,
			ModalManagerData: null as unknown,
			updateTimestamp: 0 as number,
		}
	},

	props: {
		removedChannel: Number
	},

	async mounted() {
		this.ModalManagerData = this.$refs['ModalManager'];
		const user = await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/me', { credentials: 'include' })).json()
		this.sender.id = user['id'];
		this.sender.name = user['name'];
		this.sender.img = user['avatarLink'];
		const channels_json = await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + this.sender.id + '/joinedChannels', { credentials: 'include' })).json();
		for (let i = 0; i < channels_json.length; i++) {
			this.channels.push({
				id: channels_json[i]['id'],
				admin: (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + channels_json[i]['id'] + '/admin', { credentials: 'include' })).json())['id'],
				name: channels_json[i]['name'],
				messages: await this.getChannelMessages(channels_json[i]['id']),
				protected: channels_json[i]['protected'],
			});
		}
		this.init();
		const token = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/auth/token", { credentials: 'include' });
		sessionStorage.setItem('token', await token.text());
	},

	updated() {
		if (this.selectedChannel.messages) {
			const lastMessage = this.$refs[`message-${this.selectedChannel.messages.length - 1}`] as any;
			if (lastMessage)
				lastMessage[0].scrollIntoView();
		}
	},

	unmounted() {
		this.socket.disconnect();
	},

	methods: {
		init() {
			this.socket = io('http://' + import.meta.env.VITE_HOST + ':3000/');
			this.socket.on('connect', () => {
				this.socket.emit('changeState', this.sender.id, {
					userId: this.sender.id,
					state: State.ONLINE,
				});
			});
			this.socket.on('disconnect', () => {
				this.socket.emit('changeState', {
					userId: this.sender.id,
					state: State.OFFLINE,
				});
			});
			this.socket.on('message',
				(data: {
					channelId: number,
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
			this.socket.on('kick', (data: { channelId: number, userId: number, ban: boolean }) => {
				const { channelId, userId, ban } = data;
				if (this.sender.id === userId) {
					for (let i = 0; i < this.channels.length; i++) {
						if (this.channels[i].id === this.selectedChannel.id) {
							const channel_name = this.channels[i].name;
							this.channels.splice(i, 1);
							if (this.selectedChannel.id === channelId)
								this.selectedChannel = {} as Channel;
							this.showChannelDiv = false;
							const notif = useNotification()
							notif.notify({
								title: 'Erreur',
								text: `Vous avez ete ${ban ? 'ban' : 'kick'} du channel: ${channel_name}`,
								type: 'error',
								group: 'notif-center',
							});
							break;
						}
					}
				}
			});
			this.socket.on('changeAdmin', (data: { channel_id: number, new_admin_id: number }) => {
				const { channel_id, new_admin_id } = data;
				if (this.sender.id === new_admin_id) {
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
							break;
						}
					}
				}
			});

			// this.socket.on('changeState', (data: any) => {
			// for (var friend of this.friends)
			// 	if (friend.)
			// 		// change state
			// });
		},

		async showChannel(chan: Channel) {
			this.showChannelDiv = true;
			this.selectedChannel = chan;
		},

		async joinChannel(channel: Channel, password: string) {
			const found = this.findChannel(channel.id);
			if (found) {
				this.showChannel(found);
				return;
			}
			const response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + this.sender.id + '/channels/' + channel['id'] + '/add', {
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
				channel.admin = (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + channel.id + '/admin', { credentials: 'include' })).json())['id'];
				this.channels.push(channel);
				this.selectedChannel = channel;
				this.selectedChannel.messages = await this.getChannelMessages(channel.id);
				this.showChannelDiv = true;
			}
			else {
				const notif = useNotification()
				notif.notify({
					title: 'Erreur',
					text: `Impossible de rejoindre le channel: ${response_json['message']}`,
					type: 'error',
					group: 'notif-center',
				});
			}
		},

		async removeChannel(id: number) {
			for (let i = 0; i < this.channels.length; i++) {
				if (this.channels[i].id === this.selectedChannel.id) {
					if (this.selectedChannel.admin === this.sender.id) {
						const admin_response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + this.channels[i].id + '/admin');
						try {
							const new_admin_id = (await admin_response.json())['id'];
							let channel_id = this.channels[i].id;
							this.socket.emit('changeAdmin', { channel_id, new_admin_id });
						}
						catch { }
					}
					this.channels.splice(i, 1);
					this.selectedChannel = {} as Channel;
					this.showChannelDiv = false;
					break;
				}
			}
		},

		displayChannelOption(str: string) {
			if (str === 'kick')
				this.ModalManagerData.showKickModal = true;
			else if (str === 'ban')
				this.ModalManagerData.showBanModal = true;
			else if (str === 'unban')
				this.ModalManagerData.showUnBanModal = true;
		},

		findChannel(id: number): Channel | null {
			for (let i = 0; i < this.channels.length; i++)
				if (this.channels[i].id === id)
					return (this.channels[i]);
			return (null);
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
						sender_name: (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/id/' + messages_json[i].sender.id, { credentials: 'include' })).json())['name'],
						sender_img: (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/id/' + messages_json[i].sender.id, { credentials: 'include' })).json())['avatarLink'],
					});
				}
				return (messages);
			}
			catch {
				return ([] as Message[]);
			}
		},

		notifyKick(channelId: number, userId: number, ban: boolean) {
			this.socket.emit('kick', { channelId, userId, ban });
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

.friend_list {
	display: flex;
	flex-direction: column;
	height: 80%;
	width: 100%;
	background-color: #ffffff;
	border: 3px solid #BC0002;
	border-radius: 10px;
}

/* .friends {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	width: 100%;
	background-color: white;
} */

@media screen and (max-width: 1150px) {
	/* .join_panel button {
		font-size: 65%;
	} */

	.left_column {
		flex-grow: 0.6;
	}
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