<template>
	<div class="emoteContainer" @click="test">
		{{ emoji }}
	</div>
</template>

<script lang="ts">
import { SocketService } from '@/services/SocketService';


export default {
	props: ["emoji", "socket"],
	methods: {
		test() {
			this.socket.emit('emote', this.emoji);
		}
	}
}

</script>

<style>
.emoteContainer {
	position: relative;
	overflow: hidden;
	background-color: #229EE6;
	border: #515151 solid 1px;
	border-radius: 20px;
	/* font-size: 2.5vh; */
	font-size: clamp(0.75rem, 0.4853rem + 1.4118vw, 1.5rem);padding: 3px;
}

.emoteContainer:hover {
	background-color: #91CEF2;
	cursor: pointer;
}
</style>