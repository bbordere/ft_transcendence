<template>
	    <v-file-input accept="image/*" 
                label="Select file"
                prepend-icon="photo"
                multiple chips color="pink"
                v-model="file"
                @change="addFile">
		</v-file-input>
</template>

<script lang="ts">
	export default{
		data: () => ({
			file: [],
			readers: [],
		}),
		methods:{
			addFile(){
				console.log(this.file);
			}
		}
	}
</script>

<style>

</style>