<template>
	<ul>
		<li :class="clickedChannel(channel['id'])" @click="$emit('showChannel', channel)" v-for="channel in channels"><span>{{ channel['name'] }}</span></li>
	</ul>
</template>
<script lang="ts">
export default {
	props: ['channels', 'selectedChannel'],
	methods: {
		clickedChannel(channelId: number) {
			return (this.selectedChannel['id'] === channelId ? 'selectedChannel' : '');
		},
	},
}
</script>