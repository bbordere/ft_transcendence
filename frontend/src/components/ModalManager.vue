<template>
	<div class="add_friend">
		<button class="spe" @click="listView = true;">Channel</button>
		<button class="spe" @click="listView = false;">Amitié</button>
		<ButtonAdd icon="fa-solid fa-user-plus" id="show-modal" @click="showModalFriend = true"></ButtonAdd>
		<Teleport to="body">
			<ModalAddFriend :show="showModalFriend" @close="showModalFriend = false"></ModalAddFriend>
		</Teleport>
		<ButtonAdd icon="fa-circle-plus" id="show-modal" @click="showModal = true"></ButtonAdd>
		<Teleport to="body">
			<ModalAdd :show="showModal" @close="showModal = false" @newChannel="joinChannelForwarder"></ModalAdd>
		</Teleport>
		<Teleport to="body">
			<UnBanUserModal :show="showUnBanModal" :channelId="selectedChannel.id" @close="showUnBanModal = false;">
			</UnBanUserModal>
		</Teleport>
		<Teleport to="body">
			<AddAdminModal :show="showAddAdminModal" :channelId="selectedChannel.id" @close="showAddAdminModal = false;"/>
			<RemoveAdminModal :show="showRemoveAdminModal" :channelId="selectedChannel.id" @close='showRemoveAdminModal = false;' />
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

export default {
	components: {
		ButtonAdd,
		ModalAddFriend,
		ModalAdd,
		UnBanUserModal,
		AddAdminModal,
		RemoveAdminModal,
	},

	props: ['selectedChannel'],

	data() {
		return {
			listView: false,
			showModalFriend: false,
			showModal: false,
			showUnBanModal: false,
			showMuteModal: false,
			showAddAdminModal: false,
			showRemoveAdminModal: false,
		}
	},

	methods: {
		joinChannelForwarder(channel: any, channel_password: any) {
			this.$emit('joinChannel', channel, channel_password);
		},

		notifyKickForwarder(channelId: number, userId: number, ban: boolean) {
			this.$emit('kick', channelId, userId, ban);
		},
	},
}
</script>
<style>
.add_friend {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 1%;
	height: 7%;
	padding-left: 3px;
	width: 97%;
}

.add_friend .spe {
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