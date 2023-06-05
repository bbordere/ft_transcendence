<!-- <template>
	<div class="container-upload">
		<div>
			<h2>Change Avatar</h2>
			<label>
				<input type="file" @change="handleFileUpload( $event )" accept="image/*"/>
			</label>
			<button @click="addFile">Submit</button>
		</div>
	</div>
</template>

<script lang="ts">

	export default {
		data(){
			return {
				file: ''
			}
		},
		
		methods: {
			handleFileUpload( event ){
				this.file = event.target.files[0];
			},
			
			addFile(){
				let formData = new FormData();
				formData.append("file", this.file);
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
</script> -->

<template>
	<div>
	  <div class="image-container">
		<!-- Afficher votre photo ici -->
		<img :src="photoUrl" alt="Photo" />
  
		<!-- Bouton de téléchargement -->
		<label for="file-upload" class="upload-button">
		  Changer de photo
		</label>
		<input
		  id="file-upload"
		  type="file"
		  style="display: none"
		  @change="handleFileUpload"
		/>
	  </div>
	</div>
  </template>
  
  <script>
  export default {
	data() {
	  return {
		photoUrl: 'URL_DE_VOTRE_PHOTO'
	  };
	},
	methods: {
	  handleFileUpload(event) {
		const file = event.target.files[0];
		// Effectuer les opérations de téléchargement ici
		// Par exemple, vous pouvez envoyer le fichier au serveur avec une requête AJAX ou utiliser une bibliothèque de téléchargement comme Axios
	  }
	}
  };
  </script>
  
  <style>
  .image-container {
	position: relative;
  }
  
  .upload-button {
	position: absolute;
	top: 10px;
	left: 10px;
	padding: 10px;
	background-color: #ffffff;
	color: #000000;
	cursor: pointer;
	border: none;
	border-radius: 4px;
  }
  </style>