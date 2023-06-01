<template>
	<div class="chat">
		<span>Chat page</span>
		<form>
			<label for="username">Username</label>
			<input type="text" name="username" id="username_chat">
			<label for="message">Message</label>
			<input type="text" name="message" id="message_chat">
			<input type="button" value="Send !" id="send_chat_btn">
		</form>
	</div>
</template>

<script lang="ts">
// import io from 'socket.io-client';

// const socket = io('http://localhost:3000');

// socket.on('connect', () => {
// 	console.log(socket.id);
// });
</script>