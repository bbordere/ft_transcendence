<script lang="ts">
	export default {
		props: ['path', 'editable'],
		methods:{
			openFileUpload() {
				this.$refs.fileInput.click();
			},
			uploadFile(event) {
				const file = event.target.files[0];
				console.log(file);
				let formData = new FormData();
				formData.append("file", file);
				const res = fetch("http://" + import.meta.env.VITE_HOST + ":3000/avatar/update",
				{
					method: "post",
					credentials: 'include',
					body: formData,
				})
				.then(res => this.$emit('updated'));
			}
		}
	}
</script>

<template>
	<div class="avatar-container">
		<img :src="path" class="image"/>
		<button class="change-button" @click="openFileUpload" v-if="editable != 0">
			<font-awesome-icon icon="fa-solid fa-pen"/>
		</button>
		<input type="file" ref="fileInput" style="display: none" @change="uploadFile" accept="image/*"/>
	</div>

</template>

<style>
	.avatar-container{
		position: relative;
	}

	.image{
		width: 175px;
		height: 175px;
		border-radius: 50%;
		border: 2px solid #b5dbdb;
		filter: drop-shadow(0 0 8px #1f81dd);
	}

.change-button {
	position: absolute;
	top: 0px;
	right: -5px;
	padding: 8px;
	background-color: #ffffff;
	color: #000000;
	cursor: pointer;
	border: none;
	border-radius: 20px;
  }
</style>

<!-- <template>
	<div class="image-container">
	  <img :src="photoUrl" alt="Photo" />
  
	  <button class="change-button" @click="openFileUpload">
		Changer d'image
	  </button>
  
	  <input
		type="file"
		ref="fileInput"
		style="display: none"
		@change="handleFileUpload"
	  />
	</div>
  </template>
  
  <script>
  export default {
	data() {
	  return {
		photoUrl: 'http://localhost:3000/avatar/default'
	  };
	},
	methods: {
	  openFileUpload() {
		this.$refs.fileInput.click();
	  },
	  handleFileUpload(event) {
		const file = event.target.files[0];
		// Effectuer les opérations de téléchargement ici
	  }
	}
  };
  </script>
  
  <style>
  .image-container {
	position: relative;
  }
  
  .change-button {
	position: absolute;
	top: 10px;
	right: 10px;
	padding: 8px;
	background-color: #ffffff;
	color: #000000;
	cursor: pointer;
	border: none;
	border-radius: 4px;
  }
  </style> -->