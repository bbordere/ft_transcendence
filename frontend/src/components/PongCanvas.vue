<template>

	<div class="pong_screen">
		<canvas id="pongCanvas" width="1200" height="600"></canvas>
	</div>

</template>

<script lang="ts">

const TPI = 6.2831853;

import type { ball } from '@/interfaces/ball.interface'
import type { gameInfos } from '@/interfaces/gameInfos.interface'
import type { paddle } from '@/interfaces/paddle.interface'
import confetti from 'canvas-confetti';

export default {
	props: ["socket", "playId1", "playId2", "score1", "score2"],

	data() {
		return {
			sprites: [] as Array<HTMLImageElement>,
			animId: -1,
			ball: {speed: -1} as ball,
			user1Img: new Image,
			user2Img: new Image,
			user1Name: "",
			user2Name: "",
			pad1: {} as paddle, 
			pad2: {} as paddle, 
			gameInfos: {} as gameInfos,
			lastUpdate: -1 as number,
			angle: 0,
			offsetX: 0,
			isInGame: false,
		}
	},
	methods: {
		async loadImage(path: string): Promise<HTMLImageElement> {
  			return new Promise(r => { let i = new Image(); i.onload = (() => r(i)); i.src = path; });
		},

		async spritesInit(){
			this.sprites.push(await this.loadImage("/powerups/big_pad.png"));
			this.sprites.push(await this.loadImage("/powerups/lil_pad.png"));
			this.sprites.push(await this.loadImage("/powerups/speed.png"));
			this.sprites.push(await this.loadImage("pong_background.png"));
			this.sprites.push(await this.loadImage("paddle.png"));
			this.sprites.push(await this.loadImage("queueing_background.png"));
			this.sprites.push(await this.loadImage("queueing_ananas.png"));
		},

		animate(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
			this.animId = requestAnimationFrame(() => {this.animate(ctx, canvas)});

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(this.sprites[5], 0, 0, canvas.width, canvas.height);

			this.angle += 0.02;
			this.offsetX += 1;
            let offsetY = canvas.height / 2 + Math.sin(this.angle) * 20;
			if (this.offsetX > canvas.width - this.sprites[6].width / 8) {
                this.offsetX = -this.sprites[6].width;
            }
            ctx.drawImage(this.sprites[6], this.offsetX, offsetY - canvas.height/6);
        },

		animateEnd(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
			ctx.clearRect(0,0,canvas.width, canvas.height)
			var end = Date.now() + (1000 * 3);

			(function frame() {
				let drift = Math.random() * 5
			confetti({
				particleCount: 5,
				angle: 60,
				spread: 70,
				origin: { x: 0 },
				gravity: 0.8,
				drift: drift,
			});
			confetti({
				particleCount: 5,
				angle: 120,
				spread: 70,
				origin: { x: 1 },
				gravity: 0.8,
				drift: -drift,
			});

			if (Date.now() < end) {
				requestAnimationFrame(frame);
			}
			}());
			ctx.drawImage(this.sprites[3], 0, 0);
			fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/id/" + this.playId1, {credentials: 'include'})
			.then(res => res.json())
			.then((res) => {this.user1Img.src = res["avatarLink"]
							this.user1Name = res["name"]})
			.then(() => {ctx.drawImage(this.user1Img, canvas.width / 6, canvas.height / 3, 200, 200)})
			.then(() => {ctx.font = "60px poppins";
						ctx.fillText(this.user1Name, canvas.width / 4, canvas.height - canvas.height / 5)})
			fetch("http://" + import.meta.env.VITE_HOST + ":3000/user/id/" + this.playId2, {credentials: 'include'})
			.then(res => res.json())
			.then((res) => {this.user2Img.src = res["avatarLink"]
							this.user2Name = res["name"]})
			.then(() => {ctx.drawImage(this.user2Img, canvas.width - canvas.width / 3,canvas.height / 3, 200, 200)})
			.then(() => {ctx.font = "60px poppins";
						ctx.fillText(this.user2Name, canvas.width - canvas.width / 4, canvas.height - canvas.height / 5)})
			ctx.fillStyle = 'white dark'
			ctx.font = "150px poppins";
			ctx.textBaseline = "middle";
			ctx.textAlign = "center";

			let offsetX1;
			let offsetX2;
			this.score1 <= 9 ? offsetX1 = 70 : offsetX1 = 105;
			this.score2 <= 9 ? offsetX2 = 70 : offsetX2 = 105;
			ctx.fillText(this.score1, offsetX1, canvas.height / 2 + canvas.height / 20);
			ctx.fillText(this.score2, canvas.width - offsetX2, canvas.height / 2 + canvas.height / 20);
			ctx.fillText(this.user1Name, canvas.width / 4, canvas.height - canvas.height / 6)
			ctx.font = "100px poppins";
			if (this.score1 > this.score2) {
				ctx.fillText("Victoire", canvas.width / 4, canvas.height / 6 + canvas.height / 20);
				ctx.fillText("Défaite", canvas.width - canvas.width / 4, canvas.height / 6 + canvas.height / 20);
			} else if (this.score2 > this.score1) {
				ctx.fillText("Défaite", canvas.width / 4, canvas.height / 6 + canvas.height / 20);
				ctx.fillText("Victoire", canvas.width - canvas.width / 4, canvas.height / 6 + canvas.height / 20);
			} else {
				ctx.fillText("Egalité", canvas.width / 4, canvas.height / 6 + canvas.height / 20);
				ctx.fillText("Egalité", canvas.width - canvas.width / 4, canvas.height / 6 + canvas.height / 20);
			}


		},


		drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, size: number, color: string) {
			ctx.beginPath();
			ctx.rect(x, y, width, size);
			ctx.fillStyle = color;
			ctx.fill();
			ctx.closePath();
		},

		drawText(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, text: string){
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.font = "200px serif";
			ctx.fillText(text, 50, canvas.height / 2);
			ctx.fillStyle = 'white'
		},

		drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string) {
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, TPI);
			ctx.fillStyle = color;
			ctx.lineWidth = 6;
			ctx.strokeStyle = "white";
			ctx.stroke();
			ctx.fill();
			ctx.closePath();
		},

		drawPowerups(ctx: CanvasRenderingContext2D){
			if (!this.gameInfos.powerups)
				return;
			for (var item of this.gameInfos.powerups as any[]){
				ctx.drawImage(this.sprites[item.effect], item.pos.x, item.pos.y, item.radius, item.radius);
			}
		},

		draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, time: number){
			this.animId = requestAnimationFrame((current) => {this.draw(ctx, canvas, current)});
			if (this.lastUpdate === -1){
				this.lastUpdate = time;
			}
			this.lastUpdate = time;
			if (Object.keys(this.gameInfos).length){
				if (this.ball.speed === -1){
					this.ball = this.gameInfos.ball;
					this.pad1 = this.gameInfos.pad1;
					this.pad2 = this.gameInfos.pad2;
				}
				const targetBall = this.gameInfos.ball;
				const pad1 = this.gameInfos.pad1;
				const pad2 = this.gameInfos.pad2;
				this.ball.position.x += (targetBall.position.x - this.ball.position.x) * 0.5;
				this.ball.position.y += (targetBall.position.y - this.ball.position.y) * 0.5;

				// this.ball = targetBall;
				// console.log(this.ball.position, this.gameInfos.ball.position);

				this.pad1.pos.x += (pad1.pos.x - this.pad1.pos.x) * 0.2;
				this.pad1.pos.y += (pad1.pos.y - this.pad1.pos.y) * 0.2;

				this.pad2.pos.x += (pad2.pos.x - this.pad2.pos.x) * 0.2;
				this.pad2.pos.y += (pad2.pos.y - this.pad2.pos.y) * 0.2;

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(this.sprites[3], 0, 0);
				ctx.drawImage(this.sprites[4], this.pad1.pos.x, this.pad1.pos.y,
								pad1.width, pad1.size);
				ctx.drawImage(this.sprites[4], this.pad2.pos.x, this.pad2.pos.y, 
				 				pad2.width, pad2.size);

				// this.drawRect(ctx, this.pad1.pos.x, this.pad1.pos.y, 
				// 				pad1.width, pad1.size, "#5151510F");
				// this.drawRect(ctx, this.pad2.pos.x, this.pad2.pos.y, 
				// 				pad2.width, pad2.size, "#515151");

				this.drawCircle(ctx, this.ball.position.x, this.ball.position.y,
					this.ball.radius, this.ball.speed === 30 ? "#F44E1A" : "#515151");

				this.drawPowerups(ctx);
			}
		},
	},
	async mounted() {
		const canvas = <HTMLCanvasElement> document.getElementById('pongCanvas');
		if (!canvas)
			return; // ERROR HANDLING
		const ctx = canvas.getContext('2d');
		if (!ctx)
			return; // ERROR HANDLING

		await this.spritesInit();
		this.socket.on('updateGame', (ball: ball, racket1: paddle, racket2: paddle, powerups: []) => {
			this.gameInfos = {ball: ball, pad1: racket1, pad2: racket2, powerups: powerups};
			if (this.animId === -1 || !this.isInGame){
				if (this.animId !== -1)
					cancelAnimationFrame(this.animId);
				this.isInGame = true;
				this.animId = requestAnimationFrame((current) => {this.draw(ctx, canvas, current)});
			}
			
		});

		this.socket.on('text', (data: string) => {
			cancelAnimationFrame(this.animId);
			this.isInGame = false;
			this.animId = -1;
			var x = 0;
			if (data === "QUEUEING" || data === "WAITING") {
				this.animId = requestAnimationFrame(() => {this.animate(ctx, canvas)});
			} else if (data === "FINISHED") {
				requestAnimationFrame(() => {this.animateEnd(ctx, canvas)})
			}
		});
	},
	unmounted(){
		if (this.animId !== -1)
			cancelAnimationFrame(this.animId);
	},
}

</script>

<style>

.pong_screen {
	margin-top: -6px;
	max-width: 100%;
	max-height: 80%;
	min-width: auto;
	border: 3px solid #515151;
	border-radius: 20px;
	overflow: hidden;
}
#pongCanvas {
	width: 100%;
	height: 100%;
}

</style>
