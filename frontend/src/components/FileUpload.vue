<template>
	<div class="container-upload">
		<div>
			<hr/>
			<h2>Change Avatar</h2>
			<label>
				<input type="file" @change="handleFileUpload( $event )"/>
			</label>
			<br>
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
			
			submitFile(){
				let formData = new FormData();
				
				formData.append('file', this.file);
				console.log(this.file);
			},
			async addFile(){
				let formData = new FormData();
				formData.append("file", this.file);
				const res = await fetch("http://" + import.meta.env.VITE_HOST + ":3000/avatar/update",
				{
					method: "post",
					credentials: 'include',
					body: formData,
				})
			}
		}
	}
</script>