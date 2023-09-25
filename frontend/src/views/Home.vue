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
					<FriendList v-else :updateTimestamp="updateTimestamp" :friendTimestamp="refreshTimestamp"/>
				</div>
			</div>
			<Chat :selectedChannel="selectedChannel" :sender="sender" @removeChannel="removeChannel"
				@displayChannelOption="displayChannelOption"></Chat>
		</div>
	</div>
</template>

<script lang="ts">
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
import { SocketService } from '@/services/SocketService'

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
	owner: number;
	messages: Message[],
	protected: boolean,
	admins: number[];
}

export enum State {
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
			sender: {} as User,
			channels: [] as Channel[],
			selectedChannel: {} as Channel,
			ModalManagerData: null as unknown,
			updateTimestamp: 0 as number,
			refreshTimestamp: 0 as number,
		}
	},

	props: {
		removedChannel: Number
	},

	async mounted() {
		if (SocketService.getStatus)
			SocketService.getInstance.emit('setStatus', SocketService.getUser.id, State.ONLINE);
		this.ModalManagerData = this.$refs['ModalManager'];
		const user = await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/me', { credentials: 'include' })).json()
		this.sender.id = user['id'];
		this.sender.name = user['name'];
		this.sender.img = user['avatarLink'];
		const channels_json = await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + this.sender.id + '/joinedChannels', { credentials: 'include' })).json();
		for (let i = 0; i < channels_json.length; i++) {
			this.channels.push({
				id: channels_json[i]['id'],
				owner: (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + channels_json[i]['id'] + '/owner', { credentials: 'include' })).json())['id'],
				name: channels_json[i]['name'],
				messages: await this.getChannelMessages(channels_json[i]['id']),
				protected: channels_json[i]['protected'],
				admins: await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + channels_json[i]['id'] + '/getAdmins', { credentials: 'include' })).json(),
			});
		}
		await this.init();
		const token = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/auth/token", { credentials: 'include' });
		sessionStorage.setItem('token', await token.text());
		setInterval(async () => {
			const token = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/auth/token", { credentials: 'include' });
			sessionStorage.setItem('token', await token.text());
		}, 1000 * 10);
	},

	updated() {
		if (this.selectedChannel.messages) {
			const lastMessage = this.$refs[`message-${this.selectedChannel.messages.length - 1}`] as any;
			if (lastMessage)
				lastMessage[0].scrollIntoView();
		}
	},

	methods: {
		async init() {
			this.$emit('socketReady');
			SocketService.getInstance.on('message',
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
			SocketService.getInstance.on('kick', (data: { channelId: number, userId: number, ban: boolean }) => {
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
			SocketService.getInstance.on('changeAdmin', (data: { channel_id: number, new_owner_id: number }) => {
				const { channel_id, new_owner_id } = data;
				if (this.sender.id === new_owner_id) {
					for (let i = 0; i < this.channels.length; i++) {
						if (this.channels[i].id === channel_id) {
							this.channels[i].owner = new_owner_id;
							const notif = useNotification();
							notif.notify({
								title: 'Nouvel owner',
								text: `Vous avez ete promu owner du channel ${this.channels[i].name}`,
								type: 'success',
								group: 'notif-center',
							});
							break;
						}
					}
				}
			});

			SocketService.getInstance.on('updateFriendList', () => {
				this.refreshTimestamp = Date.now();
			});
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
				channel.owner = (await (await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + channel.id + '/owner', { credentials: 'include' })).json())['id'];
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
					if (this.selectedChannel.owner === this.sender.id) {
						const owner_response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/chat/' + this.channels[i].id + '/owner');
						try {
							const new_owner_id = (await owner_response.json())['id'];
							let channel_id = this.channels[i].id;
							SocketService.getInstance.emit('changeAdmin', { channel_id, new_owner_id });
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
			else if (str === 'mute')
				this.ModalManagerData.showMuteModal = true;
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
			SocketService.getInstance.emit('kick', { channelId, userId, ban });
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
	border: 3px solid #515151;
	border-radius: 10px;
}

@media screen and (max-width: 1150px) {
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