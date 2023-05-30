<script lang="ts">
export default {
	props: ['path']
}
</script>

<template>
	<img :src="path" class="image"/>
</template>

<style>
	.image{
		width: 175px;
		height: 175px;
		border-radius: 50%;
		border: 2px solid #b5dbdb;
		filter: drop-shadow(0 0 8px #1f81dd);
	}
</style>