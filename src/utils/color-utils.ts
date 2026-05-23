/**
 * 将十六进制颜色转换为 RGBA 字符串
 * @param hex - 十六进制颜色值，格式如 "#fff"、"#ffffff"、"fff" 等
 * @param alpha - 透明度，取值范围 0～1，默认 1（完全不透明）
 * @returns RGBA 字符串，如 "rgba(255, 255, 255, 1)"；若格式无效则返回空字符串
 */
export function hexToRGBA(hex: string | undefined, alpha = 1): string {
	// 移除开头的 '#'
    if (!hex) return "#FFFFFF";
	let cleanHex = hex.replace(/^#/, "");

	// 处理缩写形式 (#fff -> ffffff)
	if (cleanHex.length === 3) {
		cleanHex = cleanHex
			.split("")
			.map((c) => c + c)
			.join("");
	}

	// 验证是否为有效的 6 位十六进制字符串
	const hexRegex = /^[0-9A-Fa-f]{6}$/;
	if (!hexRegex.test(cleanHex)) {
		console.error(`无效的十六进制颜色值: ${hex}`);
		return "";
	}

	// 解析 R, G, B 分量
	const r = Number.parseInt(cleanHex.slice(0, 2), 16);
	const g = Number.parseInt(cleanHex.slice(2, 4), 16);
	const b = Number.parseInt(cleanHex.slice(4, 6), 16);

	// 确保 alpha 在 [0, 1] 范围内
	const validAlpha = Math.min(1, Math.max(0, alpha));
	return `rgba(${r}, ${g}, ${b}, ${validAlpha})`;
}
