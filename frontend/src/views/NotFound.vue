<template>
	<img src="pinaRecipe.svg" class="recipe">
</template>

<script lang="ts">
import { SocketService } from '@/services/SocketService';
import { State } from './Home.vue';

if (SocketService.getStatus)
	SocketService.getInstance.emit('setStatus', SocketService.getUser.id, State.ONLINE);


</script>

<style>

.recipe{
	margin-top: 15px;
	width: 100%;
	height: 85vh;
}

</style>