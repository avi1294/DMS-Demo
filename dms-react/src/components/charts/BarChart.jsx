import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { barChartOptions, chartColors } from '../../utils/chartConfig'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function BarChart({ data, labels, label = 'Revenue' }) {
  const chartData = {
    labels: labels || ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: label,
        backgroundColor: chartColors.primary,
        hoverBackgroundColor: '#2e59d9',
        borderColor: chartColors.primary,
        data: data || [4215, 5312, 6251, 7841, 9821, 14984]
      }
    ]
  }

  return (
    <div className="chart-bar">
      <Bar data={chartData} options={barChartOptions} />
    </div>
  )
}

export default BarChart
