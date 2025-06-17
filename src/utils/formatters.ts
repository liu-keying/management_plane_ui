export function formatBytes(bytes: number | null | undefined): string {
    if (bytes == null || isNaN(bytes)) return '-';
    if (bytes >= 1e9) return (bytes / 1e9).toFixed(2) + ' GB';
    if (bytes >= 1e6) return (bytes / 1e6).toFixed(2) + ' MB';
    if (bytes >= 1e3) return (bytes / 1e3).toFixed(2) + ' KB';
    return bytes + ' B';
  }

  
  export function formatDate(datetime: string | Date | null | undefined): string {
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

  export function formatPercentage (value: Number | String): string {
  const num = Number(value);
  if (isNaN(num)) return '无';
  return `${num.toFixed(2)}%`;
};

/**
 * 将对象数组中的所有空值字段统一替换为 "无"
 * @param data 原始数据
 * @param placeholder 占位符，默认值为 "无"
 * @returns 处理后的数据
 */
import type { TableColumnCtx } from 'element-plus';

/**
 * 默认格式化器：用于 Element Plus 表格列，空值统一显示为 “无”
 * @param row 当前行数据
 * @param column 当前列定义
 * @returns 格式化后的字符串
 */
export function defaultFormatter<T = any>(row: T, column: TableColumnCtx<T>): string {
  const value = row[(column.property as keyof T)];
  return value?.toString().trim() ? String(value) : '无';
}
