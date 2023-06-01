<template>
	  <div class="modal-overlay" @click="$emit('close-modal')">
		<div class="modal" @click.stop>
		  <div class="title">Settings</div>
		  <div class="buttons">
			  2fA<Switch/>
			<button>Change Username</button>
			<FileUpload></FileUpload>
		  </div>
		</div>
	  </div>
  </template>
  
<script lang="ts">
	import Switch from '@/components/switch.vue';
	import FileUpload from '@/components/FileUpload.vue'

	export default{
		components: {
			Switch,
			FileUpload
		},
		data: () => ({
			files: [],
			readers: [],
		}),
		methods:{
		}
	}
</script>
  
  <style scoped>
  .modal-overlay {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	background-color: #242424d0;
	transition: opacity 0.3s ease;
	transition: all 0.3s ease;
  }
  
  .modal {
	text-align: center;
	background-color: white;
	height: 500px;
	width: 500px;
	margin-top: auto;
	margin-bottom: auto;
	padding: 60px 0;
	border-radius: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
  }
 
  .title {
	font-family: 'Baloo Tamma', cursive;
	color: #FFFFFF;
	text-shadow: 0 1px 0 #CCCCCC, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15);
	color: #FFFFFF;
	width: 100%;
	font-size: 80px;
  }
  
	.buttons{
		display: flex;
		flex-direction: column;
		margin-top: 40px;
	}

  .buttons button{
	margin-top: 15%;
	margin-left: auto;
	margin-right: auto;
	width: 40%;
  }
  </style>