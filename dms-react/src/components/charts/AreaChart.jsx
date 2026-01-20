import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { areaChartOptions, chartColors } from '../../utils/chartConfig'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

function AreaChart({ data, labels, label = 'Earnings' }) {
  const chartData = {
    labels: labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: label,
        tension: 0.3,
        backgroundColor: 'rgba(78, 115, 223, 0.05)',
        borderColor: chartColors.primary,
        pointRadius: 3,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: chartColors.primary,
        pointHoverRadius: 3,
        pointHoverBackgroundColor: chartColors.primary,
        pointHoverBorderColor: chartColors.primary,
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: data || [0, 10000, 5000, 15000, 10000, 20000, 15000, 25000, 20000, 30000, 25000, 40000],
        fill: true
      }
    ]
  }

  return (
    <div className="chart-area">
      <Line data={chartData} options={areaChartOptions} />
    </div>
  )
}

export default AreaChart
