<script lang="ts">

import BlueButton from './BlueButton.vue';
import Invite from './Invite.vue';
import router from '@/router';
import MuteModal from './MuteModal.vue';
import { SocketService } from '@/services/SocketService';

export default {
	props: ["connected_user", "friendId", "username", "show", "selectedChannel"],

	components: {
		BlueButton,
		Invite,
		MuteModal,
	},

	data() {
		return {
			modalInvite: false as boolean,
			showMuteModal: false as boolean,
		}
	},

	methods: {

		redirecToProfil(name: string) {
			router.push({ path: '/profile', query: { user: name } });
		},

		async deleteFriend() {
			const response = await fetch(`http://${import.meta.env.VITE_HOST}:3000/friend/delete?id1=${this.connected_user.id}&id2=${this.friendId}`, {
				credentials: 'include',
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
			});
		},

		async blockUser() {
			const response = await fetch(`http://${import.meta.env.VITE_HOST}:3000/user/block/blocked`, {
				credentials: 'include',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					userId: this.connected_user.id,
					blockId: this.friendId,
				}),
			});
		},

		async kickUser() {
			const user_resp = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + this.$props.username, { credentials: 'include' });
			if (!user_resp['ok'] || this.$props.username == '') {
				this.$emit('close');
				return;
			}
			const user = await user_resp.json();
			const response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + user['id'] + '/channels/' + this.$props.selectedChannel.id + '/kick', { credentials: 'include', method: 'POST' });
			const response_json = await response.json();
			console.log(response_json);
			if (response_json['ok']) {
				SocketService.getInstance.emit('kick', this.$props.selectedChannel.id, user['id'], false);
				this.$emit('close');
			}
		},

		async banUser() {
			const user_resp = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + this.$props.username, { credentials: 'include' });
			if (!user_resp['ok'] || this.$props.username == '') {
				this.$emit('close');
				return;
			}
			const user = await user_resp.json();
			const response = await fetch('http://' + import.meta.env.VITE_HOST + ':3000/user/' + user['id'] + '/channels/' + this.$props.selectedChannel.id + '/ban', { credentials: 'include', method: 'POST' });
			const response_json = await response.json();
			this.$emit('close');
			if (response_json['ok']) {
				SocketService.getInstance.emit('kick', this.$props.selectedChannel.id, user['id'], true);
				this.$emit('close');
			}
		},

		userIsAdmin(userId: number): boolean {
			for (let admin of this.selectedChannel.admins)
				if (admin.id === userId)
					return (true);
			return (false);
		},

		displayButton(): boolean {
			return (this.connected_user.id === this.selectedChannel.owner
				|| (this.userIsAdmin(this.connected_user.id)
				&& this.friendId !== this.selectedChannel.owner
				&& !this.userIsAdmin(this.friendId)));
		}
	}
}

</script>

<template>
	<Transition name="slide-fade" mode="out-in">
		<div v-if="show" class="modal_overlay" @click="$emit('close')">
			<div class="modal_chat" @click.stop>
				<div class="grid">
					<div class="button-grid">
						<BlueButton :text="'Profil de ' + username" @click="redirecToProfil(username); $emit('close')" />
						<BlueButton text="Inviter à jouer" @click="modalInvite = true" />
						<BlueButton text="Bloquer" @click="blockUser(); deleteFriend(); $emit('close')" />
						<BlueButton v-if="displayButton()" text="Mettre en sourdine" @click="showMuteModal = true;" />
						<BlueButton v-if="displayButton()" text="Exclure" @click="kickUser()" />
						<BlueButton v-if="displayButton()" text="Bannir" @click="banUser()" />
					</div>
				</div>
			</div>
			<invite :show="modalInvite" @close="modalInvite = false" :myId="connected_user.id" :friendId="friendId"></invite>
		</div>
	</Transition>
	<Teleport to="body">
		<MuteModal :channelId="selectedChannel.id" :username="username" :show="showMuteModal" @close="showMuteModal = false;" />
	</Teleport>
</template>

<style scoped>
.modal_overlay {
	position: fixed;
	display: flex;
	z-index: 9998;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	align-items: center;
	justify-content: center;
	transition: opacity 0.4s ease;
	transition: all 0.4s ease;
	min-height: 600px;
	min-width: 500px;
}

.grid {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
}

.modal_chat {
	display: flex;
	flex-direction: center;
	justify-content: center;
	right: 70%;
	width: 40%;
	height: 65%;
	background-color: #DBEFFC;
	border-radius: 20px;
}

.modal_friend p {
	text-align: center;
	font-size: 1.3em;
}

.button-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	row-gap: 20%;
	column-gap: 10%;
	width: 80%;
	height: 50%;
}

@media screen and (max-width: 1150px) {
	.modal_friend {
		width: 75%;
	}
}
</style>
