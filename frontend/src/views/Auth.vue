
<template>
	<h2>Auth</h2>
	<button @click="test">Test api 42</button>
	
</template>

<script lang="ts">

export default {
  methods: {
    async test() {
		// console.log("test");
		const res = await fetch("http://localhost:3000/auth/42/callback",
				{
					method: 'get',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJib3JkZXJlIiwiZW1haWwiOiJiYm9yZGVyZUBzdHVkZW50LjQyLmZyIiwiaWF0IjoxNjg0NzQ2MjQxfQ.-2WscK6hWEQAZjNzs3SU94o0Mi72Z4TGEzZaXWdS9yw', // to do changer pour recuperer le bon
					},
				})
				// status.value = await (await res.blob()).text();
				// console.log(await (await res.blob()).text());
				console.log(res);
    }
  }
}

async function test() {
}



	// const res = await fetch("http://localhost:3000/auth/2fa/verify",
	// 		{
	// 			method: 'post',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJib3JkZXJlIiwiZW1haWwiOiJiYm9yZGVyZUBzdHVkZW50LjQyLmZyIiwiaWF0IjoxNjg0NzQ2MjQxfQ.-2WscK6hWEQAZjNzs3SU94o0Mi72Z4TGEzZaXWdS9yw' // to do changer pour recuperer le bon
	// 			},
	// 			body: JSON.stringify({
	// 				code: code,
	// 			})
	// 		})
	// 		status.value = await (await res.blob()).text();
</script>
