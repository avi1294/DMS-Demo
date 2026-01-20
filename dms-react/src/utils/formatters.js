export function numberFormat(number, decimals = 0, decPoint = '.', thousandsSep = ',') {
  number = (number + '').replace(',', '').replace(' ', '')
  let n = !isFinite(+number) ? 0 : +number
  let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)

  const toFixedFix = (n, prec) => {
    const k = Math.pow(10, prec)
    return '' + Math.round(n * k) / k
  }

  let s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')

  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, thousandsSep)
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }

  return s.join(decPoint)
}

export function formatCurrency(value, symbol = '$') {
  return symbol + numberFormat(value)
}

export function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function getCurrentYear() {
  return new Date().getFullYear()
}

export function generateYearOptions(startYear = 1980) {
  const currentYear = getCurrentYear()
  const years = []
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year)
  }
  return years
}
