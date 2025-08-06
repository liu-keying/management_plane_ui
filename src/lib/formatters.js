export function formatBytes(bytes) {
    if (bytes == null || isNaN(bytes)) return '-';
    if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' GB';
    if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + ' MB';
    if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + ' KB';
    return bytes + ' B';
}

  
export function formatDate(datetime) {
    if (!datetime) return '-';
    const date = new Date(datetime);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
}

export function formatPercentage(value) {
  const num = Number(value);
  if (isNaN(num)) return '无';
  return `${num.toFixed(2)}%`;
}

/**
 * 默认格式化器：用于 Element Plus 表格列，空值统一显示为 "无"
 * @param row 当前行数据
 * @param column 当前列定义
 * @returns 格式化后的字符串
 */
export function defaultFormatter(row, column) {
  const value = row[column.property];
  return value?.toString().trim() ? String(value) : '无';
}

export function formatPath(nodes) {
  if (!nodes || nodes.length === 0) return 'N/A';
  return nodes.map((id) => `${id}`).join(' → ');
}
