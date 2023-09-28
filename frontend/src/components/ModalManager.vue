<template>
	<div class="social_buttons">
		<button class="spe" @click="listView = true;">Channel</button>
		<button class="spe" @click="listView = false;">Amitié</button>
		<ButtonAdd icon="fa-solid fa-user-plus" @click="showModalFriend = true"></ButtonAdd>
		<ButtonAdd icon="fa-circle-plus" @click="showModal = true"></ButtonAdd>
		<Teleport to="body">
			<ModalAddFriend :show="showModalFriend" @close="showModalFriend = false"></ModalAddFriend>
			<ModalAdd :show="showModal" @close="showModal = false" @newChannel="joinChannelForwarder"></ModalAdd>
			<KickUserModal :show="showKickModal" :channelId="selectedChannel.id" @close="showKickModal = false;"
				@kick="notifyKickForwarder"></KickUserModal>
				<UnBanUserModal :show="showUnBanModal" :channelId="selectedChannel.id" @close="showUnBanModal = false;">
			</UnBanUserModal>
			<BanUserModal :show="showBanModal" :channelId="selectedChannel.id"
				@close="showBanModal = false;" @kick="notifyKickForwarder"></BanUserModal>
				<MuteModal :show="showMuteModal" :channelId="selectedChannel.id" @close="showMuteModal = false" />
				<AddAdminModal :show="showAddAdminModal" :channelId="selectedChannel.id" @close="showAddAdminModal = false;"/>
			<RemoveAdminModal :show="showRemoveAdminModal" :channelId="selectedChannel.id" :sender="sender" @close='showRemoveAdminModal = false;' />
			<AddPasswordModal :show="showAddPasswordModal" :channelId="selectedChannel.id" :sender="sender" @close="showAddPasswordModal = false;"
				@updateButton="updateButtonForwarder" />
		</Teleport>
	</div>
</template>
<script lang="ts">
import ButtonAdd from './ButtonAdd.vue';
import ModalAddFriend from './ModalAddFriend.vue';
import ModalAdd from './ModalAdd.vue';
import UnBanUserModal from './UnBanUserModal.vue';
import AddAdminModal from './AddAdminModal.vue';
import RemoveAdminModal from './RemoveAdminModal.vue';
import AddPasswordModal from './AddPasswordModal.vue';
import BanUserModal from './BanUserModal.vue';

export default {
	components: {
		ButtonAdd,
		ModalAddFriend,
		ModalAdd,
		UnBanUserModal,
		AddAdminModal,
		RemoveAdminModal,
		AddPasswordModal,
		BanUserModal
	},

	props: ['selectedChannel', 'sender'],

	data() {
		return {
			listView: false,
			showModalFriend: false,
			showModal: false,
			showUnBanModal: false,
			showBanModal: false,
			showMuteModal: false,
			showAddAdminModal: false,
			showRemoveAdminModal: false,
			showAddPasswordModal: false,
			showKickModal: false,
		}
	},

	methods: {
		joinChannelForwarder(channel: any, channel_password: any) {
			this.$emit('joinChannel', channel, channel_password);
		},

		notifyKickForwarder(channelId: number, userId: number, ban: boolean) {
			this.$emit('kick', channelId, userId, ban);
		},

		updateButtonForwarder() {
			this.$emit('updateButton');
		},
	},
}
</script>
<style>
.social_buttons {
	display: flex;
	position: relative;
	align-items: center;
	justify-content: center;
	gap: 1%;
	height: 7%;
	padding: 3px;
	/* background: pink; */
}

.spe {
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	background-color: #046280;
	height: 90%;
	flex-shrink: 0;
	width: 37%;
	overflow: hidden;
	border-radius: 20px;
	border: none;
	cursor: pointer;
}

.spe:hover {
	background-color: #032f3d;
}

.spe:focus {
	background-color: #032f3d;
}
</style>