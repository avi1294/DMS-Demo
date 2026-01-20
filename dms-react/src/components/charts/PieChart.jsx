import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { pieChartOptions, chartColors } from '../../utils/chartConfig'

ChartJS.register(ArcElement, Tooltip, Legend)

function PieChart({ data, labels, colors }) {
  const chartData = {
    labels: labels || ['Direct', 'Referral', 'Social'],
    datasets: [
      {
        data: data || [55, 30, 15],
        backgroundColor: colors || [chartColors.primary, chartColors.success, chartColors.info],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
        hoverBorderColor: 'rgba(234, 236, 244, 1)'
      }
    ]
  }

  return (
    <div className="chart-pie pt-4 pb-2">
      <Doughnut data={chartData} options={pieChartOptions} />
    </div>
  )
}

export default PieChart
