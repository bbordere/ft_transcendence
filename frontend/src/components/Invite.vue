<script lang="ts">

import { Socket } from 'socket.io-client';
import BlueButton from './BlueButton.vue';
import { SocketService } from '@/services/SocketService';

export default {
	components: {
		BlueButton,
	},

	props: ["myId", "friendId", "show", "senderName"],
	// props: {
	// 	myId: Number,
	// 	friendId: Number,
	// 	show: Boolean,
	// 	senderName: "",
	// },

	methods: {
		goToPong(mode: string) {
			SocketService.getInstance.emit('pongInvite', this.myId, this.friendId,
				this.senderName, mode);
			this.$emit('close');
			// this.$router.push({ path: '/pong', query: { mode: mode, id: this.myId}});
		}
	}
}

</script>

<template>
	<transition name="slide-fade" mode="out-in">
		<div v-if="show" class="play-modal-overlay" @click="$emit('close')">
			<div class="modal" @click.stop>
				<div class="play-modal-title">Choix du mode de jeu</div>
				<div class="buttons-play-modal">
					<BlueButton class="button-play-modal" text="Classique" @click="goToPong('duelClassic')"></BlueButton>
					<BlueButton class="button-play-modal" text="Arcade" @click="goToPong('duelArcade')"></BlueButton>
				</div>

			</div>
		</div>
	</transition>
</template>

<style></style>



