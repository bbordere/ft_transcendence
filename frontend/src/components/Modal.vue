<template>
	  <div class="modal-overlay" @click="$emit('close-modal')">
		<div class="modal" @click.stop>
		  <h6>Account Settings</h6>
		  <div class="buttons">
			<button>2fa</button>
			<button>Change Username</button>
			<button>Change Profile Picture</button>
		  </div>
		</div>
	  </div>
  </template>
  
  <script lang="ts">
  	export default{

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
 
  h6 {
	font-weight: 500;
	font-size: 28px;
	margin: 20px 0;
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