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
					text: "Winrate",
					align: 'center',
				},
				labels: ['Wins', 'Looses'],
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

// return {
// 			chartOptions: {
// 				chart:{
// 					stacked: true,
// 					stackType: '100%'
// 				},
// 				legend: {
// 					show: false
//     			},
// 				labels: [''],
// 				plotOptions: {
// 					bar: {
//                 		horizontal: true,
//              	 	},
// 				},
// 				xaxis: {
// 					show: false,
// 					labels: {
// 						show: false
// 					},
// 					axisBorder: {
// 						show: false
// 					},
// 					axisTicks: {
// 						show: false
// 					},
// 					tooltip: {
// 						enabled: false
// 					}

// 				},
// 				// grid: {
// 				// 	padding: {
// 				// 		bottom: -120
// 				// 	}
// 				// },
// 				responsive: [{
// 					breakpoint: 480,
// 				}],
// 				colors:['#00A300', '#D22B2B'],
// 		},
// 		series: [{name: 'Wins', data: [15]}, {name: 'Looses', data: [11]}],
// 		};

</script>

<style>
	.chart{
		margin-top: 20%;
		display: flex;
		flex: 1;
		justify-content: center; /* Centre horizontalement les éléments enfants */
		align-items: center; /* Centre verticalement les éléments enfants */
	}
</style>