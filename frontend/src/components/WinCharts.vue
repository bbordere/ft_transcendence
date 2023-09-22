<template>
	<div class="chart">
		<div v-if="show">
			<apexchart type="donut" :options="chartOptions" :series="getSerie()"></apexchart>
		</div>
    </div>
</template>

<script lang="ts">

export default{
	props: ["wins", "looses", "show"],
	data(){
		return {
			chartOptions: {
				legend: {
					position: 'right',
					show: false
				},
				title: {
					text: "Taux de victoires",
					align: 'center',
				},
				labels: ['Victoires', 'Défaites'],
				plotOptions: {
					pie: {
						startAngle: -90,
						endAngle: 90,
						expandOnClick: false,
					},
				},
				responsive: [{
					breakpoint: 480,
				}],
				colors:['#00A300', '#D22B2B'],
			},
		};
	},
	methods:{
		getSerie(){
			return [this.wins, this.looses];
		}
	},
	mounted(){

	}
}

</script>

<style>
	.chart{
		/* margin-top: 20%; */
		/* margin-top: 1vh; */
		padding-top: 1%;
		margin-bottom: -5%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.text-chart{
		display: none;
	}

	@media screen and (max-width: 550px) {
		.chart{
			display: none;
		}
	}

</style>