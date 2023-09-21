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
	border-radius: 20px;
	font-size: 2.5vh;
	padding: 0.7vw;
	margin-left: 1vw;
}

.emoteContainer:hover {
	background-color: #91CEF2;
	cursor: pointer;
}
</style>