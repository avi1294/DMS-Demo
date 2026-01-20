import { numberFormat } from './formatters'

export const chartColors = {
  primary: '#4e73df',
  success: '#1cc88a',
  info: '#36b9cc',
  warning: '#f6c23e',
  danger: '#e74a3b',
  secondary: '#858796',
  light: '#f8f9fc',
  dark: '#5a5c69'
}

export const chartFontFamily = "'Nunito', '-apple-system', 'system-ui', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'"

export const areaChartOptions = {
  maintainAspectRatio: false,
  layout: {
    padding: {
      left: 10,
      right: 25,
      top: 25,
      bottom: 0
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        maxTicksLimit: 7
      }
    },
    y: {
      ticks: {
        maxTicksLimit: 5,
        padding: 10,
        callback: function(value) {
          return '$' + numberFormat(value)
        }
      },
      grid: {
        color: 'rgb(234, 236, 244)',
        drawBorder: false,
        borderDash: [2]
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgb(255,255,255)',
      bodyColor: '#858796',
      titleMarginBottom: 10,
      titleColor: '#6e707e',
      titleFont: {
        size: 14
      },
      borderColor: '#dddfeb',
      borderWidth: 1,
      padding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(context) {
          const label = context.dataset.label || ''
          return label + ': $' + numberFormat(context.parsed.y)
        }
      }
    }
  }
}

export const pieChartOptions = {
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgb(255,255,255)',
      bodyColor: '#858796',
      borderColor: '#dddfeb',
      borderWidth: 1,
      padding: 15,
      displayColors: false,
      caretPadding: 10
    }
  },
  cutout: '80%'
}

export const barChartOptions = {
  maintainAspectRatio: false,
  layout: {
    padding: {
      left: 10,
      right: 25,
      top: 25,
      bottom: 0
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        maxTicksLimit: 6
      }
    },
    y: {
      ticks: {
        maxTicksLimit: 5,
        padding: 10,
        callback: function(value) {
          return '$' + numberFormat(value)
        }
      },
      grid: {
        color: 'rgb(234, 236, 244)',
        drawBorder: false,
        borderDash: [2]
      }
    }
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgb(255,255,255)',
      bodyColor: '#858796',
      titleMarginBottom: 10,
      titleColor: '#6e707e',
      titleFont: {
        size: 14
      },
      borderColor: '#dddfeb',
      borderWidth: 1,
      padding: 15,
      displayColors: false,
      caretPadding: 10,
      callbacks: {
        label: function(context) {
          const label = context.dataset.label || ''
          return label + ': $' + numberFormat(context.parsed.y)
        }
      }
    }
  }
}
