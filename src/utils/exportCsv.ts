/**
 * Generic CSV exporter.
 * @param filename  The downloaded file name (without extension).
 * @param headers   Array of column header strings.
 * @param rows      Array of arrays — each inner array is one row's values.
 */
export function exportToCsv(filename: string, headers: string[], rows: (string | number)[][][]) {
  const escape = (val: string | number) => {
    const str = String(val ?? '')
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str
  }

  const csvContent = [
    headers.map(escape).join(','),
    ...rows.flat().map(row => row.map(escape).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
